import mongoose from "mongoose";
// Define the grade schema
// This schema includes fields for student ID, course ID, and the grade
// The Student and Course fields are ObjectIds that reference the Student and Course models
const gradeSchema = new mongoose.Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  Course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  Grade: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'F']
  }
});
// Export the Grade model based on the grade schema
// This model will be used to interact with the "grades" collection in the database
export default mongoose.model("Grade", gradeSchema);
