console.log("App is starting...");

const express=require('express');
const app=express();



app.get("/user",(req,res)=>{
    res.send("Hello User");
});

app.post("/user",(req,res)=>{
    res.send("Post request to user");
})


app.delete("/user",(req,res)=>{
    res.send("Delete request to user");
})




app.listen(3003,()=>{
    console.log("server is running on port 3003");
});