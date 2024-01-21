const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();
const user = require('../model/user');

router.delete('/deleteUser/:userId',adminMiddleware,async (req,res)=>{
    try {
        const admin = req.admin;
        const userId = req.params.userId;

        // Check if the admin is trying to delete a user in their own hostel
        const userToDelete = await user.findOne({ UserId: userId });

        if (!userToDelete) {
            return res.status(404).json({ error: 'User not found or unauthorized access' });
        }

        // Delete the user
        await User.findOneAndDelete({ UserId: userId });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})
module.exports= router;

