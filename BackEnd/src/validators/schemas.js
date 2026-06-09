const { z } = require('zod');

const idParam = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.any().optional(),
  query: z.any().optional(),
});

const register = z.object({
  body: z.object({
    nomeUsuario: z.string().min(2),
    email: z.string().email(),
    senha: z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/),
    instituicao: z.string().optional(),
    curso: z.string().optional(),
    avatar: z.string().optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const login = z.object({
  body: z.object({
    email: z.string().email(),
    senha: z.string().min(1),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const profile = z.object({
  body: z.object({
    nomeUsuario: z.string().min(2).optional(),
    instituicao: z.string().optional(),
    curso: z.string().optional(),
    avatar: z.string().optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const preferences = z.object({
  body: z.object({
    notificacoesAtivas: z.boolean().optional(),
    iaAtiva: z.boolean().optional(),
    antecedenciaNotificacaoDias: z.number().int().min(0).optional(),
    tema: z.string().optional(),
    dados: z.record(z.string(), z.any()).optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const discipline = z.object({
  body: z.object({
    codigoDisciplina: z.string().min(1).max(20).optional(),
    nomeDisciplina: z.string().min(2).max(100).optional(),
  }).refine((data) => data.codigoDisciplina || data.nomeDisciplina),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const disciplineCreate = z.object({
  body: z.object({
    codigoDisciplina: z.string().min(1).max(20),
    nomeDisciplina: z.string().min(2).max(100),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const grades = z.object({
  body: z.object({
    nota1: z.number().min(0).max(10).optional(),
    nota2: z.number().min(0).max(10).optional(),
    nota3: z.number().min(0).max(10).optional(),
    notaPf: z.number().min(0).max(10).optional(),
    limiteFaltas: z.number().int().min(0).optional(),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const absences = z.object({
  body: z.object({
    numeroFaltas: z.number().int().min(0),
    limiteFaltas: z.number().int().min(0).optional(),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const activity = z.object({
  body: z.object({
    idCronograma: z.number().int().positive().optional(),
    idDisciplina: z.number().int().positive().optional(),
    dataAtividade: z.string().min(10).optional(),
    topicoEstudo: z.string().min(2).optional(),
    duracaoMinutos: z.number().int().positive().optional(),
    tipoAtividade: z.string().min(2).optional(),
    concluida: z.boolean().optional(),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const activityCreate = z.object({
  body: activity.shape.body.extend({
    dataAtividade: z.string().min(10),
    topicoEstudo: z.string().min(2),
    tipoAtividade: z.string().min(2),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const cronograma = z.object({
  body: z.object({
    titulo: z.string().optional(),
    dataInicio: z.string().min(10).optional(),
    dataFim: z.string().min(10).optional(),
    dicasDoMentor: z.string().optional(),
    ativo: z.boolean().optional(),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const cronogramaCreate = z.object({
  body: cronograma.shape.body.extend({
    dataInicio: z.string().min(10),
    dataFim: z.string().min(10),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const horario = z.object({
  body: z.object({
    idDisciplina: z.number().int().positive().optional(),
    diaSemana: z.number().int().min(1).max(7),
    horaInicio: z.string().min(4),
    horaFim: z.string().min(4),
    localAula: z.string().optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const horarioUpdate = z.object({
  body: z.object({
    idDisciplina: z.number().int().positive().optional(),
    diaSemana: z.number().int().min(1).max(7).optional(),
    horaInicio: z.string().min(4).optional(),
    horaFim: z.string().min(4).optional(),
    localAula: z.string().optional(),
  }).refine((data) => Object.keys(data).length > 0),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const reminder = z.object({
  body: z.object({
    idAtividade: z.number().int().positive().optional(),
    titulo: z.string().min(2).optional(),
    descricao: z.string().optional(),
    dataHora: z.string().min(10).optional(),
    antecedenciaMinutos: z.number().int().min(0).optional(),
    enviado: z.boolean().optional(),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.any().optional(),
});

const reminderCreate = z.object({
  body: reminder.shape.body.extend({
    titulo: z.string().min(2),
    dataHora: z.string().min(10),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

const notificationKey = z.object({
  body: z.object({
    chave: z.string().min(1).max(255),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

module.exports = {
  idParam,
  register,
  login,
  profile,
  preferences,
  discipline,
  disciplineCreate,
  grades,
  absences,
  activity,
  activityCreate,
  cronograma,
  cronogramaCreate,
  horario,
  horarioUpdate,
  reminder,
  reminderCreate,
  notificationKey,
};
