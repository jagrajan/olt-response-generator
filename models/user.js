var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
require('mongoose-type-email');

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
    name: String,
    role: {type: String, enum: ['subhuman', 'regular', 'admin'], default: 'subhuman'}
});

var noop = function() {};

//Before saving new user information to the database
userSchema.pre('save', function(done) {
    var user = this;

    //If password is not modified, save as-is
    if (!user.isModified('password')) {
        return done();
    }

    //Generate the salt
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return done(err);
        }
        //Generate the hashed password
        bcrypt.hash(user.password, salt, noop, function(err, hashedPassword){
            if (err) {
                return done(err);
            }
            //Save the new hashed password into the database
            user.password = hashedPassword;
            done();
        });
    });
});

//Compare password hashes
userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

//If name is set, return name, otherwise take email username
userSchema.methods.displayName = function() {
    return this.name || this.email.substring(0, this.email.indexOf('@'));
};

var User = mongoose.model('User', userSchema);

module.exports = User;