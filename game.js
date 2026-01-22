const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'bronte.png';

// Player
const player = {
  x: 50,
  y: 500,
  width: 100,
  height: 80,
  dx: 0,
  dy: 0,
  speed: 5,
  jumping: false,
  grounded: false
};

// Keyboard input
const keys = {
  right: false,
  left: false,
  up: false
};

// Platforms
const platforms = [
  // Ground
  { x: 0, y: 580, width: 250, height: 20 },
  { x: 350, y: 580, width: 250, height: 20 },
  { x: 700, y: 580, width: 100, height: 20 },

  // Floating platforms
  { x: 150, y: 500, width: 100, height: 20 },
  { x: 300, y: 420, width: 100, height: 20 },
  { x: 450, y: 340, width: 100, height: 20 },
  { x: 600, y: 260, width: 100, height: 20 },
  { x: 450, y: 180, width: 100, height: 20 },
  { x: 250, y: 100, width: 100, height: 20 },
];

// Goal
const goal = {
  x: 275,
  y: 50,
  width: 50,
  height: 50,
  color: 'yellow'
};

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = 'brown';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawGoal() {
  ctx.fillStyle = goal.color;
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    keys.right = true;
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    keys.left = true;
  }
  if (e.key === 'ArrowUp' || e.key === 'w') {
    keys.up = true;
  }
}

function keyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    keys.right = false;
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    keys.left = false;
  }
  if (e.key === 'ArrowUp' || e.key === 'w') {
    keys.up = false;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function checkWinCondition() {
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    alert('You Win!');
    // Reset player position
    player.x = 50;
    player.y = 500;
  }
}

function update() {
  // Handle horizontal movement
  if (keys.right) {
    player.dx = player.speed;
  }
  else if (keys.left) {
    player.dx = -player.speed;
  }
  else {
    player.dx = 0;
  }

  // Handle jumping
  if (keys.up && !player.jumping && player.grounded) {
    player.dy = -10;
    player.jumping = true;
    player.grounded = false;
  }

  // Apply gravity
  player.dy += 0.5;

  // Update player position
  player.x += player.dx;
  player.y += player.dy;

  // Prevent player from going off screen
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Collision detection
  player.grounded = false;
  platforms.forEach(platform => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y
    ) {
      // Collision detected, but only stop if falling
      if (player.dy > 0) {
        player.y = platform.y - player.height;
        player.dy = 0;
        player.grounded = true;
        player.jumping = false;
      }
    }
  });


  clearCanvas();
  drawPlatforms();
  drawGoal();
  drawPlayer();
  checkWinCondition();
  requestAnimationFrame(update);
}

playerImage.onload = () => {
  update();
};

