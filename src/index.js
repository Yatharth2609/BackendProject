require('dotenv').config({path: './env'});
const connectDB = require("./db/index.js");

connectDB();



// const mongoose = require("mongoose");
// import { DB_NAME } from "./constants";
// const express = require("express");
// const app = express();

// ;( async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("Error: ", (error) => {
//       console.log("ERROR: ", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening onport ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error: ", error);
//     throw error;
//   }
// } )
