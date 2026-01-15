const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty-select');
const highScoreElement = document.getElementById('high-score');

let timerInterval;
let startTime;
let isTyping = false;

// Load High Score on startup
highScoreElement.innerText = localStorage.getItem('bestWPM') || 0;

function getNextQuote() {
    const level = difficultySelect.value;
    const selectedQuotes = quotes[level];
    const randomIndex = Math.floor(Math.random() * selectedQuotes.length);
    return selectedQuotes[randomIndex];
}

async function renderNewQuote() {
    const quote = getNextQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    resetStats();
}

function resetStats() {
    stopTimer();
    timerElement.innerText = '0s';
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    isTyping = false;
}

quoteInputElement.addEventListener('input', () => {
    if (!isTyping) {
        startTimer();
        isTyping = true;
    }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correctCharacters = 0;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctCharacters++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }
    });

    // Update Accuracy
    const accuracy = Math.floor((correctCharacters / arrayValue.length) * 100) || 100;
    accuracyElement.innerText = accuracy;

    // Check if finished
    if (arrayValue.length === arrayQuote.length) {
        stopTimer();
        updateHighScore(parseInt(wpmElement.innerText));
    }
});

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timeElapsed = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = timeElapsed + 's';
        
        // Calculate WPM
        const wordsTyped = quoteInputElement.value.length / 5;
        const minutesElapsed = timeElapsed / 60;
        if (minutesElapsed > 0) {
            wpmElement.innerText = Math.round(wordsTyped / minutesElapsed);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateHighScore(currentWPM) {
    let highScore = localStorage.getItem('bestWPM') || 0;
    if (currentWPM > highScore) {
        localStorage.setItem('bestWPM', currentWPM);
        highScoreElement.innerText = currentWPM;
    }
}

difficultySelect.addEventListener('change', renderNewQuote);
restartBtn.addEventListener('click', renderNewQuote);

renderNewQuote();
