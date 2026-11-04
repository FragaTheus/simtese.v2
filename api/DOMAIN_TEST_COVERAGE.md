# Cobertura de testes do domínio

## Resultado

**Conforme:** `cd api && ./gradlew test` concluiu com sucesso após a inclusão dos testes, sem falhas. Os testes de persistência usam PostgreSQL por Testcontainers, conforme a configuração existente; Docker precisa estar disponível para executá-los.

## Entidades e value objects

| Tipo | Cobertura |
|---|---|
| `Account` | Factories para todos os papéis; nome e e-mail (obrigatoriedade, formato e limites); senha obrigatória; alteração de nome/senha, confirmação e hashing; ativação/desativação idempotentes. |
| `Appointment` | Campos obrigatórios, conjunto de exames nulo/vazio, limite de observação e estados de atendimento/liberação. |
| `Enterprise` | Factories para CNPJ, CAEPF e CPF; documento obrigatório; nome e limite; tipo/número de cadastro; vínculo/desvínculo de conta e erros; ativação/desativação idempotentes. |
| `Exam` | Nome obrigatório, caracteres e limites; alteração válida e rejeição sem substituir o nome existente; ativação/desativação idempotentes. |
| `Result` | Factory baseada em `Appointment` e construtor direto; transferência de empresa, colaborador, aptidão e nome do arquivo. |
| `CAEPF` | Valores válidos com e sem formatação; obrigatoriedade, comprimento, caracteres, dígitos repetidos e dígitos verificadores. |
| `CNPJ` | Valores válidos com e sem formatação; obrigatoriedade, comprimento, caracteres, dígitos repetidos e dígitos verificadores. |
| `CPF` | Valores válidos com e sem formatação; obrigatoriedade, comprimento, caracteres, dígitos repetidos e dígitos verificadores. |
| `Employee` | Nome e CPF (obrigatoriedade, limites, formato, normalização e dígitos verificadores); função ausente/padrão, trim, limite e caracteres permitidos. |
| `EnterpriseDocument` | Tipo obrigatório e valor obrigatório/não vazio. |
| `Password` | Comprimento mínimo/máximo, presença de letra/número/caractere especial, hashing e comparação de senha correspondente ou inválida. |

## Outros tipos do domínio

| Tipos | Cobertura |
|---|---|
| Enums `Role`, `ExamStatus`, `ExamType`, `Shift`, `EnterpriseDocumentType` | Valores suportados verificados integralmente. |
| 11 exceções de domínio | Tipo concreto, mensagem preservada e natureza unchecked (`RuntimeException`). |
| `AccountRepository` | `findByEmail` e `existsByEmail`, com resultado encontrado e ausente. |
| `EnterpriseRepository` | Busca/existência por CNPJ, CAEPF e CPF; busca por conta vinculada. |
| `ExamRepository` | Existência por nome, exames associados a agendamento e filtro de exames ativos. |
| `AppointmentRepository` | Operações herdadas de gravação e recarga exercitadas em `AppointmentPersistenceIT`; não há consultas próprias na interface. |
| `ResultRepository` | Gravação e recarga exercitadas em `DomainRepositoriesIT`; não há consultas próprias na interface. |

As operações genéricas herdadas de `JpaRepository`/`JpaSpecificationExecutor` não foram duplicadas como testes unitários de cada interface; foram verificadas na fronteira de persistência quando aplicável.

## Arquivos de teste

- Unitários: `src/test/java/br/com/matheusfragadev/api/domain/`
- Contratos de repositório: `src/test/java/br/com/matheusfragadev/api/integration/DomainRepositoriesIT.java`
- Persistência de agendamento existente: `src/test/java/br/com/matheusfragadev/api/integration/AppointmentPersistenceIT.java`
