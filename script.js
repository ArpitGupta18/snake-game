const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;

let snakeBody,
	currentDirection,
	foodPosition,
	playerScore,
	gameSpeed,
	gameInterval,
	hasEatenFood;

// * Event listener for arrow key controls and restart of the game
document.addEventListener("keydown", (e) => {
	const key = e.key;

	if (key === "ArrowLeft" && currentDirection !== "right") {
		currentDirection = "left";
	} else if (key === "ArrowRight" && currentDirection !== "left") {
		currentDirection = "right";
	} else if (key === "ArrowUp" && currentDirection !== "down") {
		currentDirection = "up";
	} else if (key === "ArrowDown" && currentDirection !== "up") {
		currentDirection = "down";
	} else {
		if (!gameInterval) {
			startGame();
		}
	}
});

// * Main game loop
function runGameLoop() {
	updateGameState();
	renderGame();
}

// * Update the game state
function updateGameState() {
	moveSnake();

	if (checkCollision()) {
		clearInterval(gameInterval);
		gameInterval = null;
		alert("Game Over!");
		return;
	}

	if (
		snakeBody[0].x === foodPosition.x &&
		snakeBody[0].y === foodPosition.y
	) {
		processFoodConsumption();
	}

	if (!hasEatenFood) {
		snakeBody.pop();
	} else {
		hasEatenFood = false;
	}
}

// * Render the game elements on the canvas
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// * Draw the snake
	ctx.fillStyle = "#9acd32";
	snakeBody.forEach((segment) => {
		ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
	});

	// * Draw the food on the board
	ctx.fillStyle = "red";
	ctx.fillRect(foodPosition.x, foodPosition.y, cellSize, cellSize);

	// * Draw the score on the board
	ctx.fillStyle = "white";
	ctx.font = "20px Helvetica";
	ctx.fillText(`Score: ${playerScore}`, 10, 25);
}

// * Move the snake in the current direction
function moveSnake() {
	const head = { x: snakeBody[0].x, y: snakeBody[0].y };

	switch (currentDirection) {
		case "right":
			head.x += cellSize;
			break;
		case "left":
			head.x -= cellSize;
			break;
		case "up":
			head.y -= cellSize;
			break;
		case "down":
			head.y += cellSize;
			break;
	}

	snakeBody.unshift(head);
}

// * Check for collisions with the walls or itself
function checkCollision() {
	const head = snakeBody[0];

	if (
		head.x < 0 ||
		head.x >= canvas.width ||
		head.y < 0 ||
		head.y >= canvas.height
	) {
		return true;
	}

	for (let i = 4; i < snakeBody.length; i++) {
		if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
			return true;
		}
	}

	return false;
}

// * Place food at a random position on the canvas
function spawnFood() {
	foodPosition.x =
		Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
	foodPosition.y =
		Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
}

// * Handle the snake eating the food
function processFoodConsumption() {
	playerScore += 1;
	hasEatenFood = true;
	spawnFood();
	adjustDifficulty();
}

// * Adjust game difficulty by increasing speed
function adjustDifficulty() {
	if (playerScore % 5 === 0) {
		gameSpeed -= 10;
		clearInterval(gameInterval);
		gameInterval = setInterval(runGameLoop, gameSpeed);
	}
}

// * Initialize and start the game
function startGame() {
	snakeBody = [{ x: 200, y: 300 }];
	currentDirection = "right";
	foodPosition = { x: 0, y: 0 };
	playerScore = 0;
	gameSpeed = 200;
	// gameInterval;
	hasEatenFood = false;
	spawnFood();
	gameInterval = setInterval(runGameLoop, gameSpeed);
}

startGame();
