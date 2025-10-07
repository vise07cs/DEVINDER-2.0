const express=require('express');
const profileRouter=express.Router();
const {userAuth}=require('../../middlewares/auth');

// get current user profile

profileRouter.get("/profile",userAuth, async (req,res)=>{
  try{
    const user=req.user
    res.send(user);
  }catch(err){
    return res.status(400).send(err.message);

  }
}
)

module.exports={profileRouter};