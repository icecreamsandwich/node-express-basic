var mongoose = require("mongoose")
var personSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    age: Number,
    nationality: String
 });
 var User = mongoose.model("Person", personSchema);