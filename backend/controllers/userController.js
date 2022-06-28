const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken_repitivecode");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user
module.exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    // parameters for uploading media => path of media, options, callback function
    
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars", // make sure ki Cloudinary site par Media Library mein hamne avatars name ka folder bna rakha ho
        width: 150,
        crop: "scale",
    });

    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    // call the method of user i.e getJWTToken()
    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    // });
    sendToken(user, 201, res);
});

// Login User
module.exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
     const {email,password} = req.body;
     // checking if user has given password and email both
     if(!email || !password)
      { return next(new ErrorHandler("Please Enter Email & Password",400)); }
     
     // agar email & password dono provide kare hai to
     const user = await User.findOne({email}).select("+password");
     if(!user){
         return next(new ErrorHandler("Invalid email or password",401));
     }

     const isPasswordMatched = await user.comparePassword(password);

     if(!isPasswordMatched){
         return next(new ErrorHandler("Invalid email or password",401));
     }

    sendToken(user, 200, res);
})

// Logout User
module.exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });
})

// forgot password
module.exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
      const user = await User.findOne({email:req.body.email});
      if(!user)
       { return next(new ErrorHandler("User not found",404)); }
      
      // Get ResetPassword Token
      const resetToken = user.getResetPasswordToken(); //userSchema ke methods mein ye function hai
      await user.save({ validateBeforeSave: false });
    //   const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`;
    //   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;   // BE ka gethost rkha hai hamne 4000 & FE ham chla rahe hai 3000 par
    
      // temporary I add
      //const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;   // remove api/v1/
      const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
      const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
      
      try{
         await sendEmail({
             email: user.email,
             subject: `EcommerceShoppingApp Password Recovery`,
             message,
         });

         res.status(200).json({
             success: true,
             message: `Email sent to ${user.email} successfully`,
         });
      }
      catch(error){
          // sabse pehle user ke resetPasswordToken aur resetPasswordExpire dono ko hi undefined kar do
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          // ab is user ko save bhi karna padega
          await user.save({ validateBeforeSave: false });
          return next(new ErrorHandler(error.message, 500));
      }

});

// Reset Password
module.exports.resetPassword = catchAsyncErrors( async(req,res,next)=>{
     // creating token hash
     const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
     const user = await User.findOne({
         resetPasswordToken,
         resetPasswordExpire: { $gt: Date.now() },
     });
     if(!user){
         return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
     }   
     if(req.body.password !== req.body.confirmPassword){
         return next(new ErrorHandler("Password does not match",400));
     }

     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;

     await user.save();
     sendToken(user, 200, res);// reset hone ke baad login ho jayega
})

// Get User Detail
module.exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
});

// update user password
module.exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
     const user = await User.findById(req.user.id).select("+password");
     const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
     if(!isPasswordMatched){
         return next(new ErrorHandler("old password is incorrect", 400));
     }
     if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password doesn't match", 400));
     }
     user.password = req.body.newPassword;
     await user.save();

     sendToken(user, 200, res);
});

// update user Profile
module.exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    // we will add cloudinary later
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars", // make sure ki Cloudinary site par Media Library mein hamne avatars name ka folder bna rakha ho
            width: 150,
            crop: "scale",
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `${user.name}'s Profile updated Successfully`,
    })
});

// Get All Users (admin): Admin can see how many users are their on website
module.exports.getAllUsers = catchAsyncErrors(async(req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});

// Get single user (admin) -> get any user details
module.exports.getSingleUser = catchAsyncErrors( async(req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user,
    });
});

// update any user ka Role by-- admin
module.exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    
    // na bhi likhe to bhi chalega
    /* if(!user){
         return next(new ErrorHandler(`User does not exist with Id: ${req.params,id}`,400));
     } */

    res.status(200).json({
        success: true,
        message: `${user.name}'s Role updated Successfully`,
    })
});

// Delete any user -- Admin
module.exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.params.id);
    // we will remove cloudinary later
    
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`));
    }
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    
    await user.remove();

    res.status(200).json({
        success: true,
        message: "user deleted Successfully"
    })
});