const mongoose = require("mongoose");
const DB_NAME = require("../constants.js");


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://yatharthmishra2002:back2002@cluster0.yfev5t9.mongodb.net/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

module.exports = connectDB;