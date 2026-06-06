const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.databaseUrl,
});

async function query(sql, params) {
  return pool.query(sql, params);
}

module.exports = {
  pool,
  query,
};
