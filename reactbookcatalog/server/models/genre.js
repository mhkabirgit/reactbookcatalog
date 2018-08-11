var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema (
  {
    name: {type: String, required: true, max: 100}
    }
);

GenreSchema
.virtual('url')
.get(function() {
  return '/catalog/genre/detail/' + this._id;
});

GenreSchema
.virtual('id')
.get( function() {
  return this._id;
});

module.exports.Genre = mongoose.model('Genre', GenreSchema);
