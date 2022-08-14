(function () {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const blockSize = 10;
  const widthInBlock = width / blockSize;
  const heightInBlock = height / blockSize;
  let score = 0;

  function drawBorder() {
    ctx.fillStyle = "Grey";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
  }

  function drawScore() {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, blockSize, blockSize);
  }

  function gameOver() {
    playing = false;
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game is over", width / 2, height / 2);
  }

  function Block(col, row) {
    this.col = col;
    this.row = row;
  }

  Block.prototype.drawSquare = function (color) {
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  };

  Block.prototype.drawCircle = function (color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  };

  Block.prototype.equal = function (otherblock) {
    return this.col === otherblock.col && this.row === otherblock.row;
  };

  function circle(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);

    if (fillCircle) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }

  function Snake() {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
    this.direction = "right";
    this.nextDirection = "right";
  }

  Snake.prototype.draw = function () {
    this.segments[0].drawSquare("Black");
    let isEvenSegment = false;

    for (var i = 1; i < this.segments.length; i++) {
      if (isEvenSegment) {
        this.segments[i].drawSquare("Blue");
      } else {
        this.segments[i].drawSquare("Yellow");
      }

      isEvenSegment = !isEvenSegment;
    }
  };

  Snake.prototype.move = function () {
    const head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      animationTime -= 5;
      apple.move(this.segments);
    } else {
      this.segments.pop();
    }
  };

  Snake.prototype.checkCollision = function (head) {
    const leftCollision = head.col === 0;
    const topCollision = head.row === 0;
    const rightCollision = head.col === widthInBlock - 1;
    const downCollision = head.row === heightInBlock - 1;

    const wallCollision =
      leftCollision || topCollision || rightCollision || downCollision;

    let selfCollision = false;

    for (var i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }
    return wallCollision || selfCollision;
  };

  const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    }
    this.nextDirection = newDirection;
  };

  function Apple() {
    this.position = new Block(10, 10);
  }

  Apple.prototype.draw = function () {
    this.position.drawCircle("Limegreen");
  };

  Apple.prototype.move = function (occuipaiedBlock) {
    var randomCol = Math.floor(Math.random() * (widthInBlock - 2)) + 1;
    var randomRaw = Math.floor(Math.random() * (heightInBlock - 2)) + 1;
    this.position = new Block(randomCol, randomRaw);

    for (var i = 0; i < occuipaiedBlock.length; i++) {
      if (this.position.equal(occuipaiedBlock[i])) {
        this.move(occuipaiedBlock);
        return;
      }
    }
  };

  const apple = new Apple();
  const snake = new Snake();

  let playing = true;
  let animationTime = 100;

  function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    if (playing) {
      setTimeout(gameLoop, animationTime);
    }
  }

  gameLoop();

  $("body").keydown(function (event) {
    const newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
      snake.setDirection(newDirection);
    }
  });
})();
