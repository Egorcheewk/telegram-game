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

        // Загрузка изображения
        this.image.onload = () => {
            console.log(`Image loaded: ${imagePath}`);
            this.resizeLayer();
        };
        this.image.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
        };
    }

    // Метод для масштабирования слоя
    resizeLayer() {
        const aspectRatio = this.image.width / this.image.height;

        // Масштабируем изображение, чтобы оно заполняло экран
        this.width = canvas.width; // Растягиваем ширину на весь экран
        this.height = this.width / aspectRatio; // Высота рассчитывается с учётом пропорций

        // Если изображение по высоте меньше экрана, растягиваем по высоте
        if (this.height < canvas.height) {
            this.height = canvas.height; // Растягиваем высоту на весь экран
            this.width = this.height * aspectRatio; // Ширина сохраняет пропорции
        }

        // Учитываем вертикальное смещение слоя
        this.y = y;
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
        this.x -= this.speedModifier; // Перемещаем слой влево
        if (this.x <= -this.width) {
            this.x = 0; // Сбрасываем позицию для бесконечного движения
        }
    }
}

// Создание слоёв с корректным масштабированием и вертикальным положением
const layers = [
    new Layer("assets/nightwalk bg mid.png", 1, 1, 0), // Передний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1, 0), // Средний слой
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 0) // Задний слой
];

// Обновление размеров холста
function resizeCanvas() {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
    layers.forEach(layer => layer.resizeLayer()); // Перерасчёт размеров слоёв
    console.log(`Canvas resized: ${canvas.width}x${canvas.height}`);
}
resizeCanvas();

// Обработчик изменения размеров окна
window.addEventListener("resize", resizeCanvas);

// Функция для обновления и отрисовки слоёв
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
    requestAnimationFrame(gameLoop); // Следующий кадр
}

// Запуск игрового цикла
gameLoop();
