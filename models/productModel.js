const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    name:{

        type:String,
        required:[true,"Please Enter The Product Name"],
        trim:true
    },
    product_highlights:{
       
      type:String
    },
    key_information:{

        type:String,
        required:[true,"please Enter The Product Description"]
    },
    key_ingredients:{
      type:String
    },

    price:{
        type:Number,
        required:[true,"Please Enter The Product Price"],
        maxlength:[8,"Price Cannot Exceed 8 Characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[

        {
           
            type:String
        }
        
    ],

   
    
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"please Enter Product Stock"],
        maxlength:[4,"stock cannot exceed more than 4 characters"]
    },
    
    quantityof:{
      type:String

    },
    numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
           type: mongoose.Schema.ObjectId,
           ref: "User",
           required: true,

          },
          
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],

      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },

});
module.exports = mongoose.model("products",productSchema);
