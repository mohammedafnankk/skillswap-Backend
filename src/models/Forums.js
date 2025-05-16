
import mongoose from "../config/db.js";

const ForumsSchema = mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username:String,
    avatar:String,
    question:String,
    answer:[{
        ans_user_id:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
        ans_avatar:String,
        ans_username:String,
        ans_answer:String,
    }]
})
const Forums = mongoose.model("forums",ForumsSchema)
export default Forums