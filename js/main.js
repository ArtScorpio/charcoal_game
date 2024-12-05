const Game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        coalDust: 0,
        coal: 0,
        goldenCoal: 0,
        woodcutters: 0,
        experience: 0,
        level: 1,
        lastUpdate: Date.now()
    },

    // Налаштування гри
    config: {
        // Лісоруби
        woodcutter: {
            baseCost: 100,
            costMultiplier: 1.5,
            maxCount: 10,
            baseProduction: 1
        },
        // Виробництво вугілля
        production: {
            methods: {
                1: { woodNeeded: 8, name: "Кустарний", cost: 0 },
                2: { woodNeeded: 7, name: "Покращений", cost: 5000 },
                3: { woodNeeded: 6, name: "Промисловий", cost: 25000 }
            }
        },
        // Ціни продажу
        sellPrices: {
            wood: 10,
            coalDust: 50,
            coal: 150,
            goldenCoal: 300
        },
        // Досвід
        experience: {
            baseNeeded: 1000,
            multiplier: 1.5
        }
    },

    // Ініціалізація гри
    init() {
        this.loadGame();
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
                const production = this.state.woodcutters * this.config.woodcutter.baseProduction;
                this.state.wood += production * delta;
            }

            this.state.lastUpdate = now;
            this.updateUI();
            this.saveGame();
        }, 1000);
    },

    // Найм лісоруба
    hireWoodcutter() {
        const cost = this.calculateWoodcutterCost();
        if (this.state.money >= cost && this.state.woodcutters < this.config.woodcutter.maxCount) {
            this.state.money -= cost;
            this.state.woodcutters++;
            this.addExperience(50);
            this.showMessage("Найнято нового лісоруба!");
            this.updateUI();
        } else {
            this.showMessage(
                this.state.woodcutters >= this.config.woodcutter.maxCount ? 
                "Досягнуто максимум лісорубів!" : 
                "Недостатньо грошей!"
            );
        }
    },

    // Виробництво вугілля
    produceCoal(method) {
        const methodConfig = this.config.production.methods[method];
        if (this.state.wood >= methodConfig.woodNeeded) {
            this.state.wood -= methodConfig.woodNeeded;
            
            setTimeout(() => {
                // Розрахунок результату
                const roll = Math.random() * 100;
                if (roll < 20) {
                    this.state.coalDust++;
                    this.showMessage("Отримано вугільний пил!");
                } else if (roll < 95) {
                    this.state.coal++;
                    this.showMessage("Отримано деревне вугілля!");
                } else {
                    this.state.goldenCoal++;
                    this.showMessage("Отримано золоте вугілля!");
                }
                this.addExperience(100);
                this.updateUI();
            }, 5000); // 5 секунд на виробництво

            this.updateUI();
        } else {
            this.showMessage(`Потрібно ${methodConfig.woodNeeded} деревини!`);
        }
    },

    // Система продажу
    sellWood() {
        if (this.state.wood >= 1) {
            const amount = Math.floor(this.state.wood);
            this.state.wood -= amount;
            this.state.money += amount * this.config.sellPrices.wood;
            this.addExperience(amount);
            this.showMessage(`+${amount * this.config.sellPrices.wood}💰`);
            this.updateUI();
        }
    },

    sellCoalDust() {
        if (this.state.coalDust >= 1) {
            this.state.coalDust--;
            this.state.money += this.config.sellPrices.coalDust;
            this.addExperience(5);
            this.showMessage(`+${this.config.sellPrices.coalDust}💰`);
            this.updateUI();
        }
    },

    sellCoal() {
        if (this.state.coal >= 1) {
            this.state.coal--;
            this.state.money += this.config.sellPrices.coal;
            this.addExperience(15);
            this.showMessage(`+${this.config.sellPrices.coal}💰`);
            this.updateUI();
        }
    },

    sellGoldenCoal() {
        if (this.state.goldenCoal >= 1) {
            this.state.goldenCoal--;
            this.state.money += this.config.sellPrices.goldenCoal;
            this.addExperience(30);
            this.showMessage(`+${this.config.sellPrices.goldenCoal}💰`);
            this.updateUI();
        }
    },

    // У Game об'єкт додайте:
prices: {
    wood: 10,
    coalDust: 50,
    coal: 150,
    goldenCoal: 300
},

sellResource(type) {
    if (this.state[type] >= 1) {
        this.state[type]--;
        const price = this.prices[type];
        this.state.money += price;
        
        // Додаємо досвід за продаж
        const expGain = Math.floor(price / 10);  // 1 досвід за кожні 10 монет
        this.addExperience(expGain);
        
        this.showMessage(`+${price}💰`);
        this.updateUI();
    } else {
        this.showMessage(`Недостатньо ресурсу для продажу!`);
    }
},
    // Система досвіду
    addExperience(amount) {
        this.state.experience += amount;
        const neededExp = this.calculateNeededExperience();
        
        if (this.state.experience >= neededExp) {
            this.state.level++;
            this.state.experience -= neededExp;
            this.showMessage(`Досягнуто рівень ${this.state.level}!`);
        }
    },

    calculateNeededExperience() {
        return Math.floor(
            this.config.experience.baseNeeded * 
            Math.pow(this.config.experience.multiplier, this.state.level - 1)
        );
    },

    // Допоміжні функції
    calculateWoodcutterCost() {
        return Math.floor(
            this.config.woodcutter.baseCost * 
            Math.pow(this.config.woodcutter.costMultiplier, this.state.woodcutters)
        );
    },

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

    // Оновлення інтерфейсу
    updateUI() {
        // Ресурси
        document.getElementById('money').textContent = Math.floor(this.state.money);
        document.getElementById('wood').textContent = Math.floor(this.state.wood);
        document.getElementById('coalDust').textContent = Math.floor(this.state.coalDust);
        document.getElementById('coal').textContent = Math.floor(this.state.coal);
        document.getElementById('goldenCoal').textContent = Math.floor(this.state.goldenCoal);
        
        // Лісоруби
        document.getElementById('woodcuttersCount').textContent = this.state.woodcutters;
        document.getElementById('woodcutterCost').textContent = this.calculateWoodcutterCost();
        
        // Досвід
        document.getElementById('level').textContent = this.state.level;
        document.getElementById('experience').textContent = Math.floor(this.state.experience);
        document.getElementById('expNeeded').textContent = this.calculateNeededExperience();

        // Кнопки методів
        document.getElementById('method2').disabled = this.state.money < 5000;
        document.getElementById('method3').disabled = this.state.money < 25000;
    },

    // Збереження/завантаження
    saveGame() {
        localStorage.setItem('charcoalGame', JSON.stringify(this.state));
    },

    loadGame() {
        const saved = localStorage.getItem('charcoalGame');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    }
};

// Запуск гри
window.onload = () => Game.init();
