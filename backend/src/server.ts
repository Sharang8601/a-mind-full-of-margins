import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import apiRouter from "./routes/api";

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// CORS Configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api", apiRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

import mongoose from "mongoose";

// Database connection & Server initialization
const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });

    // Graceful shutdown handling for Docker / Render deployments
    const gracefulShutdown = () => {
      console.log("Received kill signal, shutting down gracefully...");
      server.close(async () => {
        console.log("Closed out remaining HTTP connections.");
        try {
          if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("MongoDB connection closed.");
          }
          process.exit(0);
        } catch (err) {
          console.error("Error during MongoDB disconnection", err);
          process.exit(1);
        }
      });

      // Force shutdown after 10s if connections are hanging
      setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals from Render or Docker
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

  } catch (error) {
    console.error("Failed to start server due to DB connection failure:", error);
    process.exit(1);
  }
};

startServer();
