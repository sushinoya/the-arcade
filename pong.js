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

//Getting the Canvas element with the id 'pong'
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

//Constructing a ball which is an object of the Ball class (which in turn
//inherits from the rectangle class)
const ball = new Ball;

//Defining the velocity of the ball by default.
ball.velocity.x = 100;
ball.velocity.y = 100;

let lastTime;

//This function calls requestAnimationFrame recursively to animate according to
//updated positions
function callback(milliseconds) {
  if (lastTime) {
    secondSinceLastRefresh = (milliseconds - lastTime) / 1000;
    updatePosition(secondSinceLastRefresh);
  }
  lastTime = milliseconds;
  requestAnimationFrame(callback);
}

//This function allows updating the position of the ball with respect to time.
// Distance = Speed x Time
function updatePosition(time) {
  ball.position.x += ball.velocity.x * time;
  ball.position.y += ball.velocity.y * time;

  //Preventing ball form moving out of the canvas; i.e, simulating bouncing off
  //the walls. If the ball touches the edge of the canvas, invert the velocity.
  if (ball.left < 0 || ball.right > canvas.width) {
    ball.velocity.x = - ball.velocity.x;
  }

  if (ball.top < 0 || ball.bottom > canvas.height) {
    ball.velocity.y = - ball.velocity.y;
  }

  //Filling the entire width x height of the canvas with a black background
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //Drawing a white ball
  context.fillStyle = '#fff';
  context.fillRect(ball.position.x, ball.position.y, ball.size.x, ball.size.y);
}

callback();
