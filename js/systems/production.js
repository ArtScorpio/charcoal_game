const ProductionSystem = {
    // Конфігурація методів виробництва
    levels: {
        1: {
            name: "Кустарний метод",
            woodNeeded: 8,        // 8 кубів деревини
            timeMinutes: 20,      // 20 хвилин на цикл
            maxCapacity: 5,       // 5 тонн за цикл
            chances: {
                dust: 20,         // 20% вугільний пил
                coal: 75,         // 75% звичайне вугілля
                golden: 5         // 5% золоте вугілля
            },
            cost: 0
        },
        2: {
            name: "Покращений метод",
            woodNeeded: 7,
            timeMinutes: 20,
            maxCapacity: 15,      // 15 тонн за цикл
            chances: {
                dust: 15,
                coal: 80,
                golden: 5
            },
            cost: 5000
        },
        3: {
            name: "Промисловий метод",
            woodNeeded: 6,
            timeMinutes: 20,
            maxCapacity: 65,      // 65 тонн за цикл
            chances: {
                dust: 10,
                coal: 80,
                golden: 10
            },
            cost: 25000
        },
        4: {
            name: "Автоматизований метод",
            woodNeeded: 5,
            timeMinutes: 20,
            maxCapacity: 165,     // 165 тонн за цикл
            chances: {
                dust: 5,
                coal: 85,
                golden: 10
            },
            cost: 100000
        }
    },

    // Перевірка можливості виробництва
    canProduce(level) {
        const config = this.levels[level];
        return {
            canProduce: Game.state.wood >= config.woodNeeded,
            woodNeeded: config.woodNeeded,
            timeNeeded: config.timeMinutes
        };
    },

    // Початок виробництва
    startProduction(level) {
        const config = this.levels[level];
        if (!config) return { success: false, message: "Недійсний метод виробництва" };

        if (Game.state.wood < config.woodNeeded) {
            return {
                success: false,
                message: `Потрібно ${config.woodNeeded} кубів деревини`
            };
        }

        // Віднімаємо деревину
        Game.state.wood -= config.woodNeeded;

        return {
            success: true,
            timeMs: config.timeMinutes * 60 * 1000, // Конвертуємо хвилини в мілісекунди
            capacity: config.maxCapacity,
            woodUsed: config.woodNeeded
        };
    },

    // Завершення виробництва
    finishProduction(level) {
        const config = this.levels[level];
        const results = {
            dust: 0,
            coal: 0,
            golden: 0
        };

        // Розраховуємо результати для кожної тонни
        for (let i = 0; i < config.maxCapacity; i++) {
            const roll = Math.random() * 100;
            if (roll < config.chances.dust) {
                results.dust++;
            } else if (roll < config.chances.dust + config.chances.coal) {
                results.coal++;
            } else {
                results.golden++;
            }
        }

        return {
            coalDust: results.dust,
            coal: results.coal,
            golden: results.golden,
            total: config.maxCapacity
        };
    },

    // Форматування часу
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Отримання інформації про метод
    getMethodInfo(level) {
        const config = this.levels[level];
        return {
            name: config.name,
            woodNeeded: config.woodNeeded,
            timeMinutes: config.timeMinutes,
            capacity: config.maxCapacity,
            cost: config.cost,
            chances: config.chances
        };
    },

    // Розрахунок потенційного виходу продукції
    calculatePotentialOutput(level) {
        const config = this.levels[level];
        return {
            coalDust: Math.floor(config.maxCapacity * (config.chances.dust / 100)),
            coal: Math.floor(config.maxCapacity * (config.chances.coal / 100)),
            golden: Math.floor(config.maxCapacity * (config.chances.golden / 100))
        };
    }
};
