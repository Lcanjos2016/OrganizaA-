const disciplineModel = require('../models/disciplineModel');
const aiLogModel = require('../models/aiLogModel');
const { buildProgressSummary } = require('../services/academicRules');
const { badRequest } = require('../utils/httpError');

function buildAdvice(rows, summary) {
  const risks = rows.filter((row) => row.situacao && row.situacao !== 'Aprovado');
  const tips = [];

  if (rows.length === 0) {
    tips.push('Cadastre disciplinas, notas e faltas para receber uma analise academica.');
  }

  risks.forEach((row) => {
    if (row.situacao === 'Prova Final') {
      tips.push(
        `Revise ${row.nome_disciplina}: faltam aproximadamente ${row.nota_necessaria_pf || 0} pontos na PF.`
      );
    }
    if (row.situacao === 'Reprovado por Falta') {
      tips.push(`Verifique a frequencia de ${row.nome_disciplina}: o limite de faltas foi ultrapassado.`);
    }
    if (row.situacao === 'Reprovado por Nota') {
      tips.push(`Priorize ${row.nome_disciplina}: a media atual esta abaixo do intervalo de PF.`);
    }
  });

  if (summary.percentualConclusao >= 70) {
    tips.push('Seu progresso esta bom. Mantenha revisoes curtas antes das proximas avaliacoes.');
  }

  return tips;
}

async function analyzeProgress(req, res, next) {
  try {
    const rows = await disciplineModel.list(req.user.id);
    if (rows.length === 0) throw badRequest('Cadastre notas e faltas antes de solicitar a analise da IA');

    const summary = buildProgressSummary(rows);
    const response = {
      summary,
      dicas: buildAdvice(rows, summary),
      disciplinas: rows.map((row) => ({
        idDisciplina: row.id_disciplina,
        nome: row.nome_disciplina,
        media: Number(row.nota_final || 0),
        faltas: Number(row.numero_faltas || 0),
        situacao: row.situacao,
      })),
    };

    await aiLogModel.create(req.user.id, { source: 'progress-analysis' }, response);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function listLogs(req, res, next) {
  try {
    res.json(await aiLogModel.list(req.user.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzeProgress,
  listLogs,
};
