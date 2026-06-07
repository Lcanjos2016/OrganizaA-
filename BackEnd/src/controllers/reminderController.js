const reminderModel = require('../models/reminderModel');
const activityModel = require('../models/activityModel');
const { notFound, forbidden } = require('../utils/httpError');

async function validateActivity(userId, activityId) {
  if (!activityId) return;
  const activity = await activityModel.findById(userId, activityId);
  if (!activity) throw forbidden('A atividade informada nao pertence ao usuario');
}

async function list(req, res, next) {
  try {
    res.json(await reminderModel.list(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const reminder = await reminderModel.findById(req.user.id, req.validated.params.id);
    if (!reminder) throw notFound('Lembrete nao encontrado');
    res.json(reminder);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    await validateActivity(req.user.id, req.validated.body.idAtividade);
    const reminder = await reminderModel.create(req.user.id, req.validated.body);
    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await validateActivity(req.user.id, req.validated.body.idAtividade);
    const reminder = await reminderModel.update(req.user.id, req.validated.params.id, req.validated.body);
    if (!reminder) throw notFound('Lembrete nao encontrado');
    res.json(reminder);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const removed = await reminderModel.remove(req.user.id, req.validated.params.id);
    if (!removed) throw notFound('Lembrete nao encontrado');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
