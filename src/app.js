const express = require("express");

const server = express();
const PORT = 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log("I am listening now");
})

function handler1 (rq,rs,next){
    console.log("somebody is requesting")
    next()
}

function handler2 (req,res,next){
    res.send("serving via 2nd handler")
    console.log("Now control is with second handler")
    next()
}

function handler3 (req,res,next){
    // res.send("serving via 2nd handler")
    console.log("Now control is with 3rd handler")
    next()   
}

server.get("/user",handler1,handler3,handler2)
