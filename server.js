const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const session = require("express-session")
require("dotenv").config()

const app= express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(session({
    secret:"brightfutureacadmey",
    resave: false,
    saveUninitialized:false
}))

function isloggedin(req, res, next){
    if(req.session.user){
        next()
    }else{
        res.send(`
                <script>
                alert("login to view")
                window.location.href="/login"
                </script>
                `)
    }
}

mongoose.connect(process.env.mongodb_url)
.then(()=>{
    console.log("DB connected")
}).catch(err=> console.log("Connection error" , err))

const register = new mongoose.Schema({
    name:String,
    mail:String,
    password:String
})

const userdata = mongoose.model("userdata", register)

const fromschema = new mongoose.Schema({
    userid:String,
    name:{
        type: String,
        required: true
    } ,
    age:Number
})
const formdata = mongoose.model("formdata", fromschema)

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "./public/register.html"))
})
app.get("/login", (req,res)=>{
    res.sendFile(path.join(__dirname, "./public/login.html"))
})
app.get("/home", isloggedin, (req,res)=>{
    res.sendFile(path.join(__dirname , "./public/home.html"))
})

app.get("/read", isloggedin, (req,res)=>{
    res.sendFile(path.join(__dirname , "./public/read.html"))
})
app.get("/edit",isloggedin ,(req,res)=>{
    res.sendFile(path.join(__dirname , "./public/edit.html"))
})

app.post("/register", async(req,res)=>{
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

app.post("/login" , async(req,res)=>{
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

app.post("/submit", async(req,res)=>{

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

app.get("/data" , isloggedin, async(req,res)=>{
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
app.get("/read/:id" , isloggedin, async(req,res)=>{
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

app.post("/update" , isloggedin,  async(req,res) =>{
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

app.post("/delete/:id" , isloggedin ,async(req,res)=>{
   try{
     const id = req.params.id
    await formdata.findByIdAndDelete(id)
    // console.log(datas)
    res.send("data Delete")
   }catch(err){
    res.send("error on delete ")
   }
})

app.get("/logout" , (req,res)=>{
    req.session.destroy(()=>{
 res.send(`
                <script>
                alert("logout")
                window.location.href="/login"
                </script>
                `)
    })
})







app.listen(4000 , ()=>{
    console.log("server is running")
})