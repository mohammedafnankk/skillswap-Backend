import { configDotenv } from "dotenv";
configDotenv()

import mongoose from "mongoose";
const MONGO_URI= process.env.MONGO_URI || 5000
mongoose.connect(MONGO_URI,{

}).then((res)=>console.log('MongoDB connected successfull!!'))
.catch((err)=>console.log("Mongo error ",err))

export default mongoose