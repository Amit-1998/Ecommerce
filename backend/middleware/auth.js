const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.isAuthenticatedUser = catchAsyncErrors( async (req,res,next)=>{
    const { token } = req.cookies; // login ke time par hamne cookie mein token ko store kra the
    // console.log(token);
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource",401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);
    req.user = await User.findById(decodedData.id); // jab tak user login rahega, tab tak req mein se user ka data access kar sakte hai
    next();
});

module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`));
        }
        next(); // skip & call the next()
    };
}