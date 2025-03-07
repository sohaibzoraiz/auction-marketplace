// File Path: middleware/authMiddleware.js

const jwt = require ('jsonwebtoken');
require ('dotenv') .config ();

const authMiddleware = async (req, res, next) => {
   /* const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // Set req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }*/
   // Moving to cookies from headers
   const token = req.cookies.accessToken;
    if (!token) {
         return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set req.user
        next();
    } 
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
};


module.exports=authMiddleware;
