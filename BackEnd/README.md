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

Swagger:

```text
http://localhost:3333/api-docs
```

No Swagger, execute primeiro `POST /api/auth/login`, copie o campo `token`,
clique em **Authorize** e cole somente o token. As demais rotas protegidas
passarao a enviar automaticamente o header `Authorization: Bearer`.

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
- `GET /api/dashboard`: resumo de notas, faltas, disciplinas e atividades.

## Exemplos

Cadastro:

```http
POST /api/auth/register
Content-Type: application/json

{
  "nomeUsuario": "Maria Silva",
  "email": "maria@email.com",
  "senha": "senha123",
  "instituicao": "UFAM",
  "curso": "Engenharia de Software"
}
```

Criar disciplina:

```http
POST /api/disciplines
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "codigoDisciplina": "ES101",
  "nomeDisciplina": "Engenharia de Requisitos"
}
```

Registrar notas:

```http
PUT /api/disciplines/1/grades
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "nota1": 8.5,
  "nota2": 7.5,
  "nota3": 9
}
```

Registrar faltas:

```http
PUT /api/disciplines/1/absences
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "numeroFaltas": 4,
  "limiteFaltas": 15
}
```

Criar atividade:

```http
POST /api/activities
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "idDisciplina": 1,
  "dataAtividade": "2026-06-20",
  "topicoEstudo": "Prova de requisitos",
  "duracaoMinutos": 90,
  "tipoAtividade": "Prova"
}
```

Criar horario de aula:

```http
POST /api/class-times
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "idDisciplina": 1,
  "diaSemana": 2,
  "horaInicio": "08:00",
  "horaFim": "10:00",
  "localAula": "Sala 10"
}
```

Consultas individuais usam `GET /api/recurso/:id`. Horarios tambem aceitam
`PATCH /api/class-times/:id`. Horarios sobrepostos no mesmo dia retornam erro `400`.

Rotas protegidas exigem header:

```http
Authorization: Bearer SEU_TOKEN
```
