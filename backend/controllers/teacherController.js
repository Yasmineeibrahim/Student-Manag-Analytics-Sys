import Teacher from '../models/teacherModel.js';

export const deleteTeachers = async (req,res) => {
  try{
    const id = req.params.id;
    const teacherExists = await Teacher.findById({ _id: id });
    if (!teacherExists) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    await Teacher.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Teacher deleted successfully' });
  }catch(errror){
    return res.status(400).json({ message: error.message });
  }
}

export const updateTeacher = async (req, res) => {
  try{
    const id=req.params.id;
    const teacherExists= await Teacher.findOne({_id:id});
    if (!teacherExists){
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: 'Teacher updated successfully', Teacher: updatedTeacher });
  }catch(error){
    return res.status(400).json({ message: error.message });
  }
}

export const addNewTeacher = async (req, res) => {
 try{
    const teacherData = new Teacher(req.body);
    const { Teacher_Name, Email,Password, Courses } = teacherData;

    const existingTeacher = await Teacher.findOne({ Email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const savedTeacher = await teacherData.save();
    return res.status(201).json({ message: 'Teacher added successfully', Teacher: savedTeacher });
 } catch (error) {
  return res.status(400).json({ message: error.message });
 }
};


export const fetchTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}