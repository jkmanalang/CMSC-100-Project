const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// connect to to Mongo DB
// mongoose.connect(
//   "mongodb://localhost:27017/week11",
//   { useUnifiedTopology: true},
//   // useNewUrlParse: true, 
//   (err) => {
//     if(err) { console.log(err); }
//     else { console.log("Successfully connected to Mongo DB"); }
//   });

try {
  mongoose.connect("mongodb://localhost:27017/exer10db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, () => {
    console.log("MongoDB database connection established successfully");
  });
}catch (error){
  throw error;
}

// register User model with Mongoose
require("./models/user")
require("./models/posts")

// initialize the server
const app = express()
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieParser());

// allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
})

// declare routes
require("./routes")(app);

// start server
app.listen(3001, (err) => {
  if(err) { console.log(err); }
  else { console.log("Server listening at port 3001"); }
})





