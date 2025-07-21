import express from 'express';
import { fetchCourses , addNewCourse, updateCourse,deleteCourse,fetchCourseById} from '../controllers/courseController.js'; 


const courseRouter = express.Router();

courseRouter.get('/fetchcourses', fetchCourses);
courseRouter.post('/createcourse', addNewCourse);
courseRouter.delete('/deletecourse/:id', deleteCourse);
courseRouter.put('/updatecourse/:id', updateCourse);
courseRouter.get('/:id', fetchCourseById);
export default courseRouter;