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
            <button class="resource-btn view" onclick="location.href=''">View Course</button>
          `;
          lessonsList.appendChild(div);
        });
      })
      .catch(err => {
        lessonsList.innerHTML = '<div style="color:red">Failed to load courses.</div>';
      });
  }
});
