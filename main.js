const generateBtn = document.getElementById('generate-btn');
const setsInput = document.getElementById('sets');
const resultsContainer = document.getElementById('results-container');

generateBtn.addEventListener('click', () => {
    const numSets = parseInt(setsInput.value);
    resultsContainer.innerHTML = '';

    for (let i = 0; i < numSets; i++) {
        const numbers = generateLottoNumbers();
        displayLottoSet(numbers);
    }
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayLottoSet(numbers) {
    const setElement = document.createElement('div');
    setElement.classList.add('lotto-set');

    numbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('lotto-number');
        numberElement.textContent = number;
        setElement.appendChild(numberElement);
    });

    resultsContainer.appendChild(setElement);
}
