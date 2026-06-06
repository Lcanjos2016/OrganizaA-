# OrganizaAE BackEnd

API REST em Node.js + PostgreSQL para o app OrganizaAE.

## Como Rodar

1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` com a senha do seu PostgreSQL.
2. Crie o banco no PostgreSQL:

```sql
CREATE DATABASE "OrganizaAE";
```

3. Instale dependencias e rode a migration:

```bash
npm install
npm run db:init
npm run dev
```

A API fica em `http://localhost:3333`.

No seu Windows, o PostgreSQL 18 pode estar rodando na porta `5433`. Se aparecer erro de senha, troque `SUA_SENHA` pela senha definida na instalação do PostgreSQL:

```env
DATABASE_URL=postgres://postgres:SUA_SENHA@localhost:5433/OrganizaAE
```

## Rotas Principais

- `POST /api/auth/register`: cadastro com `nomeUsuario`, `email`, `senha`, `instituicao`, `curso`.
- `POST /api/auth/login`: login com `email` e `senha`.
- `GET/PATCH /api/users/me`: perfil do usuario logado.
- `GET/PUT /api/users/me/preferences`: preferencias e configuracoes.
- `GET/POST/PATCH/DELETE /api/disciplines`: disciplinas.
- `PUT /api/disciplines/:id/grades`: notas e calculo de situacao.
- `PUT /api/disciplines/:id/absences`: faltas e alerta de 80% do limite.
- `GET/POST/PATCH/DELETE /api/activities`: atividades, provas e entregas.
- `GET/POST/PATCH/DELETE /api/schedules`: cronogramas.
- `GET/POST/DELETE /api/class-times`: horarios de aula com bloqueio de conflito exato.
- `GET/POST/PATCH/DELETE /api/reminders`: lembretes.
- `POST /api/ai/progress`: analise de progresso baseada nas notas e faltas cadastradas.
- `GET /api/ai/logs`: historico das analises.

Rotas protegidas exigem header:

```http
Authorization: Bearer SEU_TOKEN
```
