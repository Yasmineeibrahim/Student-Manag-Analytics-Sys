import express from 'express';
import {fetchTeachers,deleteTeachers,updateTeacher,addNewTeacher} from '../controllers/teacherController.js'; 


const teacherrouter = express.Router();

teacherrouter.get('/fetchteachers', fetchTeachers);
teacherrouter.post('/createteachers', addNewTeacher);
teacherrouter.put('/updateteacher/:id', updateTeacher);
teacherrouter.delete('/deleteteacher/:id', deleteTeachers);

export default teacherrouter;