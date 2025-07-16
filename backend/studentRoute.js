import express from 'express';
import { fetchStudents } from './studentModel.js'; 


const router = express.Router();

router.get('/fetch', fetchStudents);

export default router;