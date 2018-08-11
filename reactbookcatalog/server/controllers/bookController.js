const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

var book_model = require('../models/book');
var author_model = require('../models/author');
var genre_model = require('../models/genre');
var Book = book_model.Book;
var Author = author_model.Author;
var Genre = genre_model.Genre;

var book_create = require('./bookCreate');
var book_update = require('./bookUpdate');
var book_delete = require('./bookDelete');


module.exports.book_list_home = function(req, res, next) {
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, books) {
      if (err) { return next(err); }
      //Successful, so send the response
      res.json({statusCode: 200, message:'Books', books: books});
    });
};


module.exports.book_list_get = function(req, res, next) {
  Book.find({}, 'isbn title author genre synopsis')
    .populate('author')
    .populate('genre')
    .exec(function (err, books) {
      if (err) { return next(err); }
      //Successful, so send the response
      res.json({statusCode: 200, message:'Books', books: books});
    });
};

module.exports.book_detail_get = function(req, res,next) {
  Book.findById(req.params.id)
               .populate('author')
               .populate('genre')
               .exec(function(err, book){
                 if(err) {
                   return next(err);
                 }
                 if(book==null) {
                   var err = new Error('Book not found');
                   err.status = 404;
                   return next(err);
                 }
                 else {
                   res.json({statusCode: 200, message:'Title', book:book});
                 }
        });
  };

  module.exports.get_all_authors_and_genres = function (req, res, next){
    async.parallel({
      authors: function(callback){
        Author.find(callback);
      },
      genres: function(callback){
        Genre.find(callback);
      },
    },
    function (err, results) {
        if(err) {return next(err);}
        res.json({statusCode: 200, authors:results.authors, genres:results.genres});
      });
  };

module.exports.book_create_post = book_create.post_validated;
module.exports.book_delete_post = book_delete.delete_post;
module.exports.book_update_post = book_update.post_validated;
