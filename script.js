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

class Layer {
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; // Путь к изображению слоя
        this.speedModifier = speedModifier; // Скорость движения слоя
        this.scale = scale; // Масштаб слоя
        this.y = y; // Вертикальная позиция слоя
        this.x = 0; // Горизонтальная позиция слоя
        this.width = 0; // Ширина слоя (изменяется с учётом масштаба)
        this.height = 0; // Высота слоя (изменяется с учётом масштаба)

        // Загрузка изображения и масштабирование
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

        // Масштабируем ширину и высоту с учётом `scale`
        this.width = canvas.width * this.scale; // Масштабируем относительно холста
        this.height = this.width / aspectRatio; // Высота сохраняет пропорции
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


// Создание слоёв
const layers = [
    new Layer("assets/nightwalk bg mid.png", 1, 1.3, -100), // Передний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1.1, 0), // Средний слой
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 50) // Задний слой
];

// Изменение логики отрисовки
function updateLayers() {
    const sortedLayers = layers.slice().sort((a, b) => {
        if (a.image.src.includes("nightwalk bg 1 low")) {
            return 1; // Слой с приоритетом перекрытия
        }
        return -1;
    });

    sortedLayers.forEach(layer => {
        layer.update();
        layer.draw();
    });
}

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед отрисовкой
    updateLayers(); // Отрисовка слоёв
    requestAnimationFrame(gameLoop); // Следующий кадр
}

// Запуск игрового цикла
gameLoop();

// Пример изменения вертикального положения слоя
setTimeout(() => {
    layers[2].y = 100; // Смещаем задний слой вниз на 100 пикселей
    console.log("Changed vertical position of background layer.");
}, 2000);
