const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userModel = require('../models/userModel');
const preferenceModel = require('../models/preferenceModel');
const { badRequest, unauthorized } = require('../utils/httpError');

function sign(user) {
  return jwt.sign({ sub: user.id_usuario }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

async function register(req, res, next) {
  try {
    const data = req.validated.body;
    const existing = await userModel.findByEmail(data.email);
    if (existing) throw badRequest('E-mail ja cadastrado');

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const user = await userModel.create({ ...data, senhaHash });
    await preferenceModel.upsert(user.id_usuario, {});

    res.status(201).json({ user, token: sign(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.validated.body;
    const user = await userModel.findByEmail(email);
    if (!user) throw unauthorized('E-mail ou senha invalidos');

    const valid = await bcrypt.compare(senha, user.senha_hash);
    if (!valid) throw unauthorized('E-mail ou senha invalidos');

    const { senha_hash: _, ...safeUser } = user;
    res.json({ user: safeUser, token: sign(user) });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
