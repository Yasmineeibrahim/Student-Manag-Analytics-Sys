import mongoose from "mongoose";

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

export default mongoose.model("Grade", gradeSchema);
