const Router = require('express');
const Controller = require('./Controller');
const router = Router();

router.post('/login', Controller.login);
router.post('/logout', Controller.logout);
router.get('/checkAuth', Controller.checkAuth);
router.get('/getData', Controller.getData);
router.delete('/deleteGroup', Controller.deleteGroup);
router.post('/editGroup', Controller.editGroup);
router.post('/addGroup', Controller.addGroup);

module.exports = router;
