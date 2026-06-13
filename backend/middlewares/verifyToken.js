import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from cookie or header
      const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Please login first" });
      }

      // Decode token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Role check
      if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "You are not authorized" });
      }

      // Attach user info
      req.user = decodedToken;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
