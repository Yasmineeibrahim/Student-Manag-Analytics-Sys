
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
      btn.addEventListener('click', function () {
        const row = btn.closest('.resource-row');
        const student = course.Students[idx];

        // Save original HTML in case of cancel
        const originalHTML = row.innerHTML;

        // Create input fields for name and grade
        row.innerHTML = `
          <span class="resource-badge badge-a1">${student.Student_Name ? student.Student_Name.charAt(0).toUpperCase() : '?'}</span>
          <input class="student-edit-name" type="text" value="${student.Student_Name}" style="flex:1; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
          <span class="resource-members">${student._id}</span>
          <input class="student-edit-grade" type="text" value="${student.Grade ? student.Grade : ''}" style="width:48px; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
          <span class="resource-members year">${student.Year ? `Year: ${student.Year}` : 'Year: -'}</span>
          <button class="student-save-btn" aria-label="Save"><i class="fa fa-check" style="color: #4ecb7a;"></i></button>
          <button class="student-cancel-btn" aria-label="Cancel"><i class="fa fa-times" style="color: #a82929;"></i></button>
        `;

        // Add event listeners for Save and Cancel
        row.querySelector('.student-save-btn').addEventListener('click', async function () {
          const newName = row.querySelector('.student-edit-name').value.trim();
          const newGrade = row.querySelector('.student-edit-grade').value.trim();
          let nameUpdated = false, gradeUpdated = false;

          if (newName && newName !== student.Student_Name) {
            const res = await fetch(`/api/students/updatestudents/${student._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Student_Name: newName })
            });
            nameUpdated = res.ok;
          }

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
            row.innerHTML = originalHTML;
          }
        });

        row.querySelector('.student-cancel-btn').addEventListener('click', function () {
          row.innerHTML = originalHTML;
        });
      });
    });
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 