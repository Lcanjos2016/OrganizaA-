require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3333,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/OrganizaAE',
  jwtSecret: process.env.JWT_SECRET || 'organizaae-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
