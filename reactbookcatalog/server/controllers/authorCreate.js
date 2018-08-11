const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var author_model = require('../models/author');

var Author = author_model.Author;

module.exports.post_validated = [

    body('first_name').isLength({min:1}).trim().withMessage('First name must be specified')
      .isAlphanumeric().withMessage('First name cannot contain non-alphanumeric charaster'),
    body('middle_name').trim()
        .isAlphanumeric().withMessage('Middle name cannot contain non-alphanumeric charaster'),
    body('last_name').isLength({min:1}).trim().withMessage('Last name must be specified')
        .isAlphanumeric().withMessage('Last name cannot contain non-alphanumeric charaster'),

    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('middle_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.json({statusCode: 400 , message: 'Bad Request'});
      }
      else {
        var author = new Author({
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name
        });
        author.save(function(err){
          if(err){
            return next(err);
          }
          else{
            res.json({statusCode: 200, message: 'Author Added'});
          }
        });
      }
    }
];
