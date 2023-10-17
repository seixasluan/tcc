const router = require('express').Router();

const UserController = require('../app/controllers/UserController');

// middlewares
const verifyToken = require('../app/helpers/verify-token');

// gets
router.get('/checkuser', UserController.checkUser);
router.get('/:id', UserController.getUserById);

// posts
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// patches
router.patch('/edituser/:id', verifyToken, UserController.editUser);

// deletes

module.exports = router;