
var async = require('async');

var genre_model = require('../models/genre');
var book_model = require('../models/book');

var Genre = genre_model.Genre;
var Book = book_model.Book;

module.exports.delete_post = function (req, res, next) {
  async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({ 'genre': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found to delete.');
            err.status = 404;
            return next(err);
        }
        if(results.genre_books.length>0){
          res.json({statusCode:400, message: 'This Genre has books, cannot be deleted'} );
        }
        else{
          Genre.findByIdAndRemove(results.genre.id)
          .exec(function(err){
            if(err) {
              return next(err);
            }
            else {
              res.json({statusCode: 200, message:'Deleted'});
            }
          });
        }
    });
};
