const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const menu = document.getElementById("menu");
const backToMainMenu = document.getElementById("back-to-main-menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Массив для хранения кадров анимации персонажа
const characterFrames = [];
const totalFrames = 5; // Количество кадров анимации

// Загрузка кадров анимации
for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl-running${i}.png`;
    characterFrames.push(img);
}

let frameIndex = 0;
const character = {
    x: 50,
    y: canvas.height - 100, // Положение персонажа на "дороге"
    width: 64,               // Ширина персонажа
    height: 64               // Высота персонажа
};

let obstacles = [];
let frameCount = 0;
let gameSpeed = 3;
let isGameOver = false;

// Функция для отображения текущего кадра персонажа
function drawPlayer() {
    ctx.drawImage(characterFrames[frameIndex], character.x, character.y, character.width, character.height);

    // Переход к следующему кадру
    frameIndex = (frameIndex + 1) % characterFrames.length; // Зацикливаем анимацию
}

function updatePlayer() {
    if (character.isJumping) {
        character.speedY += character.gravity;
        character.y += character.speedY;

        // Проверка на "пол"
        if (character.y >= canvas.height - character.height - 50) { // 50px - высота дороги и "пола" вместе
            character.y = canvas.height - character.height - 50;
            character.isJumping = false;
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
            character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.y + character.height > obstacle.y
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
    character.y = canvas.height - character.height - 50; // Обновлено для размещения на дороге
    character.isJumping = false;
    obstacles = [];
    frameCount = 0;
    gameLoop();
}

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();       // Рисуем дорогу
    drawGround();     // Рисуем "пол" под дорогой
    drawPlayer();     // Анимируем персонажа
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
    if (e.code === "Space" && !character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
    }
});

// Обработка для мобильных устройств
canvas.addEventListener("touchstart", () => {
    if (!character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
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
