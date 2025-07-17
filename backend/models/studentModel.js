import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  Student_Name: {
    type: String,
    required: true
  },
  Grade: {
    type: Number,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  GPA: {
    type: Number,
    required: true,
    min: 0.0,
    max: 4.0
  }
});

export default  mongoose.model("Student", studentSchema);