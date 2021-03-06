const columnVaraible = document.querySelectorAll('.tictactoe');
startGameFunction();
// Winning Possibilities
let tableBoard;
const humanPlayer = 'O';
const computerPlayer = 'X';
const winningPossibilities = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[6, 4, 2]
	]

// Start Game Function
function startGameFunction() {
	document.querySelector(".gameOverDiv").style.display = "none";
	tableBoard = Array.from(Array(9).keys());
	for (let i = 0; i < columnVaraible.length; i++) {
		columnVaraible[i].innerText = '';
		columnVaraible[i].style.removeProperty('background-color');
		columnVaraible[i].addEventListener('click', turnClickFunction, false);
	}
	document.getElementById("restartButton").style.visibility = "hidden";
}

// Turn Click Function
function turnClickFunction(square) {
	if (typeof tableBoard[square.target.id] == 'number') {
		turnFunction(square.target.id, humanPlayer)
		if (!checkWinnerFunction(tableBoard, humanPlayer) && !checkTieFunction()) turnFunction(bestSpotFunction(), computerPlayer);
	}
}

// Game Turn Function
function turnFunction(columnId, player) {
	tableBoard[columnId] = player;
	document.getElementById(columnId).innerText = player;
	let gameWon = checkWinnerFunction(tableBoard, player)
	if (gameWon) gameOver(gameWon)
}

// Check win
function checkWinnerFunction(varboard, player) {
	let plays = varboard.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winningPossibilities.entries()) {
		if (win.every(elem => plays.includes(elem))) {
			gameWon = {
				index,
				player
			};
			break;
		}
	}
	return gameWon;
}

// Game Over Function
function gameOver(gameWon) {
	for (let index of winningPossibilities[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (let i = 0; i < columnVaraible.length; i++) {
		columnVaraible[i].removeEventListener('click', turnClickFunction, false);
	}
	declareWinnerFunction(gameWon.player == humanPlayer ? "Winner" : "You Lose");
	document.getElementById("restartButton").style.visibility = "visible";
}

// Declare Winner
function declareWinnerFunction(who) {
	document.querySelector(".gameOverDiv").style.display = "block";
	document.querySelector(".gameOverDiv .text").innerText = who;
	// Game Over Sound
	const over = new Audio();
	over.src = "files/GameOver.mp3";
	over.play();
}

// Empty Columns
function emptyColumnsFunction() {
	return tableBoard.filter(s => typeof s == 'number');
}

function bestSpotFunction() {
	return minimaxAlgorithm(tableBoard, computerPlayer).index;
}

// Check If Game ended Tie
function checkTieFunction() {
	if (emptyColumnsFunction().length == 0) {
		for (let i = 0; i < columnVaraible.length; i++) {
			columnVaraible[i].removeEventListener('click', turnClickFunction, false);
		}
		document.getElementById("restartButton").style.visibility = "visible";
		declareWinnerFunction("Tie Game")
		return true;
	}
	return false;
}

// Minimax Algorithm Function
function minimaxAlgorithm(newBoard, player) {
	const availSpots = emptyColumnsFunction();
	if (checkWinnerFunction(newBoard, humanPlayer)) {
		return {
			score: -10
		};
	} else if (checkWinnerFunction(newBoard, computerPlayer)) {
		return {
			score: 10
		};
	} else if (availSpots.length === 0) {
		return {
			score: 0
		};
	}
	const moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		const move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		if (player == computerPlayer) {
			let result = minimaxAlgorithm(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			let result = minimaxAlgorithm(newBoard, computerPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	let bestMoveFunction;
	if (player === computerPlayer) {
		let bestScore = -10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMoveFunction = i;
			}
		}
	} else {
		let bestScore = 10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMoveFunction = i;
			}
		}
	}
	return moves[bestMoveFunction];
}

// Background Music Play
let bleep = new Audio();
bleep.src = "files/background_music.mp3";
bleep.loop = true

// Button Click Sound
function PlaySound() {
	bleep.play();
}
let bleep = new Audio();
bleep.src = "files/bleep.wav";

// Stop Audio
function stopAudio() {
    let media = document.getElementsByTagName('audio');
    let i = media.length;
    while (i--) {
		media[i].volume = 0;
	}
}

// Hide restart Button
document.getElementById("restartButton").style.visibility = "hidden";
