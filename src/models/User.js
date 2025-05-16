import db from '../config/db.js'

const UserSchema = db.Schema({
    username:String,
    email:String,
    password:String,
    role:String,
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
    joined_date: String,
    isOnline:{
        type:Boolean,
        default:false
    }
    

})
const User = db.model('users',UserSchema)
export default User