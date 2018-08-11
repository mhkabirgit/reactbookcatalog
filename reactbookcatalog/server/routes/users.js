var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

router.post('/signout', user_controller.signout_post);

router.post('/signup', user_controller.create_user_post);

router.post('/signin', user_controller.signin_post);

module.exports = router;
