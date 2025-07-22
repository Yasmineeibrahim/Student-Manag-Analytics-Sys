import Student from '../models/studentModel.js';
import Course from '../models/courseModel.js';

export const deleteStudents = async (req,res) => {
  try{
    const id = req.params.id;
    const studentExists = await Student.findById({ _id: id });
    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await Student.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Student deleted successfully' });
  }catch(errror){
    return res.status(400).json({ message: error.message });
  }
}





export const updateStudent = async (req, res) => {
  try{
    const id=req.params.id;
    const studentExists= await Student.findOne({_id:id});
    if (!studentExists){
      return res.status(404).json({ message: 'Student not found' });
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: 'Student updated successfully', Student: updatedStudent });
  }catch(error){
    return res.status(400).json({ message: error.message });
  }
}

export const addNewStudent = async (req, res) => {
  try {
    const studentsArray = req.body;

    if (!Array.isArray(studentsArray) || studentsArray.length === 0) {
      return res.status(400).json({ message: 'Request body should be a non-empty array of students' });
    }


    const emails = studentsArray.map(s => s.Email.toLowerCase());
    const existingStudents = await Student.find({ Email: { $in: emails } }).select('Email');

    if (existingStudents.length > 0) {
      const existingEmails = existingStudents.map(s => s.Email);
      return res.status(400).json({ message: `These emails already exist: ${existingEmails.join(', ')}` });
    }


    const savedStudents = await Student.insertMany(studentsArray);

    return res.status(201).json({ message: 'Students added successfully', students: savedStudents });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const fetchStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}

export const fetchStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Find the student and populate their courses
    const student = await Student.findById(studentId).populate('Courses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ courses: student.Courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student courses', error: error.message });
  }
};