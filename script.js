const NUM_MOVES = 2;
const MIN_WORD_LEN = 3;
const TILE_RACK_SIZE = 7;
const TILE_RACK_SIZE_INIT = 7;
const TILE_RACK_SIZE_MIN = 3;
const TILE_RACK_ADD_ONE = true;
const NUM_TILES = 98;
const NUM_PLAYERS = 2;

const PLAYER_NAMES = [];
const TILES = [];

PLAYER_NAMES.push("HELEN");
PLAYER_NAMES.push("BABY");

TILES.push({letter: "a", points: 1, count: 9});
TILES.push({letter: "b", points: 3, count: 2});
TILES.push({letter: "c", points: 3, count: 2});
TILES.push({letter: "d", points: 2, count: 4});
TILES.push({letter: "e", points: 1, count: 12});
TILES.push({letter: "f", points: 4, count: 2});
TILES.push({letter: "g", points: 2, count: 3});
TILES.push({letter: "h", points: 4, count: 2});
TILES.push({letter: "i", points: 1, count: 9});
TILES.push({letter: "j", points: 8, count: 1});
TILES.push({letter: "k", points: 5, count: 1});
TILES.push({letter: "l", points: 1, count: 4});
TILES.push({letter: "m", points: 3, count: 2});
TILES.push({letter: "n", points: 1, count: 6});
TILES.push({letter: "o", points: 1, count: 8});
TILES.push({letter: "p", points: 3, count: 2});
TILES.push({letter: "q", points: 10, count: 1});
TILES.push({letter: "r", points: 1, count: 6});
TILES.push({letter: "s", points: 1, count: 4});
TILES.push({letter: "t", points: 1, count: 6});
TILES.push({letter: "u", points: 1, count: 4});
TILES.push({letter: "v", points: 4, count: 2});
TILES.push({letter: "w", points: 4, count: 2});
TILES.push({letter: "x", points: 8, count: 1});
TILES.push({letter: "y", points: 4, count: 2});
TILES.push({letter: "z", points: 10, count: 1});

let players = {};
let currPlayerId;
let tileBank = [];
let tileRacks = {};
let words = [];

window.onload = function(){

	document.getElementById('wordInput').onkeydown = function(e) {
	   if(e.keyCode == 13){
	     submitWord();
	   }
	};
	document.getElementById('finishTurn').onclick = finishTurn;
	document.getElementById('reset').onclick = reset;

	gameSetUp();
};

function gameSetUp() {
	let tileCopy;
	for (let i = 0; i < TILES.length; i++) {
		for (let j = 0; j < TILES[i].count; j++) {
			tileCopy = Object.assign({}, TILES[i]);
			delete tileCopy.count;
			tileBank.push(tileCopy);
		}
	}
	
	for (let i = 0; i < NUM_PLAYERS; i++) {
		players[i] = {
			id: i,
			name: PLAYER_NAMES[i],
			score: 0
		}
	}

	currPlayerId = 0;

	for (let i = 0; i < NUM_PLAYERS; i++) {
		tileRacks[i] = [];
		fillTileRack(i, true);
	}

	gameSetupBoard();
	gameSetupBoardTurn();
	console.log("Game Started\n\n");
}

function gameSetupBoard() {

	let className;
	let classElems;
	for (let i = 0; i < NUM_PLAYERS; i++) {
		className = "p".concat(i+1, "Name");
		classElems = document.getElementsByClassName(className);
		for (let j = 0; j < classElems.length; j++) {
			classElems[j].innerHTML = PLAYER_NAMES[i];
		}
	}

	if (NUM_MOVES == 1) {
		document.getElementById("finishTurn").value = "Pass";
	}
}

function gameSetupBoardTurn() {
	document.getElementById("currPlayer").innerHTML = players[currPlayerId].name;
	document.getElementById("currPlayer").setAttribute("class", "currPlayer"+ (currPlayerId + 1));
	document.getElementById("numTilesRemaining").innerHTML = tileBank.length;

	let id;
	for (let i = 0; i < NUM_PLAYERS; i++) {
		id = "p".concat(i+1, "Score");
		document.getElementById(id).innerHTML = players[i].score;

		id = "p".concat(i+1, "TileRack");
		printTileRack(i, id);
	}

	document.getElementById("p" + (currPlayerId + 1) + "TileRack").style.opacity = 1;
	document.getElementById("p" + ((currPlayerId + 1) % NUM_PLAYERS + 1) + "TileRack").style.opacity = 0;

	printWordBoard();
}

