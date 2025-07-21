const form = document.getElementById('teacher-login-form');
  form.addEventListener('submit', async (e) => {
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


