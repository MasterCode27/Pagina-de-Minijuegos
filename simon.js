// Variables globales
const colors = ['green', 'red', 'yellow', 'blue', 'pink', 'orange', 'purple', 'cyan'];
let sequence = [];
let playerSequence = [];
let level = 0;
let playing = false;
let difficulty = 'easy';
let speed = 700;  // Velocidad estándar para todos los niveles
let wins = 0;
let losses = 0;
const maxWins = 8;
let timer;
let timeRemaining = 120;
let lives = 3;
let confettiRunning = false;
let inactivityTimer;
const inactivityTimeLimit = 5000; // 5 segundos

// Event Listeners
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('difficulty').addEventListener('change', (event) => {
    difficulty = event.target.value;
    setDifficultySettings(difficulty);
});
document.getElementById('retry-button').addEventListener('click', retryLevel);
document.getElementById('next-game-button').addEventListener('click', () => {
    window.location.href = 'game2.html'; // Redirigir al siguiente minijuego (modifica según la URL de tu siguiente minijuego)
});
document.getElementById('replay-button').addEventListener('click', () => {
    window.location.href = 'game1.html'; // Recargar la página para jugar de nuevo desde el inicio
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('controls').classList.add('ready');
});

function startGame() {
    resetGame();
    document.getElementById('controls').classList.remove('ready');
    countdown(() => {
        nextLevel();
        document.getElementById('controls').classList.add('ready');
    });
}

function retryLevel() {
    resetGame();
    document.getElementById('final-message').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    countdown(() => {
        showSequence();
    });
}

function resetGame() {
    sequence = [];
    playerSequence = [];
    level = 0;
    playing = true;
    wins = 0;
    lives = 3;
    timeRemaining = 120;
    document.getElementById('message').textContent = '';
    document.getElementById('score').textContent = `Ganadas: ${wins}`;
    document.getElementById('start-button').disabled = true;
    document.getElementById('difficulty').disabled = true;
    resetLives();
    startTimer();
    setDifficultySettings(difficulty);
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

function checkPlayerSequence() {
    clearTimeout(inactivityTimer);
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            lives--;
            updateLives();
            if (lives <= 0) {
                endGame('Perdiste. Vuelve a intentarlo.');
                return;
            } else {
                playerSequence = [];
                inactivityTimer = setTimeout(showSequence, inactivityTimeLimit);
                return;
            }
        }
    }
    if (playerSequence.length === sequence.length) {
        wins++;
        document.getElementById('score').textContent = `Ganadas: ${wins}`;
        if (wins >= maxWins) {
            if (difficulty === 'easy') {
                endGame('¡Has superado este nivel! Felicidades, siguiente nivel medio.');
                setTimeout(() => {
                    document.getElementById('difficulty').value = 'medium';
                    setDifficultySettings('medium');
                    startGame();
                }, 3000);
            } else if (difficulty === 'medium') {
                endGame('¡Has superado este nivel! Felicidades, siguiente nivel difícil.');
                setTimeout(() => {
                    document.getElementById('difficulty').value = 'hard';
                    setDifficultySettings('hard');
                    startGame();
                }, 3000);
            } else {
                endGame('¡Felicidades! Has completado todos los niveles. ¿Quieres volver a jugar?', true);
            }
        } else {
            setTimeout(nextLevel, 1000);
        }
    } else {
        inactivityTimer = setTimeout(showSequence, inactivityTimeLimit);
    }
}

function updateLives() {
    const livesContainer = document.getElementById('lives');
    const hearts = livesContainer.getElementsByClassName('heart');
    if (hearts.length > 0) {
        hearts[hearts.length - 1].remove();
    }
}

function endGame(message, replay = false) {
    playing = false;
    clearInterval(timer);
    document.getElementById('message').textContent = message;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('final-message').style.display = 'block';
    document.getElementById('final-text').textContent = message;
    document.getElementById('controls').classList.add('ready');
    if (replay) {
        document.getElementById('replay-button').style.display = 'block';
        document.getElementById('next-game-button').style.display = 'none';
    } else {
        document.getElementById('replay-button').style.display = 'none';
        document.getElementById('next-game-button').style.display = 'block';
    }
    if (!confettiRunning && (message.includes('superado') || message.includes('completado'))) {
        startConfetti();
        confettiRunning = true;
    }
}

function setDifficultySettings(difficulty) {
    // La velocidad ya es fija en 700ms, por lo que no necesitamos cambiarla aquí.
    switch (difficulty) {
        case 'easy':
            setDifficultyColors(4);
            break;
        case 'medium':
            setDifficultyColors(6);
            break;
        case 'hard':
            setDifficultyColors(8);
            break;
    }
}

function setDifficultyColors(numColors) {
    const simonBoard = document.getElementById('simon-board');
    switch (numColors) {
        case 4:
            simonBoard.style.gridTemplateColumns = 'repeat(2, 150px)';
            simonBoard.style.gridTemplateRows = 'repeat(2, 150px)';
            break;
        case 6:
            simonBoard.style.gridTemplateColumns = 'repeat(3, 150px)';
            simonBoard.style.gridTemplateRows = 'repeat(2, 150px)';
            break;
        case 8:
            simonBoard.style.gridTemplateColumns = 'repeat(4, 150px)';
            simonBoard.style.gridTemplateRows = 'repeat(2, 150px)';
            break;
    }
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

function flashColor(color) {
    const button = document.getElementById(color);
    button.classList.add('flash');
    setTimeout(() => {
        button.classList.remove('flash');
    }, speed / 2);
}

function showSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            inactivityTimer = setTimeout(showSequence, inactivityTimeLimit);
            return;
        }
        flashColor(sequence[i]);
        i++;
    }, speed);
}

function nextLevel() {
    level++;
    playerSequence = [];
    const randomColor = colors[Math.floor(Math.random() * getDifficultyColors())];
    sequence.push(randomColor);
    showSequence();
}

function startConfetti() {
    const confettiSettings = { target: 'confetti-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

function countdown(callback) {
    const countdownElement = document.getElementById('countdown');
    countdownElement.style.display = 'block';
    countdownElement.style.position = 'absolute';
    countdownElement.style.top = '50%';
    countdownElement.style.left = '50%';
    countdownElement.style.transform = 'translate(-50%, -50%)';
    let countdownValue = 3;
    countdownElement.textContent = countdownValue;
    const countdownInterval = setInterval(() => {
        countdownValue--;
        countdownElement.textContent = countdownValue;
        countdownElement.classList.remove('fade');
        void countdownElement.offsetWidth;
        countdownElement.classList.add('fade');
        if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            countdownElement.style.display = 'none';
            callback();
        }
    }, 1000);
}









