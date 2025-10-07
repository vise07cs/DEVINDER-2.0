console.log("App is starting...");


const express=require('express');
const app=express();
const {userAuth}=require('../middlewares/auth');
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
    const token=JWT.sign({id:user._id},"dev@tinder",{expiresIn:"1d"});

    // console.log(token);
    res.cookie("token",token ,{expires:new Date(Date.now()+ 86400000)});

    // add token in cookie and send response back to the user


    res.send("User logged in successfully");

  }catch(err){
    return res.status(400).send(err.message);

  }
    
})

// get current user profile
app.get("/profile",userAuth, async (req,res)=>{
  try{
    const user=req.user
    res.send(user);
  }catch(err){
    return res.status(400).send(err.message);

  }
}
)


app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  try{
    const user=req.user;
        res.send("Connection request sent successfully by "+ user.firstName);

  }catch(err){
    return res.status(400).send(err.message);

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





 


