const db = require('../config/db');

const publicFields =
  'id_usuario, nome_usuario, instituicao, email, curso, avatar, criado_em';

async function create({ nomeUsuario, instituicao, email, senhaHash, curso, avatar }) {
  const result = await db.query(
    `INSERT INTO usuarios (nome_usuario, instituicao, email, senha_hash, curso, avatar)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'default_avatar'))
     RETURNING ${publicFields}`,
    [nomeUsuario, instituicao, email, senhaHash, curso, avatar]
  );

  return result.rows[0];
}

async function findByEmail(email) {
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
}

async function findById(id) {
  const result = await db.query(`SELECT ${publicFields} FROM usuarios WHERE id_usuario = $1`, [
    id,
  ]);
  return result.rows[0];
}

async function update(id, data) {
  const result = await db.query(
    `UPDATE usuarios
     SET nome_usuario = COALESCE($2, nome_usuario),
         instituicao = COALESCE($3, instituicao),
         curso = COALESCE($4, curso),
         avatar = COALESCE($5, avatar)
     WHERE id_usuario = $1
     RETURNING ${publicFields}`,
    [id, data.nomeUsuario, data.instituicao, data.curso, data.avatar]
  );

  return result.rows[0];
}

module.exports = {
  create,
  findByEmail,
  findById,
  update,
};
