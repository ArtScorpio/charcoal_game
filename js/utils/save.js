// Система збереження для мобільної версії
const SaveSystem = {
    // Ключ для локального сховища
    storageKey: 'charcoal_game_save',

    // Збереження стану гри
    saveGame(gameState) {
        try {
            const saveData = {
                version: 1, // версія для майбутніх оновлень
                timestamp: Date.now(),
                state: gameState
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
            if (!savedData) return null;

            const data = JSON.parse(savedData);
            return data.state;
        } catch (error) {
            console.error('Помилка завантаження:', error);
            return null;
        }
    },

    // Видалення збереження
    deleteSave() {
        localStorage.removeItem(this.storageKey);
    }
};
