const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty-select');
const timeLimitSelect = document.getElementById('time-limit');
const highScoreElement = document.getElementById('high-score');

let timerInterval;
let isTyping = false;
let timeLeft;
let totalCharactersTyped = 0;
let errors = 0;

highScoreElement.innerText = localStorage.getItem('bestWPM') || 0;

function getNextQuote() {
    const level = difficultySelect.value;
    const selectedQuotes = quotes[level];
    return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
}

function renderNewQuote() {
    const quote = getNextQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
}

function startTimer() {
    timeLeft = parseInt(timeLimitSelect.value);
    timerElement.innerText = timeLeft + 's';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft + 's';
        
        // Live WPM calculation
        const timeElapsed = parseInt(timeLimitSelect.value) - timeLeft;
        if (timeElapsed > 0) {
            const minutes = timeElapsed / 60;
            wpmElement.innerText = Math.round((totalCharactersTyped / 5) / minutes);
        }

        if (timeLeft <= 0) endTest();
    }, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    updateHighScore(parseInt(wpmElement.innerText));
    alert(`Time's Up! Final Speed: ${wpmElement.innerText} WPM`);
}

quoteInputElement.addEventListener('input', () => {
    if (!isTyping) {
        startTimer();
        isTyping = true;
    }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    
    let correctChars = 0;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct', 'incorrect');
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }
    });

    // If current sentence is finished
    if (arrayValue.length === arrayQuote.length) {
        totalCharactersTyped += arrayValue.length; // Add to total
        renderNewQuote(); // Load next sentence
    }
});

function resetGame() {
    clearInterval(timerInterval);
    isTyping = false;
    totalCharactersTyped = 0;
    quoteInputElement.disabled = false;
    timerElement.innerText = '0s';
    wpmElement.innerText = '0';
    accuracyElement.innerText = '100';
    renderNewQuote();
}

function updateHighScore(wpm) {
    let high = localStorage.getItem('bestWPM') || 0;
    if (wpm > high) {
        localStorage.setItem('bestWPM', wpm);
        highScoreElement.innerText = wpm;
    }
}

restartBtn.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', resetGame);
timeLimitSelect.addEventListener('change', resetGame);

renderNewQuote();
