// Класс для создания слоя заднего фона
class Layer {
    /**
     * @param {string} imagePath - Путь к изображению слоя.
     * @param {number} speedModifier - Скорость движения слоя (чем больше, тем быстрее).
     * @param {number} scale - Масштаб слоя (1 = оригинальный размер, >1 = увеличенный).
     * @param {number} y - Вертикальная позиция слоя относительно верхнего края холста.
     */
    constructor(imagePath, speedModifier, scale = 1, y = 0) {
        this.image = new Image();
        this.image.src = imagePath; // Путь к изображению
        this.speedModifier = speedModifier; // Скорость слоя
        this.scale = scale; // Масштабирование слоя
        this.y = y; // Вертикальная позиция слоя
        this.x = 0; // Начальная горизонтальная позиция слоя
        this.width = 0; // Ширина слоя (устанавливается после загрузки изображения)
        this.height = 0; // Высота слоя (устанавливается после загрузки изображения)

        this.image.onload = () => {
            this.width = this.image.width * this.scale; // Устанавливаем ширину с учётом масштаба
            this.height = this.image.height * this.scale; // Устанавливаем высоту с учётом масштаба
        };
    }

    // Метод для отрисовки слоя
    draw(ctx) {
        // Проверяем, загружено ли изображение
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
            this.x = 0; // Цикличное движение
        }
    }

    // Метод для изменения вертикального положения слоя
    setY(newY) {
        this.y = newY;
    }

    // Метод для изменения масштаба слоя
    setScale(newScale) {
        this.scale = newScale;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
    }

    // Метод для изменения скорости слоя
    setSpeed(newSpeed) {
        this.speedModifier = newSpeed;
    }
}

// Настройки холста
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800; // Ширина холста
canvas.height = 600; // Высота холста

// Создание слоёв с вашими изображениями
const layers = [
    new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 100), // Нижний слой
    new Layer("assets/nightwalk bg forest.png", 0.5, 1, 200), // Средний слой
    new Layer("assets/nightwalk bg mid.png", 1, 1, 0) // Верхний слой
];

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед отрисовкой
    layers.forEach(layer => {
        layer.update(); // Обновляем положение слоя
        layer.draw(ctx); // Отрисовываем слой
    });
    requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Запуск игры
gameLoop();

/*
Инструкции по настройке:
1. Изменение высоты слоя:
   - Используйте метод `setY(newY)`. Например:
     layers[0].setY(300); // Поднимает нижний слой на 300 пикселей.

2. Изменение скорости слоя:
   - Используйте метод `setSpeed(newSpeed)`. Например:
     layers[1].setSpeed(0.7); // Увеличивает скорость среднего слоя.

3. Изменение масштаба слоя:
   - Используйте метод `setScale(newScale)`. Например:
     layers[2].setScale(1.5); // Увеличивает верхний слой на 50%.

4. Добавление новых слоёв:
   - Добавьте новый слой в массив `layers`:
     layers.push(new Layer("assets/new_layer.png", 0.8, 1.2, 100));

5. Изменение порядка слоёв:
   - Измените порядок массива `layers`. Слои рисуются в том порядке, в котором они находятся в массиве:
     const layers = [
         new Layer("assets/nightwalk bg mid.png", 1, 1, 0),
         new Layer("assets/nightwalk bg forest.png", 0.5, 1, 200),
         new Layer("assets/nightwalk bg 1 low.png", 0.2, 1, 400)
     ];
     В этом случае верхний слой будет рисоваться первым.
*/
