const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const JWT=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,  
        required:true,
        minLength:3,
        maxLength:30,
        index:true,      // to make it searchable
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
       enum:{
     values: ["male","female","others"],
      message:"not a valid gender typed"
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

userSchema.methods.getJWT= async function(){
  const user=this;
  const token=JWT.sign({id:user._id},"dev@tinder",{expiresIn:"1d"});
  return token;
  
}


userSchema.methods.validatePassword= async function(passwordEnteredByUser){
  const user=this;
  const passwordHash=user.password;

    const isPasswordValid=await bcrypt.compare(passwordEnteredByUser,passwordHash);
    if(!isPasswordValid){
       throw new Error("User not found");
    }
    return isPasswordValid;

}


const User=mongoose.model("User",userSchema);

module.exports=User;
  