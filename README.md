# Simtese

Sistema de agendamento e gestão de exames ocupacionais: agendamentos feitos pelo
público ou pela recepção, atendimento, liberação por enfermagem, empresas,
exames e resultados.

## Estrutura do repositório

| Pasta | Descrição | Documentação |
|-------|-----------|--------------|
| [`api/`](./api) | API REST em Java / Spring Boot | [api/README.md](./api/README.md) |
| [`ui/`](./ui) | Frontend em Angular | [ui/README.md](./ui/README.md) |

## Arquitetura

```
 Navegador ──► Frontend Angular (Vercel)
                    │  HTTPS / JSON (JWT)
                    ▼
            API Spring Boot ──► PostgreSQL  (dados, migrations Flyway)
            (Docker, AWS EC2) ─► Redis       (rate limit e blacklist de tokens)
```

## Infraestrutura

- **API, PostgreSQL e Redis** rodam em contêineres Docker, orquestrados por Docker Compose,
  em uma instância **AWS EC2**.
- **Frontend** é publicado como aplicação estática com rewrite para `index.html`
  (configuração em [`ui/vercel.json`](./ui/vercel.json)).
- Migrações de banco são versionadas com **Flyway** e aplicadas na inicialização da API.

## Qualidade e testes

O projeto segue **TDD** e só é considerado pronto com a suíte **passando**:

- **API**: JUnit 5, AssertJ, Mockito, Spring Boot Test, MockMvc e Spring Security Test.
  Os testes de integração usam **Testcontainers** com **Docker**, executando em um
  **PostgreSQL real** (a mesma engine de produção) e rodando todas as migrations Flyway.
- **Frontend**: Vitest (runner do `ng test`) com `TestBed` e `HttpTestingController`.

Detalhes e comandos em cada README.

## Execução rápida

```bash
# API (requer JDK 25 e Docker para os testes de integração)
cd api && ./gradlew test

# Frontend (requer Node 20+)
cd ui && npm ci && npm test -- --watch=false
```

## Licença

Software proprietário. Copyright (c) 2026 Melissa Acassio. Todos os direitos
reservados. Veja [LICENSE](./LICENSE).
