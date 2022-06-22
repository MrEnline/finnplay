const Router = require('express');
const authController = require('./authController');
const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/checkAuth', authController.checkAuth);

module.exports = router;
