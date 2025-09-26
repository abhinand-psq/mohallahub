import jwt from 'jsonwebtoken'
import { userinfo } from '../models/user.model.js';

export const jwtverification = async(req,res,next) =>{
  console.log("ho");
  
    try{
const accesstoken = req.cookies?.accesstoken || req.headers["authorization"]?.split(" ")[1];
console.log(accesstoken);
if( !accesstoken ) {
  throw new Error('no accesstoken')
}
  const userweneed =  jwt.verify(accesstoken,process.env.Secret)
 const fromhere = await userinfo.findById(userweneed.id).select('_id username email fullname isEmailVerified')
 if(!fromhere)  throw new Error('user not found')
 req.user = fromhere
        next()
    }catch(e){
        console.log('comes here');
      res.status(401).json({error:e.message})
    }
}