import mongoose from "mongoose";

const centerSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  hours: String,
  distance: Number,
  accepts: [String],
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const RecyclingCenter = mongoose.model('RecyclingCenter', centerSchema);
export default RecyclingCenter;
