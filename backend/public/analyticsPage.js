window.addEventListener("DOMContentLoaded", async function () {
  //get the teacherId from localStorage
  const teacherId = localStorage.getItem("teacherId");
  //check if the teacher is login in using the teacherId
  if (!teacherId) {
    //if not, alert the user to log in again
    alert("No teacherId found. Please log in again.");
    return;
  }
  try {
    //fetch teachers courses and students
    //get teacher students by mapping the courseId and studentId
    const res = await fetch(`/api/teachers/${teacherId}/courses`);
    if (!res.ok) throw new Error("Failed to fetch courses/students");
    //get the students with their average grades
    const { studentsWithAvg } = await res.json();
    if (!Array.isArray(studentsWithAvg) || studentsWithAvg.length === 0) {
      document.getElementById(
        "all-students-bar-chart"
      ).parentElement.innerHTML +=
        '<div style="margin-top:24px;color:#888;">No students found.</div>';
      return;
    }
    //sort the students by ascending alphabetical order of name and prepare data for the bar chart
    const sorted = studentsWithAvg
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    const labels = sorted.map((s) => s.name);
    const data = sorted.map((s) => s.avgGrade);
    //function to convert grade to letter
    function gradeToLetter(grade) {
      if (grade >= 3.5) return "A";
      if (grade >= 2.5) return "B";
      if (grade >= 1.5) return "C";
      if (grade >= 0.5) return "D";
      return "F";
    }
    //get bar chart html container from analyticsPage.html
    const ctx = document
      .getElementById("all-students-bar-chart")
      .getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Grade",
            data: data,
            backgroundColor: function (context) {
              const value = context.raw;
              if (value >= 3.5) return "#1c5838ff";
              if (value >= 2.5) return "#fc9825ff";
              if (value >= 1.5) return "#fcacffff";
              if (value >= 0.5) return "#d08c60";
              return "#d9534f";
            },

            datalabels: {
              anchor: "end",
              align: "end",
              formatter: (value) => gradeToLetter(value),
            },
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: "y",
        barThickness: 10,
        borderRadius: 8,
        scales: {
          x: {
            display: true,
            grid: { display: false },
            min: 0,
            max: 4,
            ticks: {
              callback: function (value) {
                if (value === 0) return "F";
                if (value === 1) return "D";
                if (value === 2) return "C";
                if (value === 3) return "B";
                if (value === 4) return "A";
                return "";
              },
              stepSize: 1,
            },
          },
          y: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    //get html container for the donut chart from analyticsPage.html
    const donutCtx = document
      .getElementById("grade-donut-chart")
      .getContext("2d");
    const gradeBuckets = [
      //map the average grades to buckets with colors
      { label: "A (3.5–4.0)", color: "#01451e", min: 3.5, max: 4.0 },
      { label: "B (2.5–3.49)", color: "#00375c", min: 2.5, max: 3.49 },
      { label: "C (1.5–2.49)", color: "#f1c40f", min: 1.5, max: 2.49 },
      { label: "D (0.5–1.49)", color: "#ff8922", min: 0.5, max: 1.49 },
      { label: "F (<0.5)", color: "#ffbdf1", min: -Infinity, max: 0.49 },
    ];
    //initialize bucket counts and handle the increment of each bucket based on the average grades
    const bucketCounts = [0, 0, 0, 0, 0];
    data.forEach((avg) => {
      if (avg >= 3.5) bucketCounts[0]++;
      else if (avg >= 2.5) bucketCounts[1]++;
      else if (avg >= 1.5) bucketCounts[2]++;
      else if (avg >= 0.5) bucketCounts[3]++;
      else bucketCounts[4]++;
    });
    const centerTextPlugin = {
      id: "centerText",
      afterDraw(chart) {
        const {
          ctx,
          chartArea: { width, height },
        } = chart;
        ctx.save();
        ctx.font = "bold 1.3rem Poppins, sans-serif";
        ctx.fillStyle = "#2e6a4a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Total", width / 2, height / 2 - 12);
        ctx.font = "bold 2.1rem Poppins, sans-serif";
        ctx.fillStyle = "#ff5e5e";
        ctx.fillText(data.length.toString(), width / 2, height / 2 + 18);
        ctx.restore();
      },
    };
    new Chart(donutCtx, {
      type: "doughnut",
      data: {
        labels: gradeBuckets.map((b) => b.label),
        datasets: [
          {
            label: "GPA Distribution",
            data: bucketCounts,
            backgroundColor: gradeBuckets.map((b) => b.color),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "70%",
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              font: { family: "Poppins", size: 15 },
              color: "#2e6a4a",
              padding: 18,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                return `${label}: ${value} student${value === 1 ? "" : "s"}`;
              },
            },
          },
        },
      },
      plugins: [centerTextPlugin],
    });
  } catch (error) {
    document.getElementById("all-students-bar-chart").parentElement.innerHTML +=
      '<div style="margin-top:24px;color:#a82929;">Error loading students or chart.</div>';
    console.error(error);
  }

  // get line chart canvas element from html from analyticsPage.html
  const lineCanvas = document.getElementById("performance-line-chart");
  if (!lineCanvas) return;
  //get the gpa history key from localStorage
  const gpaHistoryKey = `gpaHistory_${teacherId}`;
  const today = new Date().toLocaleDateString();
  // Function to fetch the current GPA from the server
  async function fetchCurrentGpa() {
    let avgGpa = 0;
    try {
      const res = await fetch(`/api/teachers/${teacherId}/courses`);
      const { studentsWithAvg } = await res.json();
      avgGpa =
        studentsWithAvg.reduce((sum, s) => sum + s.avgGrade, 0) /
        (studentsWithAvg.length || 1);
    } catch {}
    return Number(avgGpa.toFixed(2));
  }
  // Functions to manage GPA history in localStorage
  function getGpaHistory() {
    const raw = localStorage.getItem(gpaHistoryKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  // Save GPA history to localStorage
  function saveGpaHistory(history) {
    localStorage.setItem(gpaHistoryKey, JSON.stringify(history));
  }
  // Add a new GPA entry to the history if it doesn't already exist
  function addGpaToHistory(gpa, date) {
    let history = getGpaHistory();
    if (history.length === 0 || history[history.length - 1].gpa !== gpa) {
      history.push({ gpa, date });
      saveGpaHistory(history);
    }
  }
  //display gpa history on the line chart using chart.js
  function renderLineChart(history) {
    const labels = history.map((h) => h.date);
    const data = history.map((h) => h.gpa);
    if (window.performanceLineChart) window.performanceLineChart.destroy();
    window.performanceLineChart = new Chart(lineCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average GPA",
            data: data,
            borderColor: "#2e6a4a",
            backgroundColor: "rgba(46,106,74,0.08)",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "#2e6a4a",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0,
            max: 4,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                if (value === 0) return "F";
                if (value === 1) return "D";
                if (value === 2) return "C";
                if (value === 3) return "B";
                if (value === 4) return "A";
                return "";
              },
            },
            grid: { display: true },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }
  // Update GPA history and render the chart after changes in the student grade and average history
  async function updateGpaHistoryAndChart() {
    const gpa = await fetchCurrentGpa();
    addGpaToHistory(gpa, today);
    renderLineChart(getGpaHistory());
  }

  // Initial render of the line chart and update of GPA history
  updateGpaHistoryAndChart();

  window.addEventListener("storage", function (e) {
    if (e.key === gpaHistoryKey) {
      renderLineChart(getGpaHistory());
    }
  });
});
