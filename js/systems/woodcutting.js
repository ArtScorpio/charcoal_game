// Система лісорубів та заготівлі деревини
const WoodcuttingSystem = {
    // Базові налаштування
    config: {
        maxWoodcutters: 10,         // Максимальна кількість лісорубів
        baseWoodcutterCost: 100,    // Початкова вартість лісоруба
        costMultiplier: 1.5,        // Множник збільшення вартості
        baseProduction: 1           // Базове виробництво деревини за секунду
    },

    // Розрахунок вартості найму нового лісоруба
    calculateHireCost(currentWoodcutters = Game.state.woodcutters) {
        return Math.floor(
            this.config.baseWoodcutterCost * 
            Math.pow(this.config.costMultiplier, currentWoodcutters)
        );
    },

    // Розрахунок виробництва деревини
    produce() {
        if (Game.state.woodcutters === 0) return 0;
        
        // Базове виробництво: кількість лісорубів * базове виробництво
        let production = Game.state.woodcutters * this.config.baseProduction;
        
        // Округляємо до 2 знаків після коми
        return Math.round(production * 100) / 100;
    },

    // Перевірка можливості найму
    canHire() {
        const cost = this.calculateHireCost();
        return {
            canHire: Game.state.money >= cost && Game.state.woodcutters < this.config.maxWoodcutters,
            reason: Game.state.money < cost ? 
                    "Недостатньо грошей" : 
                    Game.state.woodcutters >= this.config.maxWoodcutters ?
                    "Досягнуто максимум лісорубів" : ""
        };
    },

    // Найм нового лісоруба
    hire() {
        const check = this.canHire();
        if (!check.canHire) {
            return {
                success: false,
                message: check.reason
            };
        }

        const cost = this.calculateHireCost();
        Game.state.money -= cost;
        Game.state.woodcutters++;

        return {
            success: true,
            message: "Лісоруб найнятий!",
            newCount: Game.state.woodcutters,
            cost: cost
        };
    },

    // Додати у WoodcuttingSystem
getProductionPerSecond() {
    return this.config.baseProduction * this.woodcutters.count;
}
    // Отримання інформації про лісорубів
    getInfo() {
        return {
            count: Game.state.woodcutters,
            maxCount: this.config.maxWoodcutters,
            productionPerSecond: this.produce(),
            nextHireCost: this.calculateHireCost(),
            canHire: this.canHire().canHire
        };
    }
};
