import db from '../config/db.js'

const MentorSchema = db.Schema({
    username:String,
    email:String,
    password:String,
    role:String,
    company:String,
    education:String,
    website:String,
    bio:String,
    level:String,
    avatar:String,
    chats:[{ type: db.Schema.Types.ObjectId, ref: "User" },],
    rememberme:{
        type:Boolean,
        default:false
    },
    address:[
        {
            street:String,
            state:String,
            city:String,
            pincode:Number,
            country:String
        }
    ],
    skills:[],
    skill_discription:String,
    joined_date: String,
    isOnline:{
        type:Boolean,
        default:false
    }


})
const Mentor = db.model('mentors',MentorSchema)
export default Mentor