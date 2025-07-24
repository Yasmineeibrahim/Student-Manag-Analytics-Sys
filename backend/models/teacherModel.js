import mongoose from "mongoose";
//defines the teacher schema
// This schema includes fields for teacher email, password, name, and an array of courses
// The Courses field is an array of ObjectIds that reference the Course model
const teacherSchema = new mongoose.Schema({
    Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  Password: {
    type: String,
    required: true,
  },
  Teacher_Name: {
    type: String,
    required: true
  },
  Courses:
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});
// Export the Teacher model based on the teacher schema
// This model will be used to interact with the "teachers" collection in the database
export default  mongoose.model("Teacher", teacherSchema);