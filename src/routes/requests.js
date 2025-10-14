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


// review connection request (accept/reject)
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser=req.user;   //He is the logged in user (we are getting him from auth middleware). Although we are not using this variable but it is useful for understanding
    const loggedInUserId=req.user._id;
    const requestId=req.params.requestId;
    const status=req.params.status;
    const allowedStatuses=["accepted","rejected"];



    if(!allowedStatuses.includes(status)){
      throw new Error("Status must be either accepted or rejected");
    }




    const connectionRequest=await ConnectionRequestModel.findById(requestId);
    if(!connectionRequest){
      throw new Error("The connection request you are trying to review does not exist");
    }

    // only the toUserId can review the connection request as he is the one who received it and is the logged in user
    if(connectionRequest.toUserId.toString()!==loggedInUserId.toString()){
      throw new Error("You are not authorized to review this connection request");
    }
    if(connectionRequest.status==="accepted" || connectionRequest.status==="rejected"){
      throw new Error("This connection request has already been reviewed");
    }
    if(!connectionRequest.status==="interested"){
      throw new Error("This connection request is not in interested status so it cannot be reviewed");
    }

    connectionRequest.status=status;

    const data=await connectionRequest.save();
    res.json({
      message:`Connection request  has been ${status} by ${loggedInUser.firstName}`,
      data:data
    })
  }catch(err){
    return res.status(400).send(err.message);
    
  }
})

module.exports={requestRouter};


