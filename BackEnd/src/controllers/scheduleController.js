const scheduleModel = require('../models/scheduleModel');
const { notFound } = require('../utils/httpError');

async function listCronogramas(req, res, next) {
  try {
    res.json(await scheduleModel.listCronogramas(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function createCronograma(req, res, next) {
  try {
    const cronograma = await scheduleModel.createCronograma(req.user.id, req.validated.body);
    res.status(201).json(cronograma);
  } catch (error) {
    next(error);
  }
}

async function updateCronograma(req, res, next) {
  try {
    const cronograma = await scheduleModel.updateCronograma(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );
    if (!cronograma) throw notFound('Cronograma nao encontrado');
    res.json(cronograma);
  } catch (error) {
    next(error);
  }
}

async function removeCronograma(req, res, next) {
  try {
    const removed = await scheduleModel.removeCronograma(req.user.id, req.validated.params.id);
    if (!removed) throw notFound('Cronograma nao encontrado');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function listHorarios(req, res, next) {
  try {
    res.json(await scheduleModel.listHorarios(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function createHorario(req, res, next) {
  try {
    const horario = await scheduleModel.createHorario(req.user.id, req.validated.body);
    res.status(201).json(horario);
  } catch (error) {
    next(error);
  }
}

async function removeHorario(req, res, next) {
  try {
    const removed = await scheduleModel.removeHorario(req.user.id, req.validated.params.id);
    if (!removed) throw notFound('Horario nao encontrado');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCronogramas,
  createCronograma,
  updateCronograma,
  removeCronograma,
  listHorarios,
  createHorario,
  removeHorario,
};
