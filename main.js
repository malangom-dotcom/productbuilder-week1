const generateBtn = document.getElementById('generate-btn');
const setsInput = document.getElementById('sets');
const resultsContainer = document.getElementById('results-container');
const themeToggle = document.getElementById('theme-toggle');
const prizeSection = document.getElementById('prize-section');
const prizeTableBody = document.getElementById('prize-table-body');

// 최신 당첨 번호 (1112회 기준)
const WINNING_NUMBERS = [16, 20, 26, 36, 42, 44];
const BONUS_NUMBER = 24;

const PRIZE_INFO = {
    1: { rank: '1등', prize: '약 28억 원' },
    2: { rank: '2등', prize: '약 5,200만 원' },
    3: { rank: '3등', prize: '약 140만 원' },
    4: { rank: '4등', prize: '50,000원' },
    5: { rank: '5등', prize: '5,000원' },
    0: { rank: '낙첨', prize: '0원' }
};

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
    prizeTableBody.innerHTML = '';
    generateBtn.disabled = true;
    generateBtn.textContent = '번호 추출 중...';
    prizeSection.style.display = 'none';

    setTimeout(() => {
        for (let i = 0; i < numSets; i++) {
            const numbers = generateLottoNumbers();
            displayLottoSet(numbers, i * 100);
            checkPrize(numbers, i + 1);
        }
        generateBtn.disabled = false;
        generateBtn.textContent = '번호 생성하기';
        prizeSection.style.display = 'block';
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
        
        // 번호 대역별 클래스 추가
        if (number <= 10) {
            numberElement.classList.add('ball-1-10');
        } else if (number <= 20) {
            numberElement.classList.add('ball-11-20');
        } else if (number <= 30) {
            numberElement.classList.add('ball-21-30');
        } else if (number <= 40) {
            numberElement.classList.add('ball-31-40');
        } else {
            numberElement.classList.add('ball-41-45');
        }

        numberElement.textContent = number;
        setElement.appendChild(numberElement);
    });

    resultsContainer.appendChild(setElement);

    setTimeout(() => {
        setElement.style.opacity = '1';
        setElement.style.transform = 'translateY(0)';
    }, delay);
}

function checkPrize(numbers, setIndex) {
    const matchCount = numbers.filter(n => WINNING_NUMBERS.includes(n)).length;
    const bonusMatch = numbers.includes(BONUS_NUMBER);
    
    let rank = 0;
    if (matchCount === 6) rank = 1;
    else if (matchCount === 5 && bonusMatch) rank = 2;
    else if (matchCount === 5) rank = 3;
    else if (matchCount === 4) rank = 4;
    else if (matchCount === 3) rank = 5;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>세트 ${setIndex}</td>
        <td>${matchCount}개</td>
        <td><span class="rank-badge rank-${rank || 'none'}">${PRIZE_INFO[rank].rank}</span></td>
        <td>${PRIZE_INFO[rank].prize}</td>
    `;
    prizeTableBody.appendChild(tr);
}
