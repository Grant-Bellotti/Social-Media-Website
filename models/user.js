var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  valueJY: { type: Number }
});


var noop = function() {};

userSchema.pre("save", function(done) {
  var user = this;

console.log("userSchema.pre(sav...")

  if (!user.isModified("password")) {
    console.log("!user.isModified")
    return done();
  }
console.log("bcrypt.genSalt")
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
console.log("bcrypt.genSalt function callback")
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
console.log("bcrypt.hash function callback  " + hashedPassword)
      if (err) { return done(err); }
      user.password = hashedPassword;
      user.valueJY = Math.floor(Math.random()*1000);
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  console.log("userSchema.methods.checkPassword")
  bcrypt.compare(guess, this.password, function(err, isMatch) {
  console.log("bcrypt.compare function callback isMatch = " + isMatch)
    done(err, isMatch);
  });
};

userSchema.methods.name = function() {
  return this.displayName || this.username;
};

var User = mongoose.model("User", userSchema);

module.exports = User;
