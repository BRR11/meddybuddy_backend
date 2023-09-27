const User = require("../models/userModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");

const jwt = require("jsonwebtoken")

module.exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next) => {
   
     const {token} =  req.cookies;
    
    
     if(!token)
     {

        return next(new Errorhandler("Please Login To Access This Resource",401));
     
     }

     const decodedData = jwt.verify(token,process.env.JWTSECRET);



     
     req.user = await User.findById(decodedData.id);
     next();

     
});



exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new Errorhandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    }
};