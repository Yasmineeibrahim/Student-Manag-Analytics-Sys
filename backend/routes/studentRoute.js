import express from 'express';
import { fetchStudents , addNewStudent, updateStudent,deleteStudents, fetchStudentById } from '../controllers/studentController.js'; 
import { fetchStudentCourses } from '../controllers/studentController.js';
import { fetchStudentGpaHistory } from '../controllers/studentController.js';


const router = express.Router();

router.get('/fetchstudents', fetchStudents);
router.get('/:id', fetchStudentById);
router.post('/createstudents', addNewStudent);
router.put('/updatestudents/:id', updateStudent);
router.delete('/deletestudents/:id', deleteStudents);
router.get('/:id/courses', fetchStudentCourses);
router.get('/:id/gpahistory', fetchStudentGpaHistory);

export default router;