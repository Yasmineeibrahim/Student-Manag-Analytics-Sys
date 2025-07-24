import express from "express";
import {
  fetchGrades,
  addNewGrade,
  updateGrade,
  deleteGrade,
} from "../controllers/gradesController.js";

// Create a new router instance
// This router will handle all grade-related routes
const gradeRouter = express.Router();

//  GET route to fetch all grades
gradeRouter.get("/fetchgrades", fetchGrades);
// POST route to add a new grade
gradeRouter.post("/creategrades", addNewGrade);
// DELETE route to delete a grade by ID
gradeRouter.delete("/deletegrade/:id", deleteGrade);
// PUT route to update a grade by ID
gradeRouter.put("/updategrade/:id", updateGrade);

export default gradeRouter;
