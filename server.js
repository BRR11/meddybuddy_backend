const app = require("./app");
const dotenv = require("dotenv");
const Razorpay = require('razorpay');

const connectDB = require("../backend/config/database")

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

  //config
dotenv.config({path:"backend/config/config.env"});
connectDB();

const server = app.listen(process.env.PORT,()=>{


    console.log(`Server Is Working On https://localhost:${process.env.PORT}`);
});

module.exports.instance = new Razorpay({

  key_id: "rzp_test_zMIzLEfR2oKln6",
  key_secret: "ng4Sm0wfofLIY1Rj5F7d0r8r",
});


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });