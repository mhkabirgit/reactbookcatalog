const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var bcrypt = require('bcrypt');
var session = require('express-session');

var User = require('../models/user');

module.exports.create_user_post = [

  body('email', 'Email must not be empty').isLength({min:1}).trim(),
  body('username', 'Username must not be empty').isLength({min:1}).trim(),
  body('password', 'Password must not be empty').isLength({min:1}).trim(),
  body('passwordcnf', 'Password confirmation must not be empty').isLength({min:1}).trim(),

  sanitizeBody('username').trim().escape(),

  (req, res, next) => {
    var user = new User ({
      email: req.body.email,
      username:req.body.username,
      password: req.body.password,
      passwordcnf: req.body.passwordcnf
    });
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.json({statusCode:400, message:'Bad Request'});
    }
    User.findOne({email:req.body.email})
    .exec(function(err, found_user) {
      if(err) {
        return next(err);
      }
      if(found_user) {
        res.json({statusCode:400, message:'User exists with the same email'});
      }
    });

    User.findOne({username:req.body.username})
    .exec(function(err, found_user) {
      if(err) {
        return next(err);
      }
      if(found_user) {
        var error = new Error();
        res.json({statusCode:400, message:'User exists with the same username'});
      }
    });

    if(req.body.password !== req.body.passwordcnf) {
      res.json({statusCode: 400, message:'Password and Password Confirmation did not match.' });
    }


    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if(err) {
        return next(err);
      }
      User.create({email:req.body.email, username: req.body.username, password: hash, passwordcnf: hash}, function (err) {
        if(err) {
          return next(err);
        }
        res.json({statusCode:200, message:'Signed Up Successful'});
      });
    });
  }

];


module.exports.signin_post = function(req, res, next) {

  if(req.body.email && req.body.password) {
    sanitizeBody('email').trim();
    sanitizeBody('password').trim();
    User.authenticate(req.body.email, req.body.password, function(err, user) {
      if(err){
        return next(err);
      }
      if(!user) {
        res.json({statusCode:401, email: req.body.email, error: 'User does not exists'});
      }
      else {
        req.session.user=user;
        const isAdmin = user.username === 'admin' ? true : false;
        res.json({statusCode:200, isAdmin: isAdmin});
      }
    });
  }
  else {
    res.json({statusCode:401, email: req.body.email, error: 'Email and password are required.'});
  }
};


module.exports.signout_post = function (req, res, next) {
  if(req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.json({statusCode:200});
  }
  else {
    res.json({statusCode:200});
  }
};
