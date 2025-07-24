import express from "express";
import {
  fetchTeachers,
  deleteTeachers,
  updateTeacher,
  addNewTeacher,
  fetchTeacherById,
} from "../controllers/teacherController.js";

// Create a new router instance
// This router will handle all teacher-related routes
const teacherrouter = express.Router();

// GET route to fetch all teachers
teacherrouter.get("/fetchteachers", fetchTeachers);
// POST route to add a new teacher
teacherrouter.post("/createteachers", addNewTeacher);
// PUT route to update a teacher by ID
teacherrouter.put("/updateteacher/:id", updateTeacher);
// DELETE route to delete a teacher by ID
teacherrouter.delete("/deleteteacher/:id", deleteTeachers);
// GET route to fetch a teacher by ID
teacherrouter.get("/:id", fetchTeacherById);

export default teacherrouter;
