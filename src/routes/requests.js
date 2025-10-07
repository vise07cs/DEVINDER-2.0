const express=require('express');

const requestRouter=express.Router();
const User=require('../models/user');
const {userAuth}=require('../../middlewares/auth');
// send connection request

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  try{
    const user=req.user;
        res.send("Connection request sent successfully by "+ user.firstName);

  }catch(err){
    return res.status(400).send(err.message);

  }
})

module.exports={requestRouter};