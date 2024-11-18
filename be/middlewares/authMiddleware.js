const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = {
    verifyUser
};


// module.exports = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'Token is required' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
//         req.body.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, message: 'Invalid token' });
//     }
// };
