import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/healthz", (req, res) => {
  res.status(200).json({ message: "Server is running" });
}
);

const PORT = process.env.PORT || 7777;

app.listen(PORT,async () => {
  await connectDB();
  console.log("Server is listening on port", PORT);
});