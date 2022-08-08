const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Product -- admin
// module.exports.createProduct = async(req,res,next)=>{
//     const product = await Product.create(req.body);
//     res.status(201).json({
//         success: true,
//         product
//     })
// }

// Create Product -- admin
module.exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    try {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images); // yha par req.body mein system se aa rhi hai images
    } else {
      images = req.body.images;
    }
    // console.log(images);
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
        maxFileSize: 3000,
      });
     
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    // cloudinary pAR ja chuki hai images
    // imagesLink mein images clodinary se aa rhi hai
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
  
    
        const product = await Product.create(req.body);
        console.log(product);

        res.status(201).json({
        success: true,
        product,
        });
    }
    catch(error) {
        console.log(error.message);
    }
  });
  


// module.exports.getAllProducts = (req,res)=>{
//     res.status(200).json({
//         message: "Route is working fine"
//     })
// }

// Get all the products
module.exports.getAllProducts = catchAsyncErrors(async(req,res)=>{
    // return next(new ErrorHandler("This is my temp error",500));
    let resultPerPage = 4;
    const productsCount = await Product.countDocuments();
    console.log("------------");
    console.log(req.query);
    
    const apiFeature = new ApiFeatures(Product.find(),req.query)
       .search()
       .filter()
       //.pagination(resultPerPage); 
       
       let products = await apiFeature.query;
       let filteredProductsCount = products.length; // jo bhi filter lgane hai uska pehle count nikal liya than us par pagination lga do
       apiFeature.pagination(resultPerPage);

    // const products = await Product.find(); // gives all products // now we will not use Product.find()
    //Now after using apiFeature
    // console.log(apiFeature.query);
    products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});

// Get all products (Admin)
module.exports.getAdminProducts = catchAsyncErrors(async(req,res)=>{
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//Get Single Product OR
// Get product details
module.exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        // return res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product,
        
    });
});

// update the product -- admin
module.exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
      let product = await Product.findById(req.params.id);
      if(!product){
        return next(new ErrorHandler("Product not found",404));
      }
      // product mil gya
      // Images start here
      let images = [];
  
       if (typeof req.body.images === "string") {
          images.push(req.body.images); // yha par req.body mein system se aa rhi hai images
       } else {
          images = req.body.images;
       }

       // sabse pehle to oldImages ko delete karo
       if(images !== undefined) { // means images mein kuch hai
           // Deleting images from Cloudinary
           for(let i=0; i<product.images.length; i++) {
              await cloudinary.v2.uploader.destroy(product.images[i].public_id); // result mein store na bhi karaye to bhi chalega
           }

         // nyi images ko update karo  
         const imagesLinks = [];
  
         for(let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                            folder: "products",
                          });
     
            imagesLinks.push({
                 public_id: result.public_id,
                 url: result.secure_url,
            });
          }
          req.body.images = imagesLinks;
       }

      product = await Product.findByIdAndUpdate(req.params.id,req.body,{
          new:true,
          runValidators:true,
          useFindAndModify:false
      });

      res.status(200).json({
          success: true,
          product
      })
});

// Delete Product -- admin
module.exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    // product milne ke baad
    // Deleting the images of that product from cloudinary
    for(let i=0; i<product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id); // result mein store na bhi karaye to bhi chalega
    }

    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    });
});

// Create New Review or Update the Review
module.exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find((rev)=>
        rev.user.toString() === req.user._id.toString()
    );
    
    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),
                (rev.comment = comment);
            
        });
    }
    else{
        product.reviews.push(review); 
        product.noOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
         avg += rev.rating;
    });
    
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });
});

// Get all reviews of a product
module.exports.getProductReviews = catchAsyncErrors( async(req,res,next)=>{
     const product = await Product.findById(req.query.id);
     if(!product){
         return next(new ErrorHandler("Product not found", 404));
     }

     res.status(200).json({
         success: true,
         reviews: product.reviews
     })
});

// Delete Review
module.exports.deleteReview = catchAsyncErrors(async (req,res,next)=>{
     const product = await Product.findById(req.query.productId);

     if(!product){
         return next(new ErrorHandler("Product not found", 404));
     }
     
     const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
     
     let avg = 0;
     reviews.forEach((rev) => {
         avg += rev.rating;
     });

    let ratings = 0;
    if(reviews.length == 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }
    
    // Error -> Resource not found due to this problem
    // console.log(avg); --> 0
    // console.log(reviews.length); --> 0
    // console.log(ratings); --> NaN

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {reviews,ratings,numOfReviews}, {new: true, runValidators: true, useFindAndModify: false});

     res.status(200).json({
         success: true,
     });

})