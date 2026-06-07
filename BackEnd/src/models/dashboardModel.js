const db = require('../config/db');

async function getSummary(userId) {
  const result = await db.query(
    `SELECT
       (SELECT COUNT(*)::int FROM disciplinas WHERE id_usuario = $1) AS total_disciplinas,
       (SELECT COUNT(*)::int FROM atividades WHERE id_usuario = $1) AS total_atividades,
       (SELECT COUNT(*)::int FROM atividades WHERE id_usuario = $1 AND concluida = TRUE) AS atividades_concluidas,
       (SELECT COUNT(*)::int FROM atividades WHERE id_usuario = $1 AND concluida = FALSE) AS atividades_pendentes,
       (SELECT COALESCE(SUM(numero_faltas), 0)::int FROM matriculas_disciplinas WHERE id_usuario = $1) AS total_faltas,
       (SELECT COALESCE(ROUND(AVG(nota_final), 2), 0) FROM matriculas_disciplinas WHERE id_usuario = $1) AS media_geral,
       (SELECT COUNT(*)::int FROM matriculas_disciplinas WHERE id_usuario = $1 AND situacao = 'Aprovado') AS disciplinas_aprovadas`,
    [userId]
  );
  return result.rows[0];
}

async function getUpcomingActivities(userId) {
  const result = await db.query(
    `SELECT a.*, d.codigo_disciplina, d.nome_disciplina
       FROM atividades a
       LEFT JOIN disciplinas d ON d.id_disciplina = a.id_disciplina
      WHERE a.id_usuario = $1
        AND a.concluida = FALSE
        AND a.data_atividade >= CURRENT_DATE
      ORDER BY a.data_atividade
      LIMIT 5`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  getSummary,
  getUpcomingActivities,
};
