const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,  
        required:true,
        minLength:3,
        maxLength:30
    },
     lastName:{
        type:String,  
        
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    age:{
      type:Number,
      required:true,
      min:18,
      max:60
    },
    gender:{
      type:String,
      trim:true,
      lowercase:true,
      validate(value){
        const allowedGenders=["male","female","other"];
        if(!allowedGenders.includes(value)){
          throw new Error("Gender must be Male, Female or Other");
        } 
      }


    },
    photoURL:{
      type:String
    },
    about:{
      type:String,
      default:"This user prefers to keep an air of mystery about them."
    },
    skills:{
      type:[String]
    }
    
});


const User=mongoose.model("User",userSchema);

module.exports=User;
  