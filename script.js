const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установка размеров холста
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
}
resizeCanvas();

// Обработчик изменения размеров окна
window.addEventListener("resize", resizeCanvas);

class Layer {
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; // Путь к изображению
        this.speedModifier = speedModifier; // Скорость слоя
        this.scale = scale; // Масштаб слоя
        this.y = y; // Вертикальное положение слоя
        this.x = 0; // Горизонтальное положение слоя
        this.width = 0; // Ширина слоя
        this.height = 0; // Высота слоя

        // Загружаем изображение и обрабатываем ошибки
        this.image.onload = () => {
            console.log(`Image successfully loaded: ${imagePath}`);
            this.resizeLayer();
        };
        this.image.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
        };
    }

    // Метод масштабирования слоя
    resizeLayer() {
        const aspectRatio = this.image.width / this.image.height;

        // Растягиваем изображение по ширине и сохраняем пропорции
        this.width = canvas.width * this.scale;
        this.height = this.width / aspectRatio;

        // Если высота изображения меньше высоты холста, растягиваем его
        if (this.height < canvas.height) {
            this.height = canvas.height;
            this.width = this.height * aspectRatio;
        }

        // Применяем вертикальное смещение
        this.y = (canvas.height - this.height) / 2;
    }

    // Метод отрисовки слоя
    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } else {
            console.warn(`Image not ready to draw: ${this.image.src}`);
        }
    }

    // Метод обновления положения слоя
    update() {
        this.x -= this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0; // Сброс позиции для бесконечного движения
        }
    }
}

// Создание слоёв
const layers = [
    new Layer("assets/nightwalk bg mid.png", 1, 1), // Передний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1), // Средний слой
    new Layer("assets/nightwalk bg 1 low.png", 0.2, -50) // Задний слой
];

// Обновление и отрисовка слоёв
function updateLayers() {
    layers.forEach(layer => {
        layer.update();
        layer.draw();
    });
}

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
    updateLayers();
    requestAnimationFrame(gameLoop);
}

// Запуск игрового цикла
gameLoop();
