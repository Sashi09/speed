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

// Load High Score
highScoreElement.innerText = localStorage.getItem('bestWPM') || 0;

function renderNewQuote() {
    const level = difficultySelect.value;
    const selectedQuotes = quotes[level]; // Uses the 3 levels from quotes.js
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
        
        // Calculate WPM based on total characters typed across ALL sentences
        const timeElapsed = parseInt(timeLimitSelect.value) - timeLeft;
        if (timeElapsed > 0) {
            const minutes = timeElapsed / 60;
            const currentWPM = Math.round((totalCharactersTyped / 5) / minutes);
            wpmElement.innerText = currentWPM;
        }

        if (timeLeft <= 0) endTest();
    }, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    const finalWPM = parseInt(wpmElement.innerText);
    
    // Update High Score if current WPM is better
    let high = localStorage.getItem('bestWPM') || 0;
    if (finalWPM > high) {
        localStorage.setItem('bestWPM', finalWPM);
        highScoreElement.innerText = finalWPM;
    }
    alert(`Time's up! Final Speed: ${finalWPM} WPM`);
}

quoteInputElement.addEventListener('input', () => {
    if (!isTyping) {
        startTimer();
        isTyping = true;
    }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correctCount = 0;

    arrayQuote.forEach((span, index) => {
        const char = arrayValue[index];
        if (char == null) {
            span.classList.remove('correct', 'incorrect');
        } else if (char === span.innerText) {
            span.classList.add('correct');
            span.classList.remove('incorrect');
            correctCount++;
        } else {
            span.classList.add('incorrect');
            span.classList.remove('correct');
        }
    });

    // Check if sentence is completed to load NEXT one
    if (arrayValue.length === arrayQuote.length) {
        totalCharactersTyped += arrayValue.length; // Accumulate characters
        renderNewQuote(); // Load continuous sentence
    }
    
    // Live Accuracy
    if (arrayValue.length > 0) {
        accuracyElement.innerText = Math.round((correctCount / arrayValue.length) * 100);
    }
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
