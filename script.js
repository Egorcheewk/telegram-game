// Получение ссылки на холст
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установка размеров холста в зависимости от размеров окна
function resizeCanvas() {
    canvas.width = window.innerWidth; // Ширина холста равна ширине окна
    canvas.height = window.innerHeight; // Высота холста равна высоте окна
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
        this.image.src = imagePath;
        this.speedModifier = speedModifier; // Скорость слоя
        this.x = 0;
        this.y = 0;
        this.width = canvas.width; // Начальная ширина слоя — равна ширине холста
        this.height = canvas.height; // Начальная высота слоя — равна высоте холста
        this.image.onload = () => this.resizeLayer();
    }

    // Метод для масштабирования слоя при изменении размеров холста
    resizeLayer() {
        this.width = canvas.width; // Масштабируем ширину слоя
        this.height = canvas.height; // Масштабируем высоту слоя
    }

    // Метод отрисовки слоя
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

    // Метод обновления положения слоя
    update() {
        this.x -= this.speedModifier; // Движение слоя
        if (this.x <= -this.width) {
            this.x = 0; // Сброс позиции слоя для бесконечного фона
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
    layers.forEach(layer => {
        layer.update(); // Обновляем положение слоя
        layer.draw(); // Рисуем слой
    });
    requestAnimationFrame(gameLoop); // Следующий кадр
}

// Запуск игрового цикла
gameLoop();

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
