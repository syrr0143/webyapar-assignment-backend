const express = require('express');
const router = express.Router();
const User = require('../model/user'); // Make sure to import your User model
const adminMiddleware = require('../middleware/adminMiddleware')

// Example route for marking a user as done (approve)
router.patch('/markAsDone/:userId',adminMiddleware ,async (req, res) => {
    try {
        const admin = req.admin;
        

        // Access the user's UserId to be marked as done
        const userIdToApprove = req.params.userId;

        // Check if the user with userIdToApprove exists
        const userToApprove = await User.findOne({ UserId: userIdToApprove });

        if (!userToApprove) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's approval status to true
        userToApprove.ApprovalStatus = true;

        // Save the updated user details
        await userToApprove.save();

        return res.status(200).json({ message: 'User marked as done (approved) successfully', user: userToApprove });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
