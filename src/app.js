console.log("App is starting...");


const express=require('express');
const app=express();
const {authMiddleware,userMiddleware}=require('../middlewares/auth');
const connectDB = require('./config/db');
const User=require('./models/user');
const {validateSignupData}=require('./utils/validation');
app.use(express.json());
const bcrypt=require('bcrypt');



app.post("/signup",async (req,res)=>{
  // validation of data 
  try{
      validateSignupData(req);

  const {firstName,lastName,email,password}=req.body;

  // encryption of password

  const passwordHash=await bcrypt.hash(req.body.password,10);


    const user=new User({
      firstName,
      lastName,
      email,
      password:passwordHash,
    });
    // creating a new instance of user model

    
     await user.save();
    res.send("User signed up successfully");

    }catch(err){
    return res.status(400).send(err.message);
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

    const allowedUpdates=["about","skills","age","photoURL"];
    const updates=Object.keys(req.body);
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation){
      return res.status(400).send("Invalid updates!");
    }
    
    const user=await User.findOneAndUpdate({email:req.query.email},req.body,{new:true,runValidators:true});
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





 


