const themeToggle = document.getElementById('theme-toggle');
const progressBar = document.getElementById('progress-bar');

// Toggle Dark Mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function renderNewQuote() {
    const level = document.getElementById('difficulty-select').value;
    const quote = quotes[level][Math.floor(Math.random() * quotes[level].length)];
    
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        // Animation delay for "streaming" effect
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
        
        // Progress Bar Update: Fills as time passes
        let progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = progress + '%';

        if (timeLeft <= 0) endTest();
    }, 1000);
}
