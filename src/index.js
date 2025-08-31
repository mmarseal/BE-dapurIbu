import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();

// Connect to database with error handling
connectDB().catch((err) => {
  console.error("Database connection failed:", err);
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Test routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DapurIbu API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    status: "success",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "DapurIbu API endpoint",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/recipe",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: "connected",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipe", recipeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

export default app;