function fillTileRack(playerId, firstRack) {
	let tileRack = tileRacks[playerId];
	let rand;
	let tileRackSize = TILE_RACK_SIZE;

	if (firstRack) {
		tileRackSize = TILE_RACK_SIZE_INIT;
	} else if (TILE_RACK_ADD_ONE) {
		if (tileRack.length >= TILE_RACK_SIZE_MIN) {
			tileRackSize = tileRack.length + 1;
		} else {
			tileRackSize = TILE_RACK_SIZE_MIN;
		}
	}

	for (let i = tileRack.length; i < tileRackSize; i++) {

		if (tileBank.length == 0) {
			break;
		}

		rand = Math.floor(Math.random() * tileBank.length);
		tileRack.push(tileBank.splice(rand, 1)[0]);
	}
}

function printTileRack(playerId, elemId) {
	let tileRack = document.getElementById(elemId)
	tileRack.innerHTML = '';

	let tile;
	let tileElem;
	let tileLetterElem;
	let tilePointsElem;
	let spaceElem;

	for (let i = 0; i < tileRacks[playerId].length; i++) {
		tile = tileRacks[playerId][i];

		tileElem = document.createElement("div");
		tileLetterElem = document.createElement("div");
		tilePointsElem = document.createElement("div");
		spaceElem = document.createTextNode(" ");

		tileLetterElem.appendChild(document.createTextNode(tile.letter.toUpperCase()));
		tilePointsElem.appendChild(document.createTextNode(tile.points));

		tileElem.setAttribute("class", "tile");
		tileLetterElem.setAttribute("class", "tileLetter");
		tilePointsElem.setAttribute("class", "tilePoints");

		tileElem.appendChild(tileLetterElem);
		tileElem.appendChild(tilePointsElem);

		tileRack.appendChild(tileElem);
		tileRack.appendChild(spaceElem);
	}

	if (spaceElem) {
		spaceElem.remove();
	}
}

function printWordBoard() {

	let wordBoard = document.getElementById("wordBoard");
	wordBoard.innerHTML = '';

	let tile;
	let tileElem;
	let tileLetterElem;
	let tilePointsElem;
	let spaceElem;
	let newLineElem;

	for (let i = 0; i < words.length; i++) {
		for (let j = 0; j < words[i].length; j++) {
			tile = words[i][j];

			tileElem = document.createElement("div");
			tileLetterElem = document.createElement("div");
			tilePointsElem = document.createElement("div");
			spaceElem = document.createTextNode(" ");

			tileLetterElem.appendChild(document.createTextNode(tile.letter.toUpperCase()));
			tilePointsElem.appendChild(document.createTextNode(tile.points));

			tileElem.setAttribute("class", "tile");
			tileLetterElem.setAttribute("class", "tileLetter");
			tilePointsElem.setAttribute("class", "tilePoints");

			tileElem.appendChild(tileLetterElem);
			tileElem.appendChild(tilePointsElem);

			wordBoard.appendChild(tileElem);
			wordBoard.appendChild(spaceElem);
		}

		newLineElem = document.createElement("br");
		wordBoard.appendChild(newLineElem);
	}

	if (newLineElem) {
		newLineElem.remove();
	}
}

function reset() {
	tileBank = [];
	words = [];
	gameSetUp();

	console.log("Game reset\n\n");
}

function finishTurn() {
	currPlayerId = currPlayerId + 1;
	currPlayerId = currPlayerId % NUM_PLAYERS;

	fillTileRack(currPlayerId, false);
	gameSetupBoardTurn();

	console.log("Finished turn\n\n");	
}

