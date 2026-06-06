const db = require('../config/db');

async function list(userId) {
  const result = await db.query(
    'SELECT * FROM lembretes WHERE id_usuario = $1 ORDER BY data_hora',
    [userId]
  );
  return result.rows;
}

async function create(userId, data) {
  const result = await db.query(
    `INSERT INTO lembretes (
       id_usuario, id_atividade, titulo, descricao, data_hora, antecedencia_minutos, enviado
     )
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 1440), COALESCE($7, FALSE))
     RETURNING *`,
    [
      userId,
      data.idAtividade,
      data.titulo,
      data.descricao,
      data.dataHora,
      data.antecedenciaMinutos,
      data.enviado,
    ]
  );
  return result.rows[0];
}

async function update(userId, reminderId, data) {
  const result = await db.query(
    `UPDATE lembretes
        SET id_atividade = COALESCE($3, id_atividade),
            titulo = COALESCE($4, titulo),
            descricao = COALESCE($5, descricao),
            data_hora = COALESCE($6, data_hora),
            antecedencia_minutos = COALESCE($7, antecedencia_minutos),
            enviado = COALESCE($8, enviado)
      WHERE id_usuario = $1 AND id_lembrete = $2
      RETURNING *`,
    [
      userId,
      reminderId,
      data.idAtividade,
      data.titulo,
      data.descricao,
      data.dataHora,
      data.antecedenciaMinutos,
      data.enviado,
    ]
  );
  return result.rows[0];
}

async function remove(userId, reminderId) {
  const result = await db.query(
    'DELETE FROM lembretes WHERE id_usuario = $1 AND id_lembrete = $2 RETURNING id_lembrete',
    [userId, reminderId]
  );
  return result.rowCount > 0;
}

module.exports = {
  list,
  create,
  update,
  remove,
};
