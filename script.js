document.addEventListener('DOMContentLoaded', () => {

    // --- Definición de las cartas ---
    const emojiArray = ['🐉', '🐼', '🏮', '🧧', '🥮', '🥟'];
    const cardArray = [...emojiArray, ...emojiArray];
    cardArray.sort(() => 0.5 - Math.random());

    // --- Elementos del DOM ---
    const gameBoard = document.getElementById('game-board');
    const resultDisplay = document.getElementById('result');
    const timerDisplay = document.getElementById('timer');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const restartButton = document.getElementById('restart-button');

    // --- Variables de estado del juego ---
    let cardsChosen = [];
    let cardsChosenIds = [];
    let cardsWon = [];
    let isChecking = false;
    let timeLeft = 60; // 60 segundos para el desafío
    let timerId; // Para poder detener el intervalo

    // --- Funciones del Juego ---

    function createBoard() {
        cardArray.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', index);
            card.setAttribute('data-emoji', emoji);

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = '❓';

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.textContent = emoji;

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (isChecking || this.classList.contains('matched') || timeLeft === 0) return;
        
        const cardId = this.getAttribute('data-id');
        if (cardsChosenIds.length === 1 && cardsChosenIds[0] === cardId) return;

        cardsChosen.push(this.getAttribute('data-emoji'));
        cardsChosenIds.push(cardId);
        
        this.classList.add('flip');

        if (cardsChosen.length === 2) {
            isChecking = true;
            setTimeout(checkForMatch, 700);
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.card');
        const [optionOneId, optionTwoId] = cardsChosenIds;

        if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].classList.add('matched');
            cards[optionTwoId].classList.add('matched');
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
        } else {
            cards[optionOneId].classList.remove('flip');
            cards[optionTwoId].classList.remove('flip');
        }

        cardsChosen = [];
        cardsChosenIds = [];
        resultDisplay.textContent = cardsWon.length;

        if (cardsWon.length === cardArray.length / 2) {
            clearInterval(timerId); // Detener el tiempo al ganar
            showModal('🎊 ¡Victoria! 🎊', 'Has demostrado una memoria de dragón. ¡Excelente trabajo!');
        }

        isChecking = false;
    }

    // --- Funciones del temporizador y modal ---

    function startTimer() {
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft === 0) {
                clearInterval(timerId);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        showModal('⏰ ¡Se acabó el tiempo! ⏰', 'No lograste encontrar todas las parejas. ¡Más suerte la próxima vez!');
        // Bloquear todas las cartas
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => card.removeEventListener('click', flipCard));
    }

    function showModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.add('show');
    }

    // --- Event Listeners ---

    restartButton.addEventListener('click', () => {
        location.reload(); // La forma más sencilla de reiniciar el juego
    });
    
    // --- Iniciar el juego ---
    createBoard();
    startTimer();
});