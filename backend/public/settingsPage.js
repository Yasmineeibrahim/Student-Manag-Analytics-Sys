
window.addEventListener('DOMContentLoaded', async function() {
  const teacherId = localStorage.getItem('teacherId');
  const studentId = localStorage.getItem('studentId');
  let userType = null;
  let userId = null;
  let info = {};
  let fields = [];
  let apiBase = '';
  let logoutRedirect = '';

  if (teacherId) {
    userType = 'teacher';
    userId = teacherId;
    info = { Teacher_Name: '', Email: '', Password: '' };
    fields = [
      { key: 'Teacher_Name', label: 'Name', type: 'text' },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Password', label: 'Password', type: 'password' }
    ];
    apiBase = '/api/teachers';
    logoutRedirect = '/teacherLogin.html';
  } else if (studentId) {
    userType = 'student';
    userId = studentId;
    info = { Student_Name: '', Email: '', Password: '' };
    fields = [
      { key: 'Student_Name', label: 'Name', type: 'text' },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Password', label: 'Password', type: 'password' }
    ];
    apiBase = '/api/students';
    logoutRedirect = '/studentLogin.html';
  } else {
    alert('No user found. Please log in again.');
    window.location.href = '/';
    return;
  }

  async function fetchUser() {
    try {
      let fetchUrl = '';
      if (userType === 'teacher') {
        fetchUrl = `/api/teachers/${userId}`;
      } else {
        fetchUrl = `/api/students/${userId}`;
      }
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error('Failed to fetch user info');
      const user = await res.json();
      if (userType === 'teacher') {
        info.Teacher_Name = user.Teacher_Name || '';
        info.Email = user.Email || '';
        info.Password = user.Password || '';
      } else {
        info.Student_Name = user.Student_Name || '';
        info.Email = user.Email || '';
        info.Password = user.Password || '';
      }
      renderInfo();
    } catch (err) {
      alert('Error loading user info.');
    }
  }

  function renderInfo() {
    document.getElementById('teacher-info').innerHTML = fields.map(f => `
      <div class="settings-row">
        <span class="settings-label">${f.label}:</span>
        <span class="settings-value" id="${f.key}">${f.key === 'Password' ? '********' : info[f.key]}</span>
        <button class="settings-edit-btn" data-field="${f.key}"><i class="fa fa-pen"></i></button>
      </div>
    `).join('');
  }

  function renderEdit(field) {
    const f = fields.find(x => x.key === field);
    let value = info[field] || '';
    let row = document.querySelector(`.settings-edit-btn[data-field="${field}"]`).parentElement;
    row.innerHTML = `
      <span class="settings-label">${f.label}:</span>
      <input class="settings-input" type="${f.type}" value="${value}" style="font-size:1rem;padding:6px 10px;border-radius:8px;border:1px solid #d1d5d8;">
      <button class="settings-save-btn"><i class="fa fa-check" style="color:#4ecb7a;"></i></button>
      <button class="settings-cancel-btn"><i class="fa fa-times" style="color:#a82929;"></i></button>
    `;
    row.querySelector('.settings-save-btn').onclick = async function() {
      const newValue = row.querySelector('.settings-input').value.trim();
      if (!newValue) return alert('Value cannot be empty.');
      try {
        const update = { [field]: newValue };
        let updateUrl = '';
        if (userType === 'teacher') {
          updateUrl = `/api/teachers/updateteacher/${userId}`;
        } else {
          updateUrl = `/api/students/updatestudents/${userId}`;
        }
        const res = await fetch(updateUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
        if (!res.ok) throw new Error('Failed to update');
        info[field] = newValue;
        renderInfo();
      } catch {
        alert('Failed to update.');
      }
    };
    row.querySelector('.settings-cancel-btn').onclick = function() {
      renderInfo();
    };
  }

  document.getElementById('teacher-info').addEventListener('click', function(e) {
    const btn = e.target.closest('.settings-edit-btn');
    if (!btn) return;
    const field = btn.getAttribute('data-field');
    renderEdit(field);
  });

  document.getElementById('logout-btn').onclick = function() {
    localStorage.clear();
    window.location.href = logoutRedirect;
  };

  fetchUser();
}); 