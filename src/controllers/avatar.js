import multer from "multer";
import express from "express";
import Mentor from "../models/Mentor.js";
import User from "../models/User.js";
const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cd) {
      cd(null, "./public/uploads");
    },
    filename: function (req, file, cd) {
      cd(null, file.originalname);
    },

  });
  const fileFilter =(req,file,cd)=>{
       const allowedTypes =["image/jpeg","image/png"]
       if(allowedTypes.includes(file.mimetype)){
        cd(null,true)
       }else{
        cd(new Error("Invalid file type. Only JPG, PNG are allowed."),false)
       }
  }
  const upload = multer({ storage,fileFilter });
  router.post("/", upload.single("avatar"), async (req, res) => {
    // const id = (req.params._id)
    // let user = await Mentor.findByIdAndUpdate({_id:id})
    // if(!user){
    //     user = await User.findByIdAndUpdate({_id:id})
    // }
    const avatar = req.file.filename;
    console.log(req.file);
    try {
      res
        .status(200)
        .json({
          msg: "avatar uploaded",
          imageUrl: `http://localhost:8020/static/uploads/${avatar}`,
        });
        //  await new 
    } catch (error) {
      res.status(500).json({ err: error });
    }
  });
  export default router