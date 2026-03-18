import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import cors from "cors";

import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { app, httpServer } from "./lib/socket.js";

// Fix dotenv path so it loads .env from backend/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

// Debug check
console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGO_URI ? "Found" : "Undefined");

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend port
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve production build
if (process.env.NODE_ENV === "production") {
  const distPath = join(__dirname, "../../frontend/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

// Connect MongoDB first, then start server
const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("Server is running on port:", PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });