import User from '../Model/User.js';

export const getAllUsers=async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
}

 