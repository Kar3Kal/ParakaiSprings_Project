import { Player } from './player.js';
import { Toy } from './toy.js';
import { SoundManager } from './speaker.js';
import { Screen } from './screen.js';

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let startButton = document.getElementById('startButton');
let restartButton = document.getElementById('restartButton');
let scoreDisplay = document.getElementById('score');
let timeLeftDisplay = document.getElementById('timeLeft');
let timeLimitOptions = document.getElementsByName('timeLimit');
let introduceDialog = document.getElementById('introduceDialog');
let gameOverDialog = document.getElementById('gameOverDialog');
let startGameButton = document.getElementById('startGameButton');
let restartGameButton = document.getElementById('restartGameButton');
let finalScoreDisplay = document.getElementById('finalScore');

let player;
let toys = [];
let score = 0;
let timeLeft;
let gameInterval;
let toyInterval;
let isGameRunning = false;

const screen = new Screen(canvas, ctx);
const soundManager = new SoundManager();

// Show the introduction dialog initially
introduceDialog.showModal();

// Start game when the start button in the dialog is clicked
startGameButton.addEventListener('click', () => {
    introduceDialog.close();
    initGame();
});

function initGame() {
    score = 0;
    timeLeft = getTimeLimit();
    scoreDisplay.innerText = `Score: ${score}`;
    timeLeftDisplay.innerText = `Time Left: ${timeLeft}`;
    player = new Player(canvas.width / 2, canvas.height / 2, ctx);
    toys = [];
    isGameRunning = true;

    // Start the game loop
    gameInterval = setInterval(gameLoop, 1000 / 60);
    toyInterval = setInterval(spawnToy, 2000);
    soundManager.play('startGame');
    updateTime();
}

function getTimeLimit() {
    let selectedOption = [...timeLimitOptions].find(option => option.checked);
    return parseInt(selectedOption.value) * 60;
}

function gameLoop() {
    screen.clear();
    player.update();
    player.draw();

    toys.forEach(toy => {
        toy.update();
        toy.draw();
    });

    // Check for collisions or collection
    toys = toys.filter(toy => {
        if (player.collidesWith(toy)) {
            if (player.isCollecting && toy.state === 'staying') {
                score++;
                scoreDisplay.innerText = `Score: ${score}`;
                soundManager.play('collectSuccess');
                return false;
            }
        }
        return true;
    });
}

function spawnToy() {
    let edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
        case 0: // Top
            x = Math.random() * canvas.width;
            y = 0;
            break;
        case 1: // Right
            x = canvas.width;
            y = Math.random() * canvas.height;
            break;
        case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height;
            break;
        case 3: // Left
            x = 0;
            y = Math.random() * canvas.height;
            break;
    }
    toys.push(new Toy(x, y, ctx));
    soundManager.play('toyShow');
}

function updateTime() {
    const timer = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(timer);
            return;
        }
        timeLeft--;
        timeLeftDisplay.innerText = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
            clearInterval(timer);
        }
    }, 1000);
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(toyInterval);
    soundManager.stop('startGame');
    soundManager.play('endGame');

    // Display the game over dialog
    finalScoreDisplay.innerText = score;
    gameOverDialog.showModal();
}

// Restart game when the restart button in the dialog is clicked
restartGameButton.addEventListener('click', () => {
    gameOverDialog.close();
    initGame();
});

startButton.addEventListener('click', () => {
    if (!isGameRunning) {
        initGame();
    }
});

restartButton.addEventListener('click', () => {
    if (isGameRunning) {
        endGame();
    }
    initGame();
});

window.addEventListener('keydown', (e) => {
    if (isGameRunning) {
        player.handleKeyDown(e);
    }
});

window.addEventListener('keyup', (e) => {
    if (isGameRunning) {
        player.handleKeyUp(e);
    }
});