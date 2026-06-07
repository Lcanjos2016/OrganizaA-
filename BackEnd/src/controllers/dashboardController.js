const dashboardModel = require('../models/dashboardModel');

async function summary(req, res, next) {
  try {
    const [metrics, upcomingActivities] = await Promise.all([
      dashboardModel.getSummary(req.user.id),
      dashboardModel.getUpcomingActivities(req.user.id),
    ]);

    res.json({
      metrics: {
        totalDisciplinas: metrics.total_disciplinas,
        totalAtividades: metrics.total_atividades,
        atividadesConcluidas: metrics.atividades_concluidas,
        atividadesPendentes: metrics.atividades_pendentes,
        totalFaltas: metrics.total_faltas,
        mediaGeral: Number(metrics.media_geral),
        disciplinasAprovadas: metrics.disciplinas_aprovadas,
      },
      proximasAtividades: upcomingActivities,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  summary,
};
