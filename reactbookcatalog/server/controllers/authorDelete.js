const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

var author_model = require('../models/author');
var book_model = require('../models/book');
var Author = author_model.Author;
var Book = book_model.Book;

module.exports.delete_post = function(req, res, next) {

    async.parallel({
        author: function(callback) {
          Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.json({ statusCode: 400, message: 'Bad Request'} );
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.json({statusCode: 200, message: 'Author Deleted'});
            })
        }
    });
};
