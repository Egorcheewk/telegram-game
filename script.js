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

function resetGame() {
    frameIndex = 0;
    frameCounter = 0;
    character.x = 50;
    character.y = canvas.height - character.height - 50;
    character.isJumping = false;
    isGameOver = false;
}

function startGame() {
    resetGame();
    menu.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
}

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    updatePlayer();
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

// Функции показа меню и начала игры
function showMenu() {
    menu.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("game-over").style.display = "none";
}

startButton.addEventListener("click", startGame);

// Управление с клавиатуры
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyW" && !character.isJumping) {
        character.isJumping = true;
        character.speedY = character.jumpStrength;
        frameIndex = 0;
    }
});
