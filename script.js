class NumberGame {
    constructor() {
        this.numbersContainer = document.getElementById('numbers-container');
        this.levelInfo = document.getElementById('level-info');
        this.scoreInfo = document.getElementById('score-info');
        this.multiplierInfo = document.getElementById('multiplier-info');
        this.errorsContainer = document.getElementById('errors-container');
        this.timerInfo = document.getElementById('timer-info');
        this.targetInfo = document.getElementById('target-info');
        this.targetNumberElement = document.getElementById('target-number');
        this.gameOverContainer = document.getElementById('game-over-container');
        this.finalScore = document.getElementById('final-score');
        this.highScore = document.getElementById('high-score');
        this.restartButton = document.getElementById('restart-button');
        this.startButton = document.getElementById('start-button');
        this.startScreen = document.getElementById('start-screen');
        this.gameContainer = document.getElementById('game-container');
        this.gameFrame = document.getElementById('game-frame');
        this.correctIcon = document.getElementById('correct-icon');

        this.level = 1;
        this.score = 0;
        this.multiplier = 1;
        this.errors = 0;
        this.targetNumber = null;
        this.timer = null;
        this.timeLeft = 120;
        this.highScoreValue = 0;

        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.level = 1;
        this.score = 0;
        this.multiplier = 1;
        this.errors = 0;
        this.timeLeft = 120;
        this.updateLevelInfo();
        this.updateScoreInfo();
        this.updateMultiplierInfo();
        this.updateErrorsInfo();
        this.updateTimerInfo();
        this.generateNumbers();
        this.startTimer();
        this.gameOverContainer.style.display = 'none';
        this.gameContainer.style.display = 'block';
        this.startScreen.style.display = 'none';
        this.changeFrameColor();
    }

    updateLevelInfo() {
        this.levelInfo.textContent = `LVL: ${this.level}`;
    }

    updateScoreInfo() {
        this.scoreInfo.textContent = `Очки: ${this.score}`;
    }

    updateMultiplierInfo() {
        this.multiplierInfo.textContent = `Множитель: x${this.multiplier}`;
    }

    updateErrorsInfo() {
        document.querySelectorAll('.error').forEach(error => {
            error.classList.remove('active');
        });
        for (let i = 1; i <= this.errors; i++) {
            document.getElementById(`error-${i}`).classList.add('active');
        }
    }

    updateTimerInfo() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerInfo.textContent = `Время: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    updateTargetInfo() {
        this.targetInfo.textContent = `Найдите число: `;
        this.targetNumberElement.textContent = this.targetNumber;
    }

    generateNumbers() {
        this.numbersContainer.innerHTML = '';
        let numbersCount;
        let numberRange;
        let gridSize;
        let gapSize;

        if (this.level <= 3) {
            numbersCount = 6;
            numberRange = [1, 10];
            gridSize = { rows: 2, cols: 3 };
            gapSize = 20;
        } else if (this.level <= 8) {
            numbersCount = 16;
            numberRange = [100, 1000];
            gridSize = { rows: 4, cols: 4 };
            gapSize = 15;
        } else {
            numbersCount = 25;
            numberRange = [1000, 10000];
            gridSize = { rows: 5, cols: 5 };
            gapSize = 10;
        }

        this.numbersContainer.style.gridTemplateRows = `repeat(${gridSize.rows}, 1fr)`;
        this.numbersContainer.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;
        this.numbersContainer.style.gap = `${gapSize}px`;

        const numbers = this.generateRandomNumbers(numbersCount, numberRange);
        this.targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
        this.updateTargetInfo();

        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('number');

            const numberSpan = document.createElement('span');
            numberSpan.textContent = number;
            numberElement.appendChild(numberSpan);

            numberElement.addEventListener('click', () => this.checkNumber(number));

            if (this.level >= 3 && Math.random() < 0.5) {
                const randomEffect = Math.floor(Math.random() * 3);
                if (randomEffect === 0) {
                    numberElement.classList.add('blink');
                } else if (randomEffect === 1) {
                    numberElement.classList.add('rotate');
                } else {
                    numberElement.classList.add('shrink');
                }
            }

            const randomColor = this.getRandomColor();
            numberElement.classList.add(randomColor);

            this.numbersContainer.appendChild(numberElement);
        });
    }

    generateRandomNumbers(count, range) {
        const numbers = new Set();
        while (numbers.size < count) {
            const number = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
            numbers.add(number);
        }
        return Array.from(numbers);
    }

    checkNumber(number) {
        if (number === this.targetNumber) {
            this.score += 10 * this.level * this.multiplier;
            this.updateScoreInfo();
            this.level++;
            if (this.level % 2 === 0 && this.multiplier < 5) {
                this.multiplier++;
            }
            this.updateMultiplierInfo();
            this.updateLevelInfo();
            this.changeFrameColor();

            this.correctIcon.style.display = 'block';
            setTimeout(() => {
                this.correctIcon.style.display = 'none';
                this.generateNumbers();
                this.targetNumberElement.classList.add('swipe-transition');
                document.querySelectorAll('.number').forEach(numberElement => {
                    numberElement.classList.add('swipe-transition');
                });
                setTimeout(() => {
                    this.targetNumberElement.classList.remove('swipe-transition');
                    document.querySelectorAll('.number').forEach(numberElement => {
                        numberElement.classList.remove('swipe-transition');
                    });
                }, 500);
            }, 500);
        } else {
            this.errors++;
            this.updateErrorsInfo();
            this.multiplier = 1;
            this.updateMultiplierInfo();
            if (this.errors >= 3) {
                this.endGame();
            }
        }
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerInfo();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        if (this.score > this.highScoreValue) {
            this.highScoreValue = this.score;
        }
        this.highScore.textContent = `Рекорд: ${this.highScoreValue}`;
        this.finalScore.textContent = `Очки: ${this.score}`;
        this.gameOverContainer.style.display = 'flex';
        this.gameContainer.style.display = 'none';
    }

    changeFrameColor() {
        const randomColor = this.getRandomPleasantColor();
        this.gameFrame.style.backgroundColor = randomColor;
    }

    getRandomColor() {
        const colors = ['pink', 'orange', 'blue', 'green', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomPleasantColor() {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFFF33',
            '#57FF33', '#5733FF', '#FF33A1', '#33FFA1', '#A133FF'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NumberGame();
});
