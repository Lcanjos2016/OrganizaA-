const db = require('../config/db');

async function listCronogramas(userId) {
  const result = await db.query(
    'SELECT * FROM cronogramas WHERE id_usuario = $1 ORDER BY criado_em DESC',
    [userId]
  );
  return result.rows;
}

async function findCronogramaById(userId, cronogramaId) {
  const result = await db.query(
    'SELECT * FROM cronogramas WHERE id_usuario = $1 AND id_cronograma = $2',
    [userId, cronogramaId]
  );
  return result.rows[0];
}

async function createCronograma(userId, data) {
  const result = await db.query(
    `INSERT INTO cronogramas (id_usuario, titulo, data_inicio, data_fim, dicas_do_mentor, ativo)
     VALUES ($1, COALESCE($2, 'Cronograma'), $3, $4, $5, COALESCE($6, TRUE))
     RETURNING *`,
    [userId, data.titulo, data.dataInicio, data.dataFim, data.dicasDoMentor, data.ativo]
  );
  return result.rows[0];
}

async function updateCronograma(userId, cronogramaId, data) {
  const result = await db.query(
    `UPDATE cronogramas
        SET titulo = COALESCE($3, titulo),
            data_inicio = COALESCE($4, data_inicio),
            data_fim = COALESCE($5, data_fim),
            dicas_do_mentor = COALESCE($6, dicas_do_mentor),
            ativo = COALESCE($7, ativo)
      WHERE id_usuario = $1 AND id_cronograma = $2
      RETURNING *`,
    [
      userId,
      cronogramaId,
      data.titulo,
      data.dataInicio,
      data.dataFim,
      data.dicasDoMentor,
      data.ativo,
    ]
  );
  return result.rows[0];
}

async function removeCronograma(userId, cronogramaId) {
  const result = await db.query(
    'DELETE FROM cronogramas WHERE id_usuario = $1 AND id_cronograma = $2 RETURNING id_cronograma',
    [userId, cronogramaId]
  );
  return result.rowCount > 0;
}

async function listHorarios(userId) {
  const result = await db.query(
    `SELECT h.*, d.codigo_disciplina, d.nome_disciplina
       FROM horarios_aula h
       LEFT JOIN disciplinas d ON d.id_disciplina = h.id_disciplina
      WHERE h.id_usuario = $1
      ORDER BY h.dia_semana, h.hora_inicio`,
    [userId]
  );
  return result.rows;
}

async function findHorarioById(userId, horarioId) {
  const result = await db.query(
    `SELECT h.*, d.codigo_disciplina, d.nome_disciplina
       FROM horarios_aula h
       LEFT JOIN disciplinas d ON d.id_disciplina = h.id_disciplina
      WHERE h.id_usuario = $1 AND h.id_horario = $2`,
    [userId, horarioId]
  );
  return result.rows[0];
}

async function createHorario(userId, data) {
  const result = await db.query(
    `INSERT INTO horarios_aula (id_usuario, id_disciplina, dia_semana, hora_inicio, hora_fim, local_aula)
     SELECT $1, $2, $3, $4, $5, $6
      WHERE NOT EXISTS (
        SELECT 1
          FROM horarios_aula
         WHERE id_usuario = $1
           AND dia_semana = $3
           AND $4 < hora_fim
           AND $5 > hora_inicio
      )
     RETURNING *`,
    [userId, data.idDisciplina, data.diaSemana, data.horaInicio, data.horaFim, data.localAula]
  );
  return result.rows[0];
}

async function updateHorario(userId, horarioId, data) {
  const result = await db.query(
    `UPDATE horarios_aula h
        SET id_disciplina = COALESCE($3, h.id_disciplina),
            dia_semana = COALESCE($4, h.dia_semana),
            hora_inicio = COALESCE($5, h.hora_inicio),
            hora_fim = COALESCE($6, h.hora_fim),
            local_aula = COALESCE($7, h.local_aula)
      WHERE h.id_usuario = $1
        AND h.id_horario = $2
        AND NOT EXISTS (
          SELECT 1
            FROM horarios_aula conflito
           WHERE conflito.id_usuario = $1
             AND conflito.id_horario <> $2
             AND conflito.dia_semana = COALESCE($4, h.dia_semana)
             AND COALESCE($5, h.hora_inicio) < conflito.hora_fim
             AND COALESCE($6, h.hora_fim) > conflito.hora_inicio
        )
      RETURNING h.*`,
    [
      userId,
      horarioId,
      data.idDisciplina,
      data.diaSemana,
      data.horaInicio,
      data.horaFim,
      data.localAula,
    ]
  );
  return result.rows[0];
}

async function removeHorario(userId, horarioId) {
  const result = await db.query(
    'DELETE FROM horarios_aula WHERE id_usuario = $1 AND id_horario = $2 RETURNING id_horario',
    [userId, horarioId]
  );
  return result.rowCount > 0;
}

module.exports = {
  listCronogramas,
  findCronogramaById,
  createCronograma,
  updateCronograma,
  removeCronograma,
  listHorarios,
  findHorarioById,
  createHorario,
  updateHorario,
  removeHorario,
};
