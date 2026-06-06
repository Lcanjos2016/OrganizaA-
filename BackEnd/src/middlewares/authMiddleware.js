const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { unauthorized } = require('../utils/httpError');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(unauthorized('Token de autenticacao ausente'));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub };
    return next();
  } catch (error) {
    return next(unauthorized('Token invalido ou expirado'));
  }
}

module.exports = auth;
