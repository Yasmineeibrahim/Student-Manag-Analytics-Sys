window.addEventListener('DOMContentLoaded', async function() {
  const teacherId = localStorage.getItem('teacherId');
  if (!teacherId) {
    alert('No teacherId found. Please log in again.');
    return;
  }
  try {
    const res = await fetch(`/api/teachers/${teacherId}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses/students');
    const { studentsWithAvg } = await res.json();
    if (!Array.isArray(studentsWithAvg) || studentsWithAvg.length === 0) {
      document.getElementById('all-students-bar-chart').parentElement.innerHTML += '<div style="margin-top:24px;color:#888;">No students found.</div>';
      return;
    }
    const sorted = studentsWithAvg.slice().sort((a, b) => b.avgGrade - a.avgGrade);
    const labels = sorted.map(s => s.name);
    const data = sorted.map(s => s.avgGrade);
    function gradeToLetter(grade) {
      if (grade >= 3.5) return 'A';
      if (grade >= 2.5) return 'B';
      if (grade >= 1.5) return 'C';
      if (grade >= 0.5) return 'D';
      return 'F';
    }
    const ctx = document.getElementById('all-students-bar-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Grade',
          data: data,
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
  } catch (error) {
    document.getElementById('all-students-bar-chart').parentElement.innerHTML += '<div style="margin-top:24px;color:#a82929;">Error loading students or chart.</div>';
    console.error(error);
  }

  // --- Line Chart Logic ---
  const lineCanvas = document.getElementById('performance-line-chart');
  if (!lineCanvas) return;

  const gpaHistoryKey = `gpaHistory_${teacherId}`;
  const today = new Date().toLocaleDateString();

  async function fetchCurrentGpa() {
    let avgGpa = 0;
    try {
      const res = await fetch(`/api/teachers/${teacherId}/courses`);
      const { studentsWithAvg } = await res.json();
      avgGpa = studentsWithAvg.reduce((sum, s) => sum + s.avgGrade, 0) / (studentsWithAvg.length || 1);
    } catch {}
    return Number(avgGpa.toFixed(2));
  }

  function getGpaHistory() {
    const raw = localStorage.getItem(gpaHistoryKey);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  }

  function saveGpaHistory(history) {
    localStorage.setItem(gpaHistoryKey, JSON.stringify(history));
  }

  function addGpaToHistory(gpa, date) {
    let history = getGpaHistory();
    if (history.length === 0 || history[history.length-1].gpa !== gpa) {
      history.push({ gpa, date });
      saveGpaHistory(history);
    }
  }

  function renderLineChart(history) {
    const labels = history.map(h => h.date);
    const data = history.map(h => h.gpa);
    if (window.performanceLineChart) window.performanceLineChart.destroy();
    window.performanceLineChart = new Chart(lineCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average GPA',
          data: data,
          borderColor: '#2e6a4a',
          backgroundColor: 'rgba(46,106,74,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#2e6a4a',
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        }]
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
              callback: function(value) {
                if (value === 0) return 'F';
                if (value === 1) return 'D';
                if (value === 2) return 'C';
                if (value === 3) return 'B';
                if (value === 4) return 'A';
                return '';
              }
            },
            grid: { display: true }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  async function updateGpaHistoryAndChart() {
    const gpa = await fetchCurrentGpa();
    addGpaToHistory(gpa, today);
    renderLineChart(getGpaHistory());
  }

  // Initial load
  updateGpaHistoryAndChart();

  // Listen for GPA changes in localStorage (from dashboard or other tabs)
  window.addEventListener('storage', function(e) {
    if (e.key === gpaHistoryKey) {
      renderLineChart(getGpaHistory());
    }
  });
}); 