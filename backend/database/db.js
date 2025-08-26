import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbconnection=async()=>{
    try {
        const db=process.env.MONGODB_URI;
        const connection=await mongoose.connect(db);
        if (connection) console.log("MongoDB connected...");
        else console.log("MongoDB connection error...")
    } catch (error) {
        console.log("error in dbconnection",error);
    }
} 
export default dbconnection