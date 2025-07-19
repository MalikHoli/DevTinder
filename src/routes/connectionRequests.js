const express = require("express");
const {userAuth} = require("../middleware/auth.js");
const {ConnectionRequests,User} = require("../model");

const router = express.Router()

router.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const fromUserId = req.user._id; //coming from the userAuth middleware

        const user = await User.findOne({_id:toUserId}); // checking if the toUserId is the valid userid from the existing dataset

        //*******************************************************************************
        //Adding this line of code after noticing that compound index created on from & to userId was not appearing on compass and 
        //as per gpt by default mongoose keep the autoindex false but not recommended in production (due to potential performance impact) - mongoose.connect(MONGO_URI, { autoIndex: false });
        //hence its recommended to do below
        await ConnectionRequests.syncIndexes(); //This forces Mongoose to compare indexes defined in the schema with what’s actually in MongoDB — and creates any missing ones.
        //*******************************************************************************
        const existingConnection = await ConnectionRequests
        .findOne({$or:[{fromUserId:toUserId,toUserId:fromUserId},{fromUserId:fromUserId,toUserId:toUserId}]})

        if(!user || existingConnection){
            throw new Error("invalid request");
        }

        const data = {toUserId,fromUserId,status};

        const connectionRequest = new ConnectionRequests(data);
        await connectionRequest.save() // Saving the data to the DB
        res.send("connection request sent successfully");

    }catch(err) {
        res.status(400).send("invalid request");
        console.log("This is the error message ",err.message);
    }
    
})

router.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try{
        const {status,requestId} = req.params;
        const loggedInUser = req.user._id

        validStatus = ["accepted","rejected"];
        IsvalidStatus = validStatus.includes(status);

        if(!IsvalidStatus){
            throw new Error("Invalid status!")
        }

        const existingConnection = await ConnectionRequests.findOne({
            _id:requestId, //checking if the request id passed by APT is exist inside the DB AND
            toUserId:loggedInUser,//checking if the toUserId of the connection requst is the loggedin in user AND
            status:"interested"// finally checking if the status of that document is interested 
        }) //this will return us a document that is valid to either accept/reject based on users wish

        if(!existingConnection){
            throw new Error("invalid request");
        }else{
            existingConnection.status = status //changing the interested status to either accepted/rejected
            await existingConnection.save(); //saving the changes to db
            res.send(`request has been ${status}`);
        }

    }catch(err) {
        res.status(400).send("invalid request");
        console.log("This is the error message ",err.message);
    }
    
})

module.exports = router