const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

var book_model = require('../models/book');
var Book = book_model.Book;

module.exports.post_validated = [

    // Convert the genre to an array
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

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('author').trim().escape(),
    sanitizeBody('synopsis').trim().escape(),
    sanitizeBody('isbn').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.json({statusCode: 400, message: 'Bad Request',errors: errors.array() });
        }
        else {

          // Create a Book object with escaped/trimmed data and old id.
          var book = new Book(
            { title: req.body.title,
              author: req.body.author,
              synopsis: req.body.synopsis,
              isbn: req.body.isbn,
              genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.json({statusCode: 200, meassge:'Book Updated'});
                });
        }
    }
];
