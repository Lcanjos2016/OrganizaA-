class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function badRequest(message) {
  return new HttpError(400, message);
}

function unauthorized(message = 'Nao autorizado') {
  return new HttpError(401, message);
}

function forbidden(message = 'Acesso negado') {
  return new HttpError(403, message);
}

function notFound(message = 'Recurso nao encontrado') {
  return new HttpError(404, message);
}

module.exports = {
  HttpError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
};
