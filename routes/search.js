const express = require('express');
const User = require('../model/user');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
// Search for users by UserId or FullName
router.get('/search', adminMiddleware, async (req, res) => {
    try {
        const { userId, fullName } = req.query;
        const query = {};

        if (userId) {
            query.UserId = userId;
        }

        if (fullName) {
            query.FullName = new RegExp(fullName, 'i'); // Case-insensitive search
        }

        const users = await User.find(query);

        if (users && users.length > 0) {
            // Exclude sensitive details like password if required
            const sanitizedUsers = users.map(user => ({
                FullName: user.FullName,
                UserId: user.UserId,
                Photo: user.Photo,
                ApprovalStatus:user.ApprovalStatus
                // Add more fields as needed
            }));
            res.status(200).json({ users: sanitizedUsers });
        } else {
            res.status(404).json({ error: 'No users found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
