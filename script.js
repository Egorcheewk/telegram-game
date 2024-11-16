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
        this.speedModifier = speedModifier; // Скорость движения слоя
        this.scale = scale; // Масштаб слоя
        this.y = y; // Начальное вертикальное положение слоя
        this.x = 0; // Горизонтальное положение слоя
        this.width = 0; // Ширина слоя
        this.height = 0; // Высота слоя

        // Загружаем изображение
        this.image.onload = () => {
            console.log(`Image successfully loaded: ${imagePath}`);
            this.resizeLayer();
        };
        this.image.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
        };
    }

    // Масштабирование слоя
    resizeLayer() {
        const aspectRatio = this.image.width / this.image.height;

        // Растягиваем изображение на ширину экрана
        this.width = canvas.width * this.scale;
        this.height = this.width / aspectRatio;

        // Если высота меньше холста, растягиваем по высоте
        if (this.height < canvas.height) {
            this.height = canvas.height * this.scale;
            this.width = this.height * aspectRatio;
        }

        console.log(`Layer resized: width=${this.width}, height=${this.height}, y=${this.y}`);
    }

    // Отрисовка слоя
    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } else {
            console.warn(`Image not ready to draw: ${this.image.src}`);
        }
    }

    // Обновление положения слоя
    update() {
        this.x -= this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0; // Цикличное движение
        }
    }
}

// Создание слоёв
const layers = [
    new Layer("assets/nightwalk bg mid.png", 1, 1, -200), // Передний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1, 0), // Средний слой
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 50) // Задний слой
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
