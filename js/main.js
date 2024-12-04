// Головний клас гри
const Game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        coal: 0,
        woodcutters: 0,
        carbonizationLevel: 1,
        lastUpdate: Date.now()
    },

    // Ініціалізація гри
    init() {
        console.log('Гра запускається...');
        // Завантаження збереження
        const savedState = SaveSystem.loadGame();
        if (savedState) {
            this.state = savedState;
            console.log('Завантажено збережену гру');
        }

        // Запуск ігрового циклу
        this.startGameLoop();
        // Оновлення інтерфейсу
        this.updateUI();
    },

    // Ігровий цикл
    startGameLoop() {
        setInterval(() => {
            const now = Date.now();
            const delta = (now - this.state.lastUpdate) / 1000;

            // Виробництво деревини лісорубами
            if (this.state.woodcutters > 0) {
                const production = WoodcuttingSystem.produce() * delta;
                this.state.wood += production;
            }

            this.state.lastUpdate = now;
            this.updateUI();
            SaveSystem.saveGame(this.state);
        }, 1000);
    },

    // Найм лісоруба
    hireWoodcutter() {
        const cost = WoodcuttingSystem.calculateHireCost();
        if (this.state.money >= cost && this.state.woodcutters < 10) {
            this.state.money -= cost;
            this.state.woodcutters++;
            UISystem.showMessage("Найнято нового лісоруба!");
            this.updateUI();
            return true;
        } else {
            UISystem.showMessage(
                this.state.woodcutters >= 10 ? 
                "Досягнуто максимум лісорубів!" : 
                "Недостатньо грошей!",
                'error'
            );
            return false;
        }
    },

    // Виробництво вугілля
    produceCoal() {
        const woodNeeded = 8; // Базова вимога деревини
        if (this.state.wood >= woodNeeded) {
            this.state.wood -= woodNeeded;
            
            // Показуємо прогрес виробництва
            UISystem.showProduction(5000); // 5 секунд на виробництво

            setTimeout(() => {
                this.state.coal++;
                UISystem.showMessage("Вироблено вугілля!");
                this.updateUI();
            }, 5000);
        } else {
            UISystem.showMessage("Недостатньо деревини!", 'error');
        }
    },

    // Оновлення інтерфейсу
    updateUI() {
        UISystem.updateResources(this.state);
    }
};

// Запуск гри при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    console.log('Сторінка завантажена, ініціалізація гри...');
    
    // Ініціалізація гри
    Game.init();

    // Додавання обробників подій для кнопок
    const hireButton = document.getElementById('hireButton');
    const produceButton = document.getElementById('produceButton');

    if (hireButton) {
        hireButton.addEventListener('click', () => {
            Game.hireWoodcutter();
        });
    }

    if (produceButton) {
        produceButton.addEventListener('click', () => {
            Game.produceCoal();
        });
    }
});
