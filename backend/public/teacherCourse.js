
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
      <h2 class="course-title">${course.Course_Name}</h2>
      <div class="course-meta"><span class="course-label">Course Code:</span> <span class="course-value">${course.Course_Code}</span></div>
      <div class="course-meta"><span class="course-label">Credit Hours:</span> <span class="course-value">${course.Credit_Hours}</span></div>
      <div class="course-meta"><span class="course-label">Number of Students:</span> <span class="course-value">${Array.isArray(course.Students) ? course.Students.length : 0}</span></div>
      <h3 class="course-section-title">Enrolled Students</h3>
      ${Array.isArray(course.Students) && course.Students.length > 0
        ? `<div class='students-resources-list'>${course.Students.map(s => `
            <div class="resource-row">
              <span class="resource-badge badge-a1">${s.Student_Name ? s.Student_Name.charAt(0).toUpperCase() : '?'}</span>
              <span class="resource-title">${s.Student_Name}</span>
              <span class="resource-members">${s._id}</span>
            </div>`).join('')}</div>`
        : '<div class="resources-list"><div class="resource-row"><span class="resource-title course-empty">No students enrolled.</span></div></div>'}
    `;
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 