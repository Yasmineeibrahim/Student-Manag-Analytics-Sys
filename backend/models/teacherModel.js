import mongoose from "mongoose";

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

export default  mongoose.model("Teacher", teacherSchema);