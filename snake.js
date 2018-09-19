// Constants
const canvasBorderColor = "#000000";
const canvasBackgroundColor = "#ffffff";
const snakeColor = "#90ee90";
const snakeBorderColor = "#006400";
const foodColor = "#ff0000";
const foodBorderColor = "#8b0000";
var foodX = 0;
var foodY = 0;

// Get Elements
var gameCanvas = document.getElementById("game-canvas");

// Return a 2D dimensional drawing context
var ctx = gameCanvas.getContext("2d");

// Setting colors of the game screen
ctx.fillStyle = canvasBackgroundColor;
ctx.strokestyle = canvasBorderColor;

//Draw a filled rectangle & border to cover the canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
ctx.strokeRect(0,0, gameCanvas.width, gameCanvas.height);

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];

let score = 0;

//Velocity
let dx = 10;
let dy = 0;

//Draw the snake
createFood();
main();

function clearCanvas() {
    // Setting colors of the game screen
    ctx.fillStyle = canvasBackgroundColor;
    ctx.strokestyle = canvasBorderColor;

    //Draw a filled rectangle & border to cover the canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0,0, gameCanvas.width, gameCanvas.height);
};

function drawSnakePart(snakePart) {
    // Set the color of the snake
    ctx.fillStyle = snakeColor;
    ctx.strokestyle = snakeBorderColor;

    // Draw the filled section of the snake
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

// Function to handle player input
function changeDirection(event) {
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    //The and statements are to make sure they cannot go in the same direction
    if (keyPressed === leftKey && !goingRight) {
        dx = -10;
        dy = 0;
    };
    if (keyPressed === upKey && !goingDown) {
        dx = 0;
        dy = -10;
    };
    if (keyPressed === rightKey && !goingLeft) {
        dx = 10;
        dy = 0;
    };
    if (keyPressed === downKey && !goingUp) {
        dx = 0;
        dy = 10;
    }
};

// Loop through and draw each segment of the snake
function drawSnake() {
    snake.forEach(drawSnakePart);
};

//Move the snake on the screen
function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}
    snake.unshift(head);

    const didEatFood = snake [0].x === foodX && snake[0].y === foodY;
    if (didEatFood){
        score += 10;
        document.getElementById("score").innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
};

//Getting food for the snake
function randomTen (min, max) {
    return Math.round((Math.random() * (max-min) + min) /10) * 10;
}
function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        if (part.x == foodX && part.y == foodY){
            createFood();
        };
    });
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.strokestyle = foodBorderColor;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
};

// This is to keep the snake moving, the guts of the game
function main() {
    if (didGameEnd()) {
        return;
    }
    setTimeout(function onTick() {
        //Clears the canvas to get rid of the old snake
        clearCanvas();
        // Draws new food for the player
        drawFood();
        //Moves the Snake forward
        advanceSnake();
        //Draws the new snake with the new vectors
        drawSnake();
        //Call main again to keep up velocity
        main();
    }, 80)
};

//Determines if the game ends
function didGameEnd() {
    for (var i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide){
            return true;
        };
    };
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
};

// This is for player input
document.addEventListener("keydown", changeDirection);