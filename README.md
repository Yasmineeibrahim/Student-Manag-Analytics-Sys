# Software documentation
## Used Frameworks
### Node.js
### Express.js
### Mongoodb
### HTML
### CSS
### JAVASCRIPT
### Chart.js

> Software Name: SAMS.\
Version: 25.0.0\
Date: Jul 23, 2025

## Software Overview
**SAMS.** The student and teacher web portal offers a streamlined workflow experience for
school and college staff, incorporating essential authentication checks for both users. The
current software version significantly enhances the functionality related to the roles of
students and teachers. The **SAMS.** portal places a strong emphasis on student analytics
and performance statistics, utilizing graphs and visuals to present data, as well as tracking
overall performance and grades for both teachers and students. The portal facilitates the
registration, updating, and removal of all pertinent information.\
courses\
grades\
students\
teachers\
The portal employs analytics and **Node.js** API endpoints to fetch, create, delete, and
update (CRUD) **MongoDB** for the entire system.
## Requirements
Educational institutions interested in implementing the system to manage their workflow
must establish a database based on the following schemas and connect it to **MongoDB**.\
```
const courseSchema = new mongoose.Schema({
Course_Name: {
type: String,
required: true
},
Credit_Hours: {
type: Number,
required: true
},
Course_Code: {
type: String,
required: true,
unique: true
},
Instructor: {
type: String,
required: true
},
Students: [{ type: mongoose.Schema.Types.ObjectId, ref:
'Student' }],
 });

 import mongoose from "mongoose";

 const gradeSchema = new mongoose.Schema({
 Student: {
 type: mongoose.Schema.Types.ObjectId,
ref: 'Student',
 required: true
 },
 Course: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Course',
 required: true
 },
 Grade: {
 type: String,
 required: true,
 enum: ['A', 'B', 'C', 'D', 'F']
 }
 });

 export default mongoose.model("Grade", gradeSchema);

 import mongoose from "mongoose";

 const studentSchema = new mongoose.Schema({
 Email: {
 type: String,
 required: true,
 unique: true,
 lowercase: true
 },
Password: {
type: String,
required: true,
 },
 Student_Name: {
 type: String,
 required: true
 },
 Grade: {
 type: Number,
 required: true
 },
 GPA: {
 type: Number,
 required: true,
 min: 0.0,
 max: 4.0
 },
 Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course'
}]
 });

 export default mongoose.model("Student", studentSchema);

 import mongoose from "mongoose";

 const teacherSchema = new mongoose.Schema({
 Email: {
type: String,
required: true,
 unique: true,
 lowercase: true
},
Password: {
type: String,
required: true,
},
 Teacher_Name: {
 type: String,
 required: true
 },
 Courses:
 [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
 });

 export default mongoose.model("Teacher", teacherSchema);
```
End users, including students, administrators, and teachers, require access to web
browsers and a stable internet connection.
## How-to guide
Teachers Portal & Student Portal\
### Step 1
Login with your assigned email and password
### Step 2
For teachers and staff, you have the ability to add, delete, and edit courses directly from
the home page. You can also review your students' grades and GPA statistics, and utilize
a fully functional Google Calendar to track your meetings and important dates. For
students, you can check your grades in the courses you are enrolled in, as well as access
course information, your GPA, grade rank, and a comparison of the grades for enrolled
subjects.
### Step 3
As a student, you can view your course details. For teachers, you have the ability to add,
delete, or edit students enrolled in the course you are teaching by accessing the course
details.
### Step 4
For educators, please access comprehensive analytics of your enrolled students in the
analytics tab.
### Step 5
Please edit the login email, passwords, and display name from the settings tab.
