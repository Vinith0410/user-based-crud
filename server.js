const express = require("express")
const path = require("path")
const session = require("express-session")
require("dotenv").config()

const isloggedin = require("./middleware/auth.js")
const connectdb = require("./config/db.js")
const authrouter = require("./router/auth.js")
const datarouter = require("./router/data.js")

const app= express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(session({
    secret:"brightfutureacadmey",
    resave: false,
    saveUninitialized:false
}))

connectdb()

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authrouter)
app.use("/", datarouter)


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


app.listen(4000 , ()=>{
    console.log("server is running")
})