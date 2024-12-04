// Система інтерфейсу для мобільної версії
const UISystem = {
    // Оновлення відображення ресурсів
    updateResources(state) {
        // Оновлення основних ресурсів
        const elements = {
            'money': state.money,
            'wood': state.wood,
            'coal': state.coal,
            'woodcutters': state.woodcutters
        };

        for (let [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = Math.floor(value);
            }
        }

        // Оновлення кнопок
        this.updateButtons(state);
    },

    // Оновлення стану кнопок
    updateButtons(state) {
        // Кнопка найму лісоруба
        const hireButton = document.getElementById('hireButton');
        if (hireButton) {
            const cost = WoodcuttingSystem.calculateHireCost();
            hireButton.disabled = state.money < cost || 
                                state.woodcutters >= WoodcuttingSystem.config.maxWoodcutters;
            hireButton.textContent = `Найняти лісоруба (${cost} 💰)`;
        }

        // Кнопка виробництва
        const produceButton = document.getElementById('produceButton');
        if (produceButton) {
            const woodNeeded = ProductionSystem.levels[state.carbonizationLevel].woodNeeded;
            produceButton.disabled = state.wood < woodNeeded;
        }
    },

    // Показ повідомлень
    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = text;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => messageDiv.remove(), 300);
        }, 2000);
    },

    // Анімація виробництва
    showProduction(duration) {
        const progressBar = document.getElementById('productionProgress');
        if (!progressBar) return;

        progressBar.style.display = 'block';
        progressBar.style.width = '0%';

        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            
            progressBar.style.width = `${progress}%`;

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
