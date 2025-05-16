import { configDotenv } from 'dotenv'
configDotenv()
import jwt from 'jsonwebtoken'

const middle = (req,res,next)=>{
    const authHeader= req.header('Authorization')
    if(!authHeader){
        return res.status(401).json({err:'no token found'})
    }
    const token = authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({error:'Not token found'})
    }
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN)
        // console.log("middle",decoded,"middle");
        
        req.user = decoded
        // console.log(decoded);
        
        next()
    } catch (error) {
        return res.status(401).json({error:'Token is invalid'})
        
    }
}
export default middle