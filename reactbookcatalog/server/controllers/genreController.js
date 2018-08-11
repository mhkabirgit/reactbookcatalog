
var async = require('async');

var genre_model = require('../models/genre');
var book_model = require('../models/book');
var genre_create = require('./genreCreate');
var genre_update = require('./genreUpdate');
var genre_delete = require('./genreDelete');

var Genre = genre_model.Genre;
var Book = book_model.Book;

module.exports.genre_list_get = function(req, res, next) {
  Genre.find({})
  .exec(function(err, genres){
    if(err) {
      return next(err);
    }
    else {
      res.json({statusCode: 200, message: 'Genres', genres: genres})
    }
  });
};

module.exports.genre_detail_get = function(req, res, next) {
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
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.json({statusCode: 200, message: 'Genre Detail', genre: results.genre, books: results.genre_books });
    });
};

module.exports.genre_create_get = genre_create.get_create_form;
module.exports.genre_create_post = genre_create.post_validated;

module.exports.genre_delete_post = genre_delete.delete_post;

module.exports.genre_update_post = genre_update.post_validated;
