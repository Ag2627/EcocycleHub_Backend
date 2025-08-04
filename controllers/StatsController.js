import Report from "../Model/Report.js";
import User from "../Model/User.js";

export const getStats =async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const completedReports = await Report.countDocuments({ status: "completed" });  
    
    res.json({
      stats: {
        totalUsers,
        totalReports,
        completedReports
      },
    });
  } catch (error) {
    console.error("Error in dashboard-stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}