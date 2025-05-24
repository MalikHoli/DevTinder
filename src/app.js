const express = require("express");
const {checkAdminAuth,checkUserAuth} = require("./middleware/auth");

const server = express();
const PORT = 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log("I am listening now");
})

server.use("/admin",checkAdminAuth)

server.get("/admin/getdata",(req,res)=>{
    res.send("Here is your admin data")
})

server.use("/user",checkUserAuth)

server.get("/user/getdata",(req,res)=>{
    res.send("Here is your data")
})