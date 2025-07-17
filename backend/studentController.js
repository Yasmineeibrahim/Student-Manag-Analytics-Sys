import Student from './studentModel.js';

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
 try{
    const studentData = new Student(req.body);
    const { Student_Name, Grade, Email, GPA } = studentData;


    const existingStudent = await Student.findOne({ Email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const savedStudent = await studentData.save();
    return res.status(201).json({ message: 'Student added successfully', Student: savedStudent });
 } catch (error) {
  return res.status(400).json({ message: error.message });
 }
};


export const fetchStudents = async (req, res) => {
  try {
    const students = await Student.find(); // fetch all documents
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}