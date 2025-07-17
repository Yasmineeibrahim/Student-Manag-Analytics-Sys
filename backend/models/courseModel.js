import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    Course_Name: {
        type: String,
        required: true
    },
    Credit_Hours: {
        type: Number,
        required: true  
    },
    Course_Code: {
        type: String,
        required: true,
        unique: true        
    },
    Instructor: {
        type: String,
        required: true
    },
    Students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

export default  mongoose.model("Course", courseSchema);