const SaveSystem = {
    storageKey: 'charcoal_game_save',
    autoSaveInterval: 30000, // Автозбереження кожні 30 секунд

    init() {
        // Запуск автозбереження
        setInterval(() => this.autoSave(), this.autoSaveInterval);
    },

    autoSave() {
        this.saveGame();
        UISystem.showMessage("Гру автоматично збережено", "info");
    },

    saveGame() {
        try {
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                state: {
                    money: Game.state.money,
                    wood: Game.state.wood,
                    coalDust: Game.state.coalDust,
                    coal: Game.state.coal,
                    goldenCoal: Game.state.goldenCoal,
                    woodcutters: Game.state.woodcutters,
                    carbonizationLevel: Game.state.carbonizationLevel,
                    experience: Game.state.experience,
                    level: Game.state.level,
                    unlockedMethods: Game.state.unlockedMethods
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Помилка збереження:', error);
            return false;
        }
    },

    loadGame() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return null;

            const data = JSON.parse(savedData);
            return data.state;
        } catch (error) {
            console.error('Помилка завантаження:', error);
            return null;
        }
    }
};
