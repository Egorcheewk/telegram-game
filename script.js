const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const menu = document.getElementById("menu");
const backToMainMenu = document.getElementById("back-to-main-menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Массивы для кадров анимации бега и прыжка
const runFrames = [];
const jumpFrames = [];
const totalRunFrames = 5; // Количество кадров бега
const totalJumpFrames = 5; // Количество кадров прыжка

// Загрузка кадров анимации бега
for (let i = 1; i <= totalRunFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl-running${i}.png`;
    runFrames.push(img);
}

// Загрузка кадров анимации прыжка
for (let i = 1; i <= totalJumpFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl_jumping${i}.png`;
    jumpFrames.push(img);
}

let frameIndex = 0;
let frameCounter = 0; // Счетчик для замедления анимации

const character = {
    x: 50,
    y: canvas.height - 100, // Положение персонажа на "дороге"
    width: 64,               // Ширина персонажа
    height: 64,              // Высота персонажа
    isJumping: false,
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10
};

let obstacles = [];
let frameCount = 0;
let gameSpeed = 3;
let isGameOver = false;

// Функция для отображения текущего кадра персонажа
function drawPlayer() {
    frameCounter++;
    let currentFrames = character.isJumping ? jumpFrames : runFrames; // Выбираем кадры в зависимости от состояния персонажа

    // Зацикливаем анимацию, изменяя кадр каждые 5 итераций
    if (frameCounter % 5 === 0) {
        frameIndex = (frameIndex + 1) % currentFrames.length;
    }

    // Рисуем текущий кадр персонажа
    ctx.drawImage(currentFrames[frameIndex], character.x, character.y, character.width, character.height);
}

function updatePlayer() {
    if (character.isJumping) {
        character.speedY += character.gravity;
        character.y += character.speedY;

        // Проверка на касание "пола"
        if (character.y >= canvas.height - character.height - 50) { // 50px - высота дороги и "пола" вместе
            character.y = canvas.height - character.height - 50;
            character.isJumping = false;
            frameIndex = 0; // Сброс анимации к началу после касания пола
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

function resetGame() {
    // Сброс всех параметров перед запуском игры
    frameIndex = 0;
    frameCounter = 0;
    obstacles = [];
    frameCount = 0;
    character.y = canvas.height - character.height - 50;
    character.isJumping = false;
    isGameOver = false;
}

function startGame() {
    resetGame(); // Сброс игры перед запуском

    menu.style.display = "none";
    canvas.style.display = "block";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("retry").style.display = "none";
    document.getElementById("back-to-main-menu").style.display = "none";

    gameLoop();
}

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();       // Рисуем дорогу
    drawGround();     // Рисуем "пол" под дорогой
    drawPlayer();     // Анимируем персонажа
    updatePlayer();

    if (frameCount % 300 === 0) { // Увеличен интервал для создания препятствий
        createObstacle();
    }

    drawObstacles();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Ожидание полной загрузки всех кадров перед началом игры
Promise.all([...runFrames, ...jumpFrames].map(img => new Promise(resolve => img.onload = resolve)))
    .then(() => {
        console.log("Все кадры загружены");
        showMenu();
    })
    .catch(() => {
        console.error("Ошибка загрузки кадров");
    });

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
        frameIndex = 0; // Сбрасываем анимацию прыжка к началу
    }
});

// Обработка для мобильных устройств
canvas.addEventListener("touchstart", () => {
    if (!character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
        frameIndex = 0; // Сбрасываем анимацию прыжка к началу
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
