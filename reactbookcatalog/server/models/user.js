var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema ( {
  email: {type:String, unique:true, required:true, trim:true},
  username: {type:String, unique:true, required:true, trim:true},
  password: {type:String, required:true},
  passwordcnf: {type:String, required:true}
});

UserSchema
.virtual('url')
.get(function() {
  return '/users/'+this._id;
});

//Tried to create user with UserSchema pre hook to hash password before saving, didn't work
//It is saving password into the database in plain text, which is unacceptable
// UserSchema
// .pre('save', function(next) {
//   bcrypt.hash(this.password, 10, function(err, hash) {
//     if(err) {
//       return next(err);
//     }
//     this.password = hash;
//     this.passwordcnf = hash;
//   });
//   next();
// });

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({email:email})
  .exec(function(err, user){
    if(err) {
      return callback(err,null);
    }
    else if(!user) {
      var err= new Error('Wrong email or password');
      err.status=401;
      return callback(err,null);
    }

    bcrypt.compare(password, user.password, function(err, result) {
        if(result===true) {
          return callback(null, user);
        }
        else {
          var err= new Error('Wrong email or password');
          return callback(err, null);
        }
    });
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
