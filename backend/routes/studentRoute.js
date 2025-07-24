import express from "express";
import {
  fetchStudents,
  addNewStudent,
  updateStudent,
  deleteStudents,
  fetchStudentById,
} from "../controllers/studentController.js";
import { fetchStudentCourses } from "../controllers/studentController.js";
import { fetchStudentGpaHistory } from "../controllers/studentController.js";

// Create a new router instance
// This router will handle all student-related routes
const router = express.Router();

// GET route to fetch all students
router.get("/fetchstudents", fetchStudents);
// GET route to fetch a student by ID
router.get("/:id", fetchStudentById);
// POST route to add a new student
router.post("/createstudents", addNewStudent);
// PUT route to update a student by ID
router.put("/updatestudents/:id", updateStudent);
// DELETE route to delete a student by ID
router.delete("/deletestudents/:id", deleteStudents);
// GET route to fetch courses for a specific student and GPA history
router.get("/:id/courses", fetchStudentCourses);
router.get("/:id/gpahistory", fetchStudentGpaHistory);

export default router;
