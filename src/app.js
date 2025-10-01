console.log("App is starting...");


const express=require('express');
const app=express();
const {authMiddleware,userMiddleware}=require('../middlewares/auth');
const connectDB = require('./config/db');
const User=require('./models/user');

app.post("/signup",async (req,res)=>{
    const user=new User({
        firstName:"Virat",
        lastName:"Kohli",
        email:"virat@gmail.com",
        age:32,
        pw:"virat123",
    })
    // creating a new instance of user model

    try{
     await user.save();
    res.send("User signed up successfully");


    }catch(err){
        console.log("Error in saving user to db",err);
        res.status(500).send("Internal server error");
    }
    
   



  
    
});









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





 


