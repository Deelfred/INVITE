import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    attending: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RSVP = mongoose.model("RSVP", rsvpSchema);

export default RSVP;