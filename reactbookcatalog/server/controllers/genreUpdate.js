const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var genre_model = require('../models/genre');
var Genre = genre_model.Genre;

module.exports.post_validated = [

  body('name', 'Genre name required').isLength({min:1}).trim(),

  sanitizeBody('name').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.json({statusCode:400, message: 'Bad Request', genre: {}})
    }
    else {
      Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {}, function(err, genre){
        if(err){
          return next(err);
        }
        res.json({statusCode: 200, message: 'Genre Updated', genre: genre});
      });
      }
    }
]
