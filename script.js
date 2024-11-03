const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const menu = document.getElementById("menu");
const backToMainMenu = document.getElementById("back-to-main-menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Массивы для кадров анимации бега, прыжка и скольжения
const runFrames = [];
const jumpFrames = [];
const totalRunFrames = 5;
const totalJumpFrames = 5;

// Загрузка кадров анимации бега
for (let i = 1; i <= totalRunFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl-running${i}.png`;
    runFrames.push(img);
    img.onload = () => console.log(`Run frame ${i} loaded.`);
}

// Загрузка кадров анимации прыжка
for (let i = 1; i <= totalJumpFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl_jumping${i}.png`;
    jumpFrames.push(img);
    img.onload = () => console.log(`Jump frame ${i} loaded.`);
}

let frameIndex = 0;
let frameCounter = 0;
let obstacles = [];
let frameCount = 0;
let gameSpeed = 3;
let isGameOver = false;

// Базовый статус персонажа
const character = {
    x: 50,
    y: canvas.height - 100,
    width: 64,
    height: 64,
    isJumping: false,
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10
};

// Функция для отображения кадра персонажа
function drawPlayer() {
    frameCounter++;
    const currentFrames = character.isJumping ? jumpFrames : runFrames;

    if (frameCounter % 5 === 0) {
        frameIndex = (frameIndex + 1) % currentFrames.length;
    }

    ctx.drawImage(currentFrames[frameIndex], character.x, character.y, character.width, character.height);
}

// Обновление позиции персонажа
function updatePlayer() {
    if (character.isJumping) {
        character.speedY += character.gravity;
        character.y += character.speedY;

        if (character.y >= canvas.height - character.height - 50) {
            character.y = canvas.height - character.height - 50;
            character.isJumping = false;
            frameIndex = 0;
        }
    }
}

// Отображение дороги и "пола"
function drawRoad() {
    ctx.fillStyle = "#777";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 30); // Дорога чуть выше "пола"
}

function drawGround() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // "Пол" на уровне 20 пикселей от нижней границы
}

// Создание препятствий
function createObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 70,
        width: 20,
        height: 20
    });
}

// Отображение препятствий
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

// Конец игры
function gameOver() {
    isGameOver = true;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("retry").style.display = "block";
    document.getElementById("back-to-main-menu").style.display = "block";
}

// Показ меню
function showMenu() {
    menu.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("game-over").style.display = "none";
}

// Сброс игры
function resetGame() {
    frameIndex = 0;
    frameCounter = 0;
    obstacles = [];
    frameCount = 0;
    character.x = 50;
    character.y = canvas.height - character.height - 50;
    character.isJumping = false;
    isGameOver = false;
}

// Начало игры
function startGame() {
    resetGame();
    menu.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
}

// Игровой цикл
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawGround();
    drawPlayer();
    updatePlayer();

    if (frameCount % 300 === 0) { // Создание препятствий каждые 300 кадров
        createObstacle();
    }

    drawObstacles();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Переход к меню после загрузки всех кадров
Promise.all([...runFrames, ...jumpFrames].map(img => new Promise(resolve => img.onload = resolve)))
    .then(() => {
        console.log("Все кадры загружены");
        showMenu();
    })
    .catch(() => {
        console.error("Ошибка загрузки кадров");
    });

// Событие нажатия кнопки "Start"
startButton.addEventListener("click", startGame);

// Управление прыжком
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyW" && !character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
        frameIndex = 0;
    }
});
