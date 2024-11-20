const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Fetch user data by ID
router.get("/fetch-user-data/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/update-profile/:userID", async (req, res) => {
  const { userID } = req.params;
  const { first_name, last_name, email, phone, address, birth_date } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userID, {
      first_name,
      last_name,
      email,
      phone,
      address,
      birth_date,
    }, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
