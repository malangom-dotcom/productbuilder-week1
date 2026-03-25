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
            displayLottoSet(numbers, i * 200);
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
    const wrapper = document.createElement('div');
    wrapper.classList.add('lotto-set-wrapper');
    wrapper.style.opacity = '0';
    wrapper.style.transition = 'all 0.5s ease';
    wrapper.style.marginBottom = '3rem';

    // 1. 숫자 공 표시
    const ballsElement = document.createElement('div');
    ballsElement.classList.add('lotto-set');
    numbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('lotto-number');
        if (number <= 10) numberElement.classList.add('ball-1-10');
        else if (number <= 20) numberElement.classList.add('ball-11-20');
        else if (number <= 30) numberElement.classList.add('ball-21-30');
        else if (number <= 40) numberElement.classList.add('ball-31-40');
        else numberElement.classList.add('ball-41-45');
        numberElement.textContent = number;
        ballsElement.appendChild(numberElement);
    });
    wrapper.appendChild(ballsElement);

    // 2. 패턴 그리드 표시
    const patternContainer = document.createElement('div');
    patternContainer.classList.add('lotto-pattern-container');
    
    const grid = document.createElement('div');
    grid.classList.add('lotto-grid');
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('pattern-svg');
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.classList.add('pattern-line');
    
    let points = "";
    
    // 1~45 그리드 셀 생성
    for (let i = 1; i <= 45; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.textContent = i;
        if (numbers.includes(i)) {
            cell.classList.add('marked');
        }
        grid.appendChild(cell);
    }
    
    patternContainer.appendChild(grid);
    patternContainer.appendChild(svg);
    wrapper.appendChild(patternContainer);
    resultsContainer.appendChild(wrapper);

    // 애니메이션 및 선 그리기 (렌더링 후 좌표 계산 필요)
    setTimeout(() => {
        wrapper.style.opacity = '1';
        
        const markedCells = grid.querySelectorAll('.marked');
        const containerRect = grid.getBoundingClientRect();
        
        markedCells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            points += `${x},${y} `;
        });
        
        polyline.setAttribute("points", points.trim());
        svg.appendChild(polyline);
    }, delay);
}
