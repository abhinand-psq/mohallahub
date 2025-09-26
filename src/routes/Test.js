import e from "express";
import { testmodel } from "../models/test.model.js";
import { apiresponse } from "../utils/Api-response.js";
import { errorresponse } from "../utils/Api-errorresponse.js";
const {router} = e()
import crypto from 'crypto'
import { userinfo } from "../models/user.model.js";
import { validatebody, validatebodylogin } from "../middlewares/express-validator.js";
import { CheckTheValidationResult } from "../middlewares/validator-middleware.js";
import { prepareEmail, prepareforgetpassword, transporter } from "../utils/ReadyTheEmail.js";
import { jwtverification } from "../middlewares/verifyuser.js";
import { logger } from "../utils/winston.js";
import {exec} from 'child_process'

 

export const CreateRefreshAndAccess =(response) =>{
const accesstoken = response.createaccess('user')
const refreshtoken = response.createrefresh()
return {accesstoken,refreshtoken}
}

const CreateRandomToken =(response)=>{
 const {radnomtoken,hashedtoken,expiry} = response.createtoken()
 response.emailVerificationToken = hashedtoken
 response.emailVerificationExpiry = expiry
 return {radnomtoken,hashedtoken,expiry}
}

const CreateRandomTokenforpassword =(response)=>{
 const {radnomtoken,hashedtoken,expiry} = response.createtoken()
 response.forgotPasswordToken = hashedtoken
 response.forgotPasswordExpiry = expiry
 return {radnomtoken,hashedtoken,expiry}
}

router.post('/',async(req,res,next)=>{
 try{
const dataweget = await req.body
console.log(dataweget);
const response = new userinfo(dataweget)
const {radnomtoken,hashedtoken,expiry} = CreateRandomToken(response)

let valueweget = await response.save();
const {htmlemailBody,textemailBody} = prepareEmail(response.username,`http://localhost:8000/signin/v1/emailverfification/${radnomtoken}`)
await transporter.sendMail({
    from: '"abhinand" <abhinand@ethereal.email>',
    to: `@${response.email},`,
    subject: "Hello ✔",
    text:textemailBody, // plain‑text body
    html: htmlemailBody, // HTML body
  });
const addedvalue = await userinfo.findById(response._id).select('-_id -password -emailVerificationToken -emailVerificationExpiry')
return res.status(200).header('Content-Type:application/octet-stream').json(new apiresponse(200,addedvalue,'success'))
 }catch(e){
    console.error(e.message)
    return res.status(401).json(new errorresponse(e.message,e.stack,401))
 }
  
})


router.post('/check/:auth',(req,res,next)=>{
   console.log('plesss');
    return res.status(200).json(new apiresponse(200,'❤️❤️😒😒😒','success'))
})


router.get('/v1/emailverfification/:emailtoken',async(req,res,next)=>{
try{
   const hashnewemail = crypto.createHash("sha256").update(req.params.emailtoken).digest('hex')
   const user =await userinfo.findOne(
      {emailVerificationToken:hashnewemail,
            emailVerificationExpiry:{$gte:Date.now()}
      }
       )
// const value = await user.compareemailtoken(req.params.emailtoken)
if(!user){
   throw new Error('token is invalid or token is expired')
}
if(user){
 user.isEmailVerified = true
 user.emailVerificationExpiry=undefined;
 user.emailVerificationToken=undefined;
await user.save({validateBeforeSave:false})  
res.status(200).json(new apiresponse('email is verified'))
}
}catch(e){
   console.log('something went wrong');
return res.status(401).json(new errorresponse(e))
}

})


router.post('/login',validatebodylogin(),CheckTheValidationResult,async(req,res,next)=>{
 try{
  const logeduser =await userinfo.findOne({email:req.body.email})
   console.log(logeduser);
  const vl=  await logeduser.comparepasssword(req.body.password)
  if(vl == false){
  return res.status(400).json(new errorresponse('password doesnt match'))
  }else if(vl == true){
 console.log('thuisdf',vl);
   const {accesstoken,refreshtoken} = CreateRefreshAndAccess(logeduser)
   logeduser.refreshToken = refreshtoken
   logeduser.save()
 return  res.status(200).cookie('accesstoken',accesstoken,{secure:false,httpOnly:true}).cookie('refreshtoken',refreshtoken,{secure:false,httpOnly:true}).json(new apiresponse(200,'scuuess',''))
  }
 }catch(e){
  return res.status(200).json(new errorresponse(e.message))
 }
})

