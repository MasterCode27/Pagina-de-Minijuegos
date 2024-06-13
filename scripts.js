let attemptCount = 0;
let heartCounter = 0;
let heartsStarted = false;
let randomImagesInterval; // Variable para almacenar el intervalo de actualización de imágenes aleatorias

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Cantar' && password === 'Verde') {
        window.location.href = 'welcome.html';
    } else {
        attemptCount++;
        document.getElementById('error-msg').textContent = 'Usuario o contraseña incorrectos.';
        
        if (attemptCount >= 4) {
            document.getElementById('hint-msg').textContent = 'Pista: Cantar es muy bueno? y Luigi es Hermano del Rojo';
        }
    }
});

// Genera corazones después de un minuto
setTimeout(() => {
    if (!heartsStarted) {
        heartsStarted = true;
        document.getElementById('counter-container').style.display = 'block';
        setInterval(createHeart, 500);
        randomImagesInterval = setInterval(showRandomImages, 15000); // Actualizar imágenes aleatorias cada 15 segundos
    }
}, 60000);

// Función para crear corazones
function createHeart() {
    const heartContainer = document.getElementById('heart-container');
    const heart = document.createElement('div');
    heart.classList.add('heart');

    const direction = Math.random();
    if (direction < 0.25) {
        heart.style.animationName = 'fly';
        heart.style.left = Math.random() * 100 + 'vw';
    } else if (direction < 0.5) {
        heart.style.animationName = 'flyLeft';
        heart.style.top = Math.random() * 100 + 'vh';
    } else if (direction < 0.75) {
        heart.style.animationName = 'flyRight';
        heart.style.top = Math.random() * 100 + 'vh';
    } else {
        heart.style.animationName = 'fly';
        heart.style.left = Math.random() * 100 + 'vw';
    }

    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';

    heart.addEventListener('click', () => {
        heart.remove();
        heartCounter++;
        document.getElementById('counter').textContent = heartCounter;
        if (heartCounter >= 20) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('secret-container').style.display = 'flex';
        }
    });

    heartContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

document.getElementById('secret-button').addEventListener('click', () => {
    window.location.href = 'minijuego.html';
});







