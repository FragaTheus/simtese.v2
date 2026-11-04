# Simtese UI

Frontend do Simtese, em **Angular 21** com componentes **PrimeNG** e **Tailwind CSS**.

## Stack

- Angular 21 (standalone components, signals, formulários reativos)
- PrimeNG 21 + `@primeuix/themes` + Tailwind CSS 4
- RxJS, `HttpClient` com interceptor de autenticação (JWT)

## Estrutura

```
src/app
├── feat/        # funcionalidades: appointments, enterprises, exams, results, auth, dash…
└── shared/      # componentes, pipes e configuração de API reutilizáveis
```

### Agendamento

Há dois formulários, ambos com o campo opcional **Função do funcionário**:

- `create-appointment-component`: modal usado no painel (recepção);
- `atendimento-page-component`: fluxo público em etapas (Funcionário → Empresa → Agendamento).

A tela de detalhes mostra a função, ou `N/A` quando não informada.

## Desenvolvimento

```bash
npm ci
npm start          # http://localhost:4200
npm run build      # build de produção
```

## Testes

```bash
npm test -- --watch=false
```

Executados com **Vitest** (runner do `ng test`) em ambiente `jsdom`, usando `TestBed` e
`HttpTestingController` para validar chamadas HTTP, formulários e regras dos componentes.

## Deploy

Publicado como aplicação estática (configuração em `vercel.json`, com rewrite de
todas as rotas para `index.html`). O consumo da API aponta para o backend hospedado em
AWS EC2.

## Licença

Software proprietário. Veja [LICENSE](../LICENSE).
