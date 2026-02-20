import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.routes.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "https://giscc.vercel.app","http://localhost:5174","https://giscc-admin.vercel.app"],
  credentials: true,
  methods: ["GET", "POST","PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/admin", apiLimiter, adminRouter);
app.get("/api/healthz", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 7777;

const startServer = async () => {
  if (!process.env.JWT_KEY) {
    console.error("FATAL: JWT_KEY environment variable is not set");
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => {
    console.log("Server is listening on port", PORT);
  });
};

startServer();