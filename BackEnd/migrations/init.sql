CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nome_usuario VARCHAR(100) NOT NULL,
  instituicao VARCHAR(150),
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  curso VARCHAR(100),
  avatar VARCHAR(50) DEFAULT 'default_avatar',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS preferencias_usuario (
  id_preferencia SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  notificacoes_ativas BOOLEAN DEFAULT TRUE,
  ia_ativa BOOLEAN DEFAULT TRUE,
  antecedencia_notificacao_dias INTEGER DEFAULT 1,
  tema VARCHAR(30) DEFAULT 'padrao',
  dados JSONB DEFAULT '{}'::jsonb,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id_disciplina SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  codigo_disciplina VARCHAR(20) NOT NULL,
  nome_disciplina VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT num_codigo_unico_por_usuario UNIQUE (id_usuario, codigo_disciplina)
);

CREATE TABLE IF NOT EXISTS matriculas_disciplinas (
  id_matricula SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_disciplina INTEGER NOT NULL REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE,
  nota1 NUMERIC(4,2) DEFAULT 0.00,
  nota2 NUMERIC(4,2) DEFAULT 0.00,
  nota3 NUMERIC(4,2) DEFAULT 0.00,
  nota_final NUMERIC(4,2) DEFAULT 0.00,
  nota_pf NUMERIC(4,2),
  nota_necessaria_pf NUMERIC(4,2),
  numero_faltas INTEGER DEFAULT 0,
  limite_faltas INTEGER DEFAULT 15,
  situacao VARCHAR(30) DEFAULT 'Em Andamento',
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT matricula_unica UNIQUE (id_usuario, id_disciplina)
);

CREATE TABLE IF NOT EXISTS cronogramas (
  id_cronograma SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  titulo VARCHAR(100) DEFAULT 'Cronograma',
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dicas_do_mentor TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horarios_aula (
  id_horario SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_disciplina INTEGER REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  local_aula VARCHAR(100),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT horario_sem_conflito UNIQUE (id_usuario, dia_semana, hora_inicio, hora_fim)
);

CREATE TABLE IF NOT EXISTS atividades (
  id_atividade SERIAL PRIMARY KEY,
  id_cronograma INTEGER REFERENCES cronogramas(id_cronograma) ON DELETE CASCADE,
  id_disciplina INTEGER REFERENCES disciplinas(id_disciplina) ON DELETE SET NULL,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  data_atividade DATE NOT NULL,
  topico_estudo VARCHAR(255) NOT NULL,
  duracao_minutos INTEGER DEFAULT 60 NOT NULL,
  tipo_atividade VARCHAR(50) NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lembretes (
  id_lembrete SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_atividade INTEGER REFERENCES atividades(id_atividade) ON DELETE CASCADE,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  data_hora TIMESTAMP NOT NULL,
  antecedencia_minutos INTEGER DEFAULT 1440,
  enviado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs_requisicoes_ia (
  id_log SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  payload_envio TEXT NOT NULL,
  json_retornado JSONB NOT NULL,
  data_requisicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notificacoes_removidas (
  id_notificacao_removida SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  chave_notificacao VARCHAR(255) NOT NULL,
  removida_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notificacao_removida_unica UNIQUE (id_usuario, chave_notificacao)
);

ALTER TABLE IF EXISTS disciplinas
  ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE IF EXISTS matriculas_disciplinas
  ADD COLUMN IF NOT EXISTS nota_pf NUMERIC(4,2),
  ADD COLUMN IF NOT EXISTS nota_necessaria_pf NUMERIC(4,2),
  ADD COLUMN IF NOT EXISTS limite_faltas INTEGER DEFAULT 15,
  ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE IF EXISTS cronogramas
  ADD COLUMN IF NOT EXISTS titulo VARCHAR(100) DEFAULT 'Cronograma';

ALTER TABLE IF EXISTS atividades
  ADD COLUMN IF NOT EXISTS id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_disciplinas_usuario ON disciplinas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_atividades_usuario_data ON atividades(id_usuario, data_atividade);
CREATE INDEX IF NOT EXISTS idx_lembretes_usuario_data ON lembretes(id_usuario, data_hora);
CREATE INDEX IF NOT EXISTS idx_notificacoes_removidas_usuario
  ON notificacoes_removidas(id_usuario);
