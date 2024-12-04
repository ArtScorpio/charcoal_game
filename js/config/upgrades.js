// Конфігурація покращень
const UPGRADES = {
    tools: {
        name: "Інструменти лісорубів",
        upgrades: {
            axe: {
                name: "Покращені сокири",
                levels: [
                    {
                        id: 'axe-1',
                        cost: 200,
                        effect: 1.2,
                        description: "Збільшує ефективність лісорубів на 20%",
                        icon: "🪓"
                    },
                    {
                        id: 'axe-2',
                        cost: 1000,
                        effect: 1.5,
                        description: "Збільшує ефективність лісорубів на 50%",
                        icon: "🪓"
                    },
                    {
                        id: 'axe-3',
                        cost: 5000,
                        effect: 2.0,
                        description: "Подвоює ефективність лісорубів",
                        icon: "🪓"
                    }
                ]
            },
            automation: {
                name: "Автоматизація",
                levels: [
                    {
                        id: 'auto-1',
                        cost: 5000,
                        effect: 0.1,
                        description: "Автоматичний збір 10% деревини",
                        icon: "⚙️"
                    },
                    {
                        id: 'auto-2',
                        cost: 15000,
                        effect: 0.25,
                        description: "Автоматичний збір 25% деревини",
                        icon: "⚙️"
                    }
                ]
            }
        }
    },

    carbonization: {
        name: "Технології карбонізації",
        upgrades: {
            efficiency: {
                name: "Ефективність печей",
                levels: [
                    {
                        id: 'eff-1',
                        cost: 1000,
                        effect: 1.2,
                        description: "Збільшує вихід вугілля на 20%",
                        icon: "🔥"
                    },
                    {
                        id: 'eff-2',
                        cost: 5000,
                        effect: 1.5,
                        description: "Збільшує вихід вугілля на 50%",
                        icon: "🔥"
                    }
                ]
            },
            quality: {
                name: "Якість вугілля",
                levels: [
                    {
                        id: 'qual-1',
                        cost: 2000,
                        effect: 1.1,
                        description: "Збільшує шанс отримання золотого вугілля на 10%",
                        icon: "✨"
                    },
                    {
                        id: 'qual-2',
                        cost: 10000,
                        effect: 1.2,
                        description: "Збільшує шанс отримання золотого вугілля на 20%",
                        icon: "✨"
                    }
                ]
            }
        }
    }
};

// Функції для роботи з покращеннями
const UpgradeManager = {
    canBuyUpgrade: function(upgradeId, playerMoney) {
        const upgrade = this.findUpgradeById(upgradeId);
        return upgrade && playerMoney >= upgrade.cost;
    },

    findUpgradeById: function(upgradeId) {
        // Пошук покращення за ID
        for (const category in UPGRADES) {
            for (const type in UPGRADES[category].upgrades) {
                const found = UPGRADES[category].upgrades[type].levels.find(u => u.id === upgradeId);
                if (found) return found;
            }
        }
        return null;
    },

    getNextUpgrade: function(category, type, currentLevel) {
        // Отримання наступного доступного покращення
        const upgrades = UPGRADES[category].upgrades[type].levels;
        return upgrades[currentLevel] || null;
    }
};
