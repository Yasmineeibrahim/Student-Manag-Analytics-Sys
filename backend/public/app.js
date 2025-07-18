const form = document.getElementById('teacher-login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent default form submit
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
        window.location.href = '/teacherDashboard.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error. Try again later.');
    }
  });


