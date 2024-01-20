const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userMiddleware = require('../middleware/userMiddleware');
const User = require('../model/user'); // Make sure to import your User model

// Example route for updating user details
router.post('/updateUserDetails', userMiddleware, async (req, res) => {
    try {
        // Assuming that userMiddleware attaches the user object to the request
        const user = req.user;

        // Access the user's UserId
        const userId = user.UserId;

        // Other request parameters
        const { newFullName, newPhoto } = req.body;

        // Check if the user with userId exists
        const existingUser = await User.findOne({ UserId: userId });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        existingUser.FullName = newFullName || existingUser.FullName; // Update only if newFullName is provided
        
        // Assuming newPhoto is the file data (Buffer) or a file path, update accordingly
        existingUser.Photo = newPhoto || existingUser.Photo;

        await existingUser.save();

        return res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
