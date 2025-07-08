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

module.exports = router