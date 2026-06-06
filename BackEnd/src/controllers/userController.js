const userModel = require('../models/userModel');
const preferenceModel = require('../models/preferenceModel');
const { notFound } = require('../utils/httpError');

async function me(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) throw notFound('Usuario nao encontrado');
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await userModel.update(req.user.id, req.validated.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function getPreferences(req, res, next) {
  try {
    const prefs = await preferenceModel.getByUser(req.user.id);
    res.json(prefs || {});
  } catch (error) {
    next(error);
  }
}

async function savePreferences(req, res, next) {
  try {
    const prefs = await preferenceModel.upsert(req.user.id, req.validated.body);
    res.json(prefs);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  me,
  updateMe,
  getPreferences,
  savePreferences,
};
