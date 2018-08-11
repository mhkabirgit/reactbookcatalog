var async = require('async');

var book_model = require('../models/book');
var Book = book_model.Book;

module.exports.delete_post = function (req, res, next) {
  Book.findByIdAndRemove(req.params.id)
  .exec(function(err, book) {
    if(err) {
      return next(err);
    }
    res.json({statusCode: 200, message:'Book Deleted'});

  });
};
