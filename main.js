const generateBtn = document.getElementById('generate-btn');
const setsInput = document.getElementById('sets');
const resultsContainer = document.getElementById('results-container');
const themeToggle = document.getElementById('theme-toggle');

// Theme toggle logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateToggleIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

function updateToggleIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

generateBtn.addEventListener('click', () => {
    const numSets = parseInt(setsInput.value);
    
    if (isNaN(numSets) || numSets < 1 || numSets > 10) {
        alert('1에서 10 사이의 숫자를 입력해주세요.');
        return;
    }

    resultsContainer.innerHTML = '';
    generateBtn.disabled = true;
    generateBtn.textContent = '번호 추출 중...';

    setTimeout(() => {
        for (let i = 0; i < numSets; i++) {
            const numbers = generateLottoNumbers();
            displayLottoSet(numbers, i * 100);
        }
        generateBtn.disabled = false;
        generateBtn.textContent = '번호 생성하기';
    }, 500);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayLottoSet(numbers, delay) {
    const setElement = document.createElement('div');
    setElement.classList.add('lotto-set');
    setElement.style.opacity = '0';
    setElement.style.transform = 'translateY(10px)';
    setElement.style.transition = 'all 0.5s ease';

    numbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('lotto-number');
        numberElement.textContent = number;
        setElement.appendChild(numberElement);
    });

    resultsContainer.appendChild(setElement);

    setTimeout(() => {
        setElement.style.opacity = '1';
        setElement.style.transform = 'translateY(0)';
    }, delay);
}
