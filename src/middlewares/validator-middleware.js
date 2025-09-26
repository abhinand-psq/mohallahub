import {validationResult} from 'express-validator'
import { errorresponse } from '../utils/Api-errorresponse.js'

export const CheckTheValidationResult = (req,res,next)=>{
const result = validationResult(req)
if(result.isEmpty()){
    return next()}
if(result.array()){
    res.status(401).json(new errorresponse(result.array().map((Res)=>Res),'',401))
}
}

