// settingsPage.js
window.addEventListener('DOMContentLoaded', async function() {
  const teacherId = localStorage.getItem('teacherId');
  if (!teacherId) {
    alert('No teacherId found. Please log in again.');
    window.location.href = '/teacherLogin.html';
    return;
  }
  const info = {
    Teacher_Name: '',
    Email: '',
    Password: ''
  };
  const nameEl = document.getElementById('teacher-name');
  const emailEl = document.getElementById('teacher-email');
  const passwordEl = document.getElementById('teacher-password');

  async function fetchTeacher() {
    try {
      const res = await fetch(`/api/teachers/${teacherId}`);
      if (!res.ok) throw new Error('Failed to fetch teacher info');
      const teacher = await res.json();
      info.Teacher_Name = teacher.Teacher_Name || '';
      info.Email = teacher.Email || '';
      info.Password = teacher.Password || '';
      renderInfo();
    } catch (err) {
      alert('Error loading teacher info.');
    }
  }

  function renderInfo() {
    document.getElementById('teacher-info').innerHTML = `
      <div class="settings-row">
        <span class="settings-label">Name:</span>
        <span class="settings-value" id="teacher-name">${info.Teacher_Name}</span>
        <button class="settings-edit-btn" data-field="Teacher_Name"><i class="fa fa-pen"></i></button>
      </div>
      <div class="settings-row">
        <span class="settings-label">Email:</span>
        <span class="settings-value" id="teacher-email">${info.Email}</span>
        <button class="settings-edit-btn" data-field="Email"><i class="fa fa-pen"></i></button>
      </div>
      <div class="settings-row">
        <span class="settings-label">Password:</span>
        <span class="settings-value" id="teacher-password">********</span>
        <button class="settings-edit-btn" data-field="Password"><i class="fa fa-pen"></i></button>
      </div>
    `;
  }

  function renderEdit(field) {
    let value = info[field] || '';
    let row = document.querySelector(`.settings-edit-btn[data-field="${field}"]`).parentElement;
    row.innerHTML = `
      <span class="settings-label">${field === 'Teacher_Name' ? 'Name:' : field === 'Email' ? 'Email:' : 'Password:'}</span>
      <input class="settings-input" type="${field === 'Password' ? 'password' : 'text'}" value="${value}" style="font-size:1rem;padding:6px 10px;border-radius:8px;border:1px solid #d1d5d8;">
      <button class="settings-save-btn"><i class="fa fa-check" style="color:#4ecb7a;"></i></button>
      <button class="settings-cancel-btn"><i class="fa fa-times" style="color:#a82929;"></i></button>
    `;
    row.querySelector('.settings-save-btn').onclick = async function() {
      const newValue = row.querySelector('.settings-input').value.trim();
      if (!newValue) return alert('Value cannot be empty.');
      try {
        const update = { [field]: newValue };
        const res = await fetch(`/api/teachers/updateteacher/${teacherId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
        if (!res.ok) throw new Error('Failed to update');
        info[field] = newValue;
        // Exit edit mode and show updated value
        renderInfo();
      } catch {
        alert('Failed to update.');
      }
    };
    row.querySelector('.settings-cancel-btn').onclick = function() {
      // Exit edit mode and revert to original value
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
    window.location.href = '/teacherLogin.html';
  };

  fetchTeacher();
}); 