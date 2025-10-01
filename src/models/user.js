const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,  
        required:true
    },
     lastName:{
        type:String,  
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    age:{
      type:Number,
      required:true
    },
    gender:{
      type:String

    }
    
});


const User=mongoose.model("User",userSchema);

module.exports=User;
  