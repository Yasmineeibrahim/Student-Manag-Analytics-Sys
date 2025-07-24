import Student from '../models/studentModel.js';
import Course from '../models/courseModel.js';
// delete student using student id from students collection
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




// update student parameters using student id
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
//add new student to the students collection

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

//if the input is an array, it will add multiple students at once
    const savedStudents = await Student.insertMany(studentsArray);

    return res.status(201).json({ message: 'Students added successfully', students: savedStudents });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Fetch all students from the students collection
export const fetchStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}

  //get courses of specific student using student id
  // This will return the courses the student is enrolled in
export const fetchStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Find the student and display their courses
    const student = await Student.findById(studentId).populate('Courses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ courses: student.Courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student courses', error: error.message });
  }
};
// Fetch a specific student by ID
export const fetchStudentById = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.status(200).json(student);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// Fetch GPA history for a specific student
// This is a dummy implementation for testing purposes
// In a real application, you would fetch this data from a database or another service
//used in student profile page to show GPA history
export const fetchStudentGpaHistory = async (req, res) => {
  try {
    // Dummy data for testing
    const gpaHistory = [
      { semester: 'Fall 2022', gpa: 3.2 },
      { semester: 'Spring 2023', gpa: 3.5 },
      { semester: 'Fall 2023', gpa: 3.7 },
      { semester: 'Spring 2024', gpa: 3.8 }
    ];
    return res.status(200).json({ gpaHistory });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};