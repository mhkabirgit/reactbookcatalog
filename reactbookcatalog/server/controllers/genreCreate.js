const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var genre_model = require('../models/genre');
var Genre = genre_model.Genre;

module.exports.post_validated = [

  body('name', 'Genre name required').isLength({min:1}).trim(),

  sanitizeBody('name').trim().escape(),

  (req, res, next) => {
    var genre = new Genre({name: req.body.name});
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.json({statusCode:400, message: 'Bad Request'});
    }
    else {
      Genre.findOne({name: genre.name})
      .exec(function(err, found_genre){
          if(err) {
            return next(err);
          }
          if(found_genre) {
            res.json({statusCode:200, message: 'Genre Exists'});
          }
          else {
            genre.save(function(err) {
              if(err) {
                return next(err);
              }
              else{
                res.json({statusCode: 200, message: 'Genre Created'});
              }
            });
          }
      });
    }
  }
]
