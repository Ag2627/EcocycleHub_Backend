import express from "express";
import { 
    createReport, 
    getAllReports, 
    getReportById, 
    deleteReport,
    getReportByUserId,
    updateReportStatus,
    // verifyWaste 
} from "../controllers/ReportController.js";
import { getStats } from "../controllers/StatsController.js";

const Reportrouter = express.Router();

// Route to create a new report
Reportrouter.post("/create", createReport);

// Route to get stats
Reportrouter.get("/dashboard-stats",getStats)
// Route to get all reports
Reportrouter.get("/all", getAllReports);
Reportrouter.put("/status/:id", updateReportStatus);

// Route to get a specific report by ID
Reportrouter.get("/:id", getReportById);
Reportrouter.get("/user/:userId", getReportByUserId);

// Route to delete a report by ID
Reportrouter.delete("/:id", deleteReport);

export default Reportrouter;
