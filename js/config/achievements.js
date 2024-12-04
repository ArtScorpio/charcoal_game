// Конфігурація досягнень
const ACHIEVEMENTS = {
    woodcutter: {
        name: "Майстер-лісоруб",
        levels: [
            {
                id: 'wood-1',
                requirement: 1000,
                reward: 500,
                description: "Заготовити 1,000 деревини",
                icon: "🌳"
            },
            {
                id: 'wood-2',
                requirement: 10000,
                reward: 2000,
                description: "Заготовити 10,000 деревини",
                icon: "🌳"
            },
            {
                id: 'wood-3',
                requirement: 100000,
                reward: 10000,
                description: "Заготовити 100,000 деревини",
                icon: "🌳"
            }
        ]
    },
    
    charcoal: {
        name: "Вугільний магнат",
        levels: [
            {
                id: 'coal-1',
                requirement: 100,
                reward: 1000,
                description: "Виробити 100 вугілля",
                icon: "⚫"
            },
            {
                id: 'coal-2',
                requirement: 1000,
                reward: 5000,
                description: "Виробити 1,000 вугілля",
                icon: "⚫"
            },
            {
                id: 'coal-3',
                requirement: 10000,
                reward: 25000,
                description: "Виробити 10,000 вугілля",
                icon: "⚫"
            }
        ]
    },
    
    golden: {
        name: "Золотошукач",
        levels: [
            {
                id: 'gold-1',
                requirement: 10,
                reward: 2000,
                description: "Отримати 10 золотого вугілля",
                icon: "✨"
            },
            {
                id: 'gold-2',
                requirement: 100,
                reward: 10000,
                description: "Отримати 100 золотого вугілля",
                icon: "✨"
            }
        ]
    },
    
    efficiency: {
        name: "Ефективний менеджер",
        levels: [
            {
                id: 'eff-1',
                requirement: 10,
                reward: 1000,
                description: "Найняти 10 лісорубів",
                icon: "🪓"
            },
            {
                id: 'eff-2',
                requirement: 5,
                reward: 5000,
                description: "Досягти 5 рівня карбонізації",
                icon: "🏭"
            }
        ]
    }
};
