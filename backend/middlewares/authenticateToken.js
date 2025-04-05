const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const jwtKey = process.env.SECRET_KEY;

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.sendStatus(401);
        jwt.verify(token.split(' ')[1], jwtKey, (err, user) => {
            if (err) return res.sendStatus(401);
            req.user = user;
            next();
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' })
        } else {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

};

module.exports = authenticateToken;