const express = require("express")
const formdata = require("../models/data")
const isloggedin = require("../middleware/auth")

const router = express.Router()

router.post("/submit",isloggedin, async(req,res)=>{

    const userid = req.session.user.id
    console.log(userid)
    const {username ,age} = req.body

    try{
        const newdata = new formdata({
        userid:userid,
        name:username,
        age:age
    })

    await newdata.save()
    res.send(`
            <script>
                alert("data stored")
                window.location.href="/read"
            </script>
        `)

    }catch(err){
        console.log(err)
        res.send("error on store")
    }

    
})

router.get("/data" , isloggedin, async(req,res)=>{
    try{
        const userid = req.session.user.id
        console.log(userid)
        const datas = await formdata.find({userid:userid})
    // console.log(datas)
    res.json(datas)
    }catch(err){
        console.log(err)
        res.send("error on read")
    }
    
})
router.get("/read/:id" , isloggedin, async(req,res)=>{
    try{
            const id = req.params.id
    const datas = await formdata.findById(id)
    // console.log(datas)
    res.json(datas)
    }catch(error){
        console.log(error)
        res.send("error read the data ")
    }
})

router.post("/update" , isloggedin,  async(req,res) =>{
    const {id, username, age} = req.body
    console.log(id , username, age)
    try{
          await  formdata.findByIdAndUpdate(
        id,
        {
            name:username,
            age:age
        }
    )
    res.send(`
            <script>
                alert("data updated")
                window.location.href="/read"
            </script>
        `)
    }
    catch(err){
        res.send("error on update")
    }
})

router.post("/delete/:id" , isloggedin ,async(req,res)=>{
   try{
     const id = req.params.id
    await formdata.findByIdAndDelete(id)
    // console.log(datas)
    res.send("data Delete")
   }catch(err){
    res.send("error on delete ")
   }
})


module.exports=router