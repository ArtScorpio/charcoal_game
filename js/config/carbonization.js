// Конфігурація рівнів карбонізації
const CARBONIZATION = {
    levels: {
        1: {
            name: "Кустарний",
            cost: 0,
            woodRatio: 8, // Потрібно деревини для 1 вугілля
            outputs: {
                coalDust: 0.20,    // 20% шанс отримати вугільний пил
                normalCoal: 0.75,   // 75% шанс отримати звичайне вугілля
                goldenCoal: 0.05    // 5% шанс отримати золоте вугілля
            },
            timeRequired: 60,       // Час виробництва в секундах
            description: "Випалювання у полі",
            icon: "🔥"
        },
        2: {
            name: "Покращений кустарний",
            cost: 1000,
            woodRatio: 7,
            outputs: {
                coalDust: 0.15,
                normalCoal: 0.80,
                goldenCoal: 0.05
            },
            timeRequired: 55,
            description: "Покращена яма для випалювання",
            icon: "🔥"
        },
        3: {
            name: "Напівпромисловий",
            cost: 5000,
            woodRatio: 6,
            outputs: {
                coalDust: 0.10,
                normalCoal: 0.80,
                goldenCoal: 0.10
            },
            timeRequired: 50,
            description: "Металева піч",
            icon: "🏭"
        },
        4: {
            name: "Промисловий",
            cost: 25000,
            woodRatio: 5,
            outputs: {
                coalDust: 0.05,
                normalCoal: 0.85,
                goldenCoal: 0.10
            },
            timeRequired: 45,
            description: "Промислова піч",
            icon: "🏭"
        },
        5: {
            name: "Високотехнологічний",
            cost: 100000,
            woodRatio: 4,
            outputs: {
                coalDust: 0.02,
                normalCoal: 0.88,
                goldenCoal: 0.10
            },
            timeRequired: 40,
            description: "Автоматизована лінія",
            icon: "⚡"
        }
    },

    // Методи для роботи з рівнями
    getCurrentLevel: function(level) {
        return this.levels[level] || null;
    },

    getNextLevelCost: function(currentLevel) {
        const nextLevel = this.levels[currentLevel + 1];
        return nextLevel ? nextLevel.cost : null;
    },

    calculateProduction: function(level, woodAmount) {
        const currentLevel = this.levels[level];
        if (!currentLevel) return null;

        // Розрахунок випадкового результату на основі шансів
        const random = Math.random();
        let result = {
            coalDust: 0,
            normalCoal: 0,
            goldenCoal: 0
        };

        if (random < currentLevel.outputs.coalDust) {
            result.coalDust = Math.floor(woodAmount / currentLevel.woodRatio);
        } else if (random < currentLevel.outputs.coalDust + currentLevel.outputs.normalCoal) {
            result.normalCoal = Math.floor(woodAmount / currentLevel.woodRatio);
        } else {
            result.goldenCoal = Math.floor(woodAmount / currentLevel.woodRatio);
        }

        return result;
    }
};
