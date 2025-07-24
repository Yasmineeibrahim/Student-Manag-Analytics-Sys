import Grade from "../models/gradeModel.js";
import Course from "../models/courseModel.js";
import Student from "../models/studentModel.js";
//delete grade using grade id from grades collection
export const deleteGrade = async (req, res) => {
  try {
    const id = req.params.id;
    const gradeExists = await Grade.findById({ _id: id });
    if (!gradeExists) {
      return res.status(404).json({ message: "grade not found" });
    }
    await Grade.findByIdAndDelete(id);
    return res.status(200).json({ message: "grade deleted successfully" });
  } catch (errror) {
    return res.status(400).json({ message: error.message });
  }
};

//update grade of student in specific course using grade id
export const updateGrade = async (req, res) => {
  try {
    const id = req.params.id;
    const gradeExists = await Grade.findOne({ _id: id });
    if (!gradeExists) {
      return res.status(404).json({ message: "grade not found" });
    }
    const updatedGrade = await Grade.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "grade updated successfully", Grade: updatedGrade });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//add new grade to the grades collection by providing student id, course id, and grade
//if the input is an array, it will add multiple grades at once
export const addNewGrade = async (req, res) => {
  try {
    const gradesInput = req.body;

    if (Array.isArray(gradesInput)) {
      for (const entry of gradesInput) {
        if (!entry.Student || !entry.Course || !entry.Grade) {
          return res
            .status(400)
            .json({
              message: "Missing Student, Course or Grade in one of the entries",
            });
        }
      }

      const savedGrades = await Grade.insertMany(gradesInput, {
        ordered: false,
      });
      return res
        .status(201)
        .json({ message: "grades added successfully", Grades: savedGrades });
    }

    const { Student, Course, Grade: gradeValue } = gradesInput;
    if (!Student || !Course || !gradeValue) {
      return res
        .status(400)
        .json({ message: "Missing Student, Course or Grade" });
    }
    const existingGrade = await Grade.findOne({ Student, Course });
    if (existingGrade) {
      return res.status(400).json({ message: "mark already input" });
    }
    const gradeData = new Grade({
      Student,
      Course,
      Grade: gradeValue,
    });
    const savedGrade = await gradeData.save();
    return res
      .status(201)
      .json({ message: "grade added successfully", Grade: savedGrade });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get all grades from the grades collection
//this will return all grades with their corresponding student and course details
export const fetchGrades = async (req, res) => {
  try {
    const grades = await Grade.find();
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
