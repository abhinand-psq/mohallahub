import mongoose,{Schema,model} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import { apiresponse } from "../utils/Api-response.js";
import { errorresponse } from "../utils/Api-errorresponse.js";
const userschema = new Schema({
    avatar: {
      imgurl:{
        type:String,
        lowercase:true,
        default:'https://placehold.co/300x200',
      },
      urlpath:{
           type:String,
           lowercase:true,
           default:''
      
    }}
    ,
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
{
    timestamps:true
})



userschema.pre("save", async function (next){
  const salt = 10;
if(this.isModified('password') & this.password != ''){
this.password = await bcrypt.hash(this.password,salt)
next()
}
next()
})

userschema.methods.createtoken = function (){
const radnomtoken = crypto.randomBytes(16).toString('hex')
const hashedtoken = crypto.createHash("sha256").update(radnomtoken).digest('hex')
const expiry = Date.now() + (20*60*1000)
return {radnomtoken,hashedtoken,expiry}
}



userschema.methods.createaccess = function (role){
this.role = role;
const secret = process.env.Secret;
const payload = { 
  id: this._id,
  email:this.email,
  role:this.role
};
const accesstoken = jwt.sign(payload, secret, { expiresIn: '1h' });
return accesstoken
}

userschema.methods.createrefresh = function (){
const secret = process.env.Secret;
const payload = { 
id: this._id,
};
const  refreshtoken = jwt.sign(payload, secret, { expiresIn: '2d' });
return refreshtoken
}

userschema.methods.compareemailtoken = async function(emailpassed){
try{

console.log(this.emailVerificationToken, " " , emailpassed);
const hashnewemail = crypto.createHash("sha256").update(emailpassed).digest('hex')
console.log(this.emailVerificationToken, " " , hashnewemail);
if(hashnewemail == this.emailVerificationToken){
  return true
}else{
  throw errorresponse('the emil token is not valid','',205)
}
}catch(e){
throw errorresponse(e,'',205)
}

}

userschema.methods.comparepasssword =async function(password){
try{
console.log(this.password   +   password);
const result = await bcrypt.compare(password,this.password)
 console.log(result);
 return result
}catch(e){
  console.log('hehe');
 throw new errorresponse(e.message,[],401); 
}
}



export const userinfo = mongoose.model('userinfo',userschema)
