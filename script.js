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
    constructor(imagePath, speedModifier, y = 0, scale = 1) {
        this.image = new Image();
        this.image.src = imagePath;
        this.speedModifier = speedModifier;
        this.scale = scale;
        this.y = y; // Устанавливаем вертикальную позицию слоя
        this.x = 0;
        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.width = this.image.width * this.scale; // Рассчитываем ширину с учётом масштаба
            this.height = this.image.height * this.scale; // Рассчитываем высоту с учётом масштаба
        };
    }

    draw(ctx) {
        // Проверяем, загружено ли изображение
        if (!this.width || !this.height) return;

        // Отрисовка изображения
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        // Рисуем повторяющееся изображение для плавного перехода
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speedModifier; // Движение слоя влево
        if (this.x <= -this.width) {
            this.x = 0; // Сбрасываем позицию для бесконечного эффекта
        }
    }

    // Метод для установки вертикального положения
    setY(newY) {
        this.y = newY;
    }
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
    new Layer("assets/nightwalk bg 1 low.png", 0.2, -200) // Задний слой
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
