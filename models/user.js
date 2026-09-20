const mongoose = require("mongoose")

const register = new mongoose.Schema({
    name:String,
    mail:String,
    password:String
})

const userdata = mongoose.model("userdata", register)

module.exports = userdata