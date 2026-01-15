const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const progressBar = document.getElementById('progress-bar');
const themeToggle = document.getElementById('theme-toggle');
const difficultySelect = document.getElementById('difficulty-select');

let timerInterval;
let isTyping = false;
let timeLeft;
let totalChars = 0;

// Dark Mode Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

function renderNewQuote() {
    const level = difficultySelect.value;
    const quote = quotes[level][Math.floor(Math.random() * quotes[level].length)];
    
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        // Animation delay for "Streaming" effect
        span.style.animationDelay = `${index * 0.01}s`; 
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
        
        if (progressBar) {
            progressBar.style.width = (timeLeft / totalTime) * 100 + '%';
        }

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
    document.getElementById('res-wpm').innerText = wpmElement.innerText;
    document.getElementById('res-acc').innerText = accuracyElement.innerText;
    document.getElementById('result-modal').style.display = 'flex';
}

quoteInputElement.addEventListener('input', () => {
    if (!isTyping) { startTimer(); isTyping = true; }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = 0;

    arrayQuote.forEach((span, i) => {
        if (arrayValue[i] == null) {
            span.classList.remove('correct', 'incorrect');
        } else if (arrayValue[i] === span.innerText) {
            span.classList.add('correct');
            correct++;
        } else {
            span.classList.add('incorrect');
        }
    });

    if (arrayValue.length === arrayQuote.length) {
        totalChars += arrayValue.length;
        renderNewQuote();
    }
    accuracyElement.innerText = arrayValue.length > 0 ? Math.round((correct / arrayValue.length) * 100) : 100;
});

function closeModal() { location.reload(); }
document.getElementById('restart-btn').addEventListener('click', () => location.reload());

renderNewQuote();
