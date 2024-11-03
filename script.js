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
const slideRightFrames = [];
const slideLeftFrames = [];
const totalRunFrames = 5; // Количество кадров бега
const totalJumpFrames = 5; // Количество кадров прыжка
const totalSlideFrames = 5; // Количество кадров скольжения

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

// Загрузка кадров анимации скольжения вправо
for (let i = 1; i <= totalSlideFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl_sliding${i}.png`;
    slideRightFrames.push(img);
    img.onload = () => console.log(`Slide right frame ${i} loaded.`);
}

// Создание зеркальных кадров для скольжения влево
for (let i = 0; i < totalSlideFrames; i++) {
    const img = new Image();
    img.src = slideRightFrames[i].src; // Используем тот же источник
    slideLeftFrames.push(img);
    img.onload = () => console.log(`Slide left frame ${i + 1} loaded.`);
}

// Статус персонажа
const character = {
    x: 50,
    y: canvas.height - 100, // Положение персонажа на "дороге"
    width: 64,               // Ширина персонажа
    height: 64,              // Высота персонажа
    isJumping: false,
    isSlidingLeft: false,
    isSlidingRight: false,
    targetX: 50,
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10
};

let frameIndex = 0;
let frameCounter = 0;
let obstacles = [];
let frameCount = 0;
let gameSpeed = 3;
let isGameOver = false;

// Функция для отображения текущего кадра персонажа
function drawPlayer() {
    frameCounter++;
    let currentFrames;

    // Определяем, какую анимацию использовать
    if (character.isSlidingLeft) {
        currentFrames = slideLeftFrames;
    } else if (character.isSlidingRight) {
        currentFrames = slideRightFrames;
    } else if (character.isJumping) {
        currentFrames = jumpFrames;
    } else {
        currentFrames = runFrames;
    }

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

        if (character.y >= canvas.height - character.height - 50) {
            character.y = canvas.height - character.height - 50;
            character.isJumping = false;
            frameIndex = 0; // Сброс анимации к началу после касания пола
        }
    }

    // Обработка движения персонажа к целевой позиции для скольжения
    if (character.isSlidingLeft || character.isSlidingRight) {
        const dx = character.targetX - character.x;
        if (Math.abs(dx) > 2) {
            character.x += dx * 0.1; // Перемещаемся к целевой позиции
        } else {
            // Когда достигли целевой позиции, возвращаемся в исходное положение
            character.isSlidingLeft = false;
            character.isSlidingRight = false;
            frameIndex = 0; // Сброс к началу анимации
            character.targetX = 50;
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
    frameIndex = 0;
    frameCounter = 0;
    obstacles = [];
    frameCount = 0;
    character.x = 50;
    character.y = canvas.height - character.height - 50;
    character.isJumping = false;
    character.isSlidingLeft = false;
    character.isSlidingRight = false;
    isGameOver = false;
}

function startGame() {
    resetGame();

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

    drawRoad();
    drawGround();
    drawPlayer();
    updatePlayer();

    if (frameCount % 300 === 0) {
        createObstacle();
    }

    drawObstacles();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Ожидание загрузки всех кадров перед началом игры
Promise.all([...runFrames, ...jumpFrames, ...slideRightFrames, ...slideLeftFrames].map(img => new Promise(resolve => img.onload = resolve)))
    .then(() => {
        showMenu();
    })
    .catch(() => {
        console.error("Ошибка загрузки кадров");
    });

// Управление с клавиатуры
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyW" && !character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
        frameIndex = 0;
    } else if (e.code === "KeyA" && !character.isSlidingLeft) {
        character.isSlidingLeft = true;
        character.targetX = 0;
        frameIndex = 0;
    } else if (e.code === "KeyD" && !character.isSlidingRight) {
        character.isSlidingRight = true;
        character.targetX = canvas.width - character.width;
        frameIndex = 0;
    }
});
