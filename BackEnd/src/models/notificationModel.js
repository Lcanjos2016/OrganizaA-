const db = require('../config/db');

async function listDismissed(userId) {
  const result = await db.query(
    `SELECT chave_notificacao
       FROM notificacoes_removidas
      WHERE id_usuario = $1
      ORDER BY removida_em DESC`,
    [userId]
  );
  return result.rows.map((row) => row.chave_notificacao);
}

async function dismiss(userId, key) {
  await db.query(
    `INSERT INTO notificacoes_removidas (id_usuario, chave_notificacao)
     VALUES ($1, $2)
     ON CONFLICT (id_usuario, chave_notificacao) DO NOTHING`,
    [userId, key]
  );
}

async function restore(userId, key) {
  await db.query(
    `DELETE FROM notificacoes_removidas
      WHERE id_usuario = $1 AND chave_notificacao = $2`,
    [userId, key]
  );
}

module.exports = {
  listDismissed,
  dismiss,
  restore,
};
