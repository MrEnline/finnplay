const Router = require('express');
const authController = require('./authController');
const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/checkAuth', authController.checkAuth);
router.get('/getData', authController.getData);
router.delete('/deleteGroup', authController.deleteGroup);
router.post('/editGroup', authController.editGroup);
router.post('/addGroup', authController.addGroup);

module.exports = router;
