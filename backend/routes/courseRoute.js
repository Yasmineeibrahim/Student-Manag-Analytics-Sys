import express from 'express';
import { fetchCourses , addNewCourse, updateCourse,deleteCourse} from '../controllers/courseController.js'; 


const courseRouter = express.Router();

courseRouter.get('/fetchcourses', fetchCourses);
courseRouter.post('/createcourse', addNewCourse);
courseRouter.delete('/deletecourse/:id', deleteCourse);
courseRouter.put('/updatecourse/:id', updateCourse);

export default courseRouter;