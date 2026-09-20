const express = require("express")
const bcrypt = require("bcrypt")

const userdata = require("../models/user.js")

const router = express.Router()

router.post("/register", async(req,res)=>{
    const {username, mail , password} = req.body
    // console.log(username , mail, password)
    try{
        const exist = await userdata.findOne({mail:mail})
        if(exist){
            return  res.send(`
                <script>
                alert("user already exist login plz")
                window.location.href="/login"
                </script>
                `)
        }
        // 1234 => igy42645ti@$#%3t5mklw463%
        const hash = await bcrypt.hash(password , 10)
        const newdata = new userdata({
            name:username,
            mail,
            password:hash
        })
        await newdata.save()

        res.send(`
                <script>
                alert("register completed Login plz")
                window.location.href="/login"
                </script>
                `)

    }catch(err){
        
        console.log(err)
        res.send("error on store")

    }
})

router.post("/login" , async(req,res)=>{
    const {mail, password} = req.body
    // console.log(mail, password)

    try{
        const exist = await userdata.findOne({mail})
        if(!exist){
            return res.send(`
                <script>
                alert("user not found ")
                window.location.href="/"
                </script>
                `)
        }
        console.log(exist.password)

        const match = await bcrypt.compare(password, exist.password)

        if(match){
            req.session.user={
                id:exist._id,
                name:exist.name,
                mail:exist.mail
            }
            res.send(`
                <script>
                alert("Login successfully")
                window.location.href="/home"
                </script>
                `)
        }else{
            res.send(`
                <script>
                alert("password wrong")
                window.location.href="/login"
                </script>
                `)
        }

    }catch(err){
        console.log(err)
        res.send("error on login")
    }

})


router.get("/logout" , (req,res)=>{
    req.session.destroy(()=>{
 res.send(`
                <script>
                alert("logout")
                window.location.href="/login"
                </script>
                `)
    })
})

module.exports = router