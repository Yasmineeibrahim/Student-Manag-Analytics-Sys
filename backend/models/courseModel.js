import mongoose from "mongoose";
// Define the course schema
// This schema includes fields for course name, credit hours, course code, instructor, and an array of students
// The students field is an array of ObjectIds that reference the Student model
const courseSchema = new mongoose.Schema({
  Course_Name: {
    type: String,
    required: true,
  },
  Credit_Hours: {
    type: Number,
    required: true,
  },
  Course_Code: {
    type: String,
    required: true,
    unique: true,
  },
  Instructor: {
    type: String,
    required: true,
  },
  Students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});
// Export the Course model based on the course schema
// This model will be used to interact with the "courses" collection in the database
export default mongoose.model("Course", courseSchema);
