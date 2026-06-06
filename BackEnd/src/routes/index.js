const { Router } = require('express');
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const schemas = require('../validators/schemas');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const disciplineController = require('../controllers/disciplineController');
const activityController = require('../controllers/activityController');
const scheduleController = require('../controllers/scheduleController');
const reminderController = require('../controllers/reminderController');
const aiController = require('../controllers/aiController');

const router = Router();

router.post('/auth/register', validate(schemas.register), authController.register);
router.post('/auth/login', validate(schemas.login), authController.login);

router.use(auth);

router.get('/users/me', userController.me);
router.patch('/users/me', validate(schemas.profile), userController.updateMe);
router.get('/users/me/preferences', userController.getPreferences);
router.put('/users/me/preferences', validate(schemas.preferences), userController.savePreferences);

router.get('/disciplines', disciplineController.list);
router.post('/disciplines', validate(schemas.disciplineCreate), disciplineController.create);
router.patch('/disciplines/:id', validate(schemas.discipline), disciplineController.update);
router.delete('/disciplines/:id', validate(schemas.idParam), disciplineController.remove);
router.put('/disciplines/:id/grades', validate(schemas.grades), disciplineController.saveGrades);
router.put('/disciplines/:id/absences', validate(schemas.absences), disciplineController.saveAbsences);

router.get('/activities', activityController.list);
router.post('/activities', validate(schemas.activityCreate), activityController.create);
router.patch('/activities/:id', validate(schemas.activity), activityController.update);
router.delete('/activities/:id', validate(schemas.idParam), activityController.remove);

router.get('/schedules', scheduleController.listCronogramas);
router.post('/schedules', validate(schemas.cronogramaCreate), scheduleController.createCronograma);
router.patch('/schedules/:id', validate(schemas.cronograma), scheduleController.updateCronograma);
router.delete('/schedules/:id', validate(schemas.idParam), scheduleController.removeCronograma);

router.get('/class-times', scheduleController.listHorarios);
router.post('/class-times', validate(schemas.horario), scheduleController.createHorario);
router.delete('/class-times/:id', validate(schemas.idParam), scheduleController.removeHorario);

router.get('/reminders', reminderController.list);
router.post('/reminders', validate(schemas.reminderCreate), reminderController.create);
router.patch('/reminders/:id', validate(schemas.reminder), reminderController.update);
router.delete('/reminders/:id', validate(schemas.idParam), reminderController.remove);

router.post('/ai/progress', aiController.analyzeProgress);
router.get('/ai/logs', aiController.listLogs);

module.exports = router;
