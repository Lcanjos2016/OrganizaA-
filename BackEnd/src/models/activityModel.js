const db = require('../config/db');

async function list(userId) {
  const result = await db.query(
    `SELECT a.*, d.codigo_disciplina, d.nome_disciplina
       FROM atividades a
       LEFT JOIN disciplinas d ON d.id_disciplina = a.id_disciplina
      WHERE a.id_usuario = $1
      ORDER BY a.data_atividade`,
    [userId]
  );
  return result.rows;
}

async function create(userId, data) {
  const result = await db.query(
    `INSERT INTO atividades (
       id_usuario, id_cronograma, id_disciplina, data_atividade,
       topico_estudo, duracao_minutos, tipo_atividade, concluida
     )
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 60), $7, COALESCE($8, FALSE))
     RETURNING *`,
    [
      userId,
      data.idCronograma,
      data.idDisciplina,
      data.dataAtividade,
      data.topicoEstudo,
      data.duracaoMinutos,
      data.tipoAtividade,
      data.concluida,
    ]
  );
  return result.rows[0];
}

async function update(userId, activityId, data) {
  const result = await db.query(
    `UPDATE atividades
        SET id_cronograma = COALESCE($3, id_cronograma),
            id_disciplina = COALESCE($4, id_disciplina),
            data_atividade = COALESCE($5, data_atividade),
            topico_estudo = COALESCE($6, topico_estudo),
            duracao_minutos = COALESCE($7, duracao_minutos),
            tipo_atividade = COALESCE($8, tipo_atividade),
            concluida = COALESCE($9, concluida)
      WHERE id_usuario = $1 AND id_atividade = $2
      RETURNING *`,
    [
      userId,
      activityId,
      data.idCronograma,
      data.idDisciplina,
      data.dataAtividade,
      data.topicoEstudo,
      data.duracaoMinutos,
      data.tipoAtividade,
      data.concluida,
    ]
  );
  return result.rows[0];
}

async function remove(userId, activityId) {
  const result = await db.query(
    'DELETE FROM atividades WHERE id_usuario = $1 AND id_atividade = $2 RETURNING id_atividade',
    [userId, activityId]
  );
  return result.rowCount > 0;
}

module.exports = {
  list,
  create,
  update,
  remove,
};
