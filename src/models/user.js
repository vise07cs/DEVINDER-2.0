const mongoose=require('mongoose');
const validator=require('validator');
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
        trim:true,
        validate(value){
          if(!validator.isEmail(value)){
            throw new Error("Invalid email address"+value);
          }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
         validate(value){
          if(!validator.isStrongPassword(value)){
            throw new Error("Password is not strong");
          }
        }
    },
    age:{
      type:Number,
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
      type:[String],
      validate:{
        validator:function(value){
          return value.length<=5;
        },
        message:"A maximum of 5 skills are allowed."
      }
      



    }
    
},{timestamps:true});


const User=mongoose.model("User",userSchema);

module.exports=User;
  