# Simtese API

API REST do Simtese, construída com **Java 25** e **Spring Boot 4**.

## Stack

- Spring Web MVC, Spring Data JPA (Hibernate), Bean Validation
- Spring Security com **JWT** (jjwt)
- **PostgreSQL** (produção) e **H2** em modo PostgreSQL (perfil `local`)
- **Flyway** para migrations (`src/main/resources/db/migration`)
- **Redis** para rate limit e blacklist de tokens (desligado no perfil `local`)
- Lombok, Gradle

## Arquitetura

Organização em camadas, em `br.com.matheusfragadev.api`:

| Pacote | Responsabilidade |
|--------|------------------|
| `domain` | Entidades, value objects (`Employee`, `CNPJ`, `Password`…) e regras de negócio |
| `application` | Serviços e commands (casos de uso) |
| `infra` | Controllers, DTOs, mappers, segurança, repositórios com Specification, configuração |

As regras de negócio ficam no domínio; validações de entrada simples ficam nos DTOs.

### Agendamento

`POST /api/v1/appointments/schedule` recebe os dados do colaborador (nome, CPF e
**função**), da empresa e do atendimento. A função é **opcional**: quando ausente ou
em branco, é gravada como `N/A` (a migration `V12` também aplica `DEFAULT 'N/A'`, o que
preserva registros anteriores sem alterá-los).

## Perfis e execução

O perfil padrão é `prod`. Para desenvolvimento local, sem Postgres e Redis:

```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

Console do H2 em `/h2-console` (apenas no perfil `local`).

## Testes

A suíte segue **TDD** e roda inteira com:

```bash
./gradlew test
```

| Tipo | Ferramentas | Onde |
|------|-------------|------|
| Unitários de domínio | JUnit 5, AssertJ, testes parametrizados | `src/test/.../domain` |
| Unitários de serviço | JUnit 5, **Mockito** (`MockitoExtension`) | `src/test/.../application` |
| Integração de persistência | `@DataJpaTest`, **Testcontainers** | `src/test/.../integration/*PersistenceIT` |
| Integração do fluxo HTTP | `@SpringBootTest`, MockMvc, Spring Security Test, **Testcontainers** | `src/test/.../integration/*FlowIT` |

### Testcontainers e Docker

Os testes de integração sobem um **PostgreSQL 16** efêmero em contêiner via
**Testcontainers**, ligado ao Spring por `@ServiceConnection`
(`integration/PostgresTestConfig`). O Flyway executa todas as migrations nesse
banco, então os testes validam o mesmo schema e a mesma engine de produção, inclusive
o comportamento do `DEFAULT 'N/A'` da migration `V12`.

**Requisito:** Docker em execução na máquina que roda os testes.

## Deploy

A API roda em **AWS EC2**, em contêiner Docker, junto de PostgreSQL e Redis, com
`docker-compose.yml`:

```bash
./gradlew bootJar
docker compose up -d
```

O contêiner da API expõe a porta `8082` do host e usa o perfil `prod`.

> Segredos (senhas de banco/Redis, `jwt.secret`) não devem ficar versionados;
> forneça-os por variáveis de ambiente ou arquivo de configuração fora do repositório.

## Licença

Software proprietário. Veja [LICENSE](../LICENSE).
