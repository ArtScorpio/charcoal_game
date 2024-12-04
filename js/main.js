// Основний об'єкт гри для мобільної версії
const game = {
    // Стан гри
    state: {
        money: 1000,
        wood: 0,
        coal: 0,
        woodcutters: 0,
        carbonizationLevel: 1,
        lastUpdate: Date.now()
    },

    // Ініціалізація гри
    init() {
        // Завантаження збереженої гри
        const savedState = SaveSystem.loadGame();
        if (savedState) {
            this.state = savedState;
        }

        // Запуск ігрового циклу
        this.startGameLoop();

        // Оновлення інтерфейсу
        UISystem.updateResources(this.state);

        // Додавання обробників подій
        this.setup
