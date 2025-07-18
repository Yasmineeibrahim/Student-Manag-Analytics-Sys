import Grade from '../models/gradeModel.js';
import Course from '../models/courseModel.js';
import Student from '../models/studentModel.js';

export const deleteGrade = async (req,res) => {
  try{
    const id = req.params.id;
    const gradeExists = await Grade.findById({ _id: id });
    if (!gradeExists) {
      return res.status(404).json({ message: 'grade not found' });
    }
    await Grade.findByIdAndDelete(id);
    return res.status(200).json({ message: 'grade deleted successfully' });
  }catch(errror){
    return res.status(400).json({ message: error.message });
  }
}


export const updateGrade = async (req, res) => {
  try{
    const id=req.params.id;
    const gradeExists= await Grade.findOne({_id:id});
    if (!gradeExists){
      return res.status(404).json({ message: 'grade not found' });
    }
    const updatedGrade = await Grade.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: 'grade updated successfully', Grade: updatedGrade });
  }catch(error){
    return res.status(400).json({ message: error.message });
  }
}

export const addNewGrade = async (req, res) => {
  try {
    const gradesInput = req.body;

    // Check if input is an array (bulk insert)
    if (Array.isArray(gradesInput)) {
      // Validate each entry (optional)
      for (const entry of gradesInput) {
        if (!entry.Student || !entry.Course || !entry.Grade) {
          return res.status(400).json({ message: 'Missing Student, Course or Grade in one of the entries' });
        }
      }

      // Optionally check for duplicates before inserting:
      // Here skipping duplicate check for brevity.

      const savedGrades = await Grade.insertMany(gradesInput, { ordered: false });
      return res.status(201).json({ message: 'grades added successfully', Grades: savedGrades });
    }

    const { Student, Course, Grade: gradeValue } = gradesInput;
    if (!Student || !Course || !gradeValue) {
      return res.status(400).json({ message: 'Missing Student, Course or Grade' });
    }
    const existingGrade = await Grade.findOne({ Student, Course });
    if (existingGrade) {
      return res.status(400).json({ message: 'mark already input' });
    }
    const gradeData = new Grade({
      Student,
      Course,
      Grade: gradeValue
    });
    const savedGrade = await gradeData.save();
    return res.status(201).json({ message: 'grade added successfully', Grade: savedGrade });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};




export const fetchGrades = async (req, res) => {
  try {
    const grades = await Grade.find();
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}