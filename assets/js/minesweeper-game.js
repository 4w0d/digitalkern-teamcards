document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('minesweeper-game-board');
    const width = 10;
    const bombAmount = 20;
    const squares = [];
    let isGameOver = false;
    let isFirstClick = true;

    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            board.appendChild(square);
            squares.push(square);

            // Normal click
            square.addEventListener('click', function(e) {
                click(square);
            });

            // Right click
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('valid')) {
                squares[i].setAttribute('data', calculateAdjacentBombs(i));
            }
        }
    }
    createBoard();

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && (square.classList.contains('flag'))) {
            square.classList.remove('flag');
            square.innerHTML = '';
        } else if (!square.classList.contains('checked') && (!square.classList.contains('flag'))) {
            square.classList.add('flag');
            square.innerHTML = ' 🚩';
        }
    }

    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (isFirstClick) {
            ensureSafeStart(currentId);
            isFirstClick = false;
        }
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                checkForWin();
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
        checkForWin();
    }

    function ensureSafeStart(startId) {
        const startSquare = squares[startId];
        const adjacentSquares = getAdjacentSquares(startId);

        adjacentSquares.forEach(id => {
            if (squares[id] && squares[id].classList.contains('bomb')) {
                squares[id].classList.remove('bomb');
                squares[id].classList.add('valid');
                placeNewBomb(startId, adjacentSquares);
            }
        });

        squares.forEach(square => {
            if (square.classList.contains('valid')) {
                square.setAttribute('data', calculateAdjacentBombs(parseInt(square.id)));
            }
        });
    }
    function getAdjacentSquares(id) {
        const adjacentSquares = [];
        const isLeftEdge = (id % width === 0);
        const isRightEdge = (id % width === width - 1);

        if (id > 0 && !isLeftEdge) adjacentSquares.push(id - 1);
        if (id > 9 && !isRightEdge) adjacentSquares.push(id + 1 - width);
        if (id > 10) adjacentSquares.push(id - width);
        if (id > 11 && !isLeftEdge) adjacentSquares.push(id - 1 - width);
        if (id < 98 && !isRightEdge) adjacentSquares.push(id + 1);
        if (id < 90 && !isLeftEdge) adjacentSquares.push(id - 1 + width);
        if (id < 88 && !isRightEdge) adjacentSquares.push(id + 1 + width);
        if (id < 89) adjacentSquares.push(id + width);

        return adjacentSquares;
    }

    function placeNewBomb(startId, adjacentSquares) {
        let newBombPlaced = false;
        while (!newBombPlaced) {
            const randomIndex = Math.floor(Math.random() * squares.length);
            if (squares[randomIndex] && !squares[randomIndex].classList.contains('bomb') && randomIndex !== startId && !adjacentSquares.includes(randomIndex)) {
                squares[randomIndex].classList.add('bomb');
                newBombPlaced = true;
            }
        }
    }

    function calculateAdjacentBombs(id) {
        let total = 0;
        const isLeftEdge = (id % width === 0);
        const isRightEdge = (id % width === width - 1);

        if (id > 0 && !isLeftEdge && squares[id - 1] && squares[id - 1].classList.contains('bomb')) total++;
        if (id > 9 && !isRightEdge && squares[id + 1 - width] && squares[id + 1 - width].classList.contains('bomb')) total++;
        if (id > 10 && squares[id - width] && squares[id - width].classList.contains('bomb')) total++;
        if (id > 11 && !isLeftEdge && squares[id - 1 - width] && squares[id - 1 - width].classList.contains('bomb')) total++;
        if (id < 98 && !isRightEdge && squares[id + 1] && squares[id + 1].classList.contains('bomb')) total++;
        if (id < 90 && !isLeftEdge && squares[id - 1 + width] && squares[id - 1 + width].classList.contains('bomb')) total++;
        if (id < 88 && !isRightEdge && squares[id + 1 + width] && squares[id + 1 + width].classList.contains('bomb')) total++;
        if (id < 89 && squares[id + width] && squares[id + width].classList.contains('bomb')) total++;

        return total;
    }

    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare) click(newSquare);
            }
        }, 10);
    }

    function gameOver(square) {
        isGameOver = true;
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        });
        displayLoseMessage();
    }

    function displayLoseMessage() {
        const loseMessage = document.createElement('div');
        loseMessage.classList.add('lose-message');
        loseMessage.innerHTML = 'You Lost!';
        document.body.appendChild(loseMessage);
    }

    function checkForWin() {
        let matches = 0;
        let allNonBombsChecked = true;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (!squares[i].classList.contains('bomb') && !squares[i].classList.contains('checked')) {
                allNonBombsChecked = false;
            }
        }
        if (allNonBombsChecked) {
            isGameOver = true;
            displayWinMessage();
        }
    }

    function displayWinMessage() {
        const winMessage = document.createElement('div');
        winMessage.classList.add('win-message');
        winMessage.innerHTML = 'You Won!';
        document.body.appendChild(winMessage);
        startConfetti();
    }

    function startConfetti() {
        const confettiSettings = { target: 'confetti-canvas' };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }
});
