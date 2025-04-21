document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers-container');
    const levelInfo = document.getElementById('level-info');
    const scoreInfo = document.getElementById('score-info');
    const multiplierInfo = document.getElementById('multiplier-info');
    const errorsContainer = document.getElementById('errors-container');
    const timerInfo = document.getElementById('timer-info');
    const targetInfo = document.getElementById('target-info');
    const targetNumberElement = document.getElementById('target-number');
    const gameOverContainer = document.getElementById('game-over-container');
    const finalScore = document.getElementById('final-score');
    const highScore = document.getElementById('high-score');
    const restartButton = document.getElementById('restart-button');
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const gameFrame = document.getElementById('game-frame');
    const correctIcon = document.getElementById('correct-icon');

    let level = 1;
    let score = 0;
    let multiplier = 1;
    let errors = 0;
    let targetNumber;
    let timer;
    let timeLeft = 120;
    let highScoreValue = 0;

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    function startGame() {
        level = 1;
        score = 0;
        multiplier = 1;
        errors = 0;
        timeLeft = 120;
        updateLevelInfo();
        updateScoreInfo();
        updateMultiplierInfo();
        updateErrorsInfo();
        updateTimerInfo();
        generateNumbers();
        startTimer();
        gameOverContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        startScreen.style.display = 'none';
        changeFrameColor();
    }

    function updateLevelInfo() {
        levelInfo.textContent = `LVL: ${level}`;
    }

    function updateScoreInfo() {
        scoreInfo.textContent = `Очки: ${score}`;
    }

    function updateMultiplierInfo() {
        multiplierInfo.textContent = `Множитель: x${multiplier}`;
    }

    function updateErrorsInfo() {
        document.querySelectorAll('.error').forEach(error => {
            error.classList.remove('active');
        });
        for (let i = 1; i <= errors; i++) {
            document.getElementById(`error-${i}`).classList.add('active');
        }
    }

    function updateTimerInfo() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerInfo.textContent = `Время: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function updateTargetInfo() {
        targetInfo.textContent = `Найдите число: `;
        targetNumberElement.textContent = targetNumber;
    }

    function generateNumbers() {
        numbersContainer.innerHTML = '';
        let numbersCount;
        let numberRange;
        let gridSize;
        let gapSize;

        if (level <= 3) {
            numbersCount = 6;
            numberRange = [1, 10];
            gridSize = { rows: 2, cols: 3 };
            gapSize = 20; 
        } else if (level <= 8) {
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

        numbersContainer.style.gridTemplateRows = `repeat(${gridSize.rows}, 1fr)`;
        numbersContainer.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;
        numbersContainer.style.gap = `${gapSize}px`;

        const numbers = generateRandomNumbers(numbersCount, numberRange);
        targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
        updateTargetInfo();

        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('number');

            const numberSpan = document.createElement('span');
            numberSpan.textContent = number;
            numberElement.appendChild(numberSpan);

            numberElement.addEventListener('click', () => checkNumber(number));

            if (level >= 3 && Math.random() < 0.5) { 
                const randomEffect = Math.floor(Math.random() * 3);
                if (randomEffect === 0) {
                    numberElement.classList.add('blink');
                } else if (randomEffect === 1) {
                    numberElement.classList.add('rotate');
                } else {
                    numberElement.classList.add('shrink');
                }
            }

            const randomColor = getRandomColor();
            numberElement.classList.add(randomColor);

            numbersContainer.appendChild(numberElement);
        });
    }

    function generateRandomNumbers(count, range) {
        const numbers = new Set();
        while (numbers.size < count) {
            const number = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
            numbers.add(number);
        }
        return Array.from(numbers);
    }

    function checkNumber(number) {
        if (number === targetNumber) {
            score += 10 * level * multiplier;
            updateScoreInfo();
            level++;
            if (level % 2 === 0 && multiplier < 5) {
                multiplier++;
            }
            updateMultiplierInfo();
            updateLevelInfo();
            changeFrameColor();

            correctIcon.style.display = 'block';
            setTimeout(() => {
                correctIcon.style.display = 'none';
                generateNumbers();
                targetNumberElement.classList.add('swipe-transition');
                document.querySelectorAll('.number').forEach(numberElement => {
                    numberElement.classList.add('swipe-transition');
                });
                setTimeout(() => {
                    targetNumberElement.classList.remove('swipe-transition');
                    document.querySelectorAll('.number').forEach(numberElement => {
                        numberElement.classList.remove('swipe-transition');
                    });
                }, 500); 
            }, 500); 
        } else {
            errors++;
            updateErrorsInfo();
            multiplier = 1; 
            updateMultiplierInfo();
            if (errors >= 3) {
                endGame();
            }
        }
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            updateTimerInfo();
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        if (score > highScoreValue) {
            highScoreValue = score;
        }
        highScore.textContent = `Рекорд: ${highScoreValue}`;
        finalScore.textContent = `Очки: ${score}`;
        gameOverContainer.style.display = 'flex';
        gameContainer.style.display = 'none';
    }

    function changeFrameColor() {
        const randomColor = getRandomPleasantColor();
        gameFrame.style.backgroundColor = randomColor;
    }

    function getRandomColor() {
        const colors = ['pink', 'orange', 'blue', 'green', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function getRandomPleasantColor() {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFFF33',
            '#57FF33', '#5733FF', '#FF33A1', '#33FFA1', '#A133FF'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});
