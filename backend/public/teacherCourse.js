
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
    const res = await fetch(`/api/courses/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    const course = await res.json();
    if (!course) {
      document.getElementById('course-details').textContent = 'Course not found.';
      return;
    }
    document.getElementById('course-details').innerHTML = `
        <h2 class="course-title">${course.Course_Name}</h2>
        <div class="course-info-horizontal">
          <div class="course-meta-horizontal"><span class="course-info-label">Course Code:</span> <span class="course-info-value">${course.Course_Code}</span></div>
          <div class="course-meta-horizontal"><span class="course-info-label">Credit Hours:</span> <span class="course-info-value">${course.Credit_Hours}</span></div>
          <div class="course-meta-horizontal"><span class="course-info-label">Number of Students:</span> <span class="course-info-value">${Array.isArray(course.Students) ? course.Students.length : 0}</span></div>
        </div>
      <h3 class="course-section-title">Enrolled Students</h3>
      ${Array.isArray(course.Students) && course.Students.length > 0
        ? `<div class='students-resources-list'>${course.Students.map(s => `
            <div class="resource-row">
              <span class="resource-badge badge-a1">${s.Student_Name ? s.Student_Name.charAt(0).toUpperCase() : '?'}</span>
              <span class="resource-title">${s.Student_Name}</span>
              <span class="resource-members">${s._id}</span>
              <span class="resource-members">${s.Grade ? s.Grade : '-'}</span>
              <button class="student-update-btn" aria-label="Update"><i class="fa fa-pencil-alt"></i></button>
              <button class="student-delete-btn" aria-label="Delete"><i class="fa fa-trash"></i></button>
            </div>`).join('')}</div>`
        : '<div class="students-resources-list"><div class="resource-row"><span class="resource-title course-empty">No students enrolled.</span></div></div>'}
    `;
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 