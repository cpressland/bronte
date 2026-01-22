const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'bronte.png';

const goalImage = new Image();
goalImage.src = 'pineapple.png';

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

const groundPlatforms = [
  // Ground
  { x: 0, y: 580, width: 230, height: 20 },
  { x: 350, y: 580, width: 230, height: 20 },
  { x: 700, y: 580, width: 80, height: 20 },
];

// Platforms
let platforms;

// Goal
const goal = {
  x: 275,
  y: 50,
  width: 35,
  height: 50
};

function createLevel() {
  const newPlatforms = [];
  // Start with a platform at the bottom
  let lastPlatform = { x: 300, y: 500, width: 100, height: 20 };
  newPlatforms.push(lastPlatform);

  for (let i = 0; i < 9; i++) {
      let newX, newY;
      let attempts = 0;
      do {
          // somewhere between 106-150px left or right of the last platform's center, ensuring a gap larger than player speed
          const xOffset = (Math.random() * 44 + 106) * (Math.random() < 0.5 ? 1 : -1);
          newX = lastPlatform.x + xOffset;
          // somewhere between 50-80px above the last platform
          newY = lastPlatform.y - (Math.random() * 30 + 50);
          attempts++;
      } while (
          // Ensure the new platform is within the canvas bounds
          (newX < 0 || newX + 100 > canvas.width || newY < 0) && attempts < 10
      );
      
      if (attempts < 10) {
          lastPlatform = { x: newX, y: newY, width: 100, height: 20 };
          newPlatforms.push(lastPlatform);
      }
  }
  return newPlatforms;
}

platforms = [
  ...groundPlatforms,
  ...createLevel()
];

function randomizeGoal() {
    const lastPlatform = platforms[platforms.length -1];
    goal.x = lastPlatform.x + (lastPlatform.width / 2) - (goal.width / 2);
    goal.y = Math.max(0, lastPlatform.y - goal.height); // Ensure goal is not off-screen upwards
}

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
  ctx.drawImage(goalImage, goal.x, goal.y, goal.width, goal.height);
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
    player.dx = 0;
    player.dy = 0;
    player.jumping = false;
    player.grounded = true;
    keys.right = false;
    keys.left = false;
    keys.up = false;

    // Generate new level
    platforms = [
      ...groundPlatforms,
      ...createLevel()
    ];
    randomizeGoal();
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
      const previousPlayerBottom = (player.y - player.dy) + player.height;
      if (player.dy >= 0 && previousPlayerBottom <= platform.y) { 
        player.y = platform.y - player.height;
        player.dy = 0;
        player.grounded = true;
        player.jumping = false;
      }
    }
  });

  // Check if player falls off the bottom of the screen
  if (player.y > canvas.height) {
    player.x = 50;
    player.y = 500;
    player.dx = 0;
    player.dy = 0;
    player.jumping = false;
    player.grounded = true;
    keys.right = false;
    keys.left = false;
    keys.up = false;
  }

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

