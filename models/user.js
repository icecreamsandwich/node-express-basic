var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var personSchema = mongoose.Schema({
    username: { 
        type: String, 
        unique: true
     },
    password: String,
    name: String,
    age: Number,
    nationality: String
 });

 personSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", personSchema);