const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retry");
const backToMainMenuButton = document.getElementById("back-to-main-menu");
const menu = document.getElementById("menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Параметры для нижнего слоя
const lowLayer = {
    img: new Image(),
    speed: 0.3,
    yOffset: canvas.height - canvas.height * 0.25 // Устанавливаем у нижней границы
};
lowLayer.img.src = "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20low%20layer.png";

// Параметры для слоя дороги
const roadLayer = {
    img: new Image(),
    speed: 0.5,
    yOffset: lowLayer.yOffset - canvas.height * 0.1 // Точная настройка над нижним слоем
};
roadLayer.img.src = "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20mid%20layer%20(road).png";

// Смещения для параллакса
let lowLayerOffsetX = 0;
let roadLayerOffsetX = 0;

// Персонаж
const character = {
    x: canvas.width / 2 - 32,
    y: roadLayer.yOffset - 64, // Позиция персонажа на уровне дороги
    width: 64,
    height: 64,
    isJumping: false,
    isSlidingLeft: false,
    isSlidingRight: false,
    targetX: canvas.width / 2 - 32,
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10,
    slideDistance: 100
};

// Анимации персонажа
const runFrames = [];
const jumpFrames = [];
const slideRightFrames = [];
const totalRunFrames = 5;
const totalJumpFrames = 5;
const totalSlideFrames = 5;

// Загрузка кадров для анимаций
for (let i = 1; i <= totalRunFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl-running${i}.png`;
    runFrames.push(img);
}

for (let i = 1; i <= totalJumpFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl_jumping${i}.png`;
    jumpFrames.push(img);
}

for (let i = 1; i <= totalSlideFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl_sliding${i}.png`;
    slideRightFrames.push(img);
}

let frameIndex = 0;
let frameCounter = 0;
let isGameOver = false;

// Отрисовка нижнего слоя
function drawLowLayer() {
    const aspectRatio = lowLayer.img.width / lowLayer.img.height;
    const layerHeight = canvas.height * 0.25;
    const layerWidth = aspectRatio * layerHeight;
    const offsetX = lowLayerOffsetX;

    // Рисуем слой дважды для бесшовного эффекта
    ctx.drawImage(lowLayer.img, offsetX, lowLayer.yOffset, layerWidth, layerHeight);
    ctx.drawImage(lowLayer.img, offsetX + layerWidth, lowLayer.yOffset, layerWidth, layerHeight);

    // Обновляем смещение
    lowLayerOffsetX -= lowLayer.speed;

    if (lowLayerOffsetX <= -layerWidth) {
        lowLayerOffsetX = 0;
    }
}

// Отрисовка слоя дороги
function drawRoadLayer() {
    const aspectRatio = roadLayer.img.width / roadLayer.img.height;
    const layerHeight = canvas.height * 0.1; // Увеличиваем высоту, чтобы слой был достаточно высоким
    const layerWidth = aspectRatio * layerHeight;
    const offsetX = roadLayerOffsetX;

    // Рисуем слой дважды для бесшовного эффекта
    ctx.drawImage(roadLayer.img, offsetX, roadLayer.yOffset, layerWidth, layerHeight);
    ctx.drawImage(roadLayer.img, offsetX + layerWidth, roadLayer.yOffset, layerWidth, layerHeight);

    // Обновляем смещение
    roadLayerOffsetX -= roadLayer.speed;

    if (roadLayerOffsetX <= -layerWidth) {
        roadLayerOffsetX = 0;
    }
}

// Отрисовка персонажа
function drawPlayer() {
    frameCounter++;
    let currentFrames;

    // Выбор анимации
    if (character.isSlidingLeft) {
        currentFrames = slideRightFrames;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            currentFrames[frameIndex],
            -character.x - character.width,
            character.y,
            character.width,
            character.height
        );
        ctx.restore();
    } else if (character.isSlidingRight) {
        currentFrames = slideRightFrames;
        ctx.drawImage(currentFrames[frameIndex], character.x, character.y, character.width, character.height);
    } else if (character.isJumping) {
        currentFrames = jumpFrames;
        ctx.drawImage(currentFrames[frameIndex], character.x, character.y, character.width, character.height);
    } else {
        currentFrames = runFrames;
        ctx.drawImage(currentFrames[frameIndex], character.x, character.y, character.width, character.height);
    }

    if (frameCounter % 5 === 0) {
        frameIndex = (frameIndex + 1) % currentFrames.length;
    }
}

// Обновление позиции персонажа
function updatePlayer() {
    if (character.isJumping) {
        character.speedY += character.gravity;
        character.y += character.speedY;

        if (character.y >= roadLayer.yOffset - character.height) { // Позиция "дороги"
            character.y = roadLayer.yOffset - character.height;
            character.isJumping = false;
        }
    }

    if (character.isSlidingLeft || character.isSlidingRight) {
        const dx = character.targetX - character.x;
        if (Math.abs(dx) > 2) {
            character.x += dx * 0.1;
        } else {
            character.isSlidingLeft = false;
            character.isSlidingRight = false;
            frameIndex = 0;
            character.targetX = canvas.width / 2 - 32;
        }
    }
}

// Игровой цикл
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка слоев и персонажа
    drawLowLayer();
    drawRoadLayer();
    updatePlayer();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Показ меню
function showMenu() {
    menu.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("game-over").style.display = "none";
    retryButton.style.display = "none";
    backToMainMenuButton.style.display = "none";
}

// Начало игры
function startGame() {
    resetGame();
    menu.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
}

// Сброс игры
function resetGame() {
    frameIndex = 0;
    frameCounter = 0;
    character.x = canvas.width / 2 - 32;
    character.y = roadLayer.yOffset - character.height;
    character.isJumping = false;
    character.isSlidingLeft = false;
    character.isSlidingRight = false;
    isGameOver = false;
}

// Управление кнопками
retryButton.addEventListener("click", startGame);
backToMainMenuButton.addEventListener("click", showMenu);
startButton.addEventListener("click", startGame);

// Переход к меню после загрузки всех ресурсов
Promise.all(
    [new Promise(resolve => lowLayer.img.onload = resolve), new Promise(resolve => roadLayer.img.onload = resolve)]
    .concat(runFrames.map(img => new Promise(resolve => img.onload = resolve)))
    .concat(jumpFrames.map(img => new Promise(resolve => img.onload = resolve)))
    .concat(slideRightFrames.map(img => new Promise(resolve => img.onload = resolve)))
).then(showMenu).catch(() => {
    console.error("Ошибка загрузки ресурсов");
    showMenu();
});
