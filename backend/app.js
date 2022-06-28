const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");

const errorMiddleware = require("./middleware/error");

// Config
// dotenv.config({ path: "backend/config/config.env" });
if(process.env.NODE_ENV!=="PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// Route imports : in app.js file import all the routes
const product = require("./routes/productRoute"); //productRoute
const user = require("./routes/userRoute");  // userRoute
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product); // ye string pehle append hogi uske baad mein lagega kuch bhi
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1",payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

// koi sa bhi url ho ham sirf index.html file send karenge
app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;