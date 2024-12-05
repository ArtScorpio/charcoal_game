const Game = {
    state: {
        money: 1000,
        wood: 0,
        coalDust: 0,
        coal: 0,
        goldenCoal: 0,
        woodcutters: 0
    },

    prices: {
        wood: 10,
        coalDust: 50,
        coal: 150,
        goldenCoal: 300
    },

    init() {
        this.loadGame();
        this.startGameLoop();
        this.updateUI();
    },

    startGameLoop() {
        setInterval(() => {
            if (this.state.woodcutters > 0) {
                this.state.wood += this.state.woodcutters;
                this.updateUI();
                this.saveGame();
            }
        }, 1000);
    },

    sellResource(type) {
        if (this.state[type] >= 1) {
            this.state[type]--;
            const price = this.prices[type];
            this.state.money += price;
            this.showMessage(`+${price}💰`);
            this.updateUI();
            this.saveGame();
        } else {
            this.showMessage(`Недостатньо ресурсу для продажу!`);
        }
    },

    hireWoodcutter() {
        const cost = Math.floor(100 * Math.pow(1.5, this.state.woodcutters));
        if (this.state.money >= cost && this.state.woodcutters < 10) {
            this.state.money -= cost;
            this.state.woodcutters++;
            this.showMessage("Найнято нового лісоруба!");
            this.updateUI();
            this.saveGame();
        }
    },

    produceCoal(method) {
        const woodNeeded = 9 - method; // 8 для методу 1, 7 для методу 2, 6 для методу 3
        if (this.state.wood >= woodNeeded) {
            this.state.wood -= woodNeeded;
            
            setTimeout(() => {
                const roll = Math.random() * 100;
                if (roll < 20) {
                    this.state.coalDust++;
                    this.showMessage("Отримано вугільний пил!");
                } else if (roll < 95) {
                    this.state.coal++;
                    this.showMessage("Отримано деревне вугілля!");
                } else {
                    this.state.goldenCoal++;
                    this.showMessage("Отримано золоте вугілля!");
                }
                this.updateUI();
                this.saveGame();
            }, 5000);
            
            this.updateUI();
        } else {
            this.showMessage(`Потрібно ${woodNeeded} деревини!`);
        }
    },

    updateUI() {
        document.getElementById('money').textContent = Math.floor(this.state.money);
        document.getElementById('wood').textContent = Math.floor(this.state.wood);
        document.getElementById('coalDust').textContent = Math.floor(this.state.coalDust);
        document.getElementById('coal').textContent = Math.floor(this.state.coal);
        document.getElementById('goldenCoal').textContent = Math.floor(this.state.goldenCoal);
        document.getElementById('woodcuttersCount').textContent = this.state.woodcutters;
        document.getElementById('woodcutterCost').textContent = 
            Math.floor(100 * Math.pow(1.5, this.state.woodcutters));
        
        document.getElementById('method2').disabled = this.state.money < 5000;
        document.getElementById('method3').disabled = this.state.money < 25000;
    },

    showMessage(text) {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.background = 'rgba(0,0,0,0.8)';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '20px';
        message.style.zIndex = '1000';
        message.textContent = text;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    },

    saveGame() {
        localStorage.setItem('charcoalGame', JSON.stringify(this.state));
    },

    loadGame() {
        const saved = localStorage.getItem('charcoalGame');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    }
};

window.onload = () => Game.init();
