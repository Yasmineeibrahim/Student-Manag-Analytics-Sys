
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
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="course-title">${course.Course_Name}</h2>
        <button class="update-course-btn" style="font-size:1rem;font-weight:600;background:#4ecb7a;color:#fff;border:none;border-radius:8px;padding:8px 18px;cursor:pointer;">Update Course</button>
      </div>
      <div class="course-info-horizontal">
        <div class="course-meta-horizontal"><span class="course-info-label">Course Code:</span> <span class="course-info-value">${course.Course_Code}</span></div>
        <div class="course-meta-horizontal"><span class="course-info-label">Credit Hours:</span> <span class="course-info-value">${course.Credit_Hours}</span></div>
        <div class="course-meta-horizontal"><span class="course-info-label">Number of Students:</span> <span class="course-info-value">${Array.isArray(course.Students) ? course.Students.length : 0}</span></div>
      </div>
      <h3 class="course-section-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>Enrolled Students</span>
        <button class="add-student-btn"><i class="fa-solid fa-plus"></i><span>Add New Student</span></button>
      </h3>
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
    document.querySelector('.update-course-btn').addEventListener('click', function () {
      const detailsDiv = document.getElementById('course-details');
      const originalHTML = detailsDiv.innerHTML;
      detailsDiv.innerHTML = `
        <form id="update-course-form">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h2 class="course-title">Update Course</h2>
          </div>
          <div class="course-info-horizontal">
            <div class="course-meta-horizontal"><span class="course-info-label">Course Name:</span> <input name="Course_Name" type="text" value="${course.Course_Name}" required style="font-size:1rem;padding:6px 10px;border-radius:8px;border:1px solid #d1d5d8;"></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Course Code:</span> <input name="Course_Code" type="text" value="${course.Course_Code}" required style="font-size:1rem;padding:6px 10px;border-radius:8px;border:1px solid #d1d5d8;"></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Credit Hours:</span> <input name="Credit_Hours" type="number" value="${course.Credit_Hours}" required style="font-size:1rem;padding:6px 10px;border-radius:8px;border:1px solid #d1d5d8;width:80px;"></div>
          </div>
          <div style="margin-top:24px;display:flex;gap:16px;">
            <button type="submit" class="add-course-submit-btn">Save</button>
            <button type="button" class="add-course-cancel-btn" style="background:#eee;color:#333;">Cancel</button>
          </div>
        </form>
      `;
      document.querySelector('.add-course-cancel-btn').addEventListener('click', function () {
        detailsDiv.innerHTML = originalHTML;
      });
      document.getElementById('update-course-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const form = e.target;
        const updatedData = {
          Course_Name: form.Course_Name.value.trim(),
          Course_Code: form.Course_Code.value.trim(),
          Credit_Hours: Number(form.Credit_Hours.value)
        };
        try {
          const res = await fetch(`/api/courses/updatecourse/${course._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
          if (res.ok) {
            alert('Course updated!');
            location.reload();
          } else {
            alert('Failed to update course.');
          }
        } catch (err) {
          alert('Server error. Try again later.');
        }
      });
    });

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
            
            btn.closest('.resource-row').remove();
          } else {
            alert('Failed to remove student.');
          }
        } catch (err) {
          alert('Server error. Try again later.');
        }
      });
    });


    document.querySelectorAll('.student-update-btn').forEach((btn, idx) => {
      btn.addEventListener('click', function () {
        const row = btn.closest('.resource-row');
        const student = course.Students[idx];

   
        const originalHTML = row.innerHTML;

 
        row.innerHTML = `
          <span class="resource-badge badge-a1">${student.Student_Name ? student.Student_Name.charAt(0).toUpperCase() : '?'}</span>
          <input class="student-edit-name" type="text" value="${student.Student_Name}" style="flex:1; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
          <span class="resource-members">${student._id}</span>
          <input class="student-edit-grade" type="text" value="${student.Grade ? student.Grade : ''}" style="width:48px; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
          <span class="resource-members year">${student.Year ? `Year: ${student.Year}` : 'Year: -'}</span>
          <button class="student-save-btn" aria-label="Save"><i class="fa fa-check" style="color: #4ecb7a;"></i></button>
          <button class="student-cancel-btn" aria-label="Cancel"><i class="fa fa-times" style="color: #a82929;"></i></button>
        `;

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

    // Add New Student button logic
    document.querySelector('.add-student-btn').addEventListener('click', function () {
      const studentsList = document.querySelector('.students-resources-list');
      // Prevent multiple add rows
      if (studentsList.querySelector('.add-student-row')) return;

      // Create the input row
      const addRow = document.createElement('div');
      addRow.className = 'resource-row add-student-row';
      addRow.innerHTML = `
        <span class="resource-badge badge-a1">N</span>
        <input class="student-add-name" type="text" placeholder="Name" style="flex:1; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
        <input class="student-add-email" type="email" placeholder="Email" style="width:180px; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
        <input class="student-add-password" type="password" placeholder="Password" style="width:120px; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
        <span class="resource-members"></span>
        <input class="student-add-grade" type="text" placeholder="Grade (A-F)" style="width:48px; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
        <input class="student-add-year" type="number" placeholder="Year" style="width:60px; font-size:1rem; padding:4px 8px; border-radius:6px; border:1px solid #d1d5d8; margin-right:8px;">
        <button class="student-save-btn" aria-label="Save"><i class="fa fa-check" style="color: #4ecb7a;"></i></button>
        <button class="student-cancel-btn" aria-label="Cancel"><i class="fa fa-times" style="color: #a82929;"></i></button>
      `;
      studentsList.prepend(addRow);

      // Save handler
      addRow.querySelector('.student-save-btn').addEventListener('click', async function () {
        const name = addRow.querySelector('.student-add-name').value.trim();
        const email = addRow.querySelector('.student-add-email').value.trim();
        const password = addRow.querySelector('.student-add-password').value.trim();
        const grade = addRow.querySelector('.student-add-grade').value.trim();
        const year = addRow.querySelector('.student-add-year').value.trim();
        if (!name || !email || !password || !grade || !year) {
          alert('Please fill in all fields.');
          return;
        }
        // 1. Create the student in the database
        let studentId;
        try {
          const res = await fetch('/api/students/createstudents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ Student_Name: name, Grade: year, GPA: 0, Email: email, Password: password, Courses: [] }])
          });
          const data = await res.json();
          if (res.ok && data.students && data.students[0] && data.students[0]._id) {
            studentId = data.students[0]._id;
          } else {
            alert('Failed to create student.');
            return;
          }
        } catch (err) {
          alert('Server error creating student.');
          return;
        }
        // 2. Add the student to the course
        const courseId = getCourseIdFromUrl();
        try {
          const res = await fetch(`/api/courses/updatecourse/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ $push: { Students: studentId } })
          });
          if (!res.ok) {
            alert('Failed to add student to course.');
            return;
          }
        } catch (err) {
          alert('Server error adding student to course.');
          return;
        }
        // 3. Add the grade for this course
        try {
          await fetch('/api/grades/addnewgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ Student: studentId, Course: courseId, Grade: grade }])
          });
        } catch (err) {
          // Ignore error for grade creation
        }
        alert('Student added!');
        location.reload();
      });

      // Cancel handler
      addRow.querySelector('.student-cancel-btn').addEventListener('click', function () {
        addRow.remove();
      });
    });
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails); 