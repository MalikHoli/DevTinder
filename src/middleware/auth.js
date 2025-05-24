const checkAdminAuth = (req,res,next)=>{
    console.log("Admin authentication initiated")
    const tocken = "abc";
    if(tocken === "abc"){
        console.log("Admin is valid")
        next()
    }
    else{
        res.status(401).send("Unauthrised Admin!!")
    }
}

const checkUserAuth = (req,res,next)=>{
    console.log("User authentication initiated")
    const tocken = "abc";
    if(tocken === "abc"){
        console.log("User is valid")
        next()
    }
    else{
        res.status(401).send("Unauthrised User!!")
    }
}

module.exports = {checkAdminAuth,checkUserAuth} 