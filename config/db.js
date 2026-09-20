const mongoose = require("mongoose")

const connectdb = async ()=>{
    try{
        await mongoose.connect(process.env.mongodb_url)
        console.log("DB Connected")
    }catch(err){
        console.log("errron on connection" , err)
    }
}

module.exports = connectdb