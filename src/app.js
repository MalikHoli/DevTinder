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