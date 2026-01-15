const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const progressBar = document.getElementById('progress-bar');
const themeToggle = document.getElementById('theme-toggle');
const highScoreElement = document.getElementById('high-score');

let timerInterval;
let isTyping = false;
let timeLeft;
let totalChars = 0;

highScoreElement.innerText = localStorage.getItem('bestWPM') || 0;

themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

function renderNewQuote() {
    const level = document.getElementById('difficulty-select').value;
    const quote = quotes[level][Math.floor(Math.random() * quotes[level].length)];
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        quoteDisplayElement.appendChild(span);
    });
    quoteInputElement.value = null;
}

function startTimer() {
    timeLeft = parseInt(document.getElementById('time-limit').value);
    const totalTime = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft + 's';
        
        // Progress Bar Update
        progressBar.style.width = (timeLeft / totalTime) * 100 + '%';

        // WPM Logic
        const elapsed = totalTime - timeLeft;
        if (elapsed > 0) {
            wpmElement.innerText = Math.round((totalChars / 5) / (elapsed / 60));
        }

        if (timeLeft <= 0) endTest();
    }, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    document.getElementById('res-level').innerText = document.getElementById('difficulty-select').value.toUpperCase();
    document.getElementById('res-wpm').innerText = wpmElement.innerText;
    document.getElementById('res-acc').innerText = accuracyElement.innerText;
    document.getElementById('result-modal').style.display = 'flex';
    
    let high = localStorage.getItem('bestWPM') || 0;
    if (parseInt(wpmElement.innerText) > high) {
        localStorage.setItem('bestWPM', wpmElement.innerText);
        highScoreElement.innerText = wpmElement.innerText;
    }
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
        totalChars += arrayValue.length;
        renderNewQuote();
    }
    accuracyElement.innerText = arrayValue.length > 0 ? Math.round((correct / arrayValue.length) * 100) : 100;
});

function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
    location.reload(); // Simplest way to reset everything perfectly
}

document.getElementById('restart-btn').addEventListener('click', () => location.reload());

renderNewQuote();
