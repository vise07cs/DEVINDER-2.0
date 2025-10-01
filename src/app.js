console.log("App is starting...");


const express=require('express');
const app=express();
const {authMiddleware,userMiddleware}=require('../middlewares/auth');
const connectDB = require('./config/db');


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





 


