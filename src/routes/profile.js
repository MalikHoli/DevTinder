const express = require("express");
const {User} = require("../model");
const bcrypt = require('bcrypt');
const {userAuth} = require("../middleware/auth.js");
const {viewProfile} = require("../utils/viewProfile.js")

const router = express.Router()

router.get("/profile/view",userAuth,async (req,res)=>{
    try {
        const userProfile = viewProfile(req.user);
        res.send(userProfile)
    } catch(err) {
            res.status(400).send("Unathenticated user")
            console.log("This is the error message ",err.message)
    }
})

router.patch("/profile/edit",userAuth,async(req,res)=>{
    const {_id} = req.user;
    const allowedUpdateFields = ["gender","about","skills","photoUrl"];
    try{
        /*This will check if my request body has the valid allowed fields for update. 
          It will return false in case at least one of the field of the request body is not allowed*/
        const IsUpdateAllowed = Object.keys(req.body).every((k) => allowedUpdateFields.includes(k))
        if(!IsUpdateAllowed){
            throw new Error("Update is not allowed")
        }
        const user = await User.findOne({ _id: _id});
        if(user===null){
            res.status(400).send("No user found")
        } else{
                await User.findByIdAndUpdate({ _id: _id},req.body,{returnDocument:'after',runValidators:true})
                res.send(`User has been updated: ${user.email}`);
        }
    } catch(err){
        res.status(400).send("something went wrong while updating user")
        console.log("This is the error message ",err)
    }
})

router.patch("/profile/edit/password",userAuth,async(req,res)=>{
    const {_id} = req.user;
    const allowedUpdateFields = ["email","password","newPassword"];
    try{
        /*This will check if my request body has the valid allowed fields for update. 
          It will return false in case at least one of the field of the request body is not allowed*/
        const IsUpdateAllowed = Object.keys(req.body).every((k) => allowedUpdateFields.includes(k))
        if(!IsUpdateAllowed){
            throw new Error("Update is not allowed")
        }
        const {newPassword,password, ...rest } = req.body; //The ...rest syntax is part of JavaScript's object destructuring with the rest(...) operator
        const user = await User.findOne({ _id: _id}); //fetching the mongo document instance from using userid (it would have all other methods attached as per our schema)
        const validateCreds = await user.validateCreds(password) //validating if user new the old password

        if(!validateCreds) { // clearing the cookie in case client dont know the old password
            res.clearCookie('DevtinderTocken');
            res.status(400).send("invalid credentials! Please login again")
        } else{
                const hashedPassword = await bcrypt.hash(newPassword, 10); //hashing the password
                await User.findByIdAndUpdate({ _id: _id},{password:hashedPassword},{returnDocument:'after',runValidators:true})
                res.clearCookie('DevtinderTocken'); //clear the cookie so that user again logins with new password
                res.send(`User password has been reset: ${user.email}`);
        }
    } catch(err){
        res.status(400).send("something went wrong while updating user")
        console.log("This is the error message ",err)
    }
})


router.get("/user",userAuth, async(req,res)=>{
    const userMail = req.body.email;
    try{
        const user = await User.findOne({ email: userMail});
        if(user===null){
            res.status(400).send("No user found")
        } else{
            res.send(user);
        }
    } catch(err){
        res.status(400).send("something went wrong")
        console.log("This is the error message ",err)
    }
})

router.delete("/user",userAuth,async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findOne({ _id: userId});
        if(user===null){
            res.status(400).send("No user found")
        } else{
            // await User.deleteMany({ email: userMail})
            // await User.deleteMany({ email: userMail})
            await User.findByIdAndDelete(userId)
            res.send(`User has been deleted: ${user.email}`);
        }
    } catch(err){
        res.status(400).send("something went wrong while deleting user")
        console.log("This is the error message ",err)
    }
})

module.exports = router