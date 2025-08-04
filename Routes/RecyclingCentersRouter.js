// routes/recyclingCenterRoutes.js
import express from "express";
import {
  getAllCenters,
  createCenter,
  updateCenter,
  deleteCenter,
} from "../controllers/RecyclingCenterController.js";
import RecyclingCenter from "../Model/RecyclingCenter.js";
const CenterRouter = express.Router();

CenterRouter.get("/", getAllCenters);
CenterRouter.post("/", createCenter);
CenterRouter.put("/:id", updateCenter);
CenterRouter.delete("/:id", deleteCenter);

CenterRouter.get('/', async (req, res) => {
  try {
    const centers = await RecyclingCenter.find();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
});
CenterRouter.get('/nearby', async (req, res) => {
  const { lat, lng, distance = 10 } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: 'Missing coordinates' });

  try {
    const allCenters = await RecyclingCenter.find();


    // Calculate distance for each center
    const R = 6371; // Earth radius in KM

    const toRad = (val) => (val * Math.PI) / 180;

    const centersWithinDistance = allCenters.filter(center => {
      const dLat = toRad(center.coordinates.lat - lat);
      const dLng = toRad(center.coordinates.lng - lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat)) *
          Math.cos(toRad(center.coordinates.lat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;

      return d <= parseFloat(distance);
    });

    res.json(centersWithinDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error finding nearby centers' });
  }
});

// Add a new center
CenterRouter.post('/', async (req, res) => {
  try {
    const newCenter = new RecyclingCenter(req.body);
    await newCenter.save();
    res.status(201).json(newCenter);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create center' });
  }
});
CenterRouter.get('/test', (req, res) => {
  res.send('Router working!');
});



export default CenterRouter;
