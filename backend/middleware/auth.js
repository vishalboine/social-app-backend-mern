const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token){
            res.status(401).json({
                success: false,
                message: "Please login first to post"
            })
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN);
        req.user = await User.findById(decodedToken._id);

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}