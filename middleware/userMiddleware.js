const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Adjust the model import based on your actual model
require('dotenv').config();

const userMiddleware = async (req, res, next) => {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if the token is present or not
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // Check if the decoded token has the expected format
        if (!decoded || !decoded.UserId) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        // Find the user based on the decoded jwt token
        const foundUser = await User.findById(decoded.UserId);

        if (!foundUser) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token, user not found' });
        }

        // Set the user details in the req object
        req.user = foundUser;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token Verification error:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = userMiddleware;
