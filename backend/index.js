import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import gradeRouter from './routes/gradeRoute.js';
import router from './routes/studentRoute.js';
import teacherRouter from './routes/teacherRoute.js';
import courseRouter from './routes/courseRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Teacher from './models/teacherModel.js';
import Student from './models/studentModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 9000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
   console.log('Connected to database:', mongoose.connection.name);
  app.listen(9000, () => {
  console.log('Server is running on http://localhost:9000');
});
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/teacherLogin.html'));
});

app.post('/api/teacherLogin', async (req, res) => {
  console.log('>>> Teacher login route hit');
  console.log('BODY RECEIVED:', req.body);
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  email = email.trim().toLowerCase();
  console.log('Login attempt with email:', email);
  try {
    const teacher = await Teacher.findOne({ Email: email });
    if (!teacher) {
      console.log('Teacher not found for email:', email);
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (password !== teacher.Password) {
  return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { Password, ...teacherData } = teacher.toObject();
    return res.status(200).json({ message: 'Login successful', teacher: teacherData });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/studentLogin', async (req, res) => {
  console.log('>>> student login route hit');
  console.log('BODY RECEIVED:', req.body);
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  email = email.trim().toLowerCase();
  console.log('Login attempt with email:', email);
  try {
    const student = await Student.findOne({ Email: email });
    if (!student) {
      console.log('Student not found for email:', email);
      return res.status(404).json({ message: 'Student not found' });
    }

    if (password !== student.Password) {
  return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { Password, ...studentData } = student.toObject();

    res.status(200).json({ message: 'Login successful', student: studentData });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.url, req.headers['content-type']);
  next();
});

app.use('/api/students', router);
app.use('/api/courses', courseRouter);
app.use('/api/grades', gradeRouter);
app.use('/api/teachers',teacherRouter);


