const colors = ['green', 'red', 'yellow', 'blue', 'pink', 'orange', 'purple', 'cyan'];
let sequence = [];
let playerSequence = [];
let level = 0;
let playing = false;
let difficulty = 'easy';
let speed = 1000;
let wins = 0;
let losses = 0;
const maxWins = 5;
let timer;
let timeRemaining = 120;
let lives = 3;
let confettiRunning = false;

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('difficulty').addEventListener('change', (event) => {
    difficulty = event.target.value;
    setDifficultySettings(difficulty);
});
document.getElementById('retry-button').addEventListener('click', startGame);
document.getElementById('next-game-button').addEventListener('click', () => {
    window.location.href = 'game2.html'; // Redirigir al siguiente minijuego (modifica según la URL de tu siguiente minijuego)
});

const buttons = document.querySelectorAll('.color-button');
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (!playing) return;
        const color = event.target.id;
        playerSequence.push(color);
        flashColor(color);
        checkPlayerSequence();
    });
});

function startGame() {
    sequence = [];
    playerSequence = [];
    level = 0;
    playing = true;
    wins = 0;
    lives = 3;
    timeRemaining = 120;
    document.getElementById('message').textContent = '';
    document.getElementById('score').textContent = `Ganadas: ${wins}`;
    resetLives();
    startTimer();
    nextLevel();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeRemaining--;
        updateTimer();
        if (timeRemaining <= 0) {
            endGame('¡Tiempo terminado! Vuelve a intentarlo.');
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `Tiempo: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function resetLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('img');
        heart.src = 'imagenes/pink-heart.png';
        heart.alt = 'Vida';
        heart.classList.add('heart');
        livesContainer.appendChild(heart);
    }
}

function nextLevel() {
    level++;
    playerSequence = [];
    const randomColor = colors[Math.floor(Math.random() * getDifficultyColors())];
    sequence.push(randomColor);
    showSequence();
}

function showSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            return;
        }
        flashColor(sequence[i]);
        i++;
    }, speed);
}

function flashColor(color) {
    const button = document.getElementById(color);
    button.style.opacity = 1;
    setTimeout(() => {
        button.style.opacity = 0.8;
    }, speed / 2);
}

function checkPlayerSequence() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            lives--;
            updateLives();
            if (lives <= 0) {
                endGame('Perdiste. Vuelve a intentarlo.');
                return;
            } else {
                playerSequence = [];
                showSequence();
                return;
            }
        }
    }
    if (playerSequence.length === sequence.length) {
        wins++;
        document.getElementById('score').textContent = `Ganadas: ${wins}`;
        if (wins % 3 === 0) {
            speed = Math.max(200, speed - 100);
        }
        if (wins >= maxWins) {
            endGame('¡Has superado este nivel! Felicidades, siguiente nivel medio.');
            setTimeout(() => {
                document.getElementById('difficulty').value = 'medium';
                setDifficultySettings('medium');
                startGame();
            }, 3000);
        } else {
            setTimeout(nextLevel, 1000);
        }
    }
}

function setDifficultySettings(difficulty) {
    switch (difficulty) {
        case 'easy':
            speed = 1000;
            setDifficultyColors(4);
            break;
        case 'medium':
            speed = 700;
            setDifficultyColors(6);
            break;
        case 'hard':
            speed = 400;
            setDifficultyColors(8);
            break;
    }
}

function setDifficultyColors(numColors) {
    buttons.forEach((button, index) => {
        button.style.display = index < numColors ? 'block' : 'none';
    });
}

function getDifficultyColors() {
    switch (difficulty) {
        case 'easy': return 4;
        case 'medium': return 6;
        case 'hard': return 8;
        default: return 4;
    }
}

function updateLives() {
    const livesContainer = document.getElementById('lives');
    const hearts = livesContainer.getElementsByClassName('heart');
    if (hearts.length > 0) {
        hearts[hearts.length - 1].remove();
    }
}

function endGame(message) {
    playing = false;
    clearInterval(timer);
    document.getElementById('message').textContent = message;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('final-message').style.display = 'block';
    document.getElementById('final-text').textContent = message;
    if (!confettiRunning && message.includes('superado')) {
        startConfetti();
        confettiRunning = true;
    }
}

function startConfetti() {
    const confettiSettings = { target: 'confetti-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}


