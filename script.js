const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Параметры для нижнего слоя
const lowLayer = {
    img: new Image(),
    speed: 0.3,
    yOffset: canvas.height - canvas.height * 0.3 // Поднимаем слой выше для видимости
};
lowLayer.img.src = "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%201%20low.png";

// Параметры для слоя дороги
const roadLayer = {
    img: new Image(),
    speed: 0.5,
    yOffset: lowLayer.yOffset + canvas.height * 0.05 // Размещаем слой дороги поверх нижнего слоя
};
roadLayer.img.src = "https://raw.githubusercontent.com/Egorcheewk/telegram-game/main/assets/nightwalk%20bg%20mid.png";

// Смещение для параллакса
let lowLayerOffsetX = 0;
let roadLayerOffsetX = 0;

// Функция для отрисовки нижнего слоя
function drawLowLayer() {
    const aspectRatio = lowLayer.img.width / lowLayer.img.height;
    const layerHeight = canvas.height * 0.3; // Высота нижнего слоя для покрытия черного пространства
    const layerWidth = aspectRatio * layerHeight;
    const offsetX = lowLayerOffsetX;

    // Рисуем слой дважды для бесшовного эффекта
    ctx.drawImage(lowLayer.img, offsetX, lowLayer.yOffset, layerWidth, layerHeight);
    ctx.drawImage(lowLayer.img, offsetX + layerWidth, lowLayer.yOffset, layerWidth, layerHeight);

    // Обновляем смещение для параллакса
    lowLayerOffsetX -= lowLayer.speed;

    if (lowLayerOffsetX <= -layerWidth) {
        lowLayerOffsetX = 0;
    }
}

// Функция для отрисовки слоя дороги
function drawRoadLayer() {
    const aspectRatio = roadLayer.img.width / roadLayer.img.height;
    const layerHeight = canvas.height * 0.15; // Высота слоя дороги
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

// Игровой цикл для отрисовки слоев
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLowLayer();     // Сначала рисуем нижний слой
    drawRoadLayer();     // Затем слой дороги поверх нижнего слоя
    requestAnimationFrame(gameLoop);
}

// Запуск игрового цикла после загрузки изображений
Promise.all([
    new Promise(resolve => (lowLayer.img.onload = resolve)),
    new Promise(resolve => (roadLayer.img.onload = resolve))
]).then(() => {
    gameLoop();
});