router.post('/logout',jwtverification,async(req,res,next)=>{
console.log(req.user); 
await userinfo.findByIdAndUpdate(req.user._id,{$set:{refreshToken:""}},{new:true})
try{
res.clearCookie('accesstoken',{secure:false,httpOnly:true}).clearCookie('refreshtoken',{secure:false,httpOnly:true}).json({success:true})
}catch(e){
   console.log("reahe here");
res.status(400).json({error:e})
}
})

router.post('/resendemail',jwtverification,async(req,res,next)=>{
try{
const usernow = await userinfo.findById(req.user?._id)
console.log(usernow);
if(!usernow){
   return res.status(401).json(new apiresponse('not a valid user'))
}
if(usernow?.isEmailVerified){
   return res.status(200).json(new apiresponse('email already verified'))
}
const {radnomtoken,hashedtoken,expiry} = CreateRandomToken(usernow)
await usernow.save({validateBeforeSave:false})
const {htmlemailBody,textemailBody} = prepareEmail(req.user.username,`http://localhost:8000/signin/v1/emailverfification/${radnomtoken}`)
await transporter.sendMail({
    from: '"abhinand" <abhinand@ethereal.email>',
    to: `@${req.user.email},`,
    subject: "Hello ✔",
    text:textemailBody, // plain‑text body
    html: htmlemailBody, // HTML body
  });
  res.status(200).json('email sended')
}catch(e){
res.status(400).json(new errorresponse(e))
}
})

router.post('/expired',jwtverification,async(req,res)=>{
res.send('yes')
 })


 router.post('/forgetpassword',async(req,res,next)=>{

   try{
const {email} =await req.body
   if(!email){
      throw new Error('email is not provided')
   }
   console.log('kk');
   
   const user = await userinfo.findOne({email})
   console.log('d',user);
   
   if(!user){
      throw new Error('user is not found in database')
   }
 const {radnomtoken,hashedtoken,expiry} = CreateRandomTokenforpassword(user)
   const {htmlemailBody,textemailBody} = prepareforgetpassword(user.username,`http://localhost:8000/signin/v1/resetpassword/${radnomtoken}`)
await transporter.sendMail({
    from: '"abhinand" <abhinand@ethereal.email>',
    to: `@${user.email},`,
    subject: "reset password✔",
    text:textemailBody, // plain‑text body
    html: htmlemailBody, // HTML body
  });
  res.status(200).json(new apiresponse('password reset link sended'))
   }catch(e){
    return res.status(401).json(new errorresponse(e.message))
   }
 })


 router.post('/v1/resetpassword/:passtoken/',async(req,res,next)=>{
try{
   const {newpassword,rewritenewpassword} = req.body;
   if(!newpassword && !rewritenewpassword){
      throw new Error('password must be provided')
   } 
   if((newpassword === rewritenewpassword) != true){
      throw new Error('both password are not same')
   }
 const thisuser =await userinfo.findOne({forgotPasswordToken:req.params.passtoken,forgotPasswordExpiry:{$gte:Date.now()}})
 if(!thisuser){
   throw new Error('token is expired or user not found')
 }
thisuser.forgotPasswordToken = undefined;
thisuser.forgotPasswordExpiry=undefined;
thisuser.password = newpassword;
thisuser.save({validateBeforeSave:false})
   res.send('yup')
}catch(e){

}
 })

router.post('/changepassword',jwtverification,async(req,res)=>{
try{
   const {oldpassword,newpassword} = await req.body
if(!oldpassword && !newpassword){
   throw new Error('old or new password must give')
}
const user =await userinfo.findById(req.user._id);
const result = await user.comparepasssword(oldpassword)
console.log("check" , result);
if(result == true){
user.password = newpassword
user.save({validateBeforeSave:false})
return res.status(200).json(new apiresponse('password changed succesfully'))
}else{
throw new Error('passowrd is incorrect')
}
}catch(e){
   return res.status(401).json(new errorresponse(e.message))
}
})

export {router}