// Система збереження для мобільної версії
const SaveSystem = {
    // Ключ для локального сховища
    storageKey: 'charcoal_game_save',

    // Збереження гри
    saveGame(state) {
        try {
            // Створюємо об'єкт збереження
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                state: {
                    money: Math.floor(state.money),
                    wood: Math.floor(state.wood),
                    coal: Math.floor(state.coal),
                    woodcutters: state.woodcutters,
                    carbonizationLevel: state.carbonizationLevel,
                    lastUpdate: Date.now()
                }
            };

            // Зберігаємо в локальне сховище
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('Гру збережено');
            return true;
        } catch (error) {
            console.error('Помилка збереження:', error);
            return false;
        }
    },

    // Завантаження збереженої гри
    loadGame() {
        try {
            // Отримуємо дані з локального сховища
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                console.log('Збереження не знайдено');
                return null;
            }

            // Парсимо дані
            const data = JSON.parse(savedData);
            
            // Перевіряємо версію збереження
            if (data.version !== 1) {
                console.log('Несумісна версія збереження');
                return null;
            }

            console.log('Збереження завантажено');
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

    // Перевірка наявності збереження
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }
};
