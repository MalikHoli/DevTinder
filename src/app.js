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
    // Creating a new instance of the User model
     const user = new User(req.body);
     const allowedSignupFields = ["firstName", "lastName", "email", "password", "age", "gender", "about", "skills", "photoUrl"];
    try{
        /*This will check if my request body has the valid allowed fields for insert/signup. 
          It will return false in case at least one of the field of the request body is not allowed*/
        const IsSugnupAllowed = Object.keys(req.body).every((k) => allowedSignupFields.includes(k))
        if(!IsSugnupAllowed){
            throw new Error("Signup is not allowed")
        }
        await user.save()
        res.send("user document is created.... please check the DB")
    } catch(err){
        res.status(400).send("Error saving the user :"+err)
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

server.patch("/user/:userId",async(req,res)=>{
    const userId = req.params.userId;
    const allowedUpdateFields = ["password","gender","about","skills","photoUrl"];
    try{
        /*This will check if my request body has the valid allowed fields for update. 
          It will return false in case at least one of the field of the request body is not allowed*/
        const IsUpdateAllowed = Object.keys(req.body).every((k) => allowedUpdateFields.includes(k))
        if(!IsUpdateAllowed){
            throw new Error("Update is not allowed")
        }
        const user = await User.findOne({ _id: userId});
        if(user===null){
            res.status(400).send("No user found")
        } else{
                await User.findByIdAndUpdate({ _id: userId},req.body,{returnDocument:'after',runValidators:true})
                res.send(`User has been updated: ${user.email}`);
        }
    } catch(err){
        res.status(400).send("something went wrong while updating user "+ err.message)
        console.log("This is the error message ",err)
    }
})