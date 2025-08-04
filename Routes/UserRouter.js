import express from "express";
import { getAllUsers } from "../controllers/UserController.js";
const UserRouter = express.Router();
UserRouter.get('/',getAllUsers);

export default UserRouter;
