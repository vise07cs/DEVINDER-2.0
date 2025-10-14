const express=require('express');
const { userAuth } = require('../../middlewares/auth');
const userRouter=express.Router();
const {ConnectionRequestModel}=require('../models/connectionRequest');


// get all pending connection requests for the logged in user
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
  try{
    const loggedInUser=req.user;
    const connectionRequests=await ConnectionRequestModel.find({
      toUserId:loggedInUser._id,
      status:"interested",


    }).populate("fromUserId",["firstName","lastName","email","city","age"])


    res.json({
      message:`You have ${connectionRequests.length} pending connection requests`,
      data:connectionRequests
    })




  }catch(err){
    return res.status(400).send(err.message);
  }
}

)




module.exports={userRouter};
