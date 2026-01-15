const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const progressBar = document.getElementById('progress-bar');
const themeToggle = document.getElementById('theme-toggle');
const highScoreElement = document.getElementById('high-score');
const difficultySelect = document.getElementById('difficulty-select');

let timerInterval;
let isTyping = false;
let timeLeft;
let totalChars = 0;

// Initialize High Score from LocalStorage
highScoreElement.innerText = localStorage.getItem('bestWPM') || 0;

// Dark Mode Toggle
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

/**
 * Renders a new quote with a staggered animation delay for each character.
 */
function renderNewQuote() {
    const level = difficultySelect.value;
    const selectedQuotes = quotes[level];
    const quote = selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
    
    quoteDisplayElement.innerHTML = '';
    
    // Split quote into characters and wrap each in an animated span
    quote.split('').forEach((character, index) => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        
        // Adds a staggered delay so letters pop in one by one (Streaming Effect)
        characterSpan.style.animationDelay = `${index * 0.01}s`; 
        quoteDisplayElement.appendChild(characterSpan);
    });
    
    quoteInputElement.value = null;
}

/**
 * Starts the countdown timer and handles live WPM/Progress Bar updates.
 */
function startTimer() {
    timeLeft = parseInt(document.getElementById('time-limit').value);
    const totalTime = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft + 's';
        
        // Progress Bar Update
        if (progressBar) {
            progressBar.style.width = (timeLeft / totalTime) * 100 + '%';
        }

        // Live WPM Logic
        const elapsed = totalTime - timeLeft;
        if (elapsed > 0) {
            wpmElement.innerText = Math.round((totalChars / 5) / (elapsed / 60));
        }

        if (timeLeft <= 0) endTest();
    }, 1000);
}

/**
 * Handles the end of the test, displays the modal, and updates high scores.
 */
function endTest() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    
    // Populate Modal Results
    document.getElementById('res-level').innerText = difficultySelect.value.toUpperCase();
    document.getElementById('res-wpm').innerText = wpmElement.innerText;
    document.getElementById('res-acc').innerText = accuracyElement.innerText;
    document.getElementById('result-modal').style.display = 'flex';
    
    // LocalStorage High Score Update
    let high = localStorage.getItem('bestWPM') || 0;
    if (parseInt(wpmElement.innerText) > high) {
        localStorage.setItem('bestWPM', wpmElement.innerText);
        highScoreElement.innerText = wpmElement.innerText;
    }
}

/**
 * Input listener for real-time character matching and accuracy tracking.
 */
quoteInputElement.addEventListener('input', () => {
    if (!isTyping) { 
        startTimer(); 
        isTyping = true; 
    }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = 0;

    arrayQuote.forEach((span, i) => {
        if (arrayValue[i] == null) {
            span.classList.remove('correct', 'incorrect');
        } else if (arrayValue[i] === span.innerText) {
            span.classList.add('correct');
            span.classList.remove('incorrect');
            correct++;
        } else {
            span.classList.add('incorrect');
            span.classList.remove('correct');
        }
    });

    // Continuous typing: Load next quote once current one is finished
    if (arrayValue.length === arrayQuote.length) {
        totalChars += arrayValue.length;
        renderNewQuote();
    }
    
    // Live Accuracy calculation
    accuracyElement.innerText = arrayValue.length > 0 ? Math.round((correct / arrayValue.length) * 100) : 100;
});

/**
 * Closes modal and resets the game state.
 */
function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
    location.reload(); 
}

// Global Event Listeners
document.getElementById('restart-btn').addEventListener('click', () => location.reload());

// Initial call to load the first quote
renderNewQuote();
