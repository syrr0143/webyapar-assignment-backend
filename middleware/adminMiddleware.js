
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');
require('dotenv').config();
const adminMiddleware = async (req, res, next) => {
    // get token from the request header
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token, no admin with such token found' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = adminMiddleware;
