import express from 'express';
import { getReminders, markReminderResolved, remindAdmin } from '../controllers/ReminderController.js';


const Remindrouter = express.Router();

Remindrouter.post('/', remindAdmin);
Remindrouter.get('/', getReminders);
Remindrouter.patch('/:id/resolve', markReminderResolved);

export default Remindrouter;
