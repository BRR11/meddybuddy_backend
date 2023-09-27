const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
const User = require("../models/userModel");
 
//Admin Create Product
 module.exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
     
    req.body.user = req.user.id;

     const product = await Product.create(req.body);
     res.status(201).json({
        success:true,
        product
     })
    

 });

 //GET ALL PRODUCTS
 module.exports.getAllProducts = catchAsyncErrors(async (req,res,next)=>{
    
    const resultPerPage = 10;
    const productCount = await Product.countDocuments();
    const apifeatures = new Apifeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    console.log(req.query);
    const products = await apifeatures.query;

    res.status(200).json({
        success: true,
        products,
        resultPerPage,
        productCount
    })
});

//ADMIN UPDATE
module.exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if(!product)
    {

        return next(new Errorhandler("Product Does Not Exist",404));
       
    }


        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        
        });
        
        res.status(200).json({
            sucess:true,
            product
        })
});


//DELETE PRODUCT -- ADMIN
module.exports.deleteProduct = catchAsyncErrors(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if(!product)
    {

        return next(new Errorhandler("Product Does Not Exist",404));
       
    }

    await Product.deleteOne(product);
    res.status(200).json({

        success: true,
        message: "Product Removed Successfully"
    });
    
});


//GET PRODUCT DETAILS
module.exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
      const product = await Product.findById(req.params.id);

      
     

      if(!product)
      {
  
          return next(new Errorhandler("Product Does Not Exist",404));
         
      }
      res.status(200).json({
        success: true,
        product

      });
      
});



// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
   console.log(rating);
   console.log(comment);
   console.log(productId);
   
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    

    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }

     
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });