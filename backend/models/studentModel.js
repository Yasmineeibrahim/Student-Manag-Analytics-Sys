import mongoose from "mongoose";
// Define the student schema
// This schema includes fields for student email, password, name, grade, GPA, and an array of courses
// The Courses field is an array of ObjectIds that reference the Course model+Student model
const studentSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Student_Name: {
    type: String,
    required: true,
  },
  Grade: {
    type: Number,
    required: true,
  },
  GPA: {
    type: Number,
    required: true,
    min: 0.0,
    max: 4.0,
  },
  Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});
// Export the Student model based on the student schema
// This model will be used to interact with the "students" collection in the database
export default mongoose.model("Student", studentSchema);
