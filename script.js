// Настройки холста
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800; // Ширина холста
canvas.height = 800; // Высота холста

// Класс для создания слоя заднего фона
class Layer {
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; // Путь к изображению слоя
        this.speedModifier = speedModifier; // Скорость движения слоя
        this.scale = scale; // Масштаб слоя
        this.y = y; // Вертикальное смещение
        this.x = 0; // Начальная горизонтальная позиция
        this.width = 0; // Ширина слоя
        this.height = 0; // Высота слоя

        this.image.onload = () => {
            this.width = this.image.width * this.scale; // Применяем масштаб
            this.height = this.image.height * this.scale;
        };
    }

    // Метод для отрисовки слоя
    draw() {
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Отрисовка второго экземпляра для плавного перехода
        ctx.drawImage(
            this.image,
            this.x + this.width,
            this.y,
            this.width,
            this.height
        );
    }

    // Метод для обновления положения слоя
    update() {
        this.x -= this.speedModifier; // Движение слоя влево
        if (this.x <= -this.width) {
            this.x = 0; // Сбрасываем позицию для бесконечного эффекта
        }
    }
}

// Создание слоёв
const layers = [
    
    
    new Layer("assets/nightwalk bg mid.png", 1, 1.3, -100) // Передний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1.1, 0), // Средний слой
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 0), // Задний слой
];

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед отрисовкой
    layers.forEach(layer => {
        layer.update(); // Обновляем положение слоя
        layer.draw(); // Отрисовываем слой
    });
    requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Запуск игрового цикла
gameLoop();
