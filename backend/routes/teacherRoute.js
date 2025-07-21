import express from 'express';
import {fetchTeachers,deleteTeachers,updateTeacher,addNewTeacher,fetchTeacherById} from '../controllers/teacherController.js'; 


const teacherrouter = express.Router();

teacherrouter.get('/fetchteachers', fetchTeachers);
teacherrouter.post('/createteachers', addNewTeacher);
teacherrouter.put('/updateteacher/:id', updateTeacher);
teacherrouter.delete('/deleteteacher/:id', deleteTeachers);
teacherrouter.get('/:id', fetchTeacherById);

export default teacherrouter;