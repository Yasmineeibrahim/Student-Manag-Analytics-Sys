
window.addEventListener('DOMContentLoaded', async function() {
  // Get the teacherId and studentId from localStorage
  const teacherId = localStorage.getItem('teacherId');
  const studentId = localStorage.getItem('studentId');
  let userType = null;
  let userId = null;
  let info = {};
  let fields = [];
  let apiBase = '';
  let logoutRedirect = '';
  // Determine if the user is a teacher or student based on the IDs
  // If both IDs are present, prioritize teacher
  if (teacherId) {
    userType = 'teacher';
    userId = teacherId;
    info = { Teacher_Name: '', Email: '', Password: '' };
    // Define the fields for the teacher settings
    // These fields will be displayed in the settings page
    fields = [
      { key: 'Teacher_Name', label: 'Name', type: 'text' },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Password', label: 'Password', type: 'password' }
    ];
    // Set the API base URL and logout redirect for teacher
    // This will be used to fetch and update teacher information
    apiBase = '/api/teachers';
    logoutRedirect = '/teacherLogin.html';
    //if its not a teacher and a student is logged in
  } else if (studentId) {
    userType = 'student';
    userId = studentId;
    info = { Student_Name: '', Email: '', Password: '' };
    // Define the fields for the student settings
    // These fields will be displayed in the settings page
    fields = [
      { key: 'Student_Name', label: 'Name', type: 'text' },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Password', label: 'Password', type: 'password' }
    ];
    // Set the API base URL and logout redirect for student
    // This will be used to fetch and update student information
    apiBase = '/api/students';
    // Set the logout redirect for student
    logoutRedirect = '/studentLogin.html';
  } else {
    alert('No user found. Please log in again.');
    window.location.href = '/';
    return;
  }
  // Fetch user information based on the user type and ID
  // This function will make an API call to get the user details
  async function fetchUser() {
    try {
      let fetchUrl = '';
      if (userType === 'teacher') {
        // Fetch teacher information by ID
        fetchUrl = `/api/teachers/${userId}`;
        //Fetch student information by ID
      } else {
        fetchUrl = `/api/students/${userId}`;
      }
      // Make the API call to fetch user information
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error('Failed to fetch user info');
      const user = await res.json();
      // Populate the info object with user details
      // This will be used to display the user information in the settings page fields
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
// Render the user information in the settings page
// This function will create HTML elements to display the user details
  function renderInfo() {
    document.getElementById('teacher-info').innerHTML = fields.map(f => `
      <div class="settings-row">
        <span class="settings-label">${f.label}:</span>
        <span class="settings-value" id="${f.key}">${f.key === 'Password' ? '********' : info[f.key]}</span>
        <button class="settings-edit-btn" data-field="${f.key}"><i class="fa fa-pen"></i></button>
      </div>
    `).join('');
  }
// Render the editable fields when the user clicks on the edit button
// This function will replace the static text with input fields for editing
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
    // Add event listeners for save 

    row.querySelector('.settings-save-btn').onclick = async function() {
      // Get the new value from the input field
      const newValue = row.querySelector('.settings-input').value.trim();
      if (!newValue) return alert('Value cannot be empty.');
      try {
        const update = { [field]: newValue };
        let updateUrl = '';
        if (userType === 'teacher') {
          // Set the update URL for teacher
          updateUrl = `/api/teachers/updateteacher/${userId}`;
        } else {
          // Set the update URL for student
          updateUrl = `/api/students/updatestudents/${userId}`;
        }
        // Make the API call to update the user information
        // This will send the updated value to the server
        
        const res = await fetch(updateUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          // If the update is successful, update the info object and re-render the info
          body: JSON.stringify(update)
        });
        if (!res.ok) throw new Error('Failed to update');
        info[field] = newValue;
        renderInfo();
      } catch {
        alert('Failed to update.');
      }
    };
    //add event listener for cancel button
    row.querySelector('.settings-cancel-btn').onclick = function() {
      renderInfo();
    };
  }
  // Add event listeners for edit buttons
  // This will allow the user to click on the edit button to modify their information
  document.getElementById('teacher-info').addEventListener('click', function(e) {
    const btn = e.target.closest('.settings-edit-btn');
    if (!btn) return;
    const field = btn.getAttribute('data-field');
    // Call the renderEdit function to make the field editable
    renderEdit(field);
  });
  // Add event listener for logout button
  document.getElementById('logout-btn').onclick = function() {
    // Clear the localStorage 
    localStorage.clear();
    // Redirect the user to the login page based on their type
    window.location.href = logoutRedirect;
  };
// Fetch the user information when the page loads
  fetchUser();
}); 