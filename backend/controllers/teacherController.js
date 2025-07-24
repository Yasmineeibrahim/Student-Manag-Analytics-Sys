import Teacher from "../models/teacherModel.js";
//delete teacher using teacher id from teachers collection
export const deleteTeachers = async (req, res) => {
  try {
    const id = req.params.id;
    const teacherExists = await Teacher.findById({ _id: id });
    if (!teacherExists) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    await Teacher.findByIdAndDelete(id);
    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (errror) {
    return res.status(400).json({ message: error.message });
  }
};
//update teacher parameters using teacher id
//this will update the teacher's information in the teachers collection
export const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const teacherExists = await Teacher.findOne({ _id: id });
    if (!teacherExists) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log("Update teacher request body:", req.body);
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({
        message: "Teacher updated successfully",
        Teacher: updatedTeacher,
      });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//add new teacher to the teachers collection
//primary key is the teachers email address
//if the input is an array, it will add multiple teachers at once
export const addNewTeacher = async (req, res) => {
  try {
    const teacherData = new Teacher(req.body);
    const { Teacher_Name, Email, Password, Courses } = teacherData;

    const existingTeacher = await Teacher.findOne({ Email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const savedTeacher = await teacherData.save();
    return res
      .status(201)
      .json({ message: "Teacher added successfully", Teacher: savedTeacher });
    //if the email already exists, it will return an error message
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get all teachers from the teachers collection
export const fetchTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Fetch a specific teacher by ID
export const fetchTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
