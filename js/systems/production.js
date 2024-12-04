// Спрощена система виробництва для мобільної версії
const ProductionSystem = {
    // Спрощені рівні карбонізації
    levels: {
        1: {
            name: "Кустарний",
            woodNeeded: 8,    // Скільки дерева потрібно
            time: 5,          // Час в секундах
            chances: {
                dust: 20,     // Шанс пилу (20%)
                coal: 75,     // Шанс вугілля (75%)
                golden: 5     // Шанс золотого (5%)
            },
            cost: 0
        },
        2: {
            name: "Покращений",
            woodNeeded: 7,
            time: 4,
            chances: {
                dust: 15,
                coal: 80,
                golden: 5
            },
            cost: 1000
        },
        3: {
            name: "Піч",
            woodNeeded: 6,
            time: 3,
            chances: {
                dust: 10,
                coal: 80,
                golden: 10
            },
            cost: 5000
        }
    },

    // Виробництво
    produce(level, wood) {
        const currentLevel = this.levels[level];
        if (!currentLevel || wood < currentLevel.woodNeeded) {
            return {
                success: false,
                message: "Недостатньо деревини!"
            };
        }

        // Визначаємо результат
        const roll = Math.floor(Math.random() * 100);
        let result = {
            success: true,
            woodUsed: currentLevel.woodNeeded,
            time: currentLevel.time,
            type: "",
            amount: 1
        };

        // Визначаємо тип продукції
        if (roll < currentLevel.chances.dust) {
            result.type = "dust";
        } else if (roll < currentLevel.chances.dust + currentLevel.chances.coal) {
            result.type = "coal";
        } else {
            result.type = "golden";
        }

        return result;
    },

    // Перевірка можливості покращення
    canUpgrade(currentLevel, money) {
        const nextLevel = this.levels[currentLevel + 1];
        return nextLevel && money >= nextLevel.cost;
    },

    // Отримання інформації про рівень
    getLevelInfo(level) {
        const lvl = this.levels[level];
        return {
            name: lvl.name,
            wood: lvl.woodNeeded,
            time: lvl.time,
            nextCost: this.levels[level + 1]?.cost || "Макс"
        };
    }
};
