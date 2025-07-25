//handle teacher login
//get teacher login form from teacherLogin.html
const teacherForm = document.getElementById("teacher-login-form");
if (teacherForm) {
  //add event listener for the submit event and collect email and password
  teacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    console.log("Attempting teacher login with email:", email);

    try {
      //send a POST request to the /api/teacherLogin endpoint with the email and password
      const res = await fetch("/api/teacherLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", res.status);
      const data = await res.json();
      console.log("Login response data:", data);

      //if the response is ok, store the teacher id and name in localStorage and redirect to teacherDashboard.html
      if (res.ok) {
       if (data.token) {
  localStorage.setItem("token", data.token);
}
if (data.teacher && data.teacher._id) {
  localStorage.setItem("teacherId", data.teacher._id);
}
if (data.teacher && data.teacher.Teacher_Name) {
  localStorage.setItem("teacherName", data.teacher.Teacher_Name);
}

        window.location.href = "/teacherDashboard.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Try again later.");
    }
  });
}
//handle student login
//get student login form from studentLogin.html
const studentForm = document.getElementById("student-login-form");
if (studentForm) {
  //add event listener for the submit event and collect email and password
  studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      //send a POST request to the /api/studentLogin endpoint with the email and password
      const res = await fetch("/api/studentLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      //if the response is ok, store the student id and name in localStorage and redirect to studentDashboard.html
      if (res.ok) {
        if (data.student && data.student._id) {
          localStorage.setItem("studentId", data.student._id);
        }
        if (data.student && data.student.Student_Name) {
          localStorage.setItem("studentName", data.student.Student_Name);
        }
        if (data.student && data.student.GPA !== undefined) {
          localStorage.setItem("studentGPA", data.student.GPA);
        }
        window.location.href = "/studentDashboard.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error. Try again later.");
    }
  });
}
