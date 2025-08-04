import Reward from "../Model/Reward.js";
import Transaction from "../Model/Transaction.js";

// Create a reward
export const createReward = async (req, res) => {
  try {
    const reward = new Reward(req.body);
    await reward.save();
    res.status(201).json(reward);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// reward overview
export const getUserRewardsOverview = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const rewards = await Reward.find({}); // Filter if needed
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    const balance = transactions.reduce((acc, txn) =>
      txn.type.startsWith('earned') ? acc + txn.amount : acc - txn.amount, 0
    );

    res.status(200).json({
      balance: Math.max(balance, 0),
      rewards,
      transactions
    });
  } catch (error) {
    console.error("Error fetching rewards overview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all rewards
export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single reward by ID
export const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a reward
export const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }
    res.json(reward);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a reward
export const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }
    res.json({ message: "Reward deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redeem a reward and create a transaction
export const redeemReward = async (req, res) => {
  const { userId, rewardId } = req.body;

  if (!userId || rewardId === undefined) {
    return res.status(400).json({ error: "userId and rewardId are required" });
  }

  try {
    // Get reward details
    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ error: "Reward not found" });

    const rewardCost = reward.cost;

    // Get user's transaction history to calculate balance
    const transactions = await Transaction.find({ userId });
    const balance = transactions.reduce((acc, txn) => {
      return txn.type.startsWith("earned") ? acc + txn.amount : acc - txn.amount;
    }, 0);

    // Check if user has enough points
    if (balance < rewardCost) {
      return res.status(400).json({ error: "Insufficient balance to redeem this reward" });
    }

    // Create a transaction for redemption
    const transaction = new Transaction({
      userId,
      type: "redeemed",
      amount: rewardCost,
      description: `Redeemed reward: ${reward.name}`,
    });

    await transaction.save();

    res.json({
      message: `Successfully redeemed reward: ${reward.name}`,
      transaction,
    });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    res.status(500).json({ error: error.message });
  }
};

