const express = require("express");

const server = express();

server.listen(3000,"0.0.0.0",()=>{
    console.log("I am listening now");
})