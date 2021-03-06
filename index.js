const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const dimensionGame = 3;
let gameField = [[]];
let clickCounter = 0;
let possibleClickedCount = dimensionGame * dimensionGame;
let checkWin = 0;
startGame();
addResetListener();

function addField() {
    let newDimensionField = gameField.length + 2;
    possibleClickedCount = newDimensionField * newDimensionField;
    let newGameField = [];
    for (let i = 0; i < newDimensionField; i++)
        newGameField[i] = new Array(newDimensionField);
    for (let i = 0; i < gameField.length; i++) {
        for (let j = 0; j < gameField.length; j++) {
            newGameField[i + 1][j + 1] = gameField[i][j];
        }
    }
    for (let i = 0; i < newDimensionField; i++) {
        for (let j = 0; j < newDimensionField; j++) {
            if (newGameField[i][j] == null)
                newGameField[i][j] = " ";
        }
    }
    gameField = newGameField.concat();
    container.innerHTML = '';
    for (let i = 0; i < gameField.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < gameField.length; j++) {
            const cell = document.createElement('td');
            cell.textContent = gameField[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }

}

function initGameField(dimension, gameField) {
    for (let i = 0; i < dimension; i++) {
        gameField[i] = new Array(dimension);
        for (let j = 0; j < dimension; j++) {
            gameField[i][j] = EMPTY;
        }
    }
    console.log(gameField, "Сформировано поле")
}

function startGame() {
    initGameField(dimensionGame, gameField);
    renderGrid(dimensionGame);
}

function renderGrid(dimension) {
    container.innerHTML = '';
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}


function smartPlayer() {

    let randomRow = Math.round(Math.random() * (gameField.length - 1));
    let randomCol = Math.round(Math.random() * (gameField.length - 1));
    let flagTrue = checkWinBot();
    if (gameField[randomRow][randomCol] == EMPTY) {
        if (flagTrue != true)
            cellClickHandler(randomRow, randomCol);

    } else {
        smartPlayer();
    }

    function checkWinBot() {
        function checkHorizontalWinnerBot(index) {
            let word = "";
            let resultField = [];
            for (let i = 0; i < gameField.length; i++) {
                if (gameField[index][i] === EMPTY) {
                    resultField.push(index, i);
                    continue
                }
                word += gameField[index][i];
            }
            if (word === ZERO.repeat(gameField.length - 1)) {
                cellClickHandler(resultField[0], resultField[1])
                return true;
            } else return false;

        }

        function checkVerticalWinnerBot(index) {
            let resultField = [];
            let word = "";
            for (let i = 0; i < gameField.length; i++) {
                if (gameField[i][index] === EMPTY) {
                    resultField.push(i, index);
                    continue;
                }
                word += gameField[i][index];
            }
            if (word === ZERO.repeat(gameField.length - 1)) {
                cellClickHandler(resultField[0], resultField[1])
                return true;
            } else return false;
        }

        function checkFirstDiagonalWinnerBot() {
            let word = "";
            let resultField = [];
            for (let i = 0; i < gameField.length; i++) {
                if (gameField[i][i] === EMPTY) {
                    resultField.push(i, i);
                    continue
                }
                word += gameField[i][i];
            }
            if (word === ZERO.repeat(gameField.length - 1)) {
                cellClickHandler(resultField[0], resultField[1])
                return true;
            } else return false;
        }

        function checkSecondDiagonalWinnerBot() {
            let word = "";
            let resultField = [];
            let flag = gameField.length - 1;
            for (let i = 0; i < gameField.length; i++) {
                if (gameField[i][flag] === EMPTY) {
                    resultField.push(i, flag);
                    flag--;
                    continue;
                }
                word += gameField[i][flag];
                flag--;
            }
            if (word === ZERO.repeat(gameField.length - 1)) {
                cellClickHandler(resultField[0], resultField[1])
                return true;
            } else return false;
        }

        for (let i = 0; i < gameField.length; i++) {
            checkHorizontalWinnerBot(i)
        }
        for (let i = 0; i < gameField.length; i++) {
            checkVerticalWinnerBot(i)
        }
        checkFirstDiagonalWinnerBot();
        checkSecondDiagonalWinnerBot();
    }
}

function cellClickHandler(row, col) {
    if (checkWin == 0) {
        if (gameField[row][col] === EMPTY) {
            if (clickCounter % 2 === 0) {
                gameField[row][col] = CROSS;
                renderSymbolInCell(CROSS, row, col)
            } else {
                gameField[row][col] = ZERO;
                renderSymbolInCell(ZERO, row, col)
            }
            clickCounter++
        }
        checkWinner(gameField)
        if (clickCounter % 2 != 0 && clickCounter != possibleClickedCount)
            smartPlayer()
        if (clickCounter > (gameField.length * gameField.length) / 2 && checkWin == 0)
            addField()
        if (clickCounter === possibleClickedCount && checkWin === 0)
            setTimeout(() => alert("Победила дружба"),1);
        console.log(`Clicked on cell: ${row}, ${col}`);
        console.log(gameField);
    }
}

function checkWinner(gameField) {

    function checkHorizontalWinner() {
        for (let i = 0; i < gameField.length; i++) {
            let rowString = gameField[i].join("");
            if (rowString === CROSS.repeat(gameField.length)) {
                paintWinningFields(rowString, i)
                setTimeout(() => alert(`${CROSS} победил`), 1)
                checkWin = 1;
                break;
            } else if (rowString === ZERO.repeat(gameField.length)) {
                paintWinningFields(rowString, i)
                setTimeout(() => alert(`${ZERO} победил`), 1)
                checkWin = 1;
                break;
            }
        }
    }

    function checkVerticalWinner(index) {
        let flatArray = gameField.flat(2)
        let word = "";
        console.log(flatArray)
        for (let i = index; i < flatArray.length; i += gameField.length) {
            if (flatArray[i] === EMPTY)
                continue;
            word += flatArray[i];
        }
        if (word === CROSS.repeat(gameField.length)) {
            paintWinningFields(gameField, index, true)
            setTimeout(() => alert(`${CROSS} победил`), 1)
            checkWin = 1;
            return true;
        } else if (word === ZERO.repeat(gameField.length)) {
            paintWinningFields(gameField, index, true)
            setTimeout(() => alert(`${ZERO} победил`),)
            checkWin = 1;
            return true;
        }
    }

    function checkFirstDiagonalWinner() {
        let word = "";
        let diagonalArray = []
        for (let i = 0; i < gameField.length; i++) {
            if (gameField[i][i] === EMPTY) {
                diagonalArray = [];
                continue
            }
            word += gameField[i][i];
            diagonalArray.push([i, i]);
        }

        if (word === CROSS.repeat(gameField.length)) {
            paintDiagonalFields(diagonalArray)
            setTimeout(() => alert(`${CROSS} победил`), 1)
            checkWin = 1;
            return true;
        } else if (word === ZERO.repeat(gameField.length)) {
            paintDiagonalFields(diagonalArray)
            setTimeout(() => alert(`${ZERO} победил`), 1)
            checkWin = 1;
            return true;
        }

    }

    function checkSecondDiagonalWinner() {
        let secondDiagonal = ""
        let flag = gameField.length - 1;
        let diagonalArray = [];
        for (let i = 0; i < gameField.length; i++) {
            if (gameField[i][flag] === EMPTY) {
                diagonalArray = [];
                continue
            }
            secondDiagonal += gameField[i][flag];
            diagonalArray.push([i, flag]);
            flag--;
        }

        if (secondDiagonal === CROSS.repeat(gameField.length)) {
            paintDiagonalFields(diagonalArray)
            setTimeout(() => alert(`${CROSS} победил`), 1)
            checkWin = 1;
            return true;
        } else if (secondDiagonal === ZERO.repeat(gameField.length)) {
            setTimeout(() => paintDiagonalFields(diagonalArray), 1)
            alert(`${ZERO} победил`)
            checkWin = 1;
            return true;
        }
    }

    function paintWinningFields(line, startIndex, col = false) {
        if (col) {
            for (let i = 0; i < line.length; i++) {
                findCell(i, startIndex).style.color = "red";
            }
        } else for (let i = 0; i < line.length; i++) {
            findCell(startIndex, i).style.color = "red";
        }
    }

    function paintDiagonalFields(diagonalArray) {
        for (let i = 0; i < diagonalArray.length; i++) {
            findCell(diagonalArray[i][0], diagonalArray[i][1]).style.color = "red";

        }
    }

    checkHorizontalWinner()

    for (let i = 0; i < gameField.length; i++) {
        if (checkVerticalWinner(i))
            break;
    }

    checkFirstDiagonalWinner()
    checkSecondDiagonalWinner()

}


function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    possibleClickedCount = dimensionGame * dimensionGame;
    gameField = [];
    startGame()
    clickCounter = 0;
    checkWin = 0;

    console.log('reset!');
}


/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
