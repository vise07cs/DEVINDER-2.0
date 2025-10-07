

const express=require('express');
const app=express();
const connectDB = require('./config/db');
app.use(express.json());

const {authRouter}=require('./routes/auth');
const {profileRouter}=require('./routes/profile');
const {requestRouter}=require('./routes/requests');


app.use(express.json());


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);




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





 


