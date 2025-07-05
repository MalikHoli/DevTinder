const express = require("express");
const {User} = require("../model");

const router = express.Router()

router.get("/feed", async(req,res)=>{
    try{
        res.send(await User.find({}));
    } catch(err){
        res.status(400).send("Error getting the feed data")
        console.log("This is the error message ",err)
    }
})

module.exports = router