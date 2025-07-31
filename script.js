document.addEventListener('DOMContentLoaded', () => {

    // --- CONSTANTES Y ESTADO ---
    const WIN_SCORE = 15;
    let score = 0;
    let hitPosition = null;
    let gameTimerId = null;
    let isGameActive = false;

    // --- ELEMENTOS DEL DOM ---
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const holes = document.querySelectorAll('.hole');
    const gameContainer = document.getElementById('game-container');
    const screamerOverlay = document.getElementById('screamer-overlay');
    const screamerVideo = document.getElementById('screamer-video');

    // --- FUNCIONES DEL JUEGO ---

    function randomHole() {
        const index = Math.floor(Math.random() * holes.length);
        const hole = holes[index];
        if (hole === hitPosition) {
            return randomHole();
        }
        hitPosition = hole;
        return hole;
    }

    function peep() {
        if (!isGameActive) return;
        const time = Math.random() * 700 + 350; // Un poco más rápido
        const hole = randomHole();
        hole.classList.add('up');
        setTimeout(() => {
            hole.classList.remove('up');
        }, time);
    }

    function whack(e) {
        if (!e.isTrusted || !this.parentElement.classList.contains('up') || !isGameActive) return;
        
        score++;
        scoreDisplay.textContent = score;
        this.parentElement.classList.remove('up');
        
        // --- CONDICIÓN DE VICTORIA ---
        if (score >= WIN_SCORE) {
            winGame();
        }
    }

    function startGame() {
        if (isGameActive) return;

        isGameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        startButton.disabled = true;

        gameTimerId = setInterval(peep, 800); // Intervalo de aparición
    }

    function winGame() {
        isGameActive = false;
        clearInterval(gameTimerId);
        
        // Ocultar el juego y mostrar el video
        gameContainer.classList.add('hidden');
        screamerOverlay.style.display = 'flex';
        screamerVideo.play(); // Reproducir el video
    }

    function resetGame() {
        // Ocultar el video y mostrar el juego
        screamerOverlay.style.display = 'none';
        gameContainer.classList.remove('hidden');

        // Reiniciar el estado
        score = 0;
        scoreDisplay.textContent = score;
        startButton.disabled = false;
    }

    // --- EVENT LISTENERS ---
    startButton.addEventListener('click', startGame);
    holes.forEach(hole => hole.querySelector('.mole').addEventListener('click', whack));
    
    // Escuchar cuando el video termine para reiniciar el juego
    screamerVideo.addEventListener('ended', resetGame);
});
