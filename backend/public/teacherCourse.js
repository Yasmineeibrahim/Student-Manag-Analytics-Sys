// teacherCourse.js

function getCourseIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadCourseDetails() {
  const courseId = getCourseIdFromUrl();
  if (!courseId) {
    document.getElementById('course-details').textContent = 'No course ID provided.';
    return;
  }
  try {
    const res = await fetch(`/api/courses/fetchcourses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const courses = await res.json();
    const course = courses.find(c => c._id === courseId);
    if (!course) {
      document.getElementById('course-details').textContent = 'Course not found.';
      return;
    }
    document.getElementById('course-details').innerHTML = `
      <h2>${course.Course_Name}</h2>
      <p><strong>Course Code:</strong> ${course.Course_Code}</p>
      <p><strong>Instructor:</strong> ${course.Instructor}</p>
      <p><strong>Credit Hours:</strong> ${course.Credit_Hours}</p>
      <p><strong>Number of Students:</strong> ${Array.isArray(course.Students) ? course.Students.length : 0}</p>
      <h3>Enrolled Students</h3>
      ${Array.isArray(course.Students) && course.Students.length > 0
        ? `<ul style='padding-left:20px;'>${course.Students.map(s => `<li>${s.Student_Name}</li>`).join('')}</ul>`
        : '<p>No students enrolled.</p>'}
    `;
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 