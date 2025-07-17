import express from 'express';
import { fetchGrades , addNewGrade, updateGrade,deleteGrade} from '../controllers/gradesController.js'; 


const gradeRouter = express.Router();

gradeRouter.get('/fetchgrades', fetchGrades);
gradeRouter.post('/creategrades', addNewGrade);
gradeRouter.delete('/deletegrade/:id', deleteGrade);
gradeRouter.put('/updategrade/:id', updateGrade);

export default gradeRouter;