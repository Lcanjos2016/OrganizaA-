const activityModel = require('../models/activityModel');
const { notFound } = require('../utils/httpError');

async function list(req, res, next) {
  try {
    res.json(await activityModel.list(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const activity = await activityModel.create(req.user.id, req.validated.body);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const activity = await activityModel.update(req.user.id, req.validated.params.id, req.validated.body);
    if (!activity) throw notFound('Atividade nao encontrada');
    res.json(activity);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const removed = await activityModel.remove(req.user.id, req.validated.params.id);
    if (!removed) throw notFound('Atividade nao encontrada');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  update,
  remove,
};
