const scheduleModel = require('../models/scheduleModel');
const disciplineModel = require('../models/disciplineModel');
const { notFound, badRequest } = require('../utils/httpError');

async function validateDiscipline(userId, disciplineId) {
  if (!disciplineId) return;
  const discipline = await disciplineModel.findById(userId, disciplineId);
  if (!discipline) throw badRequest('A disciplina informada nao pertence ao usuario');
}

function validateTimeRange(start, end) {
  if (start && end && start >= end) {
    throw badRequest('A hora final deve ser posterior a hora inicial');
  }
}

async function listCronogramas(req, res, next) {
  try {
    res.json(await scheduleModel.listCronogramas(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function getCronogramaById(req, res, next) {
  try {
    const cronograma = await scheduleModel.findCronogramaById(
      req.user.id,
      req.validated.params.id
    );
    if (!cronograma) throw notFound('Cronograma nao encontrado');
    res.json(cronograma);
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

async function getHorarioById(req, res, next) {
  try {
    const horario = await scheduleModel.findHorarioById(req.user.id, req.validated.params.id);
    if (!horario) throw notFound('Horario nao encontrado');
    res.json(horario);
  } catch (error) {
    next(error);
  }
}

async function createHorario(req, res, next) {
  try {
    await validateDiscipline(req.user.id, req.validated.body.idDisciplina);
    validateTimeRange(req.validated.body.horaInicio, req.validated.body.horaFim);
    const horario = await scheduleModel.createHorario(req.user.id, req.validated.body);
    if (!horario) throw badRequest('O horario informado conflita com outro horario cadastrado');
    res.status(201).json(horario);
  } catch (error) {
    next(error);
  }
}

async function updateHorario(req, res, next) {
  try {
    const existing = await scheduleModel.findHorarioById(req.user.id, req.validated.params.id);
    if (!existing) throw notFound('Horario nao encontrado');

    await validateDiscipline(req.user.id, req.validated.body.idDisciplina);
    validateTimeRange(
      req.validated.body.horaInicio || existing.hora_inicio,
      req.validated.body.horaFim || existing.hora_fim
    );

    const horario = await scheduleModel.updateHorario(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );
    if (!horario) throw badRequest('O horario informado conflita com outro horario cadastrado');
    res.json(horario);
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
  getCronogramaById,
  createCronograma,
  updateCronograma,
  removeCronograma,
  listHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  removeHorario,
};
