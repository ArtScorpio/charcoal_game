const SaveSystem = {
    // Ключ для локального сховища
    storageKey: 'charcoal_game_save',
    autoSaveInterval: 30000, // 30 секунд

    // Ініціалізація системи збереження
    init() {
        // Запуск автозбереження
        setInterval(() => this.autoSave(), this.autoSaveInterval);
        
        // Перше завантаження
        const savedData = this.loadGame();
        if (savedData) {
            Game.state = savedData;
            UISystem.showMessage("Прогрес завантажено", "info");
        }
    },

    // Автоматичне збереження
    autoSave() {
        if (this.saveGame()) {
            console.log('Автозбереження виконано');
        }
    },

    // Збереження гри
    saveGame() {
        try {
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                state: {
                    // Ресурси
                    money: Math.floor(Game.state.money),
                    wood: Math.floor(Game.state.wood),
                    coalDust: Math.floor(Game.state.coalDust),
                    coal: Math.floor(Game.state.coal),
                    goldenCoal: Math.floor(Game.state.goldenCoal),

                    // Виробництво
                    woodcutters: Game.state.woodcutters,
                    carbonizationLevel: Game.state.carbonizationLevel,
                    unlockedMethods: Game.state.unlockedMethods,

                    // Прогрес
                    experience: Game.state.experience,
                    level: Game.state.level,

                    // Додаткові дані
                    lastUpdate: Date.now(),
                    toolLevel: WoodcuttingSystem.woodcutters.toolLevel,
                    unlockedPlots: WoodcuttingSystem.woodcutters.plots
                        .filter(plot => plot.unlocked)
                        .map(plot => plot.id)
                }
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Помилка збереження:', error);
            return false;
        }
    },

    // Завантаження збереженої гри
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                console.log('Збережень не знайдено');
                return null;
            }

            const data = JSON.parse(savedData);

            // Перевірка версії збереження
            if (data.version !== 1) {
                console.log('Несумісна версія збереження');
                return null;
            }

            // Перевірка застарілості даних (більше 7 днів)
            const ageInDays = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
            if (ageInDays > 7) {
                console.log('Збереження застаріле');
                return null;
            }

            return data.state;
        } catch (error) {
            console.error('Помилка завантаження:', error);
            return null;
        }
    },

    // Видалення збереження
    deleteSave() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Збереження видалено');
            return true;
        } catch (error) {
            console.error('Помилка видалення збереження:', error);
            return false;
        }
    },

    // Експорт збереження
    exportSave() {
        const saveData = localStorage.getItem(this.storageKey);
        if (!saveData) return null;
        
        // Кодування в Base64 для зручного копіювання
        return btoa(saveData);
    },

    // Імпорт збереження
    importSave(saveString) {
        try {
            const saveData = atob(saveString);
            const parsed = JSON.parse(saveData);
            
            if (parsed.version !== 1) {
                return {
                    success: false,
                    message: "Несумісна версія збереження"
                };
            }

            localStorage.setItem(this.storageKey, saveData);
            return {
                success: true,
                message: "Збереження імпортовано успішно"
            };
        } catch (error) {
            return {
                success: false,
                message: "Помилка імпорту збереження"
            };
        }
    }
};
