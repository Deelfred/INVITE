import express from "express";
import RSVP from "../models/Rsvp.js";

const router = express.Router();

// =========================
// SUBMIT RSVP
// =========================
router.post("/", async (req, res) => {
  try {
    const { name, phone, attending, guests, message } = req.body;

    if (!name || !phone || !attending || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required RSVP details.",
      });
    }

    const newRSVP = await RSVP.create({
      name,
      phone,
      attending,
      guests,
      message,
    });

    res.status(201).json({
      success: true,
      message: "RSVP submitted successfully.",
      rsvp: newRSVP,
    });
  } catch (error) {
    console.error("RSVP Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the RSVP.",
    });
  }
});

export default router;