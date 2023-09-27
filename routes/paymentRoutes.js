const express = require("express");


const router = express.Router();
const {isAuthenticatedUser} = require("../middleware/auth");
const {processPayment,paymentVerification} = require("../controllers/paymentController");

router.route("/payment").post(isAuthenticatedUser, processPayment);
router.route("/paymentverification").post(paymentVerification);



module.exports = router;