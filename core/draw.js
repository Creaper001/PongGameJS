class $Draw {
  constructor(mainID = "pong") {
    this.main = document.getElementById(mainID);
    this.createCanvas();
    this.positions = [0, 0];

    this.ball = {
      position: [this.canvas.width / 2, this.canvas.height / 2],
      move: [0, 1],
    };
  }
  createBall([x, y]) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, 20, 20);
    this.ctx.fill();
  }
  ballCollision(top) {
    const { position, move } = this.ball;
    const x = this.positions[top ? 1 : 0];
    const check = top
      ? position[1] <= 30
      : position[1] >= this.main.offsetHeight - 50;

    console.log(top, position[1], this.main.offsetHeight - 50)
    if (position[0] > x && position[0] < x + 190 && check) {
      move[1] = top ? +1 : -1;
      if (position[0] > x + 100) {
        move[0] = (position[0] - x) / 100;
      } else if (position[0] < x + 90) {
        move[0] = -(position[0] - x) / 100;
      }
    }
  }
  end() {
    this.createCanvas();
    this.ball = {
      position: [this.canvas.width / 2, this.canvas.height / 2],
      move: [0, 1],
    };
  }
  wallCollision() {
    const { position, move } = this.ball;
    const width = this.main.offsetWidth;
    const height = this.main.offsetHeight;

    if (position[0] >= width - 20) move[0] = -1;
    else if (position[0] <= 0) move[0] = 1;

    if (position[1] >= height - 20) {
      alert("Loses");
      this.end();
    } else if (position[1] <= 0) {
      alert("Wins");
      this.end();
    }
  }
  moveBall() {
    this.ball.position[0] += this.ball.move[0] * 2;
    this.ball.position[1] += this.ball.move[1] * 2;
    this.ballCollision(this.ball.move[1] > 0 ? false : true);
    this.wallCollision();
  }
  createCanvas() {
    this.main.innerHTML = null;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.main.offsetWidth;
    this.canvas.height = this.main.offsetHeight;
    this.main.appendChild(this.canvas);
  }
  createRectangle(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, 190, 30);
    this.ctx.fill();
  }
  setPlayer(x, top) {
    const height = this.main.offsetHeight - 30;
    this.createRectangle(x, top ? 0 : height);
  }
  setPlayers([x1, x2]) {
    this.setPlayer(x1, false);
    this.setPlayer(x2, true);
  }
  cleanCanvas() {
    this.ctx.clearRect(0, 0, this.main.offsetWidth, this.main.offsetHeight);
  }
  checkCollision(positions, lastPositions) {
    return positions.map((x, index) => {
      const width = this.main.offsetHeight + this.main.offsetLeft;
      if (x > width || x < 0) return lastPositions[index];
      return x;
    });
  }
  frameByFrame(callback, fps = 60) {
    setInterval(() => {
      this.cleanCanvas();

      const newPositions = callback(this.positions);
      this.positions = this.checkCollision(newPositions, this.positions);
      this.moveBall();

      this.createBall(this.ball.position);
      this.setPlayers(this.positions);
    }, 1000 / fps);
  }
}
