const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retry");
const backToMainMenuButton = document.getElementById("back-to-main-menu");
const menu = document.getElementById("menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Массивы для кадров анимации
const runFrames = [];
const jumpFrames = [];
const slideRightFrames = [];
const slideLeftFrames = [];
const totalRunFrames = 5;
const totalJumpFrames = 5;
const totalSlideFrames = 5;

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

// Загрузка кадров анимации скольжения вправо
for (let i = 1; i <= totalSlideFrames; i++) {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/animecosplaygirl_sliding${i}.png`;
    slideRightFrames.push(img);
}

// Создание зеркальных кадров для скольжения влево
for (let i = 0; i < totalSlideFrames; i++) {
    const img = new Image();
    img.src = slideRightFrames[i].src;
    slideLeftFrames.push(img);
}

let frameIndex = 0;
let frameCounter = 0;
let isGameOver = false;

// Позиция и статус персонажа
const character = {
    x: canvas.width / 2 - 32, // Центрируем по горизонтали
    y: canvas.height - 150,   // Центрируем по вертикали относительно экрана
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

// Функция для отображения кадра персонажа
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

// Отображение дороги и "пола"
function drawRoad() {
    ctx.fillStyle = "#777";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 30);
}

function drawGround() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

// Конец игры
function gameOver() {
    isGameOver = true;
    document.getElementById("game-over").style.display = "block";
    retryButton.style.display = "block";
    backToMainMenuButton.style.display = "block";
}

// Показ меню
function showMenu() {
    menu.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("game-over").style.display = "none";
    retryButton.style.display = "none";
    backToMainMenuButton.style.display = "none";
}

// Сброс игры
function resetGame() {
    frameIndex = 0;
    frameCounter = 0;
    character.x = canvas.width / 2 - 32;
    character.y = canvas.height - character.height - 50;
    character.isJumping = false;
    character.isSlidingLeft = false;
    character.isSlidingRight = false;
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

    requestAnimationFrame(gameLoop);
}

// Переход к меню после загрузки всех кадров
Promise.all([...runFrames, ...jumpFrames, ...slideRightFrames, ...slideLeftFrames].map(img => new Promise(resolve => img.onload = resolve)))
    .then(() => {
        console.log("Все кадры загружены");
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
