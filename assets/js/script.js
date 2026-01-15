const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const resetBtn = document.getElementById('resetBtn');

let timer = 0;
let isRunning = false;
let timerInterval;

function renderNewQuote() {
    const randomIdx = Math.floor(Math.random() * TYPING_QUOTES.length);
    const quote = TYPING_QUOTES[randomIdx];
    
    quoteDisplay.innerHTML = '';
    quote.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        quoteDisplay.appendChild(span);
    });
    
    quoteInput.value = '';
    resetTimer();
}

function resetTimer() {
    clearInterval(timerInterval);
    timer = 0;
    isRunning = false;
    timerElement.innerText = "0s";
    wpmElement.innerText = "0";
    accuracyElement.innerText = "100";
}

quoteInput.addEventListener('input', () => {
    const arrayQuote = quoteDisplay.querySelectorAll('span');
    const arrayValue = quoteInput.value.split('');
    
    if (!isRunning && arrayValue.length > 0) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timer++;
            timerElement.innerText = timer + "s";
            // Calculate WPM
            const words = quoteInput.value.length / 5;
            const minutes = timer / 60;
            wpmElement.innerText = Math.round(words / minutes);
        }, 1000);
    }

    let correctCount = 0;
    arrayQuote.forEach((span, index) => {
        const character = arrayValue[index];
        if (character == null) {
            span.className = '';
        } else if (character === span.innerText) {
            span.className = 'correct';
            correctCount++;
        } else {
            span.className = 'incorrect';
        }
    });

    // Accuracy Calculation
    if (arrayValue.length > 0) {
        const acc = Math.round((correctCount / arrayValue.length) * 100);
        accuracyElement.innerText = acc;
    }
});

resetBtn.addEventListener('click', renderNewQuote);

// Initialize
renderNewQuote();
