
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
              <span class="resource-members grade">${s.Grade ? s.Grade : '-'}</span>
              <span class="resource-members year">${s.Year ? `Year: ${s.Year}` : 'Year: -'}</span>
              <button class="student-update-btn" aria-label="Update"><i class="fa-solid fa-pen-to-square" style="color: #004b85;"></i></button>
              <button class="student-delete-btn" aria-label="Delete"><i class="fa-solid fa-trash" style="color: #a82929;"></i></button>
            </div>`).join('')}</div>`
        : '<div class="students-resources-list"><div class="resource-row"><span class="resource-title course-empty">No students enrolled.</span></div></div>'}
    `;
    // After rendering the students list
    document.querySelectorAll('.student-delete-btn').forEach((btn, idx) => {
      btn.addEventListener('click', async function () {
        const courseId = getCourseIdFromUrl();
        const studentId = course.Students[idx]._id;
        if (!confirm('Are you sure you want to remove this student from the course?')) return;
        try {
          const res = await fetch(`/api/courses/${courseId}/student/${studentId}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            // Remove the student row from the DOM
            btn.closest('.resource-row').remove();
          } else {
            alert('Failed to remove student.');
          }
        } catch (err) {
          alert('Server error. Try again later.');
        }
      });
    });

    // Add event listeners to update buttons
    document.querySelectorAll('.student-update-btn').forEach((btn, idx) => {
      btn.addEventListener('click', async function () {
        const student = course.Students[idx];
        const newName = prompt('Edit student name:', student.Student_Name);
        if (newName === null) return; // Cancelled
        const newGrade = prompt('Edit student grade (A/B/C/D/F):', student.Grade || '');
        if (newGrade === null) return; // Cancelled

        let nameUpdated = false, gradeUpdated = false;
        if (newName !== student.Student_Name) {
          const res = await fetch(`/api/students/updatestudents/${student._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Student_Name: newName })
          });
          nameUpdated = res.ok;
        }

        // Update grade (in grades collection)
        if (newGrade && newGrade !== student.Grade) {
          // Find the grade document for this student and course
          const gradeRes = await fetch(`/api/grades/fetchgrades`);
          const grades = gradeRes.ok ? await gradeRes.json() : [];
          const gradeDoc = grades.find(g => g.Student === student._id && g.Course === course._id);
          if (gradeDoc) {
            const res = await fetch(`/api/grades/updategrade/${gradeDoc._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Grade: newGrade, Student: student._id, Course: course._id })
            });
            gradeUpdated = res.ok;
          }
        }

        if (nameUpdated || gradeUpdated) {
          alert('Student updated!');
          location.reload();
        } else {
          alert('No changes made or update failed.');
        }
      });
    });
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 