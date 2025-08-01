import jwt from 'jsonwebtoken';
import Teacher from '../models/teacherModel.js';
import Student from '../models/studentModel.js';

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
    
    // Try to find user in both Teacher and Student models
    let user = await Teacher.findById(decoded.id).select("-Password");
    if (!user) {
      user = await Student.findById(decoded.id).select("-Password");
    }

    if (!user) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }

    req.user = user;
    req.userType = user.constructor.modelName.toLowerCase(); // 'teacher' or 'student'
    next();
  } catch (error) {
    console.error("JWT validation failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to restrict routes to teachers only
export const teacherOnly = (req, res, next) => {
  if (req.userType !== 'teacher') {
    return res.status(403).json({ message: "Access denied. Teachers only." });
  }
  next();
};

// Middleware to restrict routes to students only
export const studentOnly = (req, res, next) => {
  if (req.userType !== 'student') {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};
