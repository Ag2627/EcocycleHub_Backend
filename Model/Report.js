import mongoose from "mongoose";
import User from "./User.js";

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: String,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address:{
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [ "verified", "completed", "pending","failed"],
    default: "pending",
  },
  verificationResult: {
    wasteType: { type: String },
    quantity: { type: String },
    confidence: { type: Number },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", ReportSchema);

export default Report;
