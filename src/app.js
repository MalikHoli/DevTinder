const express = require("express");

const server = express();
const PORT = 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log("I am listening now");
})

// using the regx here
// server.get(/^\/ab?c$/,(req,res)=>{
//     res.send("yes here is your data")
// })

server.get("/user",(req,res)=>{
    console.log(req.query)
    res.send("yes here is your data")
})

server.get("/user/:userid",(req,res)=>{
    console.log(req.params)
    res.send("yes here is your data")
})