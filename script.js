// Получение ссылки на холст
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установка размеров холста в зависимости от размеров окна
function resizeCanvas() {
    canvas.width = window.innerWidth; // Ширина холста равна ширине окна
    canvas.height = window.innerHeight; // Высота холста равна высоте окна
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
}
resizeCanvas();

// Обновление размеров холста при изменении размера окна
window.addEventListener("resize", () => {
    resizeCanvas();
    layers.forEach(layer => layer.resizeLayer());
});

// Класс слоя
class Layer {
    constructor(imagePath, speedModifier) {
        this.image = new Image();
        this.image.src = imagePath; // Путь к изображению слоя
        this.speedModifier = speedModifier; // Скорость движения слоя
        this.x = 0; // Горизонтальная позиция слоя
        this.y = 0; // Вертикальная позиция слоя
        this.width = canvas.width; // Ширина слоя (изначально равна ширине холста)
        this.height = canvas.height; // Высота слоя (изначально равна высоте холста)

        // Проверка загрузки изображения
        this.image.onload = () => {
            this.resizeLayer();
            console.log(`Image loaded: ${imagePath}`);
        };
        this.image.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
        };
    }

    // Метод для масштабирования слоя при изменении размеров холста
    resizeLayer() {
        this.width = canvas.width; // Масштабируем ширину слоя
        this.height = canvas.height; // Масштабируем высоту слоя
        console.log(`Layer resized to: ${this.width}x${this.height}`);
    }

    // Метод отрисовки слоя
    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            // Отрисовываем слой и его копию для бесшовного перехода
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } else {
            console.warn(`Image not ready to draw: ${this.image.src}`);
        }
    }

    // Метод обновления положения слоя
    update() {
        this.x -= this.speedModifier; // Перемещаем слой влево
        if (this.x <= -this.width) {
            this.x = 0; // Сбрасываем позицию для бесконечного движения
        }
    }
}

// Создание слоёв
const layers = [
    new Layer("assets/nightwalk bg 1 low.png", 0.2), // Задний слой
    new Layer("assets/nightwalk bg forest.png", 0.5), // Средний слой
    new Layer("assets/nightwalk bg mid.png", 1) // Передний слой
];

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед отрисовкой
    layers.forEach(layer => {
        layer.update(); // Обновляем положение слоя
        layer.draw(); // Рисуем слой
    });
    requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Запуск игрового цикла
gameLoop();
