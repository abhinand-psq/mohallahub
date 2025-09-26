import { userinfo } from "../models/user.model.js";

export const refresh_the_token = async(req,res,next)=>{
    console.log(req.newerror);
if(req.newerror){
console.log("yes the token is expired so going to refresh the token ");
next()
}else{
    const user = await userinfo.findById(req.user._id)
    console.log("oops this doenst run");
    next()
}
}

