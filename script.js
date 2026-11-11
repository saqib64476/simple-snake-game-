
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let food = {};
let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let gameOver = false;
let gameLoop;

// Generate random food
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };

    // Don't place food inside the snake
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        generateFood();
    }
}

// Draw snake
function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#00ff66" : "#00aa44";
        ctx.fillRect(part.x, part.y, box - 2, box - 2);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box - 2, box - 2);
}

// Main game function
function updateGame() {

    if (gameOver) return;

    direction = nextDirection;

    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        endGame();
        return;
    }

    // Check if food is eaten
    let ateFood = head.x === food.x && head.y === food.y;

    // Check collision with snake
    let body = ateFood ? snake : snake.slice(0, -1);

    if (body.some(part => part.x === head.x && part.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (ateFood) {
        score++;
        document.getElementById("score").textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Draw game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

// Keyboard controls
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp" && direction !== "DOWN") {
        nextDirection = "UP";
    }

    if (event.key === "ArrowDown" && direction !== "UP") {
        nextDirection = "DOWN";
    }

    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        nextDirection = "LEFT";
    }

    if (event.key === "ArrowRight" && direction !== "LEFT") {
        nextDirection = "RIGHT";
    }
});

// Game over
function endGame() {
    gameOver = true;
    clearInterval(gameLoop);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);

    ctx.font = "16px Arial";
    ctx.fillText("Click Restart to play again", canvas.width / 2, canvas.height / 2 + 35);
}

// Restart game
function restartGame() {
    clearInterval(gameLoop);

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    gameOver = false;

    document.getElementById("score").textContent = score;

    generateFood();
    drawGame();

    gameLoop = setInterval(updateGame, 120);
}

document.getElementById("restartBtn").addEventListener("click", restartGame);

// Start game
restartGame();
