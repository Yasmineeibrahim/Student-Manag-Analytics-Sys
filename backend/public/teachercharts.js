(async function () {
  // Show teacher name from localStorage
  const teacherName = localStorage.getItem('teacherName');
  if (teacherName) {
    const nameEl = document.getElementById('teacherName');
    if (nameEl) nameEl.textContent = teacherName;
  }

  // Get teacher ID
  const teacherId = localStorage.getItem('teacherId');
  if (!teacherId) {
    console.warn('No teacherId in localStorage');
    return;
  }

  // Fetch courses
  try {
    const res = await fetch(`/api/teachers/${teacherId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const { courses, studentsWithAvg } = await res.json();

    // Render teacher's courses in the .resources-list section
    const lessonsList = document.querySelector('.resources-list');
    if (lessonsList) {
      lessonsList.innerHTML = '';
      courses.forEach(course => {
        const div = document.createElement('div');
        div.classList.add('resource-row');
        div.innerHTML = `
          <span class="resource-badge badge-a1">A1</span>
          <span class="resource-title">${course.Course_Name || 'Unnamed Course'}</span>
          <span class="resource-file">Syllabus.pdf</span>
          <span class="resource-status">• Only view</span>
          <span class="resource-members">${Array.isArray(course.Students) ? course.Students.length : 0} members</span>
          <span class="resource-size">28 MB</span>
        `;
        lessonsList.appendChild(div);
      });
    }

  } catch (error) {
    console.error('Error loading courses:', error);
  }

  // Doughnut chart static data
  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
  const doughnutConfig = {
    type: 'doughnut',
    data: doughnutData
  };
  const avgGpaCanvas = document.getElementById('average-gpas');
  if (avgGpaCanvas) new Chart(avgGpaCanvas, doughnutConfig);
  else console.error('#average-gpas canvas not found');

  // Bar chart static example
  try {
    const res = await fetch(`/api/teachers/${teacherId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const { studentsWithAvg } = await res.json();

    // Sort students by avgGrade descending
    const sortedStudents = studentsWithAvg.sort((a, b) => b.avgGrade - a.avgGrade);
    // Pick 5 random students
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
    // Map avgGrade to letter for display
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
            label: 'Average Grade per Student',
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
