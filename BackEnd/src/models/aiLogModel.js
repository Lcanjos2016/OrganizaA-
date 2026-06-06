const db = require('../config/db');

async function create(userId, payload, response) {
  const result = await db.query(
    `INSERT INTO logs_requisicoes_ia (id_usuario, payload_envio, json_retornado)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, JSON.stringify(payload), JSON.stringify(response)]
  );
  return result.rows[0];
}

async function list(userId) {
  const result = await db.query(
    'SELECT * FROM logs_requisicoes_ia WHERE id_usuario = $1 ORDER BY data_requisicao DESC',
    [userId]
  );
  return result.rows;
}

module.exports = {
  create,
  list,
};
