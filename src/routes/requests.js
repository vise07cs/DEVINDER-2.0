const express=require('express');

const requestRouter=express.Router();
const User=require('../models/user');
const {userAuth}=require('../../middlewares/auth');
const {ConnectionRequestModel}=require('../models/connectionRequest');

// send connection request

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  try{
    const fromUser=req.user;   //He is the logged in user (we are getting him from auth middleware). Although we are not using this variable but it is useful for understanding
    const fromUserId=req.user._id; 
    const toUserId=req.params.toUserId;  
    const status=req.params.status;

    const allowedStatuses=["ignored","interested"];
    if(!allowedStatuses.includes(status)){
      throw new Error("Status must be either ignored or interested");
    }

    const toUser=await User.findById(toUserId);
    if(!toUser){
      throw new Error("The user you are trying to connect with does not exist");
    }


    // check if a connection request already exists between the two users

    const existingRequest=await ConnectionRequestModel.findOne({
      $or:[
        {fromUserId:fromUserId,toUserId:toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    });

    if(existingRequest){
      throw new Error("A connection request already exists between the two users");
    }


    const connectionRequest=new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status
    });

//     console.log("fromUserId:", fromUserId);
// console.log("toUserId:", toUserId);

    const data =await connectionRequest.save();

    res.json({
      message:`Connection request sent to ${toUser.firstName} by ${fromUser.firstName} with status ${status}`,
      data:data
    })
      


    

  }catch(err){
    return res.status(400).send(err.message);

  }
})

module.exports={requestRouter};


