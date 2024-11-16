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

// Класс для создания слоя заднего фона
class Layer {
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; // Загружаем изображение
        this.speedModifier = speedModifier; // Скорость движения слоя
        this.scale = scale; // Масштабирование слоя
        this.y = y; // Вертикальное положение слоя
        this.x = 0; // Горизонтальная позиция слоя
        this.width = 0; // Ширина слоя
        this.height = 0; // Высота слоя

        this.image.onload = () => {
            // Устанавливаем ширину и высоту исходного изображения
            this.width = this.image.width * this.scale;
            this.height = this.image.height * this.scale;
        };
    }

    // Метод для отрисовки слоя
    draw(ctx) {
        // Проверяем, загрузилось ли изображение
        if (!this.width || !this.height) return;

        // Основное изображение
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        // Второе изображение для плавного перехода
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

    // Метод для обновления позиции слоя
    update() {
        this.x -= this.speedModifier; // Движение слоя влево
        if (this.x <= -this.width) {
            this.x = 0; // Сбрасываем позицию для бесконечного эффекта
        }
    }

    // Метод для изменения масштаба слоя
    setScale(newScale) {
        this.scale = newScale;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
    }
}

// Настройки холста
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800; // Установите фиксированную ширину
canvas.height = 600; // Установите фиксированную высоту

// Создание слоёв
const layers = [
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 300), // Убедитесь, что `scale` = 1
    new Layer("assets/nightwalk bg forest.png", 0.5, 1, 200),
    new Layer("assets/nightwalk bg mid.png", 1, 1, 100)
];

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед отрисовкой
    layers.forEach(layer => {
        layer.update(); // Обновляем слой
        layer.draw(ctx); // Отрисовываем слой
    });
    requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Запуск игры
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
