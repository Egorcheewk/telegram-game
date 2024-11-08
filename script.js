const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Параметры для слоя дороги
const roadLayer = {
    img: new Image(),
    speed: 0.5,
    yOffset: canvas.height - canvas.height * 0.2 // Подняли слой выше и увеличили высоту
};
roadLayer.img.src = "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%20mid.png";

// Смещение для параллакса дороги
let roadLayerOffsetX = 0;

// Отрисовка слоя дороги
function drawRoadLayer() {
    const aspectRatio = roadLayer.img.width / roadLayer.img.height;
    const layerHeight = canvas.height * 0.2; // Увеличенная высота слоя
    const layerWidth = aspectRatio * layerHeight;
    const offsetX = roadLayerOffsetX;

    // Рисуем слой дважды для бесшовного эффекта
    ctx.drawImage(roadLayer.img, offsetX, roadLayer.yOffset, layerWidth, layerHeight);
    ctx.drawImage(roadLayer.img, offsetX + layerWidth, roadLayer.yOffset, layerWidth, layerHeight);

    // Обновляем смещение для параллакса
    roadLayerOffsetX -= roadLayer.speed;

    if (roadLayerOffsetX <= -layerWidth) {
        roadLayerOffsetX = 0;
    }
}

// Игровой цикл для отрисовки слоя дороги
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoadLayer();
    requestAnimationFrame(gameLoop);
}

// Запуск игрового цикла
roadLayer.img.onload = () => {
    gameLoop();
};
