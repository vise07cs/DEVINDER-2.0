console.log("App is starting...");


const express=require('express');
const app=express();
const {authMiddleware,userMiddleware}=require('../middlewares/auth');






app.use("/admin",authMiddleware);


app.get("/admin/getData",(req,res)=>{
    res.send("This is the admin data we got after authentication");
});

app.get("/admin/deleteData",(req,res)=>{
    res.send("This is delete data  we got after authentication");
});


app.get("/user/data",userMiddleware, (req,res)=>{
    res.send("This is user data that anyone can access");
});



 

app.listen(3003,()=>{
    console.log("server is running on port 3003");
}); 


// The current code flow 
// Request hits Express.

// Middleware,  authMiddleware runs (app.use("/admin", authMiddleware)).

// Middleware calls next().

// Express finds the matching route (app.get("/admin/deleteData")).

// That route sends the response.