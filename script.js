const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const menu = document.getElementById("menu");
const backToMainMenu = document.getElementById("back-to-main-menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Загрузка GIF персонажа
const characterGif = new Image();
characterGif.src = 'https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl-running.gif'; // Прямая ссылка на GIF персонажа

// Параметры персонажа
let player = {
    x: 50,
    y: canvas.height - 100,  // Положение персонажа на "дороге"
    width: 64,               // Масштабируем ширину GIF
    height: 64,              // Масштабируем высоту GIF
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false
};

let obstacles = [];
let frameCount = 0;
let gameSpeed = 3;
let isGameOver = false;

// Отображение GIF персонажа с масштабированием
function drawPlayer() {
    ctx.drawImage(characterGif, player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    if (player.isJumping) {
        player.speedY += player.gravity;
        player.y += player.speedY;

        // Проверка на "пол"
        if (player.y >= canvas.height - player.height - 50) { // 50px - высота дороги и "пола" вместе
            player.y = canvas.height - player.height - 50;
            player.isJumping = false;
        }
    }
}

function createObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 70, // Расположен на дороге
        width: 20,
        height: 20
    });
}

function drawObstacles() {
    ctx.fillStyle = "#f00";
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Проверка на столкновение
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
        }
    });
}

function drawRoad() {
    ctx.fillStyle = "#777"; // Серая дорога
    ctx.fillRect(0, canvas.height - 50, canvas.width, 30); // Дорога чуть выше "пола"
}

function drawGround() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // "Пол" на уровне 20 пикселей от нижней границы
}

function gameOver() {
    isGameOver = true;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("retry").style.display = "block";
    document.getElementById("back-to-main-menu").style.display = "block";
}

function showMenu() {
    menu.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("retry").style.display = "none";
    document.getElementById("back-to-main-menu").style.display = "none";
}

function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("retry").style.display = "none";
    document.getElementById("back-to-main-menu").style.display = "none";
    isGameOver = false;
    player.y = canvas.height - player.height - 50; // Обновлено для размещения на дороге
    player.isJumping = false;
    obstacles = [];
    frameCount = 0;
    gameLoop();
}

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();       // Рисуем дорогу
    drawGround();     // Рисуем "пол" под дорогой
    drawPlayer();     // Отображаем персонажа с масштабированием
    updatePlayer();

    if (frameCount % 100 === 0) {
        createObstacle();
    }

    drawObstacles();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Событие нажатия на кнопку "Start"
startButton.addEventListener("click", startGame);

// Событие нажатия на кнопку "Retry"
document.getElementById("retry").addEventListener("click", startGame);

// Событие нажатия на кнопку "Back to Main Menu"
backToMainMenu.addEventListener("click", showMenu);

// Обработка нажатия на пробел для прыжка
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.isJumping) {
        player.isJumping = true;
        player.speedY = player.jumpStrength;
    }
});

// Обработка для мобильных устройств
canvas.addEventListener("touchstart", () => {
    if (!player.isJumping) {
        player.isJumping = true;
        player.speedY = player.jumpStrength;
    }
});

// Автоматический запуск игры в Телеграме
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    showMenu();
} else {
    // Запуск меню в обычном браузере
    showMenu();
}
