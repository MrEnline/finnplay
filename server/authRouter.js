const Router = require('express');
const Controller = require('./Controller');
const router = Router();

router.post('/login', Controller.login);
router.post('/logout', Controller.logout);
router.get('/checkAuth', Controller.checkAuth);

module.exports = router;
