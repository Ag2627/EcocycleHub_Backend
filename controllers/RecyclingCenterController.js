
import RecyclingCenter from "../Model/RecyclingCenter.js";

// Get all centers
export const getAllCenters = async (req, res) => {
  try {
    const centers = await RecyclingCenter.find();
    res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching centers", error });
  }
};

// Create center (optional)
export const createCenter = async (req, res) => {
  try {
    const center = new RecyclingCenter(req.body);
    await center.save();
    res.status(201).json(center);
  } catch (error) {
    res.status(500).json({ message: "Error creating center", error });
  }
};

// Update center
export const updateCenter = async (req, res) => {
  try {
    const updated = await RecyclingCenter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating center", error });
  }
};

// Delete center
export const deleteCenter = async (req, res) => {
  try {
    await RecyclingCenter.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Center deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting center", error });
  }
};
