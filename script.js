class Layer {
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; // Путь к изображению слоя
        this.speedModifier = speedModifier; // Скорость движения слоя
        this.scale = scale; // Масштаб слоя
        this.y = y; // Вертикальная позиция слоя
        this.x = 0; // Горизонтальная позиция слоя
        this.width = 0; // Ширина слоя
        this.height = 0; // Высота слоя

        // Установка размеров после загрузки изображения
        this.image.onload = () => {
            this.resizeLayer();
            console.log(`Image loaded: ${imagePath}`);
        };
        this.image.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
        };
    }

    // Метод для масштабирования слоя
    resizeLayer() {
        const aspectRatio = this.image.width / this.image.height;

        // Масштабируем изображение, чтобы оно занимало всю ширину экрана, сохраняя пропорции
        this.width = canvas.width * this.scale; // Масштабируем ширину относительно холста
        this.height = this.width / aspectRatio; // Высота рассчитывается с учётом пропорций

        // Если изображение по высоте меньше экрана, смещаем по вертикали
        if (this.height < canvas.height) {
            this.y = (canvas.height - this.height) / 2; // Центрируем изображение по вертикали
        }
    }

    // Метод отрисовки слоя
    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            // Отрисовываем слой с учётом масштаба и вертикального смещения
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

// Создание слоёв с масштабированием и вертикальным положением
const layers = [
    new Layer("assets/nightwalk bg mid.png", 1, 1, 0), // Передний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1, 0), // Средний слой
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 0) // Задний слой
];

// Функция для обновления размеров холста и слоёв
function resizeCanvas() {
    canvas.width = window.innerWidth; // Ширина холста равна ширине окна
    canvas.height = window.innerHeight; // Высота холста равна высоте окна
    layers.forEach(layer => layer.resizeLayer());
}

// Слушатель изменения размеров окна
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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
