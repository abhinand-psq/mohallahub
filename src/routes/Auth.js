import express from 'express';
let app = express();
import fs from 'fs'
import { apiresponse } from '../utils/Api-response.js';
import { userinfo } from '../models/user.model.js';
import { errorresponse } from '../utils/Api-errorresponse.js';
import { checkmiddleware } from '../middlewares/check.js';
import { refresh_the_token } from '../middlewares/RefreshTheToken.js';
import { jwtverification } from '../middlewares/verifyuser.js';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadImage } from '../utils/cloudinary.js';
const { router } = app;
import path from 'path'

router.post('/',upload.fields([{name:"avatar",maxCount:1},{name:"icons",maxCount:1}]),(req, res) => {
  try {
const avatar= req?.files?.avatar?.[0].path
const icons= req?.files?.icons?.[0].path
console.dir(avatar);
console.log(icons);
    res.send(new apiresponse(200, '', 'name:"abhinnad'));
  } catch (e) {
    console.log(e);
   res.status(401).json(new errorresponse(e,'',401))
  }
});

router.get('/add', async (req, res) => {
  try {
    const newdata = new userinfo({});
    console.log(newdata.sample());
    await newdata.save();
    res.json(new apiresponse(200, newdata, 'the thing is pretty succesful'));
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.get('/getall', async (req, res) => {
  try {
    const value = await userinfo.find({});
    res.json(new apiresponse(200, value, 'the thing is pretty succesful'));
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});




router.get('/refreshtoken',jwtverification,refresh_the_token,(req,res,next)=>{
try{
res.status(200).json({token:"refreshed"})
}catch(e){

}
})



export { router };
