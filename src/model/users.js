const mongoose = require('mongoose');
const validator = require('validator');

//defining the user schema
const userSchema = mongoose.Schema(
    {
        firstName:{type:String,maxlength:50,minlength:4},
        lastName:{type:String,maxlength:50,minlength:4},
        email:{type:String,required:true,unique:true,lowercase:true,trim:true,maxlength:254,minlength:12,
            validate: {
                        validator: function (value){return validator.isEmail(value)},
                        message: 'Please enter a valid mail id'
                    }
        },
        password:{type:String,maxlength:50,minlength:10,
            validate: {
                        validator: function (value){return validator.isStrongPassword(value)},
                        message: 'Please ensures that the password has at least 8 characters, one lowercase letter, one uppercase letter, one number, and one special character'
                    }
        },
        age:{type:Number,min:18},
        gender:{type:String,enum: { values: ['Male', 'Female'], message: '{VALUE} is not supported' }},
        about:{type:String,default:"Please add information about yourself"},
        skills:{type:[String],
            validate: {
                        validator: function (value){return value.length <= 10},
                        message: 'Please enter at most 10 skills.'
                    }
        },
        photoUrl:{type:String,default:"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
            validate: {
                        validator: function (value){return validator.isURL(value)},
                        message: 'Please enter a valid photo url'
                    }
        }
    },
    {
        timestamps:true
    }
);

//creating the user collection using the useschema definition
//this is model and its a instance of class 
//best practice is to user uppercase starting for the models
const User = mongoose.model('User',userSchema);

module.exports = {User}