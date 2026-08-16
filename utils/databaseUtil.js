const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/airbnb");
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

module.exports = connectDB;