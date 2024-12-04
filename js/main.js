const Game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        coalDust: 0,
        coal: 0,
        goldenCoal: 0,
        woodcutters: 0,
        carbonizationLevel: 1,
        experience: 0,
        level: 1,
        unlockedMethods: [1],
        lastUpdate: Date.now()
    },

    // Конфігурація рівнів
    levelConfig: {
        expPerLevel: 1000,    // Базовий досвід для рівня
        multiplier: 1.5,      // Множник для наступних рівнів
        rewards: {
            2: { money: 1000, description: "Бонус новачка" },
            3: { money: 2500, description: "Досвідчений вугляр" },
            4: { money: 5000, description: "Майстер вугілля" },
            5: { money: 10000, description: "Експерт виробництва" }
        }
    },

    // Ініціалізація гри
    init() {
        console.log('Гра запускається...');
        const savedState = SaveSystem.loadGame();
        if (savedState) {
            this.state = savedState;
            console.log('Завантажено збережену гру');
        }
        this.startGameLoop();
        this.updateUI();
    },

    // Ігровий цикл
    startGameLoop() {
        setInterval(() => {
            const now = Date.now();
            const delta = (now - this.state.lastUpdate) / 1000;

            // Виробництво деревини
            if (this.state.woodcutters > 0) {
                const production = WoodcuttingSystem.produce() * delta;
                this.state.wood += production;
            }

            this.state.lastUpdate = now;
            this.updateUI();
            SaveSystem.saveGame(this.state);
        }, 1000);
    },

    // Система продажу
    sellWood() {
        if (this.state.wood >= 1) {
            this.state.wood--;
            this.state.money += 10;
            this.addExperience(1);
            UISystem.showMessage("+10 💰");
            this.updateUI();
        }
    },

    sellCoalDust() {
        if (this.state.coalDust >= 1) {
            this.state.coalDust--;
            this.state.money += 50;
            this.addExperience(5);
            UISystem.showMessage("+50 💰");
            this.updateUI();
        }
    },

    sellCoal() {
        if (this.state.coal >= 1) {
            this.state.coal--;
            this.state.money += 150;
            this.addExperience(15);
            UISystem.showMessage("+150 💰");
            this.updateUI();
        }
    },

    sellGoldenCoal() {
        if (this.state.goldenCoal >= 1) {
            this.state.goldenCoal--;
            this.state.money += 300;
            this.addExperience(30);
            UISystem.showMessage("+300 💰");
            this.updateUI();
        }
    },

    // Система досвіду
    addExperience(amount) {
        this.state.experience += amount;
        const expNeeded = this.calculateExpForNextLevel();
        
        if (this.state.experience >= expNeeded) {
            this.levelUp();
        }
        
        this.updateUI();
    },

    levelUp() {
        this.state.level++;
        const reward = this.levelConfig.rewards[this.state.level];
        
        if (reward) {
            this.state.money += reward.money;
            UISystem.showMessage(
                `Рівень ${this.state.level}! ${reward.description} +${reward.money}💰`,
                "success"
            );
        }
    },

    calculateExpForNextLevel() {
        return Math.floor(
            this.levelConfig.expPerLevel * 
            Math.pow(this.levelConfig.multiplier, this.state.level - 1)
        );
    },

    // Виробництво
    startProduction(method) {
        const production = ProductionSystem.startProduction(method);
        if (production.success) {
            // Початок виробництва
            const expGain = production.capacity * 10;
            this.addExperience(expGain);
            
            // Оновлення прогресбару
            UISystem.updateProductionProgress(
                production.timeMs,
                () => this.finishProduction(method)
            );
        } else {
            UISystem.showMessage(production.message, "error");
        }
    },

    finishProduction(method) {
        const results = ProductionSystem.finishProduction(method);
        
        this.state.coalDust += results.coalDust;
        this.state.coal += results.coal;
        this.state.goldenCoal += results.goldenCoal;
        
        UISystem.showMessage(
            `Вироблено: ${results.coalDust}💨 ${results.coal}⚫ ${results.goldenCoal}✨`
        );
        
        this.updateUI();
    },

    // Оновлення інтерфейсу
    updateUI() {
        const resources = {
            'money': Math.floor(this.state.money),
            'wood': Math.floor(this.state.wood),
            'coalDust': Math.floor(this.state.coalDust),
            'coal': Math.floor(this.state.coal),
            'goldenCoal': Math.floor(this.state.goldenCoal)
        };

        // Оновлення ресурсів
        for (const [id, value] of Object.entries(resources)) {
            document.getElementById(id).textContent = value;
        }

        // Оновлення досвіду
        const expNeeded = this.calculateExpForNextLevel();
        document.getElementById('experience').textContent = 
            `${Math.floor(this.state.experience)}/${expNeeded}`;
        document.getElementById('level').textContent = this.state.level;

        // Оновлення прогресбару досвіду
        const expPercentage = (this.state.experience / expNeeded) * 100;
        document.querySelector('.exp-fill').style.width = `${expPercentage}%`;

        // Оновлення кнопок методів виробництва
        this.updateMethodButtons();
    },

    updateMethodButtons() {
        const methods = [
            { id: 'method2', cost: 5000 },
            { id: 'method3', cost: 25000 },
            { id: 'method4', cost: 100000 }
        ];

        methods.forEach(method => {
            const button = document.getElementById(method.id);
            if (button) {
                button.disabled = this.state.money < method.cost;
            }
        });
    }
};

// Запуск гри при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
```

Хочете побачити наступний файл (production.js)? 5. **js/utils/save.js**:
```javascript
// Система збереження для мобільної версії
const SaveSystem = {
    // Ключ для локального сховища
    storageKey: 'charcoal_game_save',

    // Збереження гри
    saveGame(state) {
        try {
            // Створюємо об'єкт збереження
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                state: {
                    money: Math.floor(state.money),
                    wood: Math.floor(state.wood),
                    coal: Math.floor(state.coal),
                    woodcutters: state.woodcutters,
                    carbonizationLevel: state.carbonizationLevel,
                    lastUpdate: Date.now()
                }
            };

            // Зберігаємо в локальне сховище
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('Гру збережено');
            return true;
        } catch (error) {
            console.error('Помилка збереження:', error);
            return false;
        }
    },

    // Завантаження збереженої гри
    loadGame() {
        try {
            // Отримуємо дані з локального сховища
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                console.log('Збереження не знайдено');
                return null;
            }

            // Парсимо дані
            const data = JSON.parse(savedData);
            
            // Перевіряємо версію збереження
            if (data.version !== 1) {
                console.log('Несумісна версія збереження');
                return null;
            }

            console.log('Збереження завантажено');
            return data.state;
        } catch (error) {
            console.error('Помилка завантаження:', error);
            return null;
        }
    },

    // Видалення збереження
    deleteSave() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Збереження видалено');
            return true;
        } catch (error) {
            console.error('Помилка видалення збереження:', error);
            return false;
        }
    },

    // Перевірка наявності збереження
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }
};
