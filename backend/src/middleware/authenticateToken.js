const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', status: 'error' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { 
        if (err) {
            return res.status(403).json({ error: 'Forbidden', status: 'error' });
        }
        req.user = user; // Save the decoded user data in the request object
        next();
    });
};

module.exports = { authenticateToken };