// Головний клас гри
const Game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        coal: 0,
        woodcutters: 0,
        carbonizationLevel: 1
    },

    // Ініціалізація гри
    init() {
        // Завантаження збереженої гри
        const savedState = SaveSystem.loadGame();
        if (savedState) {
            this.state = savedState;
        }

        // Запуск ігрового циклу
        this.startGameLoop();
        // Оновлення інтерфейсу
        this.updateUI();
    },

    // Ігровий цикл (виконується кожну секунду)
    startGameLoop() {
        setInterval(() => {
            // Виробництво деревини лісорубами
            const woodProduction = WoodcuttingSystem.produce();
            this.state.wood += woodProduction;

            // Оновлення інтерфейсу
            this.updateUI();
            // Збереження гри
            SaveSystem.saveGame(this.state);
        }, 1000);
    },

    // Найм лісоруба
    hireWoodcutter() {
        const result = WoodcuttingSystem.hire();
        if (result.success) {
            this.state.woodcutters++;
            this.state.money -= WoodcuttingSystem.calculateHireCost();
            UISystem.showMessage("Лісоруб найнятий!");
        } else {
            UISystem.showMessage(result.message, 'error');
        }
        this.updateUI();
    },

    // Виробництво вугілля
    produceCoal() {
        const currentLevel = ProductionSystem.levels[this.state.carbonizationLevel];
        if (this.state.wood >= currentLevel.woodNeeded) {
            this.state.wood -= currentLevel.woodNeeded;
            
            // Показуємо анімацію виробництва
            UISystem.showProduction(currentLevel.time * 1000);

            // Запускаємо виробництво
            setTimeout(() => {
                const result = ProductionSystem.produce(
                    this.state.carbonizationLevel, 
                    currentLevel.woodNeeded
                );

                if (result.success) {
                    this.state.coal += result.amount;
                    UISystem.showMessage(`Отримано ${result.amount} вугілля!`);
                }
                this.updateUI();
            }, currentLevel.time * 1000);
        } else {
            UISystem.showMessage("Недостатньо деревини!", 'error');
        }
    },

    // Оновлення інтерфейсу
    updateUI() {
        UISystem.updateResources(this.state);
    }
};

// Запуск гри при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    Game.init();

    // Обробники подій для кнопок
    document.getElementById('hireButton')?.addEventListener('click', () => {
        Game.hireWoodcutter();
    });

    document.getElementById('produceButton')?.addEventListener('click', () => {
        Game.produceCoal();
    });
});
