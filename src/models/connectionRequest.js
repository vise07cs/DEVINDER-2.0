const mongoose=require('mongoose');
const connectionRequestSchema=new mongoose.Schema({
  fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',  // reference to User model
    required:true

  },
  toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',  // reference to User model
    required:true
  },
  status:{
    type:String,
    enum:{
     values: ["ignored","interested","accepted","rejected"],
      message:"Status can be either pending, accepted or rejected"
    }
  }
},{timestamps:true})

connectionRequestSchema.index({fromUserId:1,toUserId:1}) // to ensure uniqueness of connection requests between two users
// compound index to ensure that a user cannot send multiple connection requests to the same user


connectionRequestSchema.pre('save',function(next){
  // its a hook / middleware that runs before saving a document in the database (pre-save hook)
  // 'this' refers to the document being saved

  const connectionRequest=this;
  console.log("A connection request is about to be saved:",connectionRequest);

  // check if toUserId and fromUserId are the same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      throw new Error("You cannot send connection request to yourself");
    }
    next();





})

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports={ConnectionRequestModel};