const validator=require("validator");
const validateSignupData=(req)=>{
  const {firstName,lastName,email,password}=req.body;
  if(!firstName || firstName.length<3 || firstName.length>30){
    return {valid:false,message:"First name must be between 3 and 30 characters"};
  }
  if(lastName && (lastName.length<3 || lastName.length>30)){
    return {valid:false,message:"Last name must be between 3 and 30 characters"};
  }
  else if(email && !validator.isEmail(email)){
    return {valid:false,message:"Invalid email address"};
  }
  else if(password && !validator.isStrongPassword(password)){
    return {valid:false,message:"Password is not strong"};
  }
  return {valid:true};



}



const validateProfileData=(req)=>{
  const allowedUpdates=["firstName","lastName","email","skills","bio","location","about"]
  const updates=Object.keys(req.body);

  const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));
  if(!isValidOperation){
    throw new Error("Invalid updates");
  }
  return isValidOperation;
}

module.exports={validateSignupData,validateProfileData};
