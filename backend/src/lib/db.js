import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Make sure process.env.MONGO_URI is used directly
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // exit process if DB fails
  }
};