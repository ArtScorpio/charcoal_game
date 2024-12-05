const UISystem = {
    // Конфігурація UI
    config: {
        messageTimeout: 3000,    // Час показу повідомлень (3 секунди)
        maxMessages: 3,          // Максимальна кількість повідомлень одночасно
        updateInterval: 100      // Інтервал оновлення прогрес-барів
    },

    // Оновлення відображення ресурсів
    updateResources(state) {
        const elements = {
            'money': state.money,
            'wood': state.wood,
            'coalDust': state.coalDust,
            'coal': state.coal,
            'goldenCoal': state.goldenCoal,
            'woodcuttersCount': state.woodcutters
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = Math.floor(value);
            }
        }

        // Оновлення вартості лісоруба
        const woodcutterCost = document.getElementById('woodcutterCost');
        if (woodcutterCost) {
            woodcutterCost.textContent = WoodcuttingSystem.calculateHireCost();
        }

        this.updateButtons(state);
    },

    // Оновлення стану кнопок
    updateButtons(state) {
        // Кнопка найму
        const hireButton = document.getElementById('hireButton');
        if (hireButton) {
            const hireCost = WoodcuttingSystem.calculateHireCost();
            hireButton.disabled = state.money < hireCost || 
                                state.woodcutters >= WoodcuttingSystem.config.maxWoodcutters;
        }

        // Кнопки методів виробництва
        ProductionSystem.levels.forEach((level, index) => {
            const button = document.getElementById(`method${index + 1}`);
            if (button) {
                button.disabled = state.money < level.cost || 
                                state.wood < level.woodNeeded;
            }
        });
    },

    // Показ повідомлень
    showMessage(text, type = 'info') {
        // Видалення старих повідомлень
        const oldMessages = document.getElementsByClassName('game-message');
        if (oldMessages.length >= this.config.maxMessages) {
            oldMessages[0].remove();
        }

        // Створення нового повідомлення
        const message = document.createElement('div');
        message.className = `game-message ${type}`;
        message.textContent = text;

        // Позиціонування повідомлення
        message.style.bottom = `${20 + (oldMessages.length * 60)}px`;
        
        document.body.appendChild(message);

        // Анімація появи
        setTimeout(() => {
            message.style.opacity = '1';
        }, 10);

        // Автоматичне видалення
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, this.config.messageTimeout);
    },

    // Показ прогресу виробництва
    showProgress(totalSeconds) {
        const progressBar = document.getElementById('productionProgress');
        const progressFill = progressBar.querySelector('.progress-fill');
        const timeLeft = progressBar.querySelector('.progress-text');

        progressBar.style.display = 'block';
        let secondsLeft = totalSeconds;
        
        const updateProgress = () => {
            const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
            progressFill.style.width = `${progress}%`;
            
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = Math.floor(secondsLeft % 60);
            timeLeft.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            secondsLeft -= this.config.updateInterval / 1000;
            
            if (secondsLeft > 0) {
                setTimeout(updateProgress, this.config.updateInterval);
            } else {
                progressBar.style.display = 'none';
            }
        };

        updateProgress();
    },

    // Оновлення прогрес-бару досвіду
    updateExperience(current, needed) {
        const expBar = document.querySelector('.exp-fill');
        const expText = document.querySelector('.exp-text');
        
        if (expBar && expText) {
            const percentage = (current / needed) * 100;
            expBar.style.width = `${Math.min(percentage, 100)}%`;
            expText.textContent = `${Math.floor(current)}/${needed} EXP`;
        }
    },

    // Форматування чисел
    formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return Math.floor(number).toString();
    },

    // Форматування часу
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};
