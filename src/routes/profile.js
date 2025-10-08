const express=require('express');
const profileRouter=express.Router();
const {userAuth}=require('../../middlewares/auth');
const { validate } = require('../models/user');
const {validateProfileData}=require('../utils/validation');


// get current user profile

profileRouter.get("/profile/view",userAuth, async (req,res)=>{
  try{
    const user=req.user
    res.send(user);
  }catch(err){
    return res.status(400).send(err.message);

  }
}
)


// edit user profile
profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
  try{
    validateProfileData(req);
  
    const loggedInuser=req.user;

    const updates=Object.keys(req.body)
    updates.forEach((update)=>{
      loggedInuser[update]=req.body[update];
    })
    await loggedInuser.save();
    
    res.send(loggedInuser.firstName+" your profile was updated successfully" );


  }catch(err){
    return res.status(400).send(err.message);

  }
}
)  

// forgot password API
profileRouter.post("/forgotpassword",async(req,res)=>{
  try{
    const {email,newPassword}=req.body;
    const user=await User.findOne({ email:email });
    if(!user){
      throw new Error("User not found");
    }
    const passwordHash=await bcrypt.hash(newPassword,10);
    user.password=passwordHash;
    await user.save();
    res.send("Password reset successfully");
  }catch(err){
    return res.status(400).send(err.message);

  }
}
) 




module.exports={profileRouter};