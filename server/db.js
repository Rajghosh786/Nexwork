const mongoose = require("mongoose")
require("dotenv").config()
const dns = require("node:dns");

dns.setServers(["1.1.1.1"]);

const connectingDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Db connected")
    } catch (error) {
        console.log("sorry cannot connnect to DB now",error)
    }
}

module.exports = {connectingDB}