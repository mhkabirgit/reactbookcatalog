const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

var book_model = require('../models/book');
var Book = book_model.Book;

// Handle book create on POST.
module.exports.post_validated = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
                req.body.genre=[];
            else
              req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('synopsis', 'Synopsis must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.json({statusCode:400, message:'Bad Request', errors: errors.array() });
        }
        else {
            // Data is valid. Save data.
            // Create a Book object with escaped and trimmed data.
            var book = new Book(
              { title: req.body.title,
                author: req.body.author,
                synopsis: req.body.synopsis,
                isbn: req.body.isbn,
                genre: req.body.genre,
               });
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.json({statusCode: 200, message:'Book Added'});
                });
        }
    }
];
