const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required:true
          },
        cartproducts:[

          {
            productId: {
                type:String,
            },
            name:{
              type:String,
            },
            price:{
              type:Number,
            },
            image:{
              type:String,
            },
            stock:{
              type:Number,
            },

            quantity: {
                type:Number,
                default:1,
            }

          }  
        ]

    },
   
)

module.exports = mongoose.model("carts",CartSchema);
