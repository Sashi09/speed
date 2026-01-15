const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty-select');
const timeLimitSelect = document.getElementById('time-limit');
const highScoreElement = document.getElementById('high-score');
const modal = document.getElementById('result-modal');

let timerInterval;
let isTyping = false;
let timeLeft;
let totalCharactersTyped = 0;

highScoreElement.innerText = localStorage.getItem('bestWPM') || 0;

function renderNewQuote() {
    const level = difficultySelect.value;
    const selectedQuotes = quotes[level];
    const quote = selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
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
        const elapsed = parseInt(timeLimitSelect.value) - timeLeft;
        if (elapsed > 0) {
            wpmElement.innerText = Math.round((totalCharactersTyped / 5) / (elapsed / 60));
        }
        if (timeLeft <= 0) endTest();
    }, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    
    // Show Modal
    document.getElementById('res-level').innerText = difficultySelect.value.toUpperCase();
    document.getElementById('res-wpm').innerText = wpmElement.innerText;
    document.getElementById('res-acc').innerText = accuracyElement.innerText;
    modal.style.display = "flex";

    // Update Best Score
    let high = localStorage.getItem('bestWPM') || 0;
    if (parseInt(wpmElement.innerText) > high) {
        localStorage.setItem('bestWPM', wpmElement.innerText);
        highScoreElement.innerText = wpmElement.innerText;
    }
}

function closeModal() {
    modal.style.display = "none";
    resetGame();
}

quoteInputElement.addEventListener('input', () => {
    if (!isTyping) { startTimer(); isTyping = true; }
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = 0;

    arrayQuote.forEach((span, i) => {
        if (arrayValue[i] == null) span.classList.remove('correct', 'incorrect');
        else if (arrayValue[i] === span.innerText) { span.classList.add('correct'); correct++; }
        else span.classList.add('incorrect');
    });

    if (arrayValue.length === arrayQuote.length) {
        totalCharactersTyped += arrayValue.length;
        renderNewQuote();
    }
    accuracyElement.innerText = arrayValue.length > 0 ? Math.round((correct / arrayValue.length) * 100) : 100;
});

function resetGame() {
    clearInterval(timerInterval);
    isTyping = false;
    totalCharactersTyped = 0;
    quoteInputElement.disabled = false;
    timerElement.innerText = timeLimitSelect.value + 's';
    wpmElement.innerText = '0';
    accuracyElement.innerText = '100';
    renderNewQuote();
}

restartBtn.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', resetGame);
timeLimitSelect.addEventListener('change', resetGame);
renderNewQuote();
