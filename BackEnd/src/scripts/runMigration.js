const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function run() {
  const migrationPath = path.resolve(__dirname, '../../migrations/init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  await pool.query(sql);
  console.log('Migration executada com sucesso.');
}

run()
  .catch((error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error(
        'PostgreSQL nao aceitou conexao. Confira se o servico esta rodando e se a porta no DATABASE_URL esta correta.'
      );
    } else if (error.code === '28P01') {
      console.error(
        'Senha do PostgreSQL incorreta. Ajuste a senha no arquivo .env em DATABASE_URL.'
      );
    } else if (error.code === '3D000') {
      console.error(
        'Banco de dados nao existe. Crie o banco OrganizaAE no PostgreSQL antes de rodar a migration.'
      );
    } else {
      console.error('Erro ao executar migration:', error);
    }
    process.exitCode = 1;
  })
  .finally(() => pool.end());
