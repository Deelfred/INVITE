import express from "express";
import RSVP from "../models/Rsvp.js";

const router = express.Router();

// GET ALL RSVPs
// GET /api/rsvp
router.get("/", async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: rsvps.length,
      rsvps,
    });
  } catch (error) {
    console.error("Get RSVPs Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching RSVPs.",
    });
  }
});

// SUBMIT RSVP
// POST /api/rsvp
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      attending,
      guests,
      message,
    } = req.body;

    // Check required fields
    if (!name || !phone || !attending || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required RSVP details.",
      });
    }

    // Create RSVP
    const newRSVP = await RSVP.create({
      name: name.trim(),
      phone: phone.trim(),
      attending,
      guests,
      message: message ? message.trim() : "",
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

// DELETE RSVP
// DELETE /api/rsvp/:id
router.delete("/:id", async (req, res) => {
  try {
    const rsvp = await RSVP.findByIdAndDelete(req.params.id);

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: "RSVP not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "RSVP deleted successfully.",
    });
  } catch (error) {
    console.error("Delete RSVP Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the RSVP.",
    });
  }
});

export default router;