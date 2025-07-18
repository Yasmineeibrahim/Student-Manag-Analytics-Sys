(async function () {
  const data = {
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

  const config = {
    type: 'doughnut',
    data: data
  };

  const canvas = document.getElementById('average-gpas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  new Chart(canvas, config);

  // Bar chart
  const barData = [
    { year: '2023', count: 3 },
    { year: '2024', count: 5 },
    { year: '2025', count: 2 },
    { year: '2026', count: 4 },
    { year: '2027', count: 6 }
  ];

  const barCanvas = document.getElementById('students-list');
  if (barCanvas) {
    new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: barData.map(row => row.year),
        datasets: [{
          label: 'Current Year percentages',
          data: barData.map(row => row.count),
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        barThickness: 10,
        borderRadius: 8,
        scales: {
          x: {
            display:false,
            grid: { display: false }
          },
          y: {
            grid: { display: false }
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
})();
