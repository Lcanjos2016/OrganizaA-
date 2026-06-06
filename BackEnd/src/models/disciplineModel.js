const db = require('../config/db');

async function list(userId) {
  const result = await db.query(
    `SELECT d.id_disciplina, d.codigo_disciplina, d.nome_disciplina, d.criado_em,
            m.id_matricula, m.nota1, m.nota2, m.nota3, m.nota_final, m.nota_pf,
            m.nota_necessaria_pf, m.numero_faltas, m.limite_faltas, m.situacao
       FROM disciplinas d
       LEFT JOIN matriculas_disciplinas m ON m.id_disciplina = d.id_disciplina AND m.id_usuario = d.id_usuario
      WHERE d.id_usuario = $1
      ORDER BY d.nome_disciplina`,
    [userId]
  );
  return result.rows;
}

async function create(userId, { codigoDisciplina, nomeDisciplina }) {
  const result = await db.query(
    `WITH disciplina AS (
       INSERT INTO disciplinas (id_usuario, codigo_disciplina, nome_disciplina)
       VALUES ($1, $2, $3)
       RETURNING *
     )
     INSERT INTO matriculas_disciplinas (id_usuario, id_disciplina)
     SELECT id_usuario, id_disciplina FROM disciplina
     RETURNING id_disciplina`,
    [userId, codigoDisciplina, nomeDisciplina]
  );

  return findById(userId, result.rows[0].id_disciplina);
}

async function findById(userId, disciplineId) {
  const result = await db.query(
    `SELECT d.id_disciplina, d.codigo_disciplina, d.nome_disciplina, d.criado_em,
            m.id_matricula, m.nota1, m.nota2, m.nota3, m.nota_final, m.nota_pf,
            m.nota_necessaria_pf, m.numero_faltas, m.limite_faltas, m.situacao
       FROM disciplinas d
       LEFT JOIN matriculas_disciplinas m ON m.id_disciplina = d.id_disciplina AND m.id_usuario = d.id_usuario
      WHERE d.id_usuario = $1 AND d.id_disciplina = $2`,
    [userId, disciplineId]
  );
  return result.rows[0];
}

async function update(userId, disciplineId, data) {
  const result = await db.query(
    `UPDATE disciplinas
        SET codigo_disciplina = COALESCE($3, codigo_disciplina),
            nome_disciplina = COALESCE($4, nome_disciplina)
      WHERE id_usuario = $1 AND id_disciplina = $2
      RETURNING id_disciplina`,
    [userId, disciplineId, data.codigoDisciplina, data.nomeDisciplina]
  );

  if (!result.rows[0]) return null;
  return findById(userId, disciplineId);
}

async function remove(userId, disciplineId) {
  const result = await db.query(
    'DELETE FROM disciplinas WHERE id_usuario = $1 AND id_disciplina = $2 RETURNING id_disciplina',
    [userId, disciplineId]
  );
  return result.rowCount > 0;
}

async function updateEnrollment(userId, disciplineId, data) {
  const result = await db.query(
    `UPDATE matriculas_disciplinas
        SET nota1 = COALESCE($3, nota1),
            nota2 = COALESCE($4, nota2),
            nota3 = COALESCE($5, nota3),
            nota_final = COALESCE($6, nota_final),
            nota_pf = $7,
            nota_necessaria_pf = $8,
            numero_faltas = COALESCE($9, numero_faltas),
            limite_faltas = COALESCE($10, limite_faltas),
            situacao = COALESCE($11, situacao),
            atualizado_em = CURRENT_TIMESTAMP
      WHERE id_usuario = $1 AND id_disciplina = $2
      RETURNING *`,
    [
      userId,
      disciplineId,
      data.nota1,
      data.nota2,
      data.nota3,
      data.notaFinal,
      data.notaPf,
      data.notaNecessariaPf,
      data.numeroFaltas,
      data.limiteFaltas,
      data.situacao,
    ]
  );

  return result.rows[0];
}

module.exports = {
  list,
  create,
  findById,
  update,
  remove,
  updateEnrollment,
};
