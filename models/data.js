const mongoose = require ("mongoose")



const fromschema = new mongoose.Schema({
    userid:String,
    name:{
        type: String,
        required: true
    } ,
    age:Number
})
const formdata = mongoose.model("formdata", fromschema)

module.exports = formdata