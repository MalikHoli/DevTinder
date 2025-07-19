const express = require("express");
const {userAuth} = require("../middleware/auth.js");
const {ConnectionRequests,User} = require("../model");

const router = express.Router()

router.get("/feed", async(req,res)=>{
    try{
        res.send(await User.find({}));
    } catch(err){
        res.status(400).send("Error getting the feed data")
        console.log("This is the error message ",err)
    }
})

// router.get("/user/connections",userAuth, async(req,res)=>{
//     try{
//         const loggedInUser = req.user._id;
//         const status = "interested";
//         //*******************************************************************************************************************        
//         //Finding connections that fullfill the criteria to fetch all the connections to which logged in user sent request

//         const connectionRrequestSent = await ConnectionRequests.find({fromUserId:loggedInUser,status:status})
//         //*******************************************************************************************************************
//         if(!connectionRrequestSent){
//             throw new Error ("No connection requests found")
//         }

//         let requestSentId = [];
//         //**********************************************************************************************************************
//         //looping through all the connectionRequest documents and getting the toUserIds so that we can fetch their prodile info

//         for (let index = 0; index < connectionRrequestSent.length; index++) {
//             const element = connectionRrequestSent[index].toUserId;
//             requestSentId[index] = element;
//         }
//         //***********************************************************************************************************************

//         const user = await User.find({_id: {$in: requestSentId}}).lean();

//         let userProfile = [];
//         //**********************************************************************************************************************
//         //looping through all the user documents and showing only the relevent profile information to the client

//         for (let index = 0; index < user.length; index++) {
//             const element = viewProfile(user[index]);
//             userProfile[index]=element;
//         }
//         //***********************************************************************************************************************
//         res.send(userProfile);

//     } catch(err){
//         res.status(400).send("No connection requests found")
//         console.log("This is the error message ",err)
//     }
// })

router.get("/user/requests/received",userAuth, async(req,res)=>{ //To get all the connection requests received and pending to respond
    try{
        const loggedInUser = req.user._id;
        const status = "interested";
        //*******************************************************************************************************************        
        //Finding connections that fullfill the criteria to fetch all the connections to which logged in user sent request
        const connectionRrequestReceived = await ConnectionRequests.find({toUserId:loggedInUser,status:status})
        .populate("fromUserId","firstName lastName age gender about skills photoUrl")

        res.send(connectionRrequestReceived);

    } catch(err){
        res.status(400).send("No connection requests found")
        console.log("This is the error message ",err)
    }
})

router.get("/user/requests/match",userAuth, async(req,res)=>{ //To get matched connections (kind of like FB friends)
    try{
        const loggedInUser = req.user._id;
        const status = "accepted";
        //*******************************************************************************************************************        
        //connection request can be accepeted either by current user or the one to whom request is sent
        const connectionRrequestReceived = await ConnectionRequests.find({$or:[{toUserId:loggedInUser},{fromUserId:loggedInUser}],status:status})
        .populate("fromUserId","firstName lastName age gender about skills photoUrl")
        .populate("toUserId","firstName lastName age gender about skills photoUrl") //We can chain the populate like this

        const match = connectionRrequestReceived.map((ele)=>{if(ele.fromUserId.equals(loggedInUser)){
            return ele.toUserId
        }else{
            return ele.fromUserId
        }})

        res.json({message:"These are your matches", Data:match})

    } catch(err){
        res.status(400).send("No connection requests found")
        console.log("This is the error message ",err)
    }
})

module.exports = router