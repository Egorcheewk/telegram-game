const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retry");
const backToMainMenuButton = document.getElementById("back-to-main-menu");
const menu = document.getElementById("menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Параметры для слоев параллакса
const parallaxLayers = [
    { src: "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20back%20clouds.png", speed: 0.1, yOffset: 0 }, // Облака
    { src: "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20back%20layer%20forest.png", speed: 0.3, yOffset: 0 }, // Лес
    { src: "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20mid%20layer%20(road).png", speed: 1.0, yOffset: canvas.height - 150 }, // Дорога
    { src: "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20high%20layer.png", speed: 1.2, yOffset: canvas.height - 250 }, // Высокий слой
    { src: "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20low%20layer.png", speed: 1.5, yOffset: canvas.height - 100 }  // Нижний слой
];

// Загрузка каждого слоя
const loadedLayers = [];
parallaxLayers.forEach(layerInfo => {
    const img = new Image();
    img.src = layerInfo.src;
    layerInfo.img = img;
    loadedLayers.push(layerInfo);
});

// Смещения по оси X для каждого слоя
const layerOffsets = new Array(parallaxLayers.length).fill(0);

// Персонаж
const character = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 200,
    width: 64,
    height: 64,
    isJumping: false,
    isSlidingLeft: false,
    isSlidingRight: false,
    targetX: canvas.width / 2 - 32,
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10,
    slideDistance: 100 // Расстояние скольжения
};

// Переменные для обработки свайпов
let touchStartX = 0;
let touchEndX = 0;

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

// Отрисовка параллакс-слоев
function drawParallaxBackground() {
    loadedLayers.forEach((layer, index) => {
        const offsetX = layerOffsets[index];
        
        // Рисуем слой дважды для бесшовного эффекта
        ctx.drawImage(layer.img, offsetX, layer.yOffset, canvas.width, canvas.height);
        ctx.drawImage(layer.img, offsetX + canvas.width, layer.yOffset, canvas.width, canvas.height);
        
        // Обновляем смещение
        layerOffsets[index] -= layer.speed;

        if (layerOffsets[index] <= -canvas.width) {
            layerOffsets[index] = 0;
        }
    });
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

        if (character.y >= canvas.height - 200) { // Позиция "дороги"
            character.y = canvas.height - 200;
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

    // Отрисовка фона и персонажа
    drawParallaxBackground();
    updatePlayer();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// События для прыжка и скольжения
canvas.addEventListener("click", () => {
    if (!character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
    }
});

canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

canvas.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance < -50 && !character.isSlidingLeft) { // Свайп влево
        character.isSlidingLeft = true;
        character.targetX = character.x - character.slideDistance;
        frameIndex = 0;
    } else if (swipeDistance > 50 && !character.isSlidingRight) { // Свайп вправо
        character.isSlidingRight = true;
        character.targetX = character.x + character.slideDistance;
        frameIndex = 0;
    }
}

// Поддержка клавиатуры для ПК
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyW" && !character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
        frameIndex = 0;
    } else if (e.code === "KeyA" && !character.isSlidingLeft) {
        character.isSlidingLeft = true;
        character.targetX = character.x - character.slideDistance;
        frameIndex = 0;
    } else if (e.code === "KeyD" && !character.isSlidingRight) {
        character.isSlidingRight = true;
        character.targetX = character.x + character.slideDistance;
        frameIndex = 0;
    }
});

// Управление кнопками "Рестарт" и "Назад в меню"
retryButton.addEventListener("click", startGame);
backToMainMenuButton.addEventListener("click", showMenu);
startButton.addEventListener("click", startGame);

function startGame() {
    resetGame();
    menu.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
}

function resetGame() {
    frameIndex = 0;
    frameCounter = 0;
    character.x = canvas.width / 2 - 32;
    character.y = canvas.height - character.height - 200;
    character.isJumping = false;
    character.isSlidingLeft = false;
    character.isSlidingRight = false;
    isGameOver = false;
}
