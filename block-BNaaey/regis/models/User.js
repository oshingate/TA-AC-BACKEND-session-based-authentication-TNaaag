let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  age: Number,
  phone: Number,
});

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashedPass) => {
      if (err) return next(err);

      this.password = hashedPass;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.checkPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

let User = mongoose.model('User', userSchema);

module.exports = User;
