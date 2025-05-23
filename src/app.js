const express = require("express");

const server = express();
const PORT = 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log("I am listening now");
})

server.get("/user", (req,res)=>{
    res.send({"userName":"Sona"})
})

server.post("/user", (req,res)=>{
    // res.send({"userName":"Sona"})
    console.log("user data saved successfully")
})

server.delete("/user", (req,res)=>{
    res.send({"userName":"Sona"})
    console.log("user deleted")
})