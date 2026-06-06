const RULES = {
  UFAM: { mediaAprovacao: 8.0, mediaMinimaPf: 7.5, limiteFaltas: 15 },
  UEA: { mediaAprovacao: 7.0, mediaMinimaPf: 5.0, limiteFaltas: 15 },
  IFAM: { mediaAprovacao: 6.0, mediaMinimaPf: 4.0, limiteFaltas: 15 },
  DEFAULT: { mediaAprovacao: 8.0, mediaMinimaPf: 7.5, limiteFaltas: 15 },
};

function getRules(instituicao) {
  return RULES[String(instituicao || '').toUpperCase()] || RULES.DEFAULT;
}

function average(values) {
  const valid = values.map(Number).filter((value) => Number.isFinite(value));
  if (valid.length === 0) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function calculateAcademicStatus({ instituicao, notas = [], faltas = 0, limiteFaltas, notaPf }) {
  const rules = getRules(instituicao);
  const effectiveLimit = Number.isFinite(Number(limiteFaltas))
    ? Number(limiteFaltas)
    : rules.limiteFaltas;
  const media = Number(average(notas).toFixed(2));
  const totalFaltas = Number(faltas) || 0;

  if (totalFaltas > effectiveLimit) {
    return {
      media,
      situacao: 'Reprovado por Falta',
      notaNecessariaPf: null,
      alertaFaltas: true,
    };
  }

  if (media >= rules.mediaAprovacao) {
    return {
      media,
      situacao: 'Aprovado',
      notaNecessariaPf: null,
      alertaFaltas: totalFaltas >= Math.ceil(effectiveLimit * 0.8),
    };
  }

  if (media >= rules.mediaMinimaPf) {
    const needed = Math.max(0, rules.mediaAprovacao * 2 - media);
    const finalAverage =
      Number.isFinite(Number(notaPf)) && Number(notaPf) > 0
        ? Number(((media + Number(notaPf)) / 2).toFixed(2))
        : null;

    return {
      media: finalAverage || media,
      situacao: finalAverage && finalAverage >= rules.mediaAprovacao ? 'Aprovado' : 'Prova Final',
      notaNecessariaPf: Number(needed.toFixed(2)),
      alertaFaltas: totalFaltas >= Math.ceil(effectiveLimit * 0.8),
    };
  }

  return {
    media,
    situacao: 'Reprovado por Nota',
    notaNecessariaPf: null,
    alertaFaltas: totalFaltas >= Math.ceil(effectiveLimit * 0.8),
  };
}

function buildProgressSummary(rows) {
  const total = rows.length;
  const aprovadas = rows.filter((row) => row.situacao === 'Aprovado').length;
  const emRisco = rows.filter((row) =>
    ['Prova Final', 'Reprovado por Falta', 'Reprovado por Nota'].includes(row.situacao)
  ).length;

  return {
    totalDisciplinas: total,
    aprovadas,
    emRisco,
    percentualConclusao: total ? Number(((aprovadas / total) * 100).toFixed(2)) : 0,
  };
}

module.exports = {
  calculateAcademicStatus,
  buildProgressSummary,
  getRules,
};
