const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Cart = require("../models/cartModel.js");
const User = require("../models/userModel");



module.exports.createCart = catchAsyncErrors(async (req,res,next) => {
    req.body.userId = req.user.id;

    const cart = await Cart.create(req.body);
     res.status(201).json({
        success:true,
        cart
     })
    
})


module.exports.updateCart = catchAsyncErrors(async (req,res,next) => {
   
  try {
    const { userId, productId } = req.params; 
    const { quantity } = req.body;
    
  
    

    let cart = await Cart.findOne({ userId: userId }); // Find cart by userId

    if (!cart) {
        // If cart doesn't exist, create a new one with the item.
        cart = await Cart.create({
            userId: userId,
            
        });
        cart.cartproducts.push(req.body);
    } else {
        const itemIndex = cart.cartproducts.findIndex(item => item.productId == productId);
        
        if (itemIndex > -1) {
            // Update quantity if product already exists in cart
            const cartItem = cart.cartproducts[itemIndex];

            if (cartItem.stock < quantity) {
                return next(new ErrorHandler('Exceeds stock quantity', 400));
            }
            if (quantity == 0) {
                cart.cartproducts.splice(itemIndex, 1);  // Remove the item from cart
            } else {
                cart.cartproducts[itemIndex].quantity = quantity;
            }
        } else {
            // Add the product if it doesn't exist in the cart
            cart.cartproducts.push(req.body);
        }
    }

    await cart.save();

    res.status(200).json(cart.cartproducts);

} catch (err) {
    res.status(500).json(err);
}
});


/*module.exports.deleteCart = catchAsyncErrors(async (req,res,next) => {

  const cart = await Cart.findOneAndDelete({ userId: req.params.userId });
  if (!cart) {
   
      return next(new ErrorHandler('No cart found with this user ID', 404));
  }
  res.status(200).json({
      success: true,
      message: 'Cart deleted successfully'
  });

});*/


module.exports.getCart = catchAsyncErrors(async (req,res,next)=> {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        console.log(cart.cartproducts);
        res.status(200).json(cart.cartproducts);
      } catch (err) {
        res.status(500).json(err);
      }
});


