const JWT = require("jsonwebtoken");
    const User = require("../src/models/user");



const userAuth=async function userAuth(req,res,next){
    // read token from cookies , validate the token and  find the user


    try{

    
    console.log("Authenticating the user via auth middleware...");
    const {token} = req.cookies
    if(!token){
        return res.status(401).send("Unauthorized access, token not available");
    }
    // validate token
    const isTokenValid = JWT.verify(token, "dev@tinder");
    if(!isTokenValid){
        return res.status(401).send("Unauthorized access, invalid token");
    }

    const {id} = isTokenValid;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).send("User not found");
    }
    req.user=user;
    next();
   

}catch(err){
    return res.status(400).send(err.message);
}
}






module.exports={userAuth};