const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwttoken.js");


//register user
module.exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample public id",
        url: "sample url" ,
      },
    
    });
    
    sendToken(user,201,res);
    
  });

//Login User

 module.exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password)
    {

        return next(new ErrorHandler("Please Enter Email And Password",400));
    }

    const user = await  User.findOne({email}).select("+password");

    if(!user)
    {
        return next(new ErrorHandler("Invalid Email Or Password",401));
    }

    const isMatch =   await user.comparePassword(password);

    if(!isMatch)
    {
        return next(new ErrorHandler("Invalid Email Or Password",401));
    }


    sendToken(user,200,res);
    
 
});



//logout user
module.exports.logoutUser = catchAsyncErrors(async (req,res,next) => {

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({

        success:true,
        message:"Logged Out"
    })
});


//forgot password
module.exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {

    
    const user = await User.findOne({email : req.body.email});

    if(!user)
    {

        return next(new ErrorHandler("user not found",404));
    }   

    const resetToken = user.generateResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.host}/api/v1/password/reset/${resetToken}`;


    const message = `Your Password Reset Url IS : \n ${resetPasswordUrl} \n If You Have Not Requested This Service Please Ignore It`;
    try {
     
        await sendEmail({email: user.email,
            subject: `Ecommerce Password Recovery`,
            message});

        res.status(200).json({
            success:true,
            message: `Email Sent To ${user.email} successfully`
        })

    }catch(error){

        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined,

        await user.save({validateBeforeSave: false});
        
        return next(new ErrorHandler(error.message,500));
    }




});



// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  // Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });


  // update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  // update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
  
    
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      user
    });
  });

  // Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  
  // Get single user (admin)
  exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  // update User Role -- Admin
  exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });

  // Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
    
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });
  