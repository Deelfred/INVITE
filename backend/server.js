import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rsvpRoutes from "./routes/rsvpRoutes.js";

dotenv.config();

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// =========================
// ROUTES
// =========================
app.get("/", (req, res) => {
  res.json({
    message: "Alfred & Pearl Wedding RSVP API is running",
  });
});

app.use("/api/rsvp", rsvpRoutes);

// =========================
// DATABASE
// =========================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on port ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });