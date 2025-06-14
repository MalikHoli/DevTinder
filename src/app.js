const express = require("express");
const {connectToMongodb} = require("./config/database.js")
const {User} = require("./model");

const server = express();
const PORT = 3000;
let requestNo = 0;

connectToMongodb()
.then(() => {
    console.log("Database connection is established")
    server.listen(PORT,"0.0.0.0",()=>{
        console.log("Server is listening now");
    })
})
.catch((err)=>{console.log(err)})

server.use("/",(req,res,next)=>{
    ++requestNo
    console.log(Date.now()," : ","incoming request no: ",requestNo)
    next()
},express.json())

server.post("/signup",async (req,res)=>{
    console.log(req.body)
    // Creating a new instance of the User model
     const user = new User(req.body);
    try{
        await user.save()
        res.send("user document is created.... please check the DB")
    } catch(err){
        res.status(400).send("Error saving the user")
        console.log("This is the error message ",err)
    }
})

server.get("/feed", async(req,res)=>{
    try{
        res.send(await User.find({}));
    } catch(err){
        res.status(400).send("Error getting the feed data")
        console.log("This is the error message ",err)
    }
})

server.get("/user", async(req,res)=>{
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

server.delete("/user",async(req,res)=>{
    const userMail = req.body.email;
    try{
        const user = await User.findOne({ email: userMail});
        if(user===null){
            res.status(400).send("No user found")
        } else{
            // await User.deleteMany({ email: userMail})
            // await User.deleteMany({ email: userMail})
            await User.findByIdAndDelete(user._id.toString())
            res.send(`User has been deleted: ${userMail}`);
        }
    } catch(err){
        res.status(400).send("something went wrong while deleting user")
        console.log("This is the error message ",err)
    }
})

server.patch("/user",async(req,res)=>{
    const userMail = req.body.email;
    try{
        const user = await User.findOne({ email: userMail});
        if(user===null){
            res.status(400).send("No user found")
        } else{
            await User.findByIdAndUpdate(user._id.toString(),req.body,{returnDocument:'after'})
            res.send(`User has been updated: ${userMail}`);
        }
    } catch(err){
        res.status(400).send("something went wrong while updating user")
        console.log("This is the error message ",err)
    }
})