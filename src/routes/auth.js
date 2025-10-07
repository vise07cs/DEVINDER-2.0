const express=require('express');
const authRouter=express.Router();
const {validateSignupData}=require('../utils/validation')
const User=require('../models/user');
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');

authRouter.use(express.json());
authRouter.use(cookieParser());


// signup API
authRouter.post("/signup",async (req,res)=>{
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

// Login API
authRouter.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({
      email:email
    });
    if(!user){
      throw new Error("User not found");
    }

    // password marching
    const isPasswordValid=await user.validatePassword(password);
    if(!isPasswordValid){
      throw new Error("Invalid password");
    }

    

  
    // create JWT token
    const token= await user.getJWT();

    // console.log(token);
    res.cookie("token",token ,{expires:new Date(Date.now()+ 86400000)});

    // add token in cookie and send response back to the user


    res.send("User logged in successfully");

  }catch(err){
    return res.status(400).send(err.message);

  }
    
})



module.exports={authRouter};