const mongoose = require("mongoose");
const dotenv = require("dotenv");



const connectDB = ()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`mongodb is connected With Server: ${data.connection.host}`);
    }).catch((err)=>{
    
        console.log(err);
    })

}

module.exports = connectDB;