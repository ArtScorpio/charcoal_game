// Система лісорубів та заготівлі деревини
const WoodcuttingSystem = {
    // Базові налаштування
    config: {
        maxWoodcutters: 10,
        baseWoodcutterCost: 100,
        costMultiplier: 1.5,
        baseProductionTime: 1000, // 1 секунда
        baseProduction: 1
    },

    // Система лісорубів
    woodcutters: {
        count: 0,
        efficiency: 1,
        working: false,
        plots: new Array(12).fill().map((_, index) => ({
            id: index + 1,
            unlocked: index === 0,
            efficiency: 1 + (index * 0.1),
            cost: 1000 * Math.pow(2, index),
            name: `Ділянка ${index + 1}`,
            description: `Ефективність: +${index * 10}%`
        }))
    },

    // Методи для роботи з лісорубами
    hire: function() {
        const cost = this.calculateHireCost();
        if (game.state.money >= cost && this.woodcutters.count < this.config.maxWoodcutters) {
            game.state.money -= cost;
            this.woodcutters.count++;
            return true;
        }
        return false;
    },

    calculateHireCost: function() {
        return Math.floor(this.config.baseWoodcutterCost * 
               Math.pow(this.config.costMultiplier, this.woodcutters.count));
    },

    // Методи для роботи з ділянками
    unlockPlot: function(plotId) {
        const plot = this.woodcutters.plots[plotId - 1];
        if (plot && !plot.unlocked && game.state.money >= plot.cost) {
            game.state.money -= plot.cost;
            plot.unlocked = true;
            return true;
        }
        return false;
    },

    getUnlockedPlots: function() {
        return this.woodcutters.plots.filter(plot => plot.unlocked);
    },

    // Виробництво деревини
    produce: function() {
        if (this.woodcutters.count === 0) return 0;

        let totalProduction = 0;
        const unlockedPlots = this.getUnlockedPlots();

        unlockedPlots.forEach(plot => {
            const baseProduction = this.config.baseProduction * 
                                 this.woodcutters.count * 
                                 plot.efficiency * 
                                 this.woodcutters.efficiency;
            
            totalProduction += Math.floor(baseProduction);
        });

        return totalProduction;
    },

    // Покращення ефективності
    upgradeEfficiency: function(cost, multiplier) {
        if (game.state.money >= cost) {
            game.state.money -= cost;
            this.woodcutters.efficiency *= multiplier;
            return true;
        }
        return false;
    },

    // Система подій
    events: {
        types: {
            RAIN: {
                name: "Дощ",
                duration: 300, // 5 хвилин
                effect: 0.5,  // -50% до ефективності
                description: "Дощ зменшує ефективність лісорубів"
            },
            SUNNY: {
                name: "Сонячний день",
                duration: 300,
                effect: 1.5, // +50% до ефективності
                description: "Сонячна погода підвищує ефективність"
            }
        },
        
        currentEvent: null,
        
        startRandomEvent: function() {
            const events = Object.values(this.types);
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            
            this.currentEvent = {
                type: randomEvent,
                timeLeft: randomEvent.duration,
                startTime: Date.now()
            };
            
            return this.currentEvent;
        },
        
        updateEvents: function() {
            if (!this.currentEvent) return;
            
            const now = Date.now();
            const elapsed = (now - this.currentEvent.startTime) / 1000;
            
            if (elapsed >= this.currentEvent.type.duration) {
                this.currentEvent = null;
            }
        }
    }
};
