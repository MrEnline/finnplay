const Router = require('express');
const authController = require('./authController');
const router = Router();
//const { check } = require('express-validator');
const authMiddleware = require('./middlewaree/authMiddleware.js');
const roleMiddleware = require('./middlewaree/roleMiddleware.js');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/checkAuth', authController.checkAuth);

//router.get("/users", authMiddleware, authController.getUsers);
//router.get("/users", roleMiddleware(["ADMIN"]), authController.getUsers);

module.exports = router;
