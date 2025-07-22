document.addEventListener('DOMContentLoaded', function() {
  const studentGPA = localStorage.getItem('studentGPA');
  if (studentGPA) {
    document.getElementById('student-gpa').textContent = studentGPA;
  }

  const studentId = localStorage.getItem('studentId');
  const lessonsList = document.querySelector('.resources-list');
  if (studentId && lessonsList) {
    fetch(`/api/students/${studentId}/courses`)
      .then(res => res.json())
      .then(data => {
        lessonsList.innerHTML = '';
        (data.courses || []).forEach(course => {
          const div = document.createElement('div');
          div.classList.add('resource-row');
          div.innerHTML = `
            <span class="resource-badge badge-a1">${course.Course_Code || 'N/A'}</span>
            <span class="resource-title">${course.Course_Name || 'Unnamed Course'}</span>
            <span class="resource-members">${Array.isArray(course.Students) ? course.Students.length : 0} members</span>
            <button class="resource-btn view" onclick="location.href='/studentCourse.html?id=${course._id}'">View Course</button>
          `;
          lessonsList.appendChild(div);
        });
      })
      .catch(err => {
        lessonsList.innerHTML = '<div style="color:red">Failed to load courses.</div>';
      });
  }
});



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
    let studentGrade = '-';
    try {
      const studentId = localStorage.getItem('studentId');
      const gradesRes = await fetch('/api/grades/fetchgrades');
      if (gradesRes.ok) {
        const grades = await gradesRes.json();
        console.log('Grades:', grades, 'Student:', studentId, 'Course:', course._id);
        const gradeDoc = grades.find(g => g.Student === studentId && g.Course === course._id);
        console.log('Found gradeDoc:', gradeDoc);
        if (gradeDoc && gradeDoc.Grade) {
          studentGrade = gradeDoc.Grade;
        }
      }
    } catch (e) {
      console.error(e);
    }
    document.getElementById('course-details').innerHTML = `
      <div class="course-students-flex">
        <div class="students-list-section">
          <h3 class="course-section-title">
            <span>Classmates.</span>
          </h3>
          ${Array.isArray(course.Students) && course.Students.length > 0
            ? `<div class='resources-list'>${course.Students.map(s => `
                <div class="resource-row">
                  <span class="resource-badge badge-a1">${s.Student_Name ? s.Student_Name.charAt(0).toUpperCase() : '?'}</span>
                  <span class="resource-title">${s.Student_Name}</span>
                  <span class="resource-members year">${s.Year ? `Year: ${s.Year}` : 'Year: -'}</span>
                </div>`).join('')}</div>`
            : '<div class="resources-list"><div class="resource-row"><span class="resource-title course-empty">No students enrolled.</span></div></div>'}
        </div>
        <div class="course-details-section">
          <h2 class="course-title">${course.Course_Name}</h2>
          <div class="course-teacher" style="font-size:1.1rem; color:#888; margin-bottom:10px;">Instructor: ${course.Instructor || '-'}</div>
          <div class="course-info-horizontal">
            <div class="course-meta-horizontal"><span class="course-info-label">Course Code:</span> <span class="course-info-value">${course.Course_Code}</span></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Credit Hours:</span> <span class="course-info-value">${course.Credit_Hours}</span></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Number of Students:</span> <span class="course-info-value">${Array.isArray(course.Students) ? course.Students.length : 0}</span></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Your Grade:</span> <span class="course-info-value">${studentGrade}</span></div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 
