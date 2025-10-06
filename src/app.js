console.log("App is starting...");


const express=require('express');
const app=express();
const {authMiddleware,userMiddleware}=require('../middlewares/auth');
const connectDB = require('./config/db');
const User=require('./models/user');
const {validateSignupData}=require('./utils/validation');
app.use(express.json());
const bcrypt=require('bcrypt');
const JWT=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

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

// Login API
app.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({
      email:email
    });
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
       throw new Error("User not found");
    }
    // create JWT token
    const token=JWT.sign({id:user._id},"dev@tinder");
    // console.log(token);
    res.cookie("token",token);

    // add token in cookie and send response back to the user


    res.send("User logged in successfully");

  }catch(err){
    return res.status(400).send(err.message);

  }
    
})

// get current user profile
app.get("/profile",async (req,res)=>{
  try{
    const {token}=req.cookies;
    if(!token){
      return res.status(401).send("Unauthorized access , token not available");
    }

    // validate token
    const isTokenValid=JWT.verify(token,"dev@tinder");
    if(!isTokenValid){
      return res.status(401).send("Unauthorized access");
    }

    console.log(isTokenValid);
    const {id}=isTokenValid;
    const user=await User.findById(id);
    if(!user){
      return res.status(404).send("User not found");
    }
    // console.log(user);
  
    res.send(user);
  }catch(err){
    return res.status(400).send(err.message);

  }
}
)


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





 


