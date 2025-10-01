function authMiddleware(req,res,next){
    console.log("Authenticating the user via auth middleware...");
    const token = "abc";
    const isTokenValid = token === "abc";
    if(!isTokenValid){
        res.status(403).send("Unauthorized token");

    }
    else{
        next();
    }

}

function userMiddleware(req,res,next){
    console.log("Authenticating the user via user middleware...");
    const token = "abc";
    const isTokenValid = token === "abc";
    if(!isTokenValid){
        res.status(403).send("Unauthorized token");

    }
    else{
        next();
    }

}





module.exports={authMiddleware,userMiddleware};