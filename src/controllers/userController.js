import { configDotenv } from "dotenv";
configDotenv();
import axios from "axios";
import mongoose from "mongoose";
import multer from "multer";
import User from "../models/User.js";
import Mentor from "../models/Mentor.js";
import e from "express";
import Forums from "../models/Forums.js";


export const students = async (req, res) => {
  try {
    const allStudents = await User.find({ role: "student" });
    if (!allStudents) {
      return res.json({ msg: "No studens found!!" });
    }
    res.status(200).json({ allStudents: allStudents });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const mentors = async (req, res) => {
  try {
    const allMentors = await Mentor.find();
    if (!allMentors) {
      return res.json({ msg: "No mentors found" });
    }
    res.status(200).json({ allMentors: allMentors });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const singleMentor = async (req, res) => {
  try {
    const id = req.params._id;
    const mentor = await Mentor.findById({ _id: id });
    res.status(200).json({ mentor });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const edit = async (req, res) => {
  try {
    const id = req.params._id;
    const user = await User.findById({ _id: id });
    if (!user) {
      user = await Mentor.findById({ _id: id });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const personalInfo = async (req, res) => {
  const userId = req.params._id;
  try {
    let pInfo = await User.findByIdAndUpdate(userId, req.body);
    if (!pInfo) {
      pInfo = await Mentor.findByIdAndUpdate(userId, req.body);
    }
    console.log(pInfo);
    res.status(200).json({ msg: "information added" });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const topic = async (req, res) => {
  const id = req.params._id;
  try {
    const lessons = await Mentor.findByIdAndUpdate(id, req.body);
    res.json({ msg: lessons });
  } catch (error) {
    console.log(error);
  }
};
export const singleUser = async (req, res) => {
  try {
    const id = req.params._id;
    let singleUser = await User.findById({ _id: id });
    if (!singleUser) {
      singleUser = await Mentor.findById({ _id: id });
    }
    res.status(200).json({ msg: singleUser });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const sug = async (req, res) => {
  try {
    const id = req.params._id;
    const user = await User.findById({ _id: id });

    const requestData = {
      user_id: id,
      skills: user.skills,
    };
    // const groqResponse = await axios.post(
    //     process.env.GROQ_RECOMMENDATION_API,
    //     requestData,
    //     { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
    //   );
    //   console.log(groqResponse);

    //   return res.json(groqResponse.data);

    const skill = user.skills;
    // console.log(sk);

    const m = await Mentor.find({ role: "mentor" });
    // console.log(m);
    // m.map((item)=>(

    //     // console.log(item.skills)

    // ))

    // const filter = {role:"student"} ? { skills: { $in: sk } } : {};
    const ment = await Mentor.find({ skills: { $in: skill } });
    // const ment = await User.find(filter)

    res.json({ data: ment });
  } catch (error) {
    res.json({ err: error });
    console.log(error);
  }
};
// export const skillDetails = async (req,res)=>{
//     const {skillsdetails} = req.body
//     try {
//         let skillsAdd = await Mentor.findOne({skill_discription:skillsdetails})
//         skillsAdd =  await Mentor({
//             skill_discription:skillsdetails
//         })
//         await skillsAdd.save()
//     } catch (error) {
//         console.log(error);

//     }
// }

export const skillDelete = async (req, res) => {
  const id = req.params._id;
  try {
    let user = await User.findOneAndDelete(id, req.body);
    if (!user) {
      user = await Mentor.findOneAndDelete(id, req.body);
    }
    res.status(200).json({ msg: user });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params._id;
  try {
    let user = await User.findByIdAndDelete(id);
    if (!user) {
      user = await Mentor.findByIdAndDelete(id);
    }
    res.status(200).json({ msg: "user deleted" });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};


export const Chats = async (req, res) => {
  try {
    const id = req.params._id;
    let user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      user = await Mentor.findByIdAndUpdate(id, req.body);
    }
    if (!user) {
      return res.json({ msg: "User not found" });
    }
    res.status(200).json({ msg: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const myMentors = async (req, res) => {
  try {
    const idss = req.body;
    console.log(idss);

    // const {ObjectId}=mongoose.Types;
    const rawIds = [{ id: idss }];

    const ids = rawIds.map((obj) => obj.id);
    const mentors = await Mentor.find({
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    });
    res.status(200).json({ msg: mentors });
  } catch (error) {
    console.log(error);
  }
};
export const findS = async (req, res) => {
  // try {
  //     const ids= (req.body)
  //     const idds =  new mongoose.Types.ObjectId(ids)
  //     const id1 =new mongoose.Types.ObjectId('6810a99870a953c354fdc8ab');
  //     const id2 =new mongoose.Types.ObjectId('6810a9f870a953c354fdc8bd');
  //     const mentors = await Mentor.find({
  //         _id: { $in: [ids] }
  //       });
  //       res.status(200).json({msg:mentors})
  // } catch (error) {
  //     console.log(error);

  // }
  try {
    const ids = req.body.ids; // Example: ['661f5c1a77cccfb7e5a8b9d1', '661f5c1a77cccfb7e5a8b9d2']
    const role = req.body.role
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "ids must be an array" });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
   if(role ==="Student"){

     const  ment = await Mentor.find({ _id: { $in: objectIds } });
     res.status(200).json({ msg: ment });
   }else if(role === "Mentor"){
    const  stud = await User.find({ _id: { $in: objectIds } });
     res.status(200).json({ msg: stud });
   }

  } catch (error) {
    console.error("Error finding users by IDs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const forums = async (req,res)=>{
  
  try {
    const id = req.params._id
    const {username , avatar, question} = req.body;

    const response = await new Forums({
      userId:id,
      username:username,
      avatar:avatar,
      question:question,

    })
    await response.save()
    res.status(200).json({msg:response})
    
  } catch (error) {
    console.log(error);
    
  }
}

export const allQuestions = async (req,res)=>{
  try {
    const questions = await Forums.find()
    res.status(200).json({questions})
  } catch (error) {
    console.log(error);
    
  }
}

export const addAnswer = async (req,res)=>{
  try {
    const id = req.params._id
    const Addanswer = await Forums.findByIdAndUpdate(id,req.body)
    res.status(200).json({msg:"answer added",Addanswer})
  } catch (error) {
    console.log(error);
    
  }
}

export const deleteChatuser = async(req,res)=>{
  try {
    
    
  } catch (error) {
    
  }
}


export default {
  students,
  mentors,
  singleMentor,
  personalInfo,
  topic,
  singleUser,
  sug,
  edit,
  Chats,
  myMentors,
  findS,
  forums,
  addAnswer,
};
