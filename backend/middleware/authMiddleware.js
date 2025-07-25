import jwt from 'jsonwebtoken';
import Teacher from '../models/teacherModel.js';

export const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Teacher.findById(decoded.id).select("-Password");
    next();
  } catch (error) {
    console.error("JWT validation failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
