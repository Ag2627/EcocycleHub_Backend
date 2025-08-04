import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

    if (token == null) {
        req.user = null; // No token provided
        return next(); // Continue, checkAuthentication will handle it
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            req.user = null; // Token invalid (e.g., expired, malformed)
        } else {
            req.user = userPayload; // Token valid, payload is { userId, email, role }
            req.token = token; // Pass the token along if needed
        }
        next();
    });
};

