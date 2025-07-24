import express from "express";
import {
  fetchCourses,
  addNewCourse,
  updateCourse,
  deleteCourse,
  fetchCourseById,
  removeStudentFromCourse,
} from "../controllers/courseController.js";

// Create a new router instance
// This router will handle all course-related routes
const courseRouter = express.Router();

// Define the routes for the courseRouter
// GET route to fetch all courses
courseRouter.get("/fetchcourses", fetchCourses);
// POST route to add a new course
courseRouter.post("/createcourse", addNewCourse);
// DELETE route to delete a course by ID
courseRouter.delete("/deletecourse/:id", deleteCourse);
// PUT route to update a course by ID
courseRouter.put("/updatecourse/:id", updateCourse);
//DELETE route to remove a student from a course by course ID and student ID
courseRouter.delete("/:courseId/student/:studentId", removeStudentFromCourse);
// GET route to fetch a course by ID
courseRouter.get("/:id", fetchCourseById);
export default courseRouter;
