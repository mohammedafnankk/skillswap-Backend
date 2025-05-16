import db from '../config/db.js'

const BlackListSchema = db.Schema({
    access_token:String,
    refresh_token:String
})
const BlackList = db.model('blackList',BlackListSchema)
export default BlackList;