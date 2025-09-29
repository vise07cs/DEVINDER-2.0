console.log("App is starting...");

const express=require('express');
const app=express();

app.use("/user",(req,res,next)=>{
 
    // res.send("Hello from user")
    console.log("Hello User 1")
    next();

},


  (req,res,next)=>{
 
    // res.send("Hello from user")
    console.log("Hello User 2")
    next();

},

(req,res,next)=>{
 
    // res.send("Hello from user")
    console.log("Hello User 3")
    next();

},

(req,res,next)=>{
 
    // res.send("Hello from user")
    console.log("Hello User 4")
    
    next();

},
(req,res,next)=>{
 
    // res.send("Hello from user")
    console.log("Hello User 5")
    res.send("Hello user 5")
    // next();

}




)





app.listen(3003,()=>{
    console.log("server is running on port 3003");
});