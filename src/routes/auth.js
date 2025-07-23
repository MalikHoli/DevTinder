const express = require("express");
const bcrypt = require('bcrypt');
const {User} = require("../model");

const router = express.Router()

router.post("/signup",async (req,res)=>{
    const { password, ...rest } = req.body; //The ...rest syntax is part of JavaScript's object destructuring with the rest(...) operator

    const hashedPassword = await bcrypt.hash(password, 10); //hashing the password

    const allowedSignupFields = ["firstName", "lastName", "email", "password", "age", "gender", "about", "skills", "photoUrl"];

    try{
        /*This will check if my request body has the valid allowed fields for insert/signup. 
          It will return false in case at least one of the field of the request body is not allowed*/
        const IsSignupAllowed = Object.keys(req.body).every((k) => allowedSignupFields.includes(k))
        if(!IsSignupAllowed){
            throw new Error("Signup is not allowed")
        } //you can write a signup validator here in case data needs to be validated before going to DB level validator

        //****************************************************************
        // Creating a new instance of the User model, At this stage all the DB level validators will run
        const user = new User({...rest,password:hashedPassword}); //here passing a new object with all keys copied from req.body but password modified so avaoiding changing req.body iteself
        //****************************************************************
        await user.save() // Saving the data to the DB
        res.send("user document is created.... please check the DB")
    } catch(err){
        res.status(400).send("Error saving the user :"+err)
        console.log("This is the error message ",err)
    }
})

router.post("/login", async (req,res)=>{
    const {email,password} = req.body 
    try{
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("This is new user. Need to sign up")
        }
        const validateCreds = await user.validateCreds(password)
        if(validateCreds){
            const jwtTocken = user.getJWT()
            res.cookie('DevtinderTocken',jwtTocken)
            res.send(user)
        } else{
            throw new Error("Invalid creds")
        }
    } catch(err){
        res.status(400).send("invalid credentials")
        console.log("This is the error message ",err.message)
    }
})

router.post("/logout", async (req,res)=>{
    const {email,password} = req.body 
    try{
        res.clearCookie('DevtinderTocken'); // Clear the cookie named 'DevtinderTocken'
        res.send('Successfully logged out');
    } catch(err){
        res.status(400).send("something went wrong")
        console.log("This is the error message ",err.message)
    }
})

module.exports = router