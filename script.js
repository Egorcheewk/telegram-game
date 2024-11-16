const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установка размеров холста
function resizeCanvas() {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
    console.log(`Canvas resized: ${canvas.width}x${canvas.height}`);
}
resizeCanvas();

// Обработчик изменения размера окна
window.addEventListener("resize", resizeCanvas);

// Класс слоя
class Layer {
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; 
        this.speedModifier = speedModifier; 
        this.scale = scale; 
        this.y = y; 
        this.x = 0; 
        this.width = 0; 
        this.height = 0;

        this.image.onload = () => {
            console.log(`Image loaded: ${imagePath}`);
            this.resizeLayer();
        };
        this.image.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
        };
    }

    resizeLayer() {
        const aspectRatio = this.image.width / this.image.height;

        // Масштабируем ширину и высоту
        this.width = canvas.width * this.scale;
        this.height = this.width / aspectRatio;

        if (this.height < canvas.height) {
            this.y = (canvas.height - this.height) / 2; 
        }

        console.log(`Layer resized to: ${this.width}x${this.height}`);
    }

    draw() {
        if (this.image.complete && this.image.naturalWidth > 0) {
            console.log(`Drawing: ${this.image.src}`);
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } else {
            console.warn(`Image not ready: ${this.image.src}`);
        }
    }

    update() {
        this.x -= this.speedModifier; 
        if (this.x <= -this.width) {
            this.x = 0; 
        }
    }
}

// Создание слоёв
const layers = [
    new Layer("assets/nightwalk bg mid.png", 1, 1, 0), 
    new Layer("assets/nightwalk bg forest.png", 0.5, 1, 0), 
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 0)
];

// Обновление холста и слоёв
function updateLayers() {
    layers.forEach(layer => {
        layer.update();
        layer.draw();
    });
}

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateLayers();
    requestAnimationFrame(gameLoop);
}

gameLoop();
