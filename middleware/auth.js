const isloggedin = (req, res, next)=>{

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

module.exports = isloggedin