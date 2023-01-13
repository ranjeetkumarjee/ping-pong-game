const ball = document.getElementById("ball");
const rod1 = document.getElementById("BluRaptor");
const rod2 = document.getElementById("YellooRaptor");

const _name = "_name";
const _score = "_score";
const bluRaptor = "Blu-Raptor";
const yellooRaptor = "Yelloo-Raptor";

let score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 2,
  ballSpeedY = 2,
  rod1X,
  rod2X,
  gameOn = false,
  windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;

(function () {
  rod = localStorage.getItem(_name);
  maxScore = localStorage.getItem(_score);
  if (rod === "null" || maxScore === "null") {
    alert("LET'S START YOUR FIRST GAME");
    maxScore = 0;
    rod = "Blu-Raptor";
  } else {
    alert(rod + " has maximum score of " + maxScore);
  }
  resetBoard(rod);
})();

function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";
  // Lossing player gets the ball
  if (rodName === yellooRaptor) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ballSpeedY = 2;
  } else if (rodName === bluRaptor) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ballSpeedY = -2;
  }
  score = 0;
  gameOn = false;
  localStorage.clear();
}

function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(_name, rod);
    localStorage.setItem(_score, maxScore);
  }
  clearInterval(movement);
  resetBoard(rod);
  alert(rod + " wins with a score of " + score + ". Max score is: " + maxScore);
}

window.addEventListener("keydown", function (event) {
  let rodSpeed = 22;
  let rodRect = rod1.getBoundingClientRect();
  if (gameOn) {
    if (
      (event.code === "KeyD" || event.code === "ArrowRight") &&
      rodRect.x + rodRect.width < window.innerWidth
    ) {
      rod1.style.left = rodRect.x + rodSpeed + "px";
      rod2.style.left = rod1.style.left;
    } else if (
      (event.code === "KeyA" || event.code === "ArrowLeft") &&
      rodRect.x > 0
    ) {
      rod1.style.left = rodRect.x - rodSpeed + "px";
      rod2.style.left = rod1.style.left;
    }
  }
  if (event.code === "Enter" || event.code === "Space") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;
      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;
      movement = setInterval(() => {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        rod1X = rod1.getBoundingClientRect().x;
        rod2X = rod2.getBoundingClientRect().x;
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX; // Reverse the direction
        }
        // It specifies the center of the ball on the viewport
        let ballPos = ballX + ballDia / 2;
        // Check for Rod 1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;
          // Check if the game ends
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeWin(yellooRaptor, score);
          }
        }
        // Check for Rod 2
        else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;
          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeWin(bluRaptor, score);
          }
        }
      }, 10);
    }
  }
});
