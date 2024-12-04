// Спрощена система лісорубів для мобільної версії
const WoodcuttingSystem = {
    // Спрощені налаштування
    config: {
        maxWoodcutters: 10,
        baseCost: 100,
        costMultiplier: 1.5,
        baseProduction: 1
    },

    // Стан системи
    woodcutters: {
        count: 0,
        efficiency: 1,
        // Спрощені ділянки (тільки 4 замість 12)
        plots: [
            {
                id: 1,
                unlocked: true,
                efficiency: 1,
                cost: 0,
                name: "Звичайна ділянка"
            },
            {
                id: 2,
                unlocked: false,
                efficiency: 1.2,
                cost: 1000,
                name: "Родюча ділянка"
            },
            {
                id: 3,
                unlocked: false,
                efficiency: 1.5,
                cost: 5000,
                name: "Багата ділянка"
            },
            {
                id: 4,
                unlocked: false,
                efficiency: 2,
                cost: 10000,
                name: "Золота ділянка"
            }
        ]
    },

    // Найм лісоруба
    hire() {
        const cost = this.calculateHireCost();
        if (game.state.money >= cost && this.woodcutters.count < this.config.maxWoodcutters) {
            game.state.money -= cost;
            this.woodcutters.count++;
            return {
                success: true,
                message: "Лісоруб найнятий!"
            };
        }
        return {
            success: false,
            message: this.woodcutters.count >= this.config.maxWoodcutters ? 
                    "Досягнуто максимум лісорубів!" : 
                    "Недостатньо грошей!"
        };
    },

    // Розрахунок вартості найму
    calculateHireCost() {
        return Math.floor(this.config.baseCost * 
               Math.pow(this.config.costMultiplier, this.woodcutters.count));
    },

    // Розблокування ділянки
    unlockPlot(plotId) {
        const plot = this.woodcutters.plots.find(p => p.id === plotId);
        if (plot && !plot.unlocked && game.state.money >= plot.cost) {
            game.state.money -= plot.cost;
            plot.unlocked = true;
            return {
                success: true,
                message: `${plot.name} розблокована!`
            };
        }
        return {
            success: false,
            message: "Недостатньо грошей!"
        };
    },

    // Виробництво деревини (спрощене)
    produce() {
        if (this.woodcutters.count === 0) return 0;

        const unlockedPlots = this.woodcutters.plots.filter(plot => plot.unlocked);
        let totalProduction = 0;

        unlockedPlots.forEach(plot => {
            totalProduction += this.woodcutters.count * plot.efficiency;
        });

        return Math.floor(totalProduction);
    }
};
