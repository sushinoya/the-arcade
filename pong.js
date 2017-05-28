// A vector class to handle coordinates and velocity.
class Vector {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

// A class to aid in defining rectangles
class Rectangle {
  constructor (width, height) {
    this.position = new Vector;
    this.size = new Vector(width, height);
  }

  //Getter methods for the exact position of the left, right, top and bottom
  //edges of the rectangle.
  get left() {
    return this.position.x - this.size.x / 2;
  }

  get right() {
    return this.position.x + this.size.x / 2;
  }

  get top() {
    return this.position.y - this.size.y / 2;
  }

  get bottom() {
    return this.position.y + this.size.y / 2;
  }

}

class Ball extends Rectangle {
  constructor () {
    super (10, 10)
    this.velocity = new Vector;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    //Constructing a ball which is an object of the Ball class (which in turn
    //inherits from the rectangle class)
    this.ball = new Ball;

    //Defining the velocity of the ball by default.
    this.ball.velocity.x = 100;
    this.ball.velocity.y = 100;

    let lastTime;
    //This function calls requestAnimationFrame recursively to animate according to
    //updated positions
    const callback = (milliseconds) => {
      if (lastTime) {
        var secondsSinceLastRefresh = (milliseconds - lastTime) / 1000;
        this.updatePosition(secondsSinceLastRefresh);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    };
    callback();
  }

  //This function allows updating the position of the ball with respect to time.
  // Distance = Speed x Time
  updatePosition(time) {
    this.ball.position.x += this.ball.velocity.x * time;
    this.ball.position.y += this.ball.velocity.y * time;

    //Preventing ball form moving out of the canvas; i.e, simulating bouncing off
    //the walls. If the ball touches the edge of the canvas, invert the velocity.
    if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
      this.ball.velocity.x = - this.ball.velocity.x;
    }

    if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
      this.ball.velocity.y = - this.ball.velocity.y;
    }

    //Filling the entire width x height of the canvas with a black background
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //Drawing a white ball
    this.context.fillStyle = '#fff';
    this.context.fillRect(this.ball.position.x, this.ball.position.y, this.ball.size.x, this.ball.size.y);
  }

}


//Getting the Canvas element with the id 'pong'
const canvas = document.getElementById('pong');
const game = new Game(canvas);
