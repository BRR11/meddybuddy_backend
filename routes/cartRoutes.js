const express = require("express");
const { createCart,updateCart,getCart } = require("../controllers/cartControllers");
const router = express.Router();
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth.js");

router.route("/cart/new").post( isAuthenticatedUser,createCart);
router.route("/cart/:userId").get(getCart);
router.route("/cart/:userId/product/:productId").put( isAuthenticatedUser,updateCart);
module.exports = router;
