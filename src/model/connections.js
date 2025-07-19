const mongoose = require('mongoose');

//defining the connection requests schema
const connectionRequestsSchema = mongoose.Schema(
    {
        fromUserId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            //this will created reference 
            //i.e. association with user collection and based on content of this field mongodb identify the associated field in user collection  
            ref:"User" 
        },
        toUserId:{type: mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
        status:{
            type:String,
            required:true,
            enum: {
                values: ["ignore","interested","accepted","rejected"],
                message: "{VALUE} is not supported"
            }
        }
    },
    {
        timestamps:true
    }
);

connectionRequestsSchema.index({fromUserId:1,toUserId:1}); //creating compound index on the from & to userid combination

connectionRequestsSchema.pre('save',function(next){
    const connectionRequest = this; //assigning a instance of this class (document)
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cant send connection request to yourself");
        }
    next();
})

//creating the user collection using the useschema definition
//this is model and its a instance of class 
//best practice is to user uppercase starting for the models
const ConnectionRequests = mongoose.model('ConnectionRequests',connectionRequestsSchema);

module.exports = {ConnectionRequests}