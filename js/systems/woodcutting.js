const WoodcuttingSystem = {
    // Базові налаштування
    config: {
        maxWoodcutters: 10,           // Максимальна кількість лісорубів
        baseWoodcutterCost: 100,      // Початкова вартість лісоруба
        costMultiplier: 1.5,          // Множник збільшення вартості
        baseProduction: 1,            // Базове виробництво деревини за секунду
        maxEfficiency: 2.0,           // Максимальний множник ефективності
        autoSaveInterval: 30000       // Інтервал автозбереження (30 секунд)
    },

    // Система лісорубів
    woodcutters: {
        count: 0,
        efficiency: 1,
        toolLevel: 1,
        working: false,
        plots: [
            {
                id: 1,
                name: "Звичайна ділянка",
                unlocked: true,
                efficiency: 1,
                description: "Базова ефективність"
            },
            {
                id: 2,
                name: "Родюча ділянка",
                unlocked: false,
                efficiency: 1.2,
                cost: 1000,
                description: "+20% до ефективності"
            },
            {
                id: 3,
                name: "Густий ліс",
                unlocked: false,
                efficiency: 1.5,
                cost: 5000,
                description: "+50% до ефективності"
            },
            {
                id: 4,
                name: "Заповідник",
                unlocked: false,
                efficiency: 2,
                cost: 10000,
                description: "+100% до ефективності"
            }
        ]
    },

    // Розрахунок вартості найму
    calculateHireCost() {
        return Math.floor(
            this.config.baseWoodcutterCost * 
            Math.pow(this.config.costMultiplier, this.woodcutters.count)
        );
    },

    // Найм лісоруба
    hire() {
        const cost = this.calculateHireCost();
        if (Game.state.money >= cost && this.woodcutters.count < this.config.maxWoodcutters) {
            Game.state.money -= cost;
            this.woodcutters.count++;
            Game.addExperience(50); // Досвід за найм
            return {
                success: true,
                message: "Лісоруб найнятий!",
                cost: cost,
                newCount: this.woodcutters.count
            };
        }
        return {
            success: false,
            message: this.woodcutters.count >= this.config.maxWoodcutters ? 
                    "Досягнуто максимум лісорубів!" : 
                    "Недостатньо грошей!"
        };
    },

    // Виробництво деревини
    produce() {
        if (this.woodcutters.count === 0) return 0;

        let totalProduction = 0;
        const activeEfficiency = this.woodcutters.efficiency * this.woodcutters.toolLevel;

        // Розрахунок виробництва для кожної розблокованої ділянки
        this.woodcutters.plots.forEach(plot => {
            if (plot.unlocked) {
                const plotProduction = this.config.baseProduction * 
                                     this.woodcutters.count * 
                                     plot.efficiency * 
                                     activeEfficiency;
                totalProduction += plotProduction;
            }
        });

        return totalProduction;
    },

    // Покращення інструментів
    upgradeTool(cost) {
        if (Game.state.money >= cost && 
            this.woodcutters.toolLevel < this.config.maxEfficiency) {
            Game.state.money -= cost;
            this.woodcutters.toolLevel += 0.2; // +20% до ефективності
            Game.addExperience(100); // Досвід за покращення
            return {
                success: true,
                message: "Інструменти покращено!",
                newLevel: this.woodcutters.toolLevel
            };
        }
        return {
            success: false,
            message: "Недостатньо грошей або досягнуто максимальний рівень!"
        };
    },

    // Розблокування нової ділянки
    unlockPlot(plotId) {
        const plot = this.woodcutters.plots.find(p => p.id === plotId);
        if (plot && !plot.unlocked && Game.state.money >= plot.cost) {
            Game.state.money -= plot.cost;
            plot.unlocked = true;
            Game.addExperience(200); // Досвід за розблокування
            return {
                success: true,
                message: `${plot.name} розблоковано!`,
                efficiency: plot.efficiency
            };
        }
        return {
            success: false,
            message: plot ? "Недостатньо грошей!" : "Ділянка не знайдена!"
        };
    },

    // Отримання статистики
    getStats() {
        return {
            count: this.woodcutters.count,
            maxCount: this.config.maxWoodcutters,
            efficiency: this.woodcutters.efficiency,
            toolLevel: this.woodcutters.toolLevel,
            productionPerSecond: this.produce(),
            unlockedPlots: this.woodcutters.plots.filter(p => p.unlocked).length
        };
    }
};