function submitWord() {
	let inputStr = document.getElementById('wordInput').value.toLowerCase();
	let tileRack = tileRacks[currPlayerId];

	document.getElementById('wordInput').value = '';
	console.log("Word: " + inputStr);

	//Exit conditions
	if (tileRack.length == 0) {
		document.getElementById('error').innerHTML = "You have no tiles left!";
		console.log("Invalid - you have no tiles left\n\n");
		return;
	}
	if (inputStr.length == 0) {
		document.getElementById('error').innerHTML = "Word cannot be blank.";
		console.log("Invalid - input is blank\n\n");
		return;
	}
	if(!inputStr.match("^[a-zA-Z]+$")) {
		document.getElementById('error').innerHTML = "Word can only contain letters!";
		console.log("Invalid - contains invalid characters\n\n");
		return;
	}
	if (inputStr.length < MIN_WORD_LEN) {
		document.getElementById('error').innerHTML = "Word has to be " + MIN_WORD_LEN + " letters or more.";
		console.log("Invalid - word has to be at least 3 letters long\n\n");
		return;
	}
	

	let inputMatrix = strToMatrix(inputStr);
	let tileRackMatrix = tilesToMatrix(tileRack);
	let wordsMatrix = words.map(tilesToMatrix);

	// If input contains all letters in existing word + 1 or more letters in player's bank
	let diffMatrix = [];
	for (let i = 0; i < wordsMatrix.length; i++) {
		diffMatrix = matchMatrices(inputMatrix, wordsMatrix[i]);
		if (diffMatrix && matchMatrices(tileRackMatrix, diffMatrix) && inputStr.length > tilesToStr(words[i]).length) {
			validWord(i, inputStr, diffMatrix);
			return;
		}
	}

	// Else If input only contains letters in player's bank
	if (matchMatrices(tileRackMatrix, inputMatrix)) {
		validWord(-1, inputStr, inputMatrix);
		return;
	}

	document.getElementById('error').innerHTML = "Invalid word or letters.";
	console.log("Invalid word\n\n")
}

function validWord(wordIndex, inputStr, diffMatrix) {

	let tileRack = tileRacks[currPlayerId];
	let newWord = Array(inputStr.length);
	let wordTiles = words[wordIndex];

	let sum = 0;
	let multiplier = 1;
	let wordScore = 0;

	let isNewWord = false;

	if (wordIndex == -1) {
		isNewWord = true;
		words.push(Array(inputStr.length));
		wordIndex = words.length - 1;
		wordTiles = [];
	}

	let index;

	for (let i = wordTiles.length - 1; i >= 0; i--) {
		index = inputStr.indexOf(wordTiles[i].letter);
		if (index > -1) {
			newWord[index] = wordTiles[i];
			wordTiles.splice(i, 1);
			inputStr = inputStr.substr(0, index) + "~" + inputStr.substr(index + 1);

			sum = sum + newWord[index].points;
		}
	}

	for (let i = tileRack.length - 1; i >= 0; i--) {
		index = inputStr.indexOf(tileRack[i].letter);
		if (index > -1) {
			newWord[index] = tileRack[i];
			tileRack.splice(i, 1);
			inputStr = inputStr.substr(0, index) + "~" + inputStr.substr(index + 1);

			sum = sum + newWord[index].points;
			multiplier = multiplier + 1;
		}
	}

	words[wordIndex] = newWord;
	if (isNewWord) {
		wordScore = sum;
	} else {
		wordScore = sum * multiplier;
	}
	players[currPlayerId].score = players[currPlayerId].score + wordScore;

	gameSetupBoardTurn();

	if (NUM_MOVES == 1) {
		finishTurn();
	}

	document.getElementById('error').innerHTML = "";

	console.log("Word score: " + wordScore);
	console.log("Valid word!\n\n")
}

function tilesToStr(tiles) {
	let str = "";

	for (let i = 0; i < tiles.length; i++) {
		str = str + tiles[i].letter;
	}

	return str;
}

function strToMatrix(str) {
	let matrix = [];

    for (let i = 0; i < 26; i++) {
      matrix[i] = 0;
    }

    for (let i = 0; i < str.length; i++) {
      matrix[str.charCodeAt(i) - 97] += 1;
    }

    return matrix;
}

function tilesToMatrix(tiles) {
	return strToMatrix(tilesToStr(tiles));
}

function matchMatrices(longMatrix, shortMatrix) {
	let diffMatrix = [];

	for (let i = 0; i < 26; i++) {
		diffMatrix.push(longMatrix[i] - shortMatrix[i]);
		if (diffMatrix[i] < 0) {
			return false;
		}
	}

	return diffMatrix;
}