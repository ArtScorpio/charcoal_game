// Основний об'єкт гри
const game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        woodcutters: 0,
        coal: 0,
        lastTick: Date.now(),
        carbonizationLevel: 1
    },

    // Налаштування
    config: {
        maxWoodcutters: 10,
        baseWoodcutterCost: 100,
        woodcutterMultiplier: 1.5,
        woodPerSecond: 1,
        coalConversionRate: 8, // Скільки дерева потрібно на 1 вугілля
    },

    // Ініціалізація гри
    init() {
        this.loadGame();
        this.startGameLoop();
        this.updateDisplay();
    },

    // Ігровий цикл
    startGameLoop() {
        setInterval(() => {
            this.tick();
        }, 1000);
    },

    // Оновлення гри кожну секунду
    tick() {
        // Виробництво дерева лісорубами
        if (this.state.woodcutters > 0) {
            this.state.wood += this.state.woodcutters * this.config.woodPerSecond;
            this.updateDisplay();
        }
        this.saveGame();
    },

    // Наймання лісоруба
    hireWoodcutter() {
        const cost = this.getWoodcutterCost();
        if (this.state.money >= cost && this.state.woodcutters < this.config.maxWoodcutters) {
            this.state.money -= cost;
            this.state.woodcutters++;
            this.updateDisplay();
            return true;
        }
        this.showMessage('Недостатньо грошей або досягнуто максимум лісорубів!');
        return false;
    },

    // Розрахунок вартості лісоруба
    getWoodcutterCost() {
        return Math.floor(this.config.baseWoodcutterCost * 
               Math.pow(this.config.woodcutterMultiplier, this.state.woodcutters));
    },

    // Виробництво вугілля
    produceCoal() {
        const woodNeeded = this.config.coalConversionRate;
        if (this.state.wood >= woodNeeded) {
            this.state.wood -= woodNeeded;
            this.state.coal += 1;
            this.updateDisplay();
            return true;
        }
        this.showMessage('Недостатньо деревини!');
        return false;
    },

    // Оновлення відображення
    updateDisplay() {
        // Оновлення основних ресурсів
        document.getElementById('money').textContent = Math.floor(this.state.money);
        document.getElementById('wood').textContent = Math.floor(this.state.wood);
        document.getElementById('coal').textContent = Math.floor(this.state.coal);
        
        // Оновлення інформації про лісорубів
        document.getElementById('woodcuttersCount').textContent = this.state.woodcutters;
        document.getElementById('woodcutterCost').textContent = this.getWoodcutterCost();

        // Оновлення стану кнопок
        const hireButton = document.querySelector('button[onclick="game.hireWoodcutter()"]');
        if (hireButton) {
            hireButton.disabled = this.state.money < this.getWoodcutterCost() || 
                                this.state.woodcutters >= this.config.maxWoodcutters;
        }

        const produceButton = document.querySelector('button[onclick="game.produceCoal()"]');
        if (produceButton) {
            produceButton.disabled = this.state.wood < this.config.coalConversionRate;
        }
    },

    // Показ повідомлень
    showMessage(text) {
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    },

    // Збереження гри
    saveGame() {
        const saveData = JSON.stringify(this.state);
        localStorage.setItem('charcoalGame', saveData);
    },

    // Завантаження гри
    loadGame() {
        const savedGame = localStorage.getItem('charcoalGame');
        if (savedGame) {
            this.state = JSON.parse(savedGame);
        }
    }
};

// Запуск гри при завантаженні
window.onload = () => game.init();
