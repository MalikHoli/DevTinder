const mongoose = require('mongoose');

//defining the user schema
const userSchema = mongoose.Schema(
    {
        firstName:{type:String},
        lastName:{type:String},
        email:{type:String},
        password:{type:String},
        age:{type:Number},
        gender:{type:String}
    }
);

//creating the user collection using the useschema definition
//this is model and its a instance of class 
//best practice is to user uppercase starting for the models
const User = mongoose.model('User',userSchema);

module.exports = {User}