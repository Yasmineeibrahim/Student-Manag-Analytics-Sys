const container = document.querySelector('.container');
const studentBtn= document.getElementById('studentBtn');
const staffBtn = document.getElementById('staffBtn');

studentBtn.addEventListener('click', () => {
    container.classList.add('active');
});

staffBtn.addEventListener('click', () => {
    container.classList.remove('active');
});