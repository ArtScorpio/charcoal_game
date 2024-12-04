// Система інтерфейсу для мобільної версії
const UISystem = {
    // Оновлення відображення ресурсів
    updateResources(state) {
        // Округлення всіх числових значень
        const formattedState = {
            money: Math.floor(state.money),
            wood: Math.floor(state.wood),
            coal: Math.floor(state.coal),
            woodcutters: state.woodcutters
        };

        // Оновлення значень на екрані
        for (const [key, value] of Object.entries(formattedState)) {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        }

        // Оновлення вартості лісоруба
        const woodcutterCost = document.getElementById('woodcutterCost');
        if (woodcutterCost) {
            woodcutterCost.textContent = WoodcuttingSystem.calculateHireCost();
        }

        // Оновлення стану кнопок
        this.updateButtons(state);
    },

    // Оновлення стану кнопок
    updateButtons(state) {
        // Кнопка найму
        const hireButton = document.getElementById('hireButton');
        if (hireButton) {
            const hireCost = WoodcuttingSystem.calculateHireCost();
            hireButton.disabled = state.money < hireCost || state.woodcutters >= 10;
        }

        // Кнопка виробництва
        const produceButton = document.getElementById('produceButton');
        if (produceButton) {
            produceButton.disabled = state.wood < 8; // Базова вимога деревини
        }
    },

    // Показ повідомлень
    showMessage(text, type = 'info') {
        // Видалення попередніх повідомлень
        const oldMessages = document.getElementsByClassName('game-message');
        Array.from(oldMessages).forEach(msg => msg.remove());

        // Створення нового повідомлення
        const message = document.createElement('div');
        message.className = `game-message ${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        // Автоматичне видалення повідомлення
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    },

    // Показ прогресу виробництва
    showProduction(duration) {
        const progressBar = document.getElementById('productionProgress');
        const progressFill = progressBar.querySelector('.progress-fill');
        
        if (!progressBar || !progressFill) return;

        // Показуємо прогрес-бар
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';

        // Анімація заповнення
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            
            progressFill.style.width = `${progress}%`;

            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    progressBar.style.display = 'none';
                }, 200);
            }
        };

        requestAnimationFrame(animate);
    }
};
