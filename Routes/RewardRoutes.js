import express from "express";
import  VerifyAdmin  from "../Middleware/VerifyAdmin.js";
import {
  createReward,
  getUserRewardsOverview,
  getAllRewards,
  getRewardById,
  updateReward,
  deleteReward,
  redeemReward,
} from "../controllers/rewardController.js";

const rewardRouter = express.Router();

rewardRouter.post("/",VerifyAdmin, createReward);
rewardRouter.get("/overview/:userId", getUserRewardsOverview);
rewardRouter.get("/", getAllRewards);
rewardRouter.get("/:id", getRewardById);
rewardRouter.put("/:id",VerifyAdmin, updateReward);
rewardRouter.delete("/:id",VerifyAdmin,  deleteReward);
rewardRouter.post("/redeem", redeemReward);

export default rewardRouter;

