import { configDotenv } from "dotenv";
configDotenv();
import User from "../models/User.js";
import Mentor from "../models/Mentor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import BlackList from "../models/Blacklist.js";
export const registerUser = async (req, res) => {
  const { username, email, password, role, joined_date } = req.body;
  try {
    let mentor = await Mentor.findOne({ email });
    let user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ err: "User already register!!" });
    }
    if (mentor) {
      return res.status(403).json({ err: "Mentor already registerd" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ err: "Password must be at least 6 characters" });
    }
    if (role === "Student") {
      user = new User({
        username,
        email,
        password,
        role,
        joined_date,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
    } else if (role === "Mentor") {
      mentor = new Mentor({
        username,
        email,
        password,
        role,
        joined_date,
      });
      const salt = await bcrypt.genSalt(10);
      mentor.password = await bcrypt.hash(password, salt);
      await mentor.save();
    }
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);
    // await user.save();
    res.status(200).json({ msg: "user register successfully!!!" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await Mentor.findOne({ email });
  }
  if (!user) {
    return res.status(500).json({ msg: "User not found in database" });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({user:req.body.email, id:user._id})
      const refreshToken = generateRefreshToken({user:req.body.email,id:user._id})
      res.json({accessToken:accessToken,refreshToken:refreshToken,id:user.id,skills:user.skills})

    } else {
      res.status(401).json({ err: "Password incorrect " });
    }
    // const payload = {
    //   user: {
    //     id: user.id,
    //   },
    // };

    // jwt.sign(
    //   payload,
    //   process.env.JWT_SECRET,
    //   { expiresIn: 3600 },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token: token, id: user._id, skills: user.skills });
    //   }
    // );

    // res.json({msg:"login successfully"})
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ err: error });
  }
};

function generateAccessToken (user){
  // console.log(user);
  
  return jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'5m'})
}

let refreshTokens=[]
function generateRefreshToken(user){
  // console.log(user);
  const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN,{expiresIn:'15m'})
  refreshTokens.push(refreshToken)
  return refreshToken
}

export const tokenRefresh = async(req,res)=>{
  try {
    
    if(!refreshTokens.includes(req.body.token)) return res.status(400).json({err:"Refresh token invalid"})
      refreshTokens = refreshTokens.filter((c)=> c!=req.body.token)
    
    
    const accessToken = generateAccessToken({user:req.body.email })
    const refreshToken = generateRefreshToken({user:req.body.email})
    res.json({accessToken:accessToken,refreshToken:refreshToken})
  } catch (error) {
    console.log("refresh error",error);
    
    res.json({err:error})
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await Mentor.findOne({ email });
    }
    if (!user) {
      res.json({ err: "User not found" });
    }
    // return res.status(200).json({user:user})

    // const payload = {
    //   user: {
    //     id: user.id,
    //   },
    // };
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1m",
    });
    const link = `https://skillswapskills.netlify.app/reset-password/${user._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    var mailOptions = {
      from: `SkillSwap Support ${process.env.EMAIL}`,
      to: email,
      subject: "Reset your password",
      html: `<div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h2>Hello 👋</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${link}" style="background: #4f46e5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration:none;">Reset Password</a>
        <p>If you didn’t request, you can ignore this email.</p>
        <p>Thanks,<br>SkillSwap Team</p>
      </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({ msg: "Email sent: " + info.response });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export const resetPassword = async (req, res) => {
  const id = req.params._id;
  const { token, newPassword } = req.body;
  try {
    // 1. Find user by token (you might store token temporarily)
    let user = await User.findOne({ _id: id });
    if (!user) {
      user = await Mentor.findOne({ _id: id });
    }
    if (!user) return res.status(400).json({ message: "User not found" });
   
    if(!token){
      return res.status(403).json({err:"No token found"})
    }
    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET)
              req.user = decoded.user
    } catch (error) {
      return res.status(401).json({error:'Token is invalid'})
    }
    // 2. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Save new password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async(req,res)=>{
  try {
    const {accessToken,refreshToken}= req.body
    let Access_token = await BlackList.findOne({access_token:accessToken})
    let Refresh_token = await BlackList.findOne({refresh_token:refreshToken})
    if(Access_token){
      return res.json({msg:"access_Token already blacklisted"})
    }
    if(Refresh_token){
      return res.json({msg:"refreshToken already blacklisted"})
    }

    Access_token = new BlackList({
      access_token:accessToken,
      refresh_token:refreshToken
    })
   await Access_token.save()
   res.json({msg : "tokens added"})
  } catch (error) {
    res.json({err:error})
    console.log(error);
    
  }
}

export default { registerUser, login, forgotPassword, resetPassword ,tokenRefresh,Logout};
