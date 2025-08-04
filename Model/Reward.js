import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String, // Optional: if you're using images
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;

