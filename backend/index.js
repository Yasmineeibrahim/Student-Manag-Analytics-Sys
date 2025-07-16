import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './studentRoute.js';

const app = express();

app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 9000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
  console.log('MongoDB connected successfully');
  app.listen(9000, () => {
  console.log('Server is running on http://localhost:9000');
});
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use('/api/students', router);