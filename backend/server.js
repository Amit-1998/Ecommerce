const app = require("./app");
// const dotenv = require("dotenv"); 
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

//config
// dotenv.config({ path:"backend/config/config.env" });
if(process.env.NODE_ENV!=="PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}
// connecting to database
connectDatabase();
// After connecting to database
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server is listening on http://localhost:${process.env.PORT}`);
});

// console.log(youtube);

// mongo vaale link galat hone ke kaaran
// Unhandled Promise Rejections
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });
});