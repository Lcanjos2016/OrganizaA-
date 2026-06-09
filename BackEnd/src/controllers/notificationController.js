const notificationModel = require('../models/notificationModel');

async function listDismissed(req, res, next) {
  try {
    const keys = await notificationModel.listDismissed(req.user.id);
    res.json(keys);
  } catch (error) {
    next(error);
  }
}

async function dismiss(req, res, next) {
  try {
    await notificationModel.dismiss(req.user.id, req.validated.body.chave);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function restore(req, res, next) {
  try {
    await notificationModel.restore(req.user.id, req.validated.body.chave);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listDismissed,
  dismiss,
  restore,
};
