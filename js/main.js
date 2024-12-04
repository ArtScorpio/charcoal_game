// Ініціалізація основного об'єкта гри
const game = {
    // Базовий стан гри
    state: {
        money: 1000,
        wood: 0,
        woodcutters: 0,
        toolLevel: 1,
        unlockedPlots: 1,
        carbonizationLevel: 1,
        resources: {
            coalDust: 0,
            normalCoal: 0,
            goldenCoal: 0
        }
    },

    // Основні функції гри
    init: function() {
        this.loadGame();  // Завантаження збереженої гри
        this.setupEventListeners();  // Налаштування обробників подій
        this.startGameLoop();  // Запуск ігрового циклу
        this.updateDisplay();  // Оновлення відображення
    },

    // Ігровий цикл
    startGameLoop: function() {
        setInterval(() => {
            this.produceWood();  // Виробництво деревини
            this.updateDisplay();  // Оновлення відображення
            this.saveGame();  // Автозбереження
        }, 1000);  // Кожну секунду
    },

    // Функції виробництва
    produceWood: function() {
        const baseProduction = this.state.woodcutters * this.state.toolLevel;
        this.state.wood += baseProduction;
    },

    // Наймання лісорубів
    hireWoodcutter: function() {
        const cost = this.calculateWoodcutterCost();
        if (this.state.money >= cost && this.state.woodcutters < 10) {
            this.state.money -= cost;
            this.state.woodcutters++;
            this.updateDisplay();
        } else {
            this.showNotification('Недостатньо грошей або досягнуто ліміт лісорубів!');
        }
    },

    // Розрахунок вартості
    calculateWoodcutterCost: function() {
        return Math.floor(100 * Math.pow(1.5, this.state.woodcutters));
    },

    // Оновлення відображення
    updateDisplay: function() {
        // Оновлення ресурсів
        document.getElementById('money').textContent = this.state.money;
        document.getElementById('wood').textContent = this.state.wood;
        document.getElementById('woodcuttersCount').textContent = this.state.woodcutters;
        document.getElementById('woodcutterCost').textContent = this.calculateWoodcutterCost();
        
        // Оновлення вугілля
        document.getElementById('coalDust').textContent = this.state.resources.coalDust;
        document.getElementById('normalCoal').textContent = this.state.resources.normalCoal;
        document.getElementById('goldenCoal').textContent = this.state.resources.goldenCoal;
    },

    // Збереження/завантаження гри
    saveGame: function() {
        localStorage.setItem('charcoalGame', JSON.stringify(this.state));
    },

    loadGame: function() {
        const savedGame = localStorage.getItem('charcoalGame');
        if (savedGame) {
            this.state = JSON.parse(savedGame);
        }
    },

    // Сповіщення
    showNotification: function(message) {
        // Створення елемента сповіщення
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Додавання до сторінки
        document.body.appendChild(notification);
        
        // Видалення через 3 секунди
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// Запуск гри при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
