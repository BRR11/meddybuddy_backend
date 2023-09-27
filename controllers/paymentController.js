const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Razorpay = require('razorpay');
const crypto = require('crypto');



var instance = new Razorpay({ key_id: "rzp_test_zMIzLEfR2oKln6", key_secret:  "ng4Sm0wfofLIY1Rj5F7d0r8r" })




module.exports.processPayment = catchAsyncErrors(async (req,res,next) => {
  
    
    const options = {
        amount: Number(req.body.totalPrice)*100,  // amount in the smallest currency unit
        currency: "INR",
      };

      
    
      
     const paymentorder = await instance.orders.create(options);
    console.log(paymentorder);
   
     res.status(200).json({
        success:true,
        paymentorder,
     });
        
});

module.exports.paymentVerification = catchAsyncErrors(async (req, res,next) => {
    const { razorpay_payment_id,razorpay_order_id, razorpay_signature } =
      req.body;
     /* console.log(req.body);
    
  
    const body = razorpay_payment_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256","9bZukGc6VjYVF7gyt4JXA9Bh")
      .update(body.toString())
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log(expectedSignature);
    console.log(razorpay_signature);*/
    if (razorpay_payment_id) {
        res.redirect(
            `http://localhost:3000/ordersuccessfull?reference=${razorpay_payment_id}`
          );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  });