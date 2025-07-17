import express from 'express';
import { fetchStudents , addNewStudent, updateStudent,deleteStudents} from './studentController.js'; 


const router = express.Router();

router.get('/fetch', fetchStudents);
router.post('/create', addNewStudent);
router.put('/update/:id', updateStudent);
router.delete('/delete/:id', deleteStudents);

export default router;