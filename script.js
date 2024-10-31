const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

let player = {
    x: 50,
    y: canvas.height - 30,
    width: 20,
    height: 30,
    speedY: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false
};

let obstacles = [];
let frameCount = 0;
let gameSpeed = 3;
let isGameOver = false;

function drawPlayer() {
    ctx.fillStyle = "#ff0";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    if (player.isJumping) {
        player.speedY += player.gravity;
        player.y += player.speedY;

        if (player.y >= canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.isJumping = false;
        }
    }
}

function createObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 20,
        width: 20,
        height: 20
    });
}

function drawObstacles() {
    ctx.fillStyle = "#f00";
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Remove obstacle when it goes off-screen
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }

        // Check for collision
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

function gameOver() {
    isGameOver = true;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("retry").style.display = "block";
}

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    updatePlayer();

    if (frameCount % 100 === 0) {
        createObstacle();
    }

    drawObstacles();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Handle jumping for keyboard
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.isJumping) {
        player.isJumping = true;
        player.speedY = player.jumpStrength;
    }
});

// Handle jumping for mobile devices
canvas.addEventListener("touchstart", () => {
    if (!player.isJumping) {
        player.isJumping = true;
        player.speedY = player.jumpStrength;
    }
});

document.getElementById("retry").addEventListener("click", () => {
    isGameOver = false;
    player.y = canvas.height - player.height;
    player.isJumping = false;
    obstacles = [];
    frameCount = 0;
    document.getElementById("game-over").style.display = "none";
    document.getElementById("retry").style.display = "none";
    gameLoop();
});

// Auto-start the game in Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    gameLoop();
} else {
    // Run game loop in a regular browser environment
    gameLoop();
}
