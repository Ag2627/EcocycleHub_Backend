import Report from "../Model/Report.js";
import dotenv from 'dotenv';
import axios from "axios";
import User from "../Model/User.js";
import Transaction from "../Model/Transaction.js"; // for saving reward info

dotenv.config();

// Controller to create a new report
export const createReport = async (req, res) => {
  try {
    const {
      location, type, latitude, longitude, currentLocation,
      amount, address, imageUrl, userId
    } = req.body;

        if (!location || !type || !amount || !imageUrl || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }
         // 1. Create the report

        const newReport = new Report({
            userId,
            location,
            type,
            address,
            latitude,
            longitude,
            currentLocation,
            amount,
            imageUrl,
            createdAt: new Date(),
        });
        await User.findByIdAndUpdate(
      userId,
      { $inc: { reportsCount: 1 } },
      { new: true }
    );
        await newReport.save();

         // 2. Reward points (e.g., 10 points)
    const rewardPoints = 10;
    const rewardTransaction = new Transaction({
      userId,
      type: "earned",
      amount: rewardPoints,
      description: "Reward for submitting a report",
      createdAt: new Date()
    });

    await rewardTransaction.save();

    // 3. Respond
    res.status(201).json({
      message: "Report created successfully and points rewarded",
      report: newReport,
      transaction: rewardTransaction
    });

    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Controller to get all reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate("userId", "name").sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller to get a report by ID
export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller to get reports by user ID
export const getReportByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await Report.find({ userId });
        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: "No reports found for this user" });
        }
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller to delete a report by ID
export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByIdAndDelete(id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
            await User.findByIdAndUpdate(
        report.userId,
        { $inc: { reportsCount: -1 } },
        { new: true }
        );

        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Controller to update report status
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Status updated", report: updatedReport });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
