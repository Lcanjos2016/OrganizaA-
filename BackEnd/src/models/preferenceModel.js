const db = require('../config/db');

async function getByUser(userId) {
  const result = await db.query('SELECT * FROM preferencias_usuario WHERE id_usuario = $1', [
    userId,
  ]);
  return result.rows[0];
}

async function upsert(userId, data) {
  const result = await db.query(
    `INSERT INTO preferencias_usuario (
       id_usuario, notificacoes_ativas, ia_ativa, antecedencia_notificacao_dias, tema, dados
     )
     VALUES ($1, COALESCE($2, TRUE), COALESCE($3, TRUE), COALESCE($4, 1), COALESCE($5, 'padrao'), COALESCE($6, '{}'::jsonb))
     ON CONFLICT (id_usuario) DO UPDATE SET
       notificacoes_ativas = COALESCE(EXCLUDED.notificacoes_ativas, preferencias_usuario.notificacoes_ativas),
       ia_ativa = COALESCE(EXCLUDED.ia_ativa, preferencias_usuario.ia_ativa),
       antecedencia_notificacao_dias = COALESCE(EXCLUDED.antecedencia_notificacao_dias, preferencias_usuario.antecedencia_notificacao_dias),
       tema = COALESCE(EXCLUDED.tema, preferencias_usuario.tema),
       dados = COALESCE(EXCLUDED.dados, preferencias_usuario.dados),
       atualizado_em = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      userId,
      data.notificacoesAtivas,
      data.iaAtiva,
      data.antecedenciaNotificacaoDias,
      data.tema,
      data.dados ? JSON.stringify(data.dados) : null,
    ]
  );

  return result.rows[0];
}

module.exports = {
  getByUser,
  upsert,
};
