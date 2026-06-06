const disciplineModel = require('../models/disciplineModel');
const userModel = require('../models/userModel');
const { calculateAcademicStatus } = require('../services/academicRules');
const { notFound, badRequest } = require('../utils/httpError');

async function list(req, res, next) {
  try {
    res.json(await disciplineModel.list(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user.instituicao) throw badRequest('Selecione uma instituicao antes de cadastrar disciplinas');
    const discipline = await disciplineModel.create(req.user.id, req.validated.body);
    res.status(201).json(discipline);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const discipline = await disciplineModel.update(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );
    if (!discipline) throw notFound('Disciplina nao encontrada');
    res.json(discipline);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const removed = await disciplineModel.remove(req.user.id, req.validated.params.id);
    if (!removed) throw notFound('Disciplina nao encontrada');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function saveGrades(req, res, next) {
  try {
    const discipline = await disciplineModel.findById(req.user.id, req.validated.params.id);
    if (!discipline) throw notFound('Disciplina nao encontrada');

    const user = await userModel.findById(req.user.id);
    const nextData = {
      nota1: req.validated.body.nota1 ?? Number(discipline.nota1 || 0),
      nota2: req.validated.body.nota2 ?? Number(discipline.nota2 || 0),
      nota3: req.validated.body.nota3 ?? Number(discipline.nota3 || 0),
      notaPf: req.validated.body.notaPf ?? discipline.nota_pf,
      numeroFaltas: Number(discipline.numero_faltas || 0),
      limiteFaltas: req.validated.body.limiteFaltas ?? Number(discipline.limite_faltas || 15),
    };
    const status = calculateAcademicStatus({
      instituicao: user.instituicao,
      notas: [nextData.nota1, nextData.nota2, nextData.nota3],
      faltas: nextData.numeroFaltas,
      limiteFaltas: nextData.limiteFaltas,
      notaPf: nextData.notaPf,
    });

    const enrollment = await disciplineModel.updateEnrollment(req.user.id, req.validated.params.id, {
      ...nextData,
      notaFinal: status.media,
      notaNecessariaPf: status.notaNecessariaPf,
      situacao: status.situacao,
    });

    res.json({ ...enrollment, alertaFaltas: status.alertaFaltas });
  } catch (error) {
    next(error);
  }
}

async function saveAbsences(req, res, next) {
  try {
    const discipline = await disciplineModel.findById(req.user.id, req.validated.params.id);
    if (!discipline) throw notFound('Disciplina nao encontrada');

    const user = await userModel.findById(req.user.id);
    const status = calculateAcademicStatus({
      instituicao: user.instituicao,
      notas: [discipline.nota1, discipline.nota2, discipline.nota3],
      faltas: req.validated.body.numeroFaltas,
      limiteFaltas: req.validated.body.limiteFaltas ?? Number(discipline.limite_faltas || 15),
      notaPf: discipline.nota_pf,
    });

    const enrollment = await disciplineModel.updateEnrollment(req.user.id, req.validated.params.id, {
      numeroFaltas: req.validated.body.numeroFaltas,
      limiteFaltas: req.validated.body.limiteFaltas,
      notaFinal: status.media,
      notaNecessariaPf: status.notaNecessariaPf,
      situacao: status.situacao,
    });

    res.json({ ...enrollment, alertaFaltas: status.alertaFaltas });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  update,
  remove,
  saveGrades,
  saveAbsences,
};
