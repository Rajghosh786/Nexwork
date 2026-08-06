const express = require("express")
const app = express()
const { connectingDB } = require("./db");
// const { userRoute } = require("./routes/user.route");
// const { todoRoute } = require("./routes/todo.route");
require("dotenv").config()
app.use(express.json())

connectingDB()


// app.use("/user",userRoute)
// app.use("/todo",todoRoute)


app.use((req,res)=>{
    res.status(404).json({msg:"This request is not found"})
})

port = process.env.port || 8000
app.listen(port,()=>{
    console.log(`server started on ${port} port`)
})