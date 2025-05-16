import { configDotenv } from "dotenv";
configDotenv()
import express from "express";
import cors from 'cors'
import db from './src/config/db.js'
import authUser from "./src/routes/authRoute.js";
import middle from "./src/middleware/authmiddleware.js";
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import path from 'path'
import avatar from './src/controllers/avatar.js'
import Message from "./src/models/Message.js";
import User from "./src/models/User.js";
import Mentor from "./src/models/Mentor.js";

const PORT = process.env.PORT
const app = express()
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*",
  },
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/static", express.static(path.join(__dirname, "public")));
// const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(cors())
app.use(express.json())
app.use('/',authUser)
app.use('/avatarupload',avatar)
app.get('/protect',middle,(req,res)=>{
  // console.log("uu",req.user.id);
  
    res.json({msg:"protect",user:req.user})
})



app.get('/chat', (req, res) => {

    // res.sendFile(join(__dirname, '/public/index.html'));
  });


// SOCKET.IO
// const users ={}
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, text,time} = data;
     console.log(text);
     
    // Save to MongoDB
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      time,
    });

    await newMessage.save();

    // Emit to receiver
    socket.broadcast.emit('receive_message', newMessage);
  });

  // socket.on("login",async (userID)=>{
  //   console.log('a user ' + userID + " "+'online')
  //   users[socket.id]= userID
  //   let user = await User.findOneAndUpdate(userID,{ isOnline:true})
  //   if(!user){
  //     user= await Mentor.findOneAndUpdate(userID,{isOnline:true})
  //   }
  // })


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // delete users[socket.id]
  });
});

server.listen(PORT,
    console.log(`Server running on PORT ${PORT}`)
)
