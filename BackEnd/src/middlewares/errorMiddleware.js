function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Rota nao encontrada: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  const status = error.status || res.statusCode || 500;

  res.status(status).json({
    error: {
      message: error.message || 'Erro interno do servidor',
      status,
    },
  });
}

module.exports = {
  notFound,
  errorHandler,
};
