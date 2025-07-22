const teacherForm = document.getElementById('teacher-login-form');
if (teacherForm) {
  teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/teacherLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.teacher && data.teacher._id) {
          localStorage.setItem('teacherId', data.teacher._id);
        }
        if (data.teacher && data.teacher.Teacher_Name) {
          localStorage.setItem('teacherName', data.teacher.Teacher_Name);
        }
        window.location.href = '/teacherDashboard.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error. Try again later.');
    }
  });
}

const studentForm = document.getElementById('student-login-form');
if (studentForm) {
  studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/studentLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.student && data.student._id) {
          localStorage.setItem('studentId', data.student._id);
        }
        if (data.student && data.student.Student_Name) {
          localStorage.setItem('studentName', data.student.Student_Name);
        }
        if (data.student && data.student.GPA !== undefined) {
          localStorage.setItem('studentGPA', data.student.GPA);
        }
        window.location.href = '/studentDashboard.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error. Try again later.');
    }
  });
}


