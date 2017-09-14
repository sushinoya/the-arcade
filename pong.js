// A vector class to handle coordinates and velocity.
class Vector {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  //Get the resultant vector magnitde: hypotenuse of the vector triangle
  get resultant() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  //Set the resultant vector magnitde
  set resultant(value) {
    const fact = value / this.resultant;
    this.x *= fact;
    this.y *= fact;
  }
}

// A class to aid in defining rectangles
class Rectangle {
  constructor (width = 0, height = 0) {
    this.position = new Vector(0, 0);
    this.size = new Vector(width, height);
  }

  //Getter methods for the exact position of the left, right, top and bottom
  //edges of the rectangle.
  get left() {
    return this.position.x - (this.size.x / 2);
  }

  get right() {
    return this.position.x + (this.size.x / 2);
  }

  get top() {
    return this.position.y - (this.size.y / 2);
  }

  get bottom() {
    return this.position.y + (this.size.y / 2);
  }

}

class Ball extends Rectangle {
  constructor () {
    super (10, 10)
    this.velocity = new Vector;
  }
}

class Player extends Rectangle {
  constructor () {
    super (20, 100)
    this.score = 0;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.count = 0


    //Constructing a ball which is an object of the Ball class (which in turn
    //inherits from the rectangle class)
    this.ball = new Ball;

    //Constructing two Players which are objects of the Player class (which in turn
    //inherits from the rectangle class)
    this.players = [new Player, new Player];

    //Defining the default position of the ball.
    this.players[0].position.x = 40;
    this.players[0].position.y = this.canvas.height / 2;
    this.players[1].position.x = this.canvas.width - 40;
    this.players[1].position.y = this.canvas.height / 2;

    let lastTime;
    //This function calls requestAnimationFrame recursively to animate according to
    //updated positions
    const callback = (milliseconds) => {
      if (lastTime) {
        let secondsSinceLastRefresh = (milliseconds - lastTime) / 1000;
        this.updatePosition(secondsSinceLastRefresh);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    };
    callback();

    //We make an array of canvases representing different digits for displaying score
    this.CHAR_PIXEL = 10;
    this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
          ].map(str => {
            const canvas = document.createElement('canvas');
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';

            str.split('').forEach((fill, i) => {
              if (fill === '1') {
                context.fillRect(
                    (i % 3) * this.CHAR_PIXEL,
                    (i / 3 | 0) * this.CHAR_PIXEL,
                    this.CHAR_PIXEL,
                    this.CHAR_PIXEL);
              }
            });
            return canvas;
          });


    //Initialises the position and velocity of the ball
    this.resetGame();
  }

 //This function changes the vertical component of the ball's velocity on collision
 //with a player
  onCollision(player, ball) {
    //Checks for collision
    if (player.left < ball.right && player.right > ball.left &&
        player.top < ball.bottom && player.bottom > ball.top) {

          const speed = ball.velocity.resultant;

          //Change horizontal direction
          ball.velocity.x = -ball.velocity.x;

          //Increase Ball's speed
          ball.velocity.resultant *= 1.05;
    }

  }

  //Setting up the canvas
  drawCanvas() {
    //Filling the entire width x height of the canvas with a black background
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawRectangle(this.ball);
    this.players.forEach(player => this.drawRectangle(player))
  }

  drawScore() {
    const align = this.canvas.width / 3;
    const CHAR_WIDTH = this.CHAR_PIXEL * 4
    this.players.forEach((player, index) => {
      const chars = player.score.toString().split('');
      const offset = align * (index + 1) - (CHAR_WIDTH * chars.length / 2) *
                     this.CHAR_PIXEL / 2;
     chars.forEach((char, pos) => {
       this.context.drawImage(this.CHARS[char | 0],
                              offset + position * CHAR_WIDTH);
     });
   });
  }

  //For drawing a white ball
  drawRectangle(rectangle) {
    this.context.fillStyle = '#fff';
    this.context.fillRect(rectangle.left, rectangle.top,
                          rectangle.size.x, rectangle.size.y);
  }

  resetGame() {
    //Defining the default velocity to be stationary.
    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;

    //Defining the default position of the ball.
    this.ball.position.x = this.canvas.width / 2;
    this.ball.position.y = this.canvas.height / 2;
  }

  startGame() {
    if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {

      //Randomly moves to either of the players (ternary operation)
      this.ball.velocity.x = 300 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.velocity.y = 300 * Math.random();

      //Sets the velocity constant irregardless of the random direction the
      //balls moves in.
      this.ball.velocity.resultant = 200;
    }
  }

  //This function allows updating the position of the ball with respect to time.
  // Distance = Speed x Time
  updatePosition(time) {
    this.ball.position.x += this.ball.velocity.x * time;
    this.ball.position.y += this.ball.velocity.y * time;

    //Preventing ball form moving out of the canvas; i.e, simulating bouncing off
    //the walls. If the ball touches the edge of the canvas, invert the velocity.
    if (this.ball.left < 0 || this.ball.right > this.canvas.width) {

      //If the direction of the ball is left, player one gets the score and if left
      //player two (zero here) gets the score
      const playerId = this.ball.velocity.x < 0 | 0
      this.players[playerId].score++;
      this.resetGame();
    }

    if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
      this.ball.velocity.y = - this.ball.velocity.y;
    }

    //The COM player follows the y-coordinate of the ball exactly
    this.players[1].position.y = this.ball.position.y;

    this.players.forEach(player => this.onCollision(player, this.ball));

    this.drawCanvas();
  }

}

//Getting the Canvas element with the id 'pong'
const canvas = document.getElementById('pong');
const game = new Game(canvas);

//Add mouse interaction
canvas.addEventListener('mousemove', event => {
  game.players[0].position.y = event.offsetY;
});

//Start game on click
canvas.addEventListener('click', event => {
  game.startGame();
});
