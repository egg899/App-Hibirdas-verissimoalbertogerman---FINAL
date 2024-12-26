import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use the secret key from the environment variable
const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const getToken = req.headers.authorization;

    if (getToken) {
        // Extract token from the "Authorization" header (format: "Bearer <token>")
        const token = getToken.split(" ")[1];

        // Verify the token
        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                  return res.status(401).send("Token expired");
                }
                return res.status(401).send("Invalid token");
              }

            // Attach user information to the request object for downstream use
            req.user = { id: payload.id, email: payload.email };

            // Proceed to the next middleware or route handler
            next();
        });
    } else {
        // If no token is provided, return 403 Forbidden
        return res.status(403).send("No token provided");
    }
};

// Export the middleware function
export default authenticateToken;
