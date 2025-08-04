import Reminder from '../Model/Reminder.js';
import Report from '../Model/Report.js';

export const remindAdmin = async (req, res) => {
  const { reportId, userId } = req.body;

  try {
    const existing = await Reminder.findOne({ reportId, userId });
    if (existing) return res.status(200).json({ message: 'Reminder already exists' });

    await Reminder.create({ reportId, userId });
    return res.status(201).json({ message: 'Reminder saved' });
  } catch (err) {
    return res.status(500).json({ message: 'Error saving reminder' });
  }
};

export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate('reportId')
      .populate('userId')
      .sort({ createdAt: -1 });
    
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reminders' });
  }
};

export const markReminderResolved = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      console.log("Reminder not found");
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Update the report status to completed
    const updatedReport = await Report.findByIdAndUpdate(
      reminder.reportId,
      { status: 'completed' },
      { new: true }
    );

    if (!updatedReport) {
      console.log("Report not found:", reminder.reportId);
      return res.status(404).json({ message: 'Related report not found' });
    }

    // Delete the reminder
    await Reminder.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Reminder resolved and report marked as completed.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to resolve reminder', error: err.message });
  }
};
