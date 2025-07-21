import Course from '../models/courseModel.js';

export const deleteCourse = async (req,res) => {
  try{
    const id = req.params.id;
    const courseExists = await Course.findById({ _id: id });
    if (!courseExists) {
      return res.status(404).json({ message: 'course not found' });
    }
    await Course.findByIdAndDelete(id);
    return res.status(200).json({ message: 'course deleted successfully' });
  }catch(errror){
    return res.status(400).json({ message: error.message });
  }
}

export const updateCourse = async (req, res) => {
  try{
    const id=req.params.id;
    const courseExists= await Course.findOne({_id:id});
    if (!courseExists){
      return res.status(404).json({ message: 'course not found' });
    }
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: 'Course updated successfully', Course: updatedCourse });
  }catch(error){
    return res.status(400).json({ message: error.message });
  }
}

export const addNewCourse = async (req, res) => {
 try{
    const courseData = new Course(req.body);
    const { Course_Name, Credit_Hours, Course_Code, Instructor,Students } = courseData;

    const existingCourse = await Course.findOne({ Course_Code });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }
    const savedCourse = await Course.insertMany(req.body);
    return res.status(201).json({ message: 'Course added successfully', Course: savedCourse });
 } catch (error) {
  return res.status(400).json({ message: error.message });
 }
};

export const fetchCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('Students', 'Student_Name _id');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const fetchCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('Students', 'Student_Name');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};