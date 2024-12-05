const Game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        coal: 0,
        woodcutters: 0,
        lastUpdate: Date.now()
    },

    // Налаштування
    config: {
        // Базові налаштування лісорубів
        woodcutter: {
            baseCost: 100,
            costMultiplier: 1.5,
            maxCount: 10,
            baseProduction: 1
        },
        // Налаштування виробництва вугілля
        coal: {
            woodNeeded: 8,
            productionTime: 5000, // 5 секунд для тесту
            baseOutput: 1
        }
    },

    // Ініціалізація гри
    init() {
        console.log('Гра запускається...');
        // Завантаження збереженої гри якщо є
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            this.state = JSON.parse(savedState);
        }
        // Запуск ігрового циклу
        this.startGameLoop();
        // Перше оновлення інтерфейсу
        this.updateUI();
    },

    // Ігровий цикл
    startGameLoop() {
        setInterval(() => {
            // Виробництво деревини лісорубами
            if (this.state.woodcutters > 0) {
                this.state.wood += this.state.woodcutters * this.config.woodcutter.baseProduction;
                this.updateUI();
                this.saveGame();
            }
        }, 1000);
    },

    // Найм лісоруба
    hireWoodcutter() {
        console.log('Спроба найняти лісоруба');
        const cost = this.calculateWoodcutterCost();
        if (this.state.money >= cost && this.state.woodcutters < this.config.woodcutter.maxCount) {
            this.state.money -= cost;
            this.state.woodcutters++;
            this.showMessage("Найнято нового лісоруба!");
            this.updateUI();
            this.saveGame();
            return true;
        } else {
            this.showMessage(
                this.state.woodcutters >= this.config.woodcutter.maxCount ? 
                "Досягнуто максимум лісорубів!" : 
                "Недостатньо грошей!"
            );
            return false;
        }
    },

    // Розрахунок вартості лісоруба
    calculateWoodcutterCost() {
        return Math.floor(
            this.config.woodcutter.baseCost * 
            Math.pow(this.config.woodcutter.costMultiplier, this.state.woodcutters)
        );
    },

    // Виробництво вугілля
    produceCoal() {
        if (this.state.wood >= this.config.coal.woodNeeded) {
            this.state.wood -= this.config.coal.woodNeeded;
            
            // Показуємо прогрес виробництва
            const progressBar = document.getElementById('productionProgress');
            if (progressBar) {
                progressBar.style.display = 'block';
                progressBar.value = 0;
                
                const interval = setInterval(() => {
                    progressBar.value += 1;
                    if (progressBar.value >= 100) {
                        clearInterval(interval);
                        progressBar.style.display = 'none';
                        this.finishCoalProduction();
                    }
                }, this.config.coal.productionTime / 100);
            } else {
                setTimeout(() => this.finishCoalProduction(), this.config.coal.productionTime);
            }
            
            this.updateUI();
        } else {
            this.showMessage("Недостатньо деревини!");
        }
    },

    // Завершення виробництва вугілля
    finishCoalProduction() {
        this.state.coal += this.config.coal.baseOutput;
        this.showMessage("Вироблено вугілля!");
        this.updateUI();
        this.saveGame();
    },

    // Оновлення інтерфейсу
    updateUI() {
        // Оновлення значень ресурсів
        document.getElementById('money').textContent = Math.floor(this.state.money);
        document.getElementById('wood').textContent = Math.floor(this.state.wood);
        document.getElementById('coal').textContent = Math.floor(this.state.coal);
        document.getElementById('woodcuttersCount').textContent = this.state.woodcutters;
        document.getElementById('woodcutterCost').textContent = this.calculateWoodcutterCost();

        // Оновлення стану кнопок
        const hireButton = document.getElementById('hireButton');
        if (hireButton) {
            hireButton.disabled = 
                this.state.money < this.calculateWoodcutterCost() || 
                this.state.woodcutters >= this.config.woodcutter.maxCount;
        }

        const produceButton = document.getElementById('produceButton');
        if (produceButton) {
            produceButton.disabled = this.state.wood < this.config.coal.woodNeeded;
        }
    },

    // Показ повідомлень
    showMessage(text) {
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = text;
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.background = 'rgba(0,0,0,0.8)';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '20px';
        message.style.zIndex = '1000';
        
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 3000);
    },

    // Збереження гри
    saveGame() {
        localStorage.setItem('gameState', JSON.stringify(this.state));
    }
};

// Запуск гри при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('Сторінка завантажена, запуск гри...');
    Game.init();
});
