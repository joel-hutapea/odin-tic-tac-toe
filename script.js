function Gameboard() {
    const board = [];
    
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeSign = (row, column, player) => {
        if (board[row][column].getValue() === "") {
            board[row][column].addSign(player);
            return true
        }
        return false
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues)
    }

    return {
        getBoard,
        placeSign,
        printBoard
    };
}

function Cell() {
    let value = "";

    const addSign = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addSign,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: "X",
            sign: "X"
        },
        {
            name: "O",
            sign: "O"
        }
    ];

    let activePlayer = players[0];

    let moveCount = 0;

    let gameOver = false;

    let result = "";

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getGameOver = () => gameOver;

    const getResult = () => result;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        if (!board.placeSign(row, column, getActivePlayer().sign)) return
        moveCount++;

        if (checkGameEnd(row, column, getActivePlayer().sign)) {
            board.printBoard()
            result = `${getActivePlayer().name} wins!`
            gameOver = true
            return;
        }
        if (moveCount === 9) {
            board.printBoard()
            result = "It's a draw!"
            gameOver = true
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    const checkGameEnd = (row, column, sign) => {
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][column].getValue() !== sign) {
                break
            }
            if (i === 2) {
                return true
            }
        }

        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[row][i].getValue() !== sign) {
                break
            }
            if (i === 2) {
                return true
            }
        }

        if (row === column) {
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][i].getValue() !== sign) {
                    break
                }
                if (i === 2) {
                    return true
                }
            }
        }

        if (row + column === 2) {
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][2 - i].getValue() !== sign) {
                    break
                }
                if (i === 2) {
                    return true
                }
            }
        }
        
        return false
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getGameOver,
        getResult,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    let game = GameController();
    const containerDiv = document.querySelector('.container');
    const turnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resultDiv = document.querySelector('.result');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        turnDiv.textContent = `${activePlayer.name}'s turn`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell")
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                cellButton.disabled = game.getGameOver();
                boardDiv.appendChild(cellButton);
            });
        });

        if (game.getGameOver()) {
            resultDiv.textContent = game.getResult();
            const retryButton = document.createElement("button");
            retryButton.textContent = "Play Again";
            retryButton.classList.add("retry");
            containerDiv.appendChild(retryButton);
            retryButton.addEventListener("click", () => {
                game = GameController();
                updateScreen();
                containerDiv.removeChild(retryButton);
            })
        } else {
            resultDiv.textContent = ""
        }
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedColumn || !selectedRow) return;
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();