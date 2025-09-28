console.log("App is starting...");

const express=require('express');
const app=express();





app.use("/test",(req,res)=>{
    res.send("This is a response from express server test royute . test test test");
})

app.use("/hello",(req,res)=>{
    res.send("This is a response from express server Hello ");
})

app.use("/contact",(req,res)=>{
    res.send("This is contact page , contact us at 9999999999");
})

app.use("/",(req,res)=>{
    res.send("This is a response from express server main route , welcome to the home page , how are you ");
})

app.listen(3003,()=>{
    console.log("server is running on port 3003");
});