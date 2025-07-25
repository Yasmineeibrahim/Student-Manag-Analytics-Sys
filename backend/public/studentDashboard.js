// Student Dashboard JS
// Handles loading student data, rendering course and GPA charts, and displaying student rank.
document.addEventListener("DOMContentLoaded", function () {
  // Update student GPA display
  const studentGPA = localStorage.getItem("studentGPA");
  const gpaElement = document.getElementById("student-gpa");
  if (studentGPA && gpaElement) {
    gpaElement.textContent = studentGPA;
  }

  // Update student name display
  const studentName = localStorage.getItem("studentName");
  const nameElement = document.getElementById("studentName");
  if (studentName && nameElement) {
    nameElement.textContent = studentName;
  }

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");
  const lessonsList = document.querySelector(".resources-list");

  // Helper function to make authenticated requests
  async function fetchWithAuth(url, options = {}) {
    if (!token) {
      window.location.href = "/studentLogin.html";
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  }

  // Function to show student rank
  async function showStudentRank() {
    try {
      const [studentRes, peersRes] = await Promise.all([
        fetchWithAuth(`/api/students/${studentId}`),
        fetchWithAuth("/api/students/fetchstudents")
      ]);

      if (!studentRes.ok || !peersRes.ok) {
        throw new Error("Failed to fetch student data");
      }

      const student = await studentRes.json();
      const peers = await peersRes.json();

      // Filter peers in the same grade and sort by GPA
      const sameGradePeers = peers
        .filter(p => p.Grade === student.Grade)
        .sort((a, b) => b.GPA - a.GPA);

      // Find student's rank
      const rank = sameGradePeers.findIndex(p => p._id === studentId) + 1;

      const container = document.querySelector(".left-vertical-container");
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
            <div style="font-size:1.2rem; color:#888;">Your rank in Grade ${student.Grade}</div>
            <div style="margin-top:12px; font-size:1rem;">Out of ${sameGradePeers.length} students</div>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error showing student rank:", error);
      const container = document.querySelector(".left-vertical-container");
      if (container) {
        container.innerHTML = `
          <div style="padding:32px; text-align:center; color:#ff5e5e;">
            Unable to load rank information. Please try again later.
          </div>
        `;
      }
    }
  }

  // Load and display courses
  if (studentId && lessonsList) {
    fetchWithAuth(`/api/students/${studentId}/courses`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/studentLogin.html";
            throw new Error("Unauthorized");
          }
          throw new Error("Failed to fetch courses");
        }
        return res.json();
      })
      .then((data) => {
        lessonsList.innerHTML = "";
        if (!data.courses || data.courses.length === 0) {
          lessonsList.innerHTML = '<div class="resource-row"><span class="resource-title" style="color: #888;">No courses enrolled.</span></div>';
          return;
        }
        data.courses.forEach((course) => {
          const div = document.createElement("div");
          div.classList.add("resource-row");
          div.innerHTML = `
            <span class="resource-badge badge-a1">${
              course.Course_Code || "N/A"
            }</span>
            <span class="resource-title">${
              course.Course_Name || "Unnamed Course"
            }</span>
            <span class="resource-members">${
              Array.isArray(course.Students) ? course.Students.length : 0
            } members</span>
            <button class="resource-btn view" onclick="location.href='/studentCourse.html?id=${
              course._id
            }'">View Course</button>
          `;
          lessonsList.appendChild(div);
        });

        // After loading courses, fetch grades and render charts
        return Promise.all([
          Promise.resolve(data.courses),
          fetchWithAuth("/api/grades/fetchgrades").then(res => res.json())
        ]);
      })
      .then(([courses, grades]) => {
        renderCoursesBarChart(courses, grades, studentId);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        lessonsList.innerHTML =
          '<div class="resource-row"><span class="resource-title" style="color: #ff5e5e;">Failed to load courses. Please try again.</span></div>';
      });
  }

  // Function to render the courses bar chart
  function renderCoursesBarChart(courses, grades, studentId) {
    const courseNames = courses.map(c => c.Course_Name || c.Course_Code || "Course");
    const courseIds = courses.map(c => c._id);
    const courseGrades = courseIds.map(cid => {
      const gradeDoc = grades.find(g => g.Student === studentId && g.Course === cid);
      return gradeDoc ? gradeDoc.Grade : null;
    });

    const gradeMap = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const chartGrades = courseGrades.map(g => gradeMap[g] !== undefined ? gradeMap[g] : null);

    const canvas = document.getElementById("courses-bar-chart");
    if (!canvas) {
      console.error("Courses bar chart canvas not found");
      return;
    }

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: courseNames,
        datasets: [{
          label: "Course Grades",
          data: chartGrades,
          backgroundColor: "#4ecb7a",
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 4,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return ["F", "D", "C", "B", "A"][value] || "";
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  // Function to render GPA comparison chart
  async function renderGpaComparisonChart() {
    try {
      const [studentRes, peersRes] = await Promise.all([
        fetchWithAuth(`/api/students/${studentId}`),
        fetchWithAuth("/api/students/fetchstudents")
      ]);

      if (!studentRes.ok || !peersRes.ok) {
        throw new Error("Failed to fetch student data");
      }

      const student = await studentRes.json();
      const peers = await peersRes.json();

      // Filter peers in the same grade and sort by GPA
      const sameGradePeers = peers
        .filter(p => p.Grade === student.Grade)
        .sort((a, b) => b.GPA - a.GPA);

      const labels = sameGradePeers.map(p => 
        p._id === studentId ? `${p.Student_Name} (You)` : p.Student_Name
      );
      const gpas = sameGradePeers.map(p => p.GPA || 0);

      const canvas = document.getElementById("gpa-comparison-bar-chart");
      if (!canvas) {
        console.error("GPA comparison chart canvas not found");
        return;
      }

      new Chart(canvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            data: gpas,
            backgroundColor: labels.map(l => l.includes("(You)") ? "#4ecb7a" : "#b2d8c5"),
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 4,
              ticks: {
                stepSize: 0.5
              },
              title: {
                display: true,
                text: "GPA"
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context) {
                  return `GPA: ${context.raw.toFixed(2)}`;
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error("Error rendering GPA comparison chart:", error);
    }
  }

  // Initialize charts and rank if student is logged in
  if (studentId) {
    renderGpaComparisonChart();
    showStudentRank();
  }
});
