const bearerSecurity = [{ bearerAuth: [] }];

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
};

const jsonBody = (schema, required = true) => ({
  required,
  content: {
    'application/json': { schema },
  },
});

const responses = {
  ok: { description: 'Operacao realizada com sucesso' },
  created: { description: 'Registro criado com sucesso' },
  noContent: { description: 'Registro removido com sucesso' },
  badRequest: {
    description: 'Dados invalidos',
    content: {
      'application/json': { schema: { $ref: '#/components/schemas/Error' } },
    },
  },
  unauthorized: {
    description: 'Token ausente, invalido ou expirado',
    content: {
      'application/json': { schema: { $ref: '#/components/schemas/Error' } },
    },
  },
  notFound: {
    description: 'Registro nao encontrado',
    content: {
      'application/json': { schema: { $ref: '#/components/schemas/Error' } },
    },
  },
};

const crudPaths = ({ tag, schema, collection, item, createRequired = [] }) => ({
  [collection]: {
    get: {
      tags: [tag],
      summary: `Listar ${tag.toLowerCase()}`,
      security: bearerSecurity,
      responses: { 200: responses.ok, 401: responses.unauthorized },
    },
    post: {
      tags: [tag],
      summary: `Criar ${tag.toLowerCase()}`,
      security: bearerSecurity,
      requestBody: jsonBody({
        allOf: [
          { $ref: `#/components/schemas/${schema}` },
          createRequired.length
            ? { type: 'object', required: createRequired }
            : { type: 'object' },
        ],
      }),
      responses: {
        201: responses.created,
        400: responses.badRequest,
        401: responses.unauthorized,
      },
    },
  },
  [item]: {
    get: {
      tags: [tag],
      summary: `Consultar ${tag.toLowerCase()} por ID`,
      security: bearerSecurity,
      parameters: [idParameter],
      responses: {
        200: responses.ok,
        401: responses.unauthorized,
        404: responses.notFound,
      },
    },
    patch: {
      tags: [tag],
      summary: `Atualizar ${tag.toLowerCase()}`,
      security: bearerSecurity,
      parameters: [idParameter],
      requestBody: jsonBody({ $ref: `#/components/schemas/${schema}` }),
      responses: {
        200: responses.ok,
        400: responses.badRequest,
        401: responses.unauthorized,
        404: responses.notFound,
      },
    },
    delete: {
      tags: [tag],
      summary: `Excluir ${tag.toLowerCase()}`,
      security: bearerSecurity,
      parameters: [idParameter],
      responses: {
        204: responses.noContent,
        401: responses.unauthorized,
        404: responses.notFound,
      },
    },
  },
});

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'OrganizaAE API',
    version: '1.0.0',
    description:
      'API REST para autenticacao, gestao academica, cronogramas, lembretes e progresso.',
  },
  servers: [{ url: 'http://localhost:3333', description: 'Servidor local' }],
  tags: [
    { name: 'Autenticacao' },
    { name: 'Usuario' },
    { name: 'Disciplinas' },
    { name: 'Atividades' },
    { name: 'Cronogramas' },
    { name: 'Horarios' },
    { name: 'Lembretes' },
    { name: 'Notificacoes' },
    { name: 'IA' },
    { name: 'Dashboard' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Cole somente o token retornado pelo login.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              status: { type: 'integer' },
            },
          },
        },
      },
      Register: {
        type: 'object',
        required: ['nomeUsuario', 'email', 'senha'],
        properties: {
          nomeUsuario: { type: 'string', example: 'Maria Silva' },
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          senha: { type: 'string', format: 'password', example: 'senha123' },
          instituicao: { type: 'string', example: 'UFAM' },
          curso: { type: 'string', example: 'Engenharia de Software' },
          avatar: { type: 'string', example: 'robot' },
        },
      },
      Login: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          senha: { type: 'string', format: 'password', example: 'senha123' },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          nomeUsuario: { type: 'string', example: 'Maria Silva' },
          instituicao: { type: 'string', example: 'UFAM' },
          curso: { type: 'string', example: 'Engenharia de Software' },
          avatar: { type: 'string', example: 'robot' },
        },
      },
      Preferences: {
        type: 'object',
        properties: {
          notificacoesAtivas: { type: 'boolean', example: true },
          iaAtiva: { type: 'boolean', example: true },
          antecedenciaNotificacaoDias: { type: 'integer', minimum: 0, example: 1 },
          tema: { type: 'string', example: 'padrao' },
          dados: { type: 'object', additionalProperties: true },
        },
      },
      Discipline: {
        type: 'object',
        properties: {
          codigoDisciplina: { type: 'string', example: 'ES101' },
          nomeDisciplina: { type: 'string', example: 'Engenharia de Requisitos' },
        },
      },
      Grades: {
        type: 'object',
        properties: {
          nota1: { type: 'number', minimum: 0, maximum: 10, example: 8.5 },
          nota2: { type: 'number', minimum: 0, maximum: 10, example: 7.5 },
          nota3: { type: 'number', minimum: 0, maximum: 10, example: 9 },
          notaPf: { type: 'number', minimum: 0, maximum: 10 },
          limiteFaltas: { type: 'integer', minimum: 0, example: 15 },
        },
      },
      Absences: {
        type: 'object',
        required: ['numeroFaltas'],
        properties: {
          numeroFaltas: { type: 'integer', minimum: 0, example: 4 },
          limiteFaltas: { type: 'integer', minimum: 0, example: 15 },
        },
      },
      Activity: {
        type: 'object',
        properties: {
          idCronograma: { type: 'integer', minimum: 1 },
          idDisciplina: { type: 'integer', minimum: 1, example: 1 },
          dataAtividade: { type: 'string', format: 'date', example: '2026-06-20' },
          topicoEstudo: { type: 'string', example: 'Prova de requisitos' },
          duracaoMinutos: { type: 'integer', minimum: 1, example: 90 },
          tipoAtividade: { type: 'string', example: 'Prova' },
          concluida: { type: 'boolean', example: false },
        },
      },
      Schedule: {
        type: 'object',
        properties: {
          titulo: { type: 'string', example: 'Semestre 2026/1' },
          dataInicio: { type: 'string', format: 'date', example: '2026-03-01' },
          dataFim: { type: 'string', format: 'date', example: '2026-07-31' },
          dicasDoMentor: { type: 'string' },
          ativo: { type: 'boolean', example: true },
        },
      },
      ClassTime: {
        type: 'object',
        properties: {
          idDisciplina: { type: 'integer', minimum: 1, example: 1 },
          diaSemana: { type: 'integer', minimum: 1, maximum: 7, example: 2 },
          horaInicio: { type: 'string', example: '08:00' },
          horaFim: { type: 'string', example: '10:00' },
          localAula: { type: 'string', example: 'Sala 10' },
        },
      },
      Reminder: {
        type: 'object',
        properties: {
          idAtividade: { type: 'integer', minimum: 1 },
          titulo: { type: 'string', example: 'Revisar para a prova' },
          descricao: { type: 'string' },
          dataHora: { type: 'string', format: 'date-time', example: '2026-06-19T18:00:00' },
          antecedenciaMinutos: { type: 'integer', minimum: 0, example: 1440 },
          enviado: { type: 'boolean', example: false },
        },
      },
      NotificationKey: {
        type: 'object',
        required: ['chave'],
        properties: {
          chave: { type: 'string', example: 'nota_1' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Dashboard'],
        summary: 'Verificar se a API esta ativa',
        responses: { 200: responses.ok },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Cadastrar usuario',
        requestBody: jsonBody({ $ref: '#/components/schemas/Register' }),
        responses: { 201: responses.created, 400: responses.badRequest },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Autenticar usuario e obter JWT',
        requestBody: jsonBody({ $ref: '#/components/schemas/Login' }),
        responses: { 200: responses.ok, 401: responses.unauthorized },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Usuario'],
        summary: 'Consultar perfil',
        security: bearerSecurity,
        responses: { 200: responses.ok, 401: responses.unauthorized },
      },
      patch: {
        tags: ['Usuario'],
        summary: 'Atualizar perfil',
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: '#/components/schemas/Profile' }),
        responses: { 200: responses.ok, 400: responses.badRequest, 401: responses.unauthorized },
      },
    },
    '/api/users/me/preferences': {
      get: {
        tags: ['Usuario'],
        summary: 'Consultar preferencias',
        security: bearerSecurity,
        responses: { 200: responses.ok, 401: responses.unauthorized },
      },
      put: {
        tags: ['Usuario'],
        summary: 'Salvar preferencias',
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: '#/components/schemas/Preferences' }),
        responses: { 200: responses.ok, 400: responses.badRequest, 401: responses.unauthorized },
      },
    },
    ...crudPaths({
      tag: 'Disciplinas',
      schema: 'Discipline',
      collection: '/api/disciplines',
      item: '/api/disciplines/{id}',
      createRequired: ['codigoDisciplina', 'nomeDisciplina'],
    }),
    '/api/disciplines/{id}/grades': {
      put: {
        tags: ['Disciplinas'],
        summary: 'Registrar notas e calcular situacao',
        security: bearerSecurity,
        parameters: [idParameter],
        requestBody: jsonBody({ $ref: '#/components/schemas/Grades' }),
        responses: { 200: responses.ok, 400: responses.badRequest, 401: responses.unauthorized },
      },
    },
    '/api/disciplines/{id}/absences': {
      put: {
        tags: ['Disciplinas'],
        summary: 'Registrar faltas',
        security: bearerSecurity,
        parameters: [idParameter],
        requestBody: jsonBody({ $ref: '#/components/schemas/Absences' }),
        responses: { 200: responses.ok, 400: responses.badRequest, 401: responses.unauthorized },
      },
    },
    ...crudPaths({
      tag: 'Atividades',
      schema: 'Activity',
      collection: '/api/activities',
      item: '/api/activities/{id}',
      createRequired: ['dataAtividade', 'topicoEstudo', 'tipoAtividade'],
    }),
    ...crudPaths({
      tag: 'Cronogramas',
      schema: 'Schedule',
      collection: '/api/schedules',
      item: '/api/schedules/{id}',
      createRequired: ['dataInicio', 'dataFim'],
    }),
    ...crudPaths({
      tag: 'Horarios',
      schema: 'ClassTime',
      collection: '/api/class-times',
      item: '/api/class-times/{id}',
      createRequired: ['diaSemana', 'horaInicio', 'horaFim'],
    }),
    ...crudPaths({
      tag: 'Lembretes',
      schema: 'Reminder',
      collection: '/api/reminders',
      item: '/api/reminders/{id}',
      createRequired: ['titulo', 'dataHora'],
    }),
    '/api/ai/progress': {
      post: {
        tags: ['IA'],
        summary: 'Analisar progresso academico',
        security: bearerSecurity,
        responses: { 200: responses.ok, 400: responses.badRequest, 401: responses.unauthorized },
      },
    },
    '/api/ai/logs': {
      get: {
        tags: ['IA'],
        summary: 'Listar historico de analises',
        security: bearerSecurity,
        responses: { 200: responses.ok, 401: responses.unauthorized },
      },
    },
    '/api/dashboard': {
      get: {
        tags: ['Dashboard'],
        summary: 'Obter resumo academico',
        security: bearerSecurity,
        responses: { 200: responses.ok, 401: responses.unauthorized },
      },
    },
    '/api/notifications/dismissed': {
      get: {
        tags: ['Notificacoes'],
        summary: 'Listar notificacoes dispensadas',
        security: bearerSecurity,
        responses: { 200: responses.ok, 401: responses.unauthorized },
      },
      post: {
        tags: ['Notificacoes'],
        summary: 'Dispensar uma notificacao',
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: '#/components/schemas/NotificationKey' }),
        responses: {
          204: responses.noContent,
          400: responses.badRequest,
          401: responses.unauthorized,
        },
      },
      delete: {
        tags: ['Notificacoes'],
        summary: 'Restaurar uma notificacao dispensada',
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: '#/components/schemas/NotificationKey' }),
        responses: {
          204: responses.noContent,
          400: responses.badRequest,
          401: responses.unauthorized,
        },
      },
    },
  },
};

module.exports = openapi;
