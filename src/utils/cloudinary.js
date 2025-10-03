import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
cloudinary.config({ 
  cloud_name: 'dwvjs0h95', 
  api_key: 773959335787321, 
  api_secret: 'UBpQstDBygSMHXL39sy5FdZBs_U'
});


// const upload = () =>{
//     cloudinary.v2.uploader.upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));
// }

export const uploadImage = async (imagePath) => {
   try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "posts", 
    });
    console.log("Uploaded: ", result.secure_url);
    fs.rmSync(imagePath)
    return result.secure_url;
  } catch (error) {
    const result = fs.rmSync(imagePath)
    console.error(error);
    return 'file removed'
  }
};