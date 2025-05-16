import express from "express";
import { registerUser, login, forgotPassword, resetPassword, tokenRefresh, Logout } from "../controllers/authController.js";
import {
  students,
  mentors,
  singleMentor,
  personalInfo,
  singleUser,
  sug,
  topic,
  edit,
  skillDelete,
  deleteUser,
  Chats,
  myMentors,
  findS,
  forums,
  allQuestions,
  addAnswer,
} from "../controllers/userController.js";
import multer from "multer";
import middle from "../middleware/authmiddleware.js";
import { createMessage, getMessage, notification } from "../controllers/chatController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post('/refresh-token',tokenRefresh)
router.post("/forgot-password",forgotPassword)
router.patch("/reset-password/:_id/:token",resetPassword)
router.get("/allstudents",middle, students);
router.get("/allmentors",middle, mentors);
router.get("/mentor/:_id",middle, singleMentor);
router.patch("/personalinfo/:_id", personalInfo);
router.patch("/topic/:_id", topic);
router.get("/singleuser/:_id",middle, singleUser);
router.get("/user/:_id",middle, edit);
router.delete("/deleteskill/:_id",middle, skillDelete);
router.delete("/deleteuser/:_id",middle, deleteUser);
router.get("/sug/:_id",middle, sug);
router.post('/send',createMessage)
router.get('/get',getMessage)
router.patch('/add-chat/:_id',Chats)
router.get('/my-mentors',middle,myMentors)
router.post('/me',findS)
router.post('/logout',Logout)
router.get('/notification/:_id',middle,notification)
router.post('/add-new-question/:_id',forums)
router.get('/all-questions',allQuestions)
router.patch('/add-answer/:_id',addAnswer)

export default router;
