import express from 'express';
import { fetchStudents , addNewStudent, updateStudent,deleteStudents} from '../controllers/studentController.js'; 


const router = express.Router();

router.get('/fetchstudents', fetchStudents);
router.post('/createstudents', addNewStudent);
router.put('/updatestudents/:id', updateStudent);
router.delete('/deletestudents/:id', deleteStudents);

export default router;