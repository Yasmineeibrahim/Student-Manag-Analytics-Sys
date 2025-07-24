// Teacher Charts JS
// Handles loading teacher's courses, GPA analytics, and rendering charts for teacher dashboard.
(async function () {
  const teacherName = localStorage.getItem('teacherName');
  if (teacherName) {
    const nameEl = document.getElementById('teacherName');
    if (nameEl) nameEl.textContent = teacherName;
  }

  const teacherId = localStorage.getItem('teacherId');
  if (!teacherId) {
    console.warn('No teacherId in localStorage');
    return;
  }
  document.querySelector('.resources-list')?.addEventListener('click', async function (e) {
  const btn = e.target.closest('.course-delete-btn');
  if (!btn) return;

  const courseRow = btn.closest('.resource-row');
  const courseId = btn.getAttribute('data-id');

  if (!courseId) return alert('Course ID not found.');

  if (!confirm('Are you sure you want to remove this course?')) return;

  try {
    const res = await fetch(`/api/courses/deletecourse/${courseId}`, { method: 'DELETE' });
    if (res.ok) {
      courseRow.remove();
    } else {
      alert('Failed to remove course.');
    }
  } catch (err) {
    alert('Server error. Try again later.');
  }
});

  
  let doughnutData;

  try {
    const res = await fetch(`/api/teachers/${teacherId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const { courses, studentsWithAvg } = await res.json();

    const gpaCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    studentsWithAvg.forEach(s => {
      const g = s.avgGrade;
      if (g >= 3.5) gpaCounts.A++;
      else if (g >= 2.5) gpaCounts.B++;
      else if (g >= 1.5) gpaCounts.C++;
      else if (g >= 0.5) gpaCounts.D++;
      else gpaCounts.F++;
    });

    doughnutData = {
      labels: ['A (3.5–4.0)', 'B (2.5–3.49)', 'C (1.5–2.49)', 'D (0.5–1.49)', 'F (<0.5)'],
      datasets: [{
        label: 'GPA Distribution',
        data: [gpaCounts.A, gpaCounts.B, gpaCounts.C, gpaCounts.D, gpaCounts.F],
        backgroundColor: [
          '#01451eff',
          '#00375cff',
          '#f1c40f', 
          '#ff8922ff', 
          '#ffbdf1ff'  
        ],
        hoverOffset: 4
      }]
    };

    const avgGpa = studentsWithAvg.reduce((sum, s) => sum + s.avgGrade, 0) / studentsWithAvg.length || 0;

    const gpaNumberEl = document.getElementById('gpa-number');
    if (gpaNumberEl) {
      gpaNumberEl.textContent = avgGpa.toFixed(2);
    } else {
      console.error('#gpa-number element not found');
    }

    const lessonsList = document.querySelector('.resources-list');
    if (lessonsList) {
      lessonsList.innerHTML = '';
      courses.forEach(course => {
        const div = document.createElement('div');
        div.classList.add('resource-row');
        div.innerHTML = `
          <span class="resource-badge badge-a1">${course.Course_Code.split(' ')[0] || 'N/A'}</span>
          <span class="resource-title">${course.Course_Name || 'Unnamed Course'}</span>
          <span class="resource-members">${Array.isArray(course.Students) ? course.Students.length : 0} members</span>
          <button class="resource-btn view" onclick="location.href='teacherCourse.html?id=${course._id}'">View Course</button>
          <button class="course-delete-btn" data-id="${course._id}" aria-label="Delete"><i class="fa-solid fa-trash" style="color: #a82929;"></i></button>
        `;
        lessonsList.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Error loading courses:', error);
  }


  const doughnutConfig = {
    type: 'doughnut',
    data: doughnutData
  };
  const avgGpaCanvas = document.getElementById('average-gpas');
  if (avgGpaCanvas) new Chart(avgGpaCanvas, doughnutConfig);
  else console.error('#average-gpas canvas not found');


  try {
    const res = await fetch(`/api/teachers/${teacherId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const { studentsWithAvg } = await res.json();

    /**
     * Helper to get a random subset of n elements from an array.
     * @param {Array} arr - The array to sample from.
     * @param {number} n - Number of elements to select.
     * @returns {Array} Randomly selected elements.
     */
    function getRandom(arr, n) {
      const result = [];
      const taken = new Set();
      while (result.length < n && result.length < arr.length) {
        const idx = Math.floor(Math.random() * arr.length);
        if (!taken.has(idx)) {
          taken.add(idx);
          result.push(arr[idx]);
        }
      }
      return result;
    }

    const sortedStudents = studentsWithAvg.slice().sort((a, b) => a.name.localeCompare(b.name));
    const random5 = getRandom(sortedStudents, 5);
    const barLabels = random5.map(s => s.name);
    const barData = random5.map(s => s.avgGrade);

    /**
     * Converts a numeric grade to a letter grade (A-F).
     * @param {number} grade - Numeric grade (0-4 scale).
     * @returns {string} Letter grade.
     */
    function gradeToLetter(grade) {
      if (grade >= 3.5) return 'A';
      if (grade >= 2.5) return 'B';
      if (grade >= 1.5) return 'C';
      if (grade >= 0.5) return 'D';
      return 'F';
    }

    const barCanvas = document.getElementById('students-list');
    if (barCanvas) {
      new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: barLabels,
          datasets: [{
            label: 'Average Grade',
            data: barData,
            backgroundColor: '#2e6a4a',
            datalabels: {
              anchor: 'end',
              align: 'end',
              formatter: (value) => gradeToLetter(value)
            }
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          barThickness: 10,
          borderRadius: 8,
          scales: {
            x: {
              display: true,
              grid: { display: false },
              min: 0,
              max: 4,
              ticks: {
                callback: function(value) {
                  if (value === 0) return 'F';
                  if (value === 1) return 'D';
                  if (value === 2) return 'C';
                  if (value === 3) return 'B';
                  if (value === 4) return 'A';
                  return '';
                },
                stepSize: 1
              }
            },
            y: { grid: { display: false } }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    } else {
      console.error('#students-list canvas not found');
    }
  } catch (error) {
    console.error('Error loading courses for bar chart:', error);
  }

})();

console.log('teachercharts.js loaded');

window.addEventListener('DOMContentLoaded', function() {
  const addCourseBtn = document.querySelector('.add-course');
  const addCourseModal = document.getElementById('add-course-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const addCourseForm = document.getElementById('add-course-form');

  if (addCourseBtn && addCourseModal && closeModalBtn && addCourseForm) {
    addCourseBtn.addEventListener('click', function() {

      const teacherName = localStorage.getItem('teacherName') || '';
      const instructorInput = document.querySelector('#add-course-form input[name="Instructor"]');
      if (instructorInput) {
        instructorInput.value = teacherName;
        instructorInput.readOnly = true;
      }
      addCourseModal.style.display = 'flex';
    });
    closeModalBtn.addEventListener('click', function() {
      addCourseModal.style.display = 'none';
    });
    addCourseForm.addEventListener('submit', async function(e) {
      console.log('Add course form submitted');
      e.preventDefault();
      const form = e.target;
      const data = {
        Course_Name: form.Course_Name.value.trim(),
        Course_Code: form.Course_Code.value.trim(),
        Credit_Hours: Number(form.Credit_Hours.value),
        Instructor: form.Instructor.value.trim(),
        Students: []
      };
      try {
        const res = await fetch('/api/courses/createcourse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const result = await res.json();
          console.log('Create course API response:', result);
          console.log('result.Course:', result.Course);
          console.log('result.Course[0]:', result.Course && result.Course[0]);
          let newCourseId = null;
          if (Array.isArray(result.Course) && result.Course[0] && result.Course[0]._id) {
            newCourseId = result.Course[0]._id;
          } else if (result.Course && result.Course._id) {
            newCourseId = result.Course._id;
          }
          console.log('Extracted newCourseId:', newCourseId);

          if (!newCourseId) {
            alert('Failed to get new course ID. Please try again.');
            return;
          }

          const teacherId = localStorage.getItem('teacherId');
          console.log('teacherId from localStorage:', teacherId);
          if (teacherId) {
            const teacherRes = await fetch(`/api/teachers/${teacherId}`);
            const teacher = teacherRes.ok ? await teacherRes.json() : null;
            console.log('Fetched teacher object:', teacher);
            if (teacher && teacher.Courses) {
              const updatedCourses = [...teacher.Courses, newCourseId];
              console.log('Attempting to update teacher with new course:', { teacherId, newCourseId, updatedCourses });
              const updateRes = await fetch(`/api/teachers/updateteacher/${teacherId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Courses: updatedCourses })
              });
              const updateResult = await updateRes.json();
              console.log('Teacher update response:', updateResult);
            }
          }
          alert('Course created!');
          addCourseModal.style.display = 'none';

        } else {
          const err = await res.json();
          alert('Failed to create course: ' + (err.message || 'Unknown error'));
        }
      } catch (err) {
        alert('Server error. Try again later.');
        console.error(err);
      }
    });
  } else {
    console.log('Modal or form elements not found:', { addCourseBtn, addCourseModal, closeModalBtn, addCourseForm });
  }
});
