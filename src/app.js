console.log("App is starting...");


const express=require('express');
const app=express();
const {authMiddleware,userMiddleware}=require('../middlewares/auth');
const connectDB = require('./config/db');
const User=require('./models/user');

app.use(express.json());



app.post("/signup",async (req,res)=>{
  // console.log(req.body);
    
    const user=new User(req.body);
    // creating a new instance of user model

    try{
     await user.save();
    res.send("User signed up successfully");


    }catch(err){
        console.log("Error in saving user to db",err);
        res.status(500).send("Internal server error");
    }
 
});

// Get all users from the database
app.get("/feed",async (req,res)=>{
;
  try{
    const user=await User.find({});
    if(user.length===0){
      return res.status(404).send("User not found");
    }
    res.send(user);
  }catch(err){
    console.log("Error in fetching users from db",err);
    res.status(500).send("Internal server error");
  } 

})


// Get a single user from the database by email
app.get("/user",async (req,res)=>{

  try{
    const user=await User.findOne({email:req.body.email});
    if(!user){
      return res.status(404).send("User not found");
    }
    res.send(user);
  }catch(err){
    console.log("Error in fetching users from db",err);
    res.status(500).send("Internal server error");
  } 

})


// Delete a user from the database by email

app.delete("/user",async (req,res)=>{
  try{
    const user=await User.findOneAndDelete({email:req.body.email});
    if(!user){
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  }catch(err){
    console.log("Error in deleting user from db",err);
    res.status(500).send("Internal server error");
  }

})

// update a user from the database by email

app.put("/user",async (req,res)=>{
  try{
    
    const user=await User.findOneAndUpdate({email:req.body.email},req.body,{new:true});
    if(!user){
      return res.status(404).send("User not found");
    } 
    res.send(user);
  }catch(err){  
    console.log("Error in updating user from db",err);
    res.status(500).send("Internal server error");
  }
})









connectDB()
  .then(() => {
    console.log(" Database connected successfully ");
    app.listen(3003,()=>{
    console.log("server is running on port 3003");
});

  })
  .catch((err) => {
    console.log("❌ DB cannot be connected", err);
  });





 


