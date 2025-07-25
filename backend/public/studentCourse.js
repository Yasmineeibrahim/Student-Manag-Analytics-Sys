// Student Course Details JS
document.addEventListener("DOMContentLoaded", function() {
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  if (!studentId || !token) {
    window.location.href = "/studentLogin.html";
    return;
  }

  // Helper function to make authenticated requests
  async function fetchWithAuth(url, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  }

  // Function to get course ID from URL
  function getCourseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  // Function to load course details
  async function loadCourseDetails() {
    const courseId = getCourseIdFromUrl();
    const courseDetailsElement = document.getElementById("course-details");

    if (!courseId) {
      courseDetailsElement.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ff5e5e;">
          No course ID provided. <a href="/studentDashboard.html" style="color: #2e6a4a; text-decoration: underline;">Return to Dashboard</a>
        </div>
      `;
      return;
    }

    try {
      const [courseRes, gradesRes] = await Promise.all([
        fetchWithAuth(`/api/courses/${courseId}`),
        fetchWithAuth("/api/grades/fetchgrades")
      ]);

      if (!courseRes.ok) {
        throw new Error("Failed to fetch course");
      }

      const course = await courseRes.json();
      if (!course) {
        courseDetailsElement.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #ff5e5e;">
            Course not found. <a href="/studentDashboard.html" style="color: #2e6a4a; text-decoration: underline;">Return to Dashboard</a>
          </div>
        `;
        return;
      }

      let studentGrade = "-";
      if (gradesRes.ok) {
        const grades = await gradesRes.json();
        const gradeDoc = grades.find(
          (g) => g.Student === studentId && g.Course === course._id
        );
        if (gradeDoc && gradeDoc.Grade) {
          studentGrade = gradeDoc.Grade;
        }
      }

      courseDetailsElement.innerHTML = `
        <div class="course-students-flex">
          <div class="students-list-section">
            <h3 class="course-section-title">
              <span>Classmates</span>
            </h3>
            ${
              Array.isArray(course.Students) && course.Students.length > 0
                ? `<div class='resources-list'>${course.Students.map(
                    (s) => `
                  <div class="resource-row">
                    <span class="resource-badge badge-a1">${
                      s.Student_Name
                        ? s.Student_Name.charAt(0).toUpperCase()
                        : "?"
                    }</span>
                    <span class="resource-title">${s.Student_Name}</span>
                    <span class="resource-members year">${
                      s.Year ? `Year: ${s.Year}` : "Year: -"
                    }</span>
                  </div>`
                  ).join("")}</div>`
                : '<div class="resources-list"><div class="resource-row"><span class="resource-title course-empty">No students enrolled.</span></div></div>'
            }
          </div>
          <div class="course-details-section">
            <div style="margin-bottom: 24px;">
              <a href="/studentDashboard.html" style="color: #888; text-decoration: none;">
                <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
              </a>
            </div>
            <h2 class="course-title">${course.Course_Name}</h2>
            <div class="course-teacher" style="font-size:1.1rem; color:#888; margin-bottom:10px;">
              Instructor: ${course.Instructor || "-"}
            </div>
            <div class="course-info-horizontal">
              <div class="course-meta-horizontal">
                <span class="course-info-label">Course Code:</span>
                <span class="course-info-value">${course.Course_Code}</span>
              </div>
              <div class="course-meta-horizontal">
                <span class="course-info-label">Credit Hours:</span>
                <span class="course-info-value">${course.Credit_Hours}</span>
              </div>
              <div class="course-meta-horizontal">
                <span class="course-info-label">Number of Students:</span>
                <span class="course-info-value">${
                  Array.isArray(course.Students) ? course.Students.length : 0
                }</span>
              </div>
              <div class="course-meta-horizontal">
                <span class="course-info-label">Your Grade:</span>
                <span class="course-info-value" style="color: ${
                  studentGrade === 'A' ? '#4ecb7a' :
                  studentGrade === 'B' ? '#2e6a4a' :
                  studentGrade === 'C' ? '#f1c40f' :
                  studentGrade === 'D' ? '#ff8922' :
                  studentGrade === 'F' ? '#ff5e5e' : '#888'
                }; font-weight: 600;">${studentGrade}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error("Error loading course details:", err);
      courseDetailsElement.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ff5e5e;">
          Error loading course details. Please try again later.<br>
          <a href="/studentDashboard.html" style="color: #2e6a4a; text-decoration: underline;">Return to Dashboard</a>
        </div>
      `;
    }
  }

  // Load course details when the page loads
  loadCourseDetails();
}); 