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
  const viewBtn = courseRow?.querySelector('.resource-btn.view');
  const courseId = viewBtn?.href?.split('=')[1];

  if (!courseId) return alert('Course ID not found.');

  if (!confirm('Are you sure you want to remove this course?')) return;

  try {
    const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
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
          <button class="course-delete-btn" aria-label="Delete"><i class="fa-solid fa-trash" style="color: #a82929;"></i></button>
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

    const sortedStudents = studentsWithAvg.sort((a, b) => b.avgGrade - a.avgGrade);

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

    const random5 = getRandom(sortedStudents, 5);
    const barLabels = random5.map(s => s.name);
    const barData = random5.map(s => s.avgGrade);

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
