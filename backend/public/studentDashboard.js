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
            <button class="resource-btn view" onclick="location.href='/studentCourse.html?id=${course._id}'">View Course</button>
          `;
          lessonsList.appendChild(div);
        });
      })
      .catch(err => {
        lessonsList.innerHTML = '<div style="color:red">Failed to load courses.</div>';
      });
  }
});



function getCourseIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}
async function loadCourseDetails() {
  const courseId = getCourseIdFromUrl();
  if (!courseId) {
    document.getElementById('course-details').textContent = 'No course ID provided.';
    return;
  }
  try {
    const res = await fetch(`/api/courses/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    const course = await res.json();
    if (!course) {
      document.getElementById('course-details').textContent = 'Course not found.';
      return;
    }
    let studentGrade = '-';
    try {
      const studentId = localStorage.getItem('studentId');
      const gradesRes = await fetch('/api/grades/fetchgrades');
      if (gradesRes.ok) {
        const grades = await gradesRes.json();
        console.log('Grades:', grades, 'Student:', studentId, 'Course:', course._id);
        const gradeDoc = grades.find(g => g.Student === studentId && g.Course === course._id);
        console.log('Found gradeDoc:', gradeDoc);
        if (gradeDoc && gradeDoc.Grade) {
          studentGrade = gradeDoc.Grade;
        }
      }
    } catch (e) {
      console.error(e);
    }
    document.getElementById('course-details').innerHTML = `
      <div class="course-students-flex">
        <div class="students-list-section">
          <h3 class="course-section-title">
            <span>Classmates.</span>
          </h3>
          ${Array.isArray(course.Students) && course.Students.length > 0
            ? `<div class='resources-list'>${course.Students.map(s => `
                <div class="resource-row">
                  <span class="resource-badge badge-a1">${s.Student_Name ? s.Student_Name.charAt(0).toUpperCase() : '?'}</span>
                  <span class="resource-title">${s.Student_Name}</span>
                  <span class="resource-members year">${s.Year ? `Year: ${s.Year}` : 'Year: -'}</span>
                </div>`).join('')}</div>`
            : '<div class="resources-list"><div class="resource-row"><span class="resource-title course-empty">No students enrolled.</span></div></div>'}
        </div>
        <div class="course-details-section">
          <h2 class="course-title">${course.Course_Name}</h2>
          <div class="course-teacher" style="font-size:1.1rem; color:#888; margin-bottom:10px;">Instructor: ${course.Instructor || '-'}</div>
          <div class="course-info-horizontal">
            <div class="course-meta-horizontal"><span class="course-info-label">Course Code:</span> <span class="course-info-value">${course.Course_Code}</span></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Credit Hours:</span> <span class="course-info-value">${course.Credit_Hours}</span></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Number of Students:</span> <span class="course-info-value">${Array.isArray(course.Students) ? course.Students.length : 0}</span></div>
            <div class="course-meta-horizontal"><span class="course-info-label">Your Grade:</span> <span class="course-info-value">${studentGrade}</span></div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    document.getElementById('course-details').textContent = 'Error loading course details.';
  }
}

window.addEventListener('DOMContentLoaded', loadCourseDetails);

function renderCoursesBarChart(courses, grades, studentId) {
  // Prepare data
  const courseNames = courses.map(c => c.Course_Name || c.Course_Code || 'Course');
  const courseIds = courses.map(c => c._id);
  const courseGrades = courseIds.map(cid => {
    const gradeDoc = grades.find(g => g.Student === studentId && g.Course === cid);
    return gradeDoc && gradeDoc.Grade ? gradeDoc.Grade : null;
  });
  // Convert letter grades to numbers for charting
  const gradeMap = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  const chartGrades = courseGrades.map(g => gradeMap[g] !== undefined ? gradeMap[g] : null);

  // Remove previous chart if exists
  const chartContainer = document.getElementById('courses-bar-chart-container');
  if (chartContainer) chartContainer.innerHTML = '<canvas id="courses-bar-chart"></canvas>';

  const canvas = document.getElementById('courses-bar-chart');
  if (!canvas) {
    console.error('Canvas for bar chart not found!');
    return;
  }
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: courseNames,
      datasets: [{
        label: 'Your Grade',
        data: chartGrades,
        backgroundColor: '#4ecb7a',
        borderRadius: 8,
      }]
    },
    options: {
      scales: {
        y: {
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return ['F','D','C','B','A'][value] || value;
            }
          },
          title: { display: true, text: 'Grade' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
  // Ensure the chart title is present
  const chartContainerEl = document.getElementById('courses-bar-chart-container');
  if (chartContainerEl && !chartContainerEl.querySelector('.courses-bar-chart-title')) {
    chartContainerEl.insertAdjacentHTML('afterbegin', '<div class="courses-bar-chart-title">Course Grades Comparison</div>');
  }
}

async function showStudentRank() {
  const studentId = localStorage.getItem('studentId');
  let studentGPA = parseFloat(localStorage.getItem('studentGPA'));
  let studentGrade = localStorage.getItem('studentGrade');

  if (!studentGrade || isNaN(parseInt(studentGrade))) {
    if (studentId) {
      const res = await fetch('/api/students/fetchstudents');
      if (res.ok) {
        const allStudents = await res.json();
        const me = allStudents.find(s => s._id === studentId);
        if (me) {
          studentGrade = me.Grade;
          studentGPA = me.GPA;
          localStorage.setItem('studentGrade', studentGrade);
        }
      }
    }
  } else {
    studentGrade = parseInt(studentGrade);
  }

  if (!studentId || isNaN(studentGPA) || isNaN(studentGrade)) return;

 
  const res = await fetch('/api/students/fetchstudents');
  if (!res.ok) return;
  const allStudents = await res.json();


  const sameGrade = allStudents.filter(s => s.Grade === studentGrade);

 
  sameGrade.sort((a, b) => b.GPA - a.GPA);

 
  const rank = sameGrade.findIndex(s => s._id === studentId) + 1;

  const container = document.querySelector('.left-vertical-container');
  if (container) {
    container.innerHTML = `
      <div style="padding:32px; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; height:100%;">
        <dotlottie-wc
          src="https://lottie.host/40337ab6-145b-421e-809f-ec95ff83c7bd/J2sqHYvbip.lottie"
          style="width: 180px; height: 180px; margin-bottom: 16px;"
          speed="1"
          autoplay
          loop
        ></dotlottie-wc>
        <div style="font-size:2.5rem; font-weight:700; color:#2e6a4a;">#${rank}</div>
        <div style="font-size:1.2rem; color:#888;">Your rank in Grade ${studentGrade}</div>
        <div style="margin-top:12px; font-size:1rem;">Out of ${sameGrade.length} students</div>
      </div>
    `;
  }
}
document.addEventListener('DOMContentLoaded', showStudentRank);

document.addEventListener('DOMContentLoaded', async function() {
  const studentGPA = localStorage.getItem('studentGPA');
  if (studentGPA) {
    document.getElementById('student-gpa').textContent = studentGPA;
  }

  const studentId = localStorage.getItem('studentId');
  const lessonsList = document.querySelector('.resources-list');
  if (studentId && lessonsList) {
   
    const [coursesRes, gradesRes] = await Promise.all([
      fetch(`/api/students/${studentId}/courses`),
      fetch('/api/grades/fetchgrades')
    ]);
    const coursesData = await coursesRes.json();
    const grades = gradesRes.ok ? await gradesRes.json() : [];
    const courses = coursesData.courses || [];
    lessonsList.innerHTML = '';
    courses.forEach(course => {
      const div = document.createElement('div');
      div.classList.add('resource-row');
      div.innerHTML = `
        <span class="resource-badge badge-a1">${course.Course_Code || 'N/A'}</span>
        <span class="resource-title">${course.Course_Name || 'Unnamed Course'}</span>
        <span class="resource-members">${Array.isArray(course.Students) ? course.Students.length : 0} members</span>
        <button class="resource-btn view" onclick="location.href='/studentCourse.html?id=${course._id}'">View Course</button>
      `;
      lessonsList.appendChild(div);
    });
  
    let chartContainer = document.getElementById('courses-bar-chart-container');
    if (!chartContainer) {
      chartContainer = document.createElement('div');
      chartContainer.id = 'courses-bar-chart-container';
      chartContainer.innerHTML = `
        <div class="courses-bar-chart-title">Course Grades Comparison</div>
        <canvas id="courses-bar-chart"></canvas>
      `;
      console.log('Chart container HTML (created):', chartContainer.innerHTML);
      lessonsList.parentNode.insertBefore(chartContainer, lessonsList.nextSibling);
      console.log('Chart container DOM (created):', chartContainer);
    } else {
      chartContainer.innerHTML = `
        <div class="courses-bar-chart-title">Course Grades Comparison</div>
        <canvas id="courses-bar-chart"></canvas>
      `;
      console.log('Chart container HTML (updated):', chartContainer.innerHTML);
      console.log('Chart container DOM (updated):', chartContainer);
    }

    setTimeout(() => renderCoursesBarChart(courses, grades, studentId), 0);
  }
}); 
