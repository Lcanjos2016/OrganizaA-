const activityModel = require('../models/activityModel');
const disciplineModel = require('../models/disciplineModel');
const scheduleModel = require('../models/scheduleModel');
const { notFound, forbidden } = require('../utils/httpError');

async function validateReferences(userId, data) {
  if (data.idDisciplina) {
    const discipline = await disciplineModel.findById(userId, data.idDisciplina);
    if (!discipline) throw forbidden('A disciplina informada nao pertence ao usuario');
  }

  if (data.idCronograma) {
    const schedule = await scheduleModel.findCronogramaById(userId, data.idCronograma);
    if (!schedule) throw forbidden('O cronograma informado nao pertence ao usuario');
  }
}

async function list(req, res, next) {
  try {
    res.json(await activityModel.list(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const activity = await activityModel.findById(req.user.id, req.validated.params.id);
    if (!activity) throw notFound('Atividade nao encontrada');
    res.json(activity);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    await validateReferences(req.user.id, req.validated.body);
    const activity = await activityModel.create(req.user.id, req.validated.body);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await validateReferences(req.user.id, req.validated.body);
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
  getById,
  create,
  update,
  remove,
};
