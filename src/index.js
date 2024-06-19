require('dotenv').config();
const connectDB = require("./db/index.js");
const app = require("./app.js")

connectDB()
.then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running at PORT ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB Connection failed");
})



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
