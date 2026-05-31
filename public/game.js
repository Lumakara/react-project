// Snake Game Logic - Fakhul Rohman

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Synthesis System (Web Audio API) ---
  class GameSFX {
    constructor() {
      this.audioCtx = null;
    }
    
    init() {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }
    
    playClick() {
      try {
        this.init();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.05);
      } catch {
        /* AudioContext may not be supported or initialized */
      }
    }
    
    playEat() {
      try {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.08); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.08);
      } catch {
        /* AudioContext may not be supported or initialized */
      }
    }
    
    playCrash() {
      try {
        this.init();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.35);
      } catch {
        /* AudioContext may not be supported or initialized */
      }
    }
  }

  const sfx = new GameSFX();

  // --- Game Elements & DOM Refs ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  const currentScoreEl = document.getElementById('currentScore');
  const snakeLengthEl = document.getElementById('snakeLength');
  const highScoreEl = document.getElementById('highScore');
  const bestLengthEl = document.getElementById('bestLength');
  const gameLevelEl = document.getElementById('gameLevel');
  const gameStatusEl = document.getElementById('gameStatus');
  const finalScoreEl = document.getElementById('finalScore');
  
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const quitBtn = document.getElementById('quitBtn');
  const playAgainBtn = document.getElementById('playAgainBtn');
  
  const gameOverModal = document.getElementById('gameOverModal');
  const pauseModal = document.getElementById('pauseModal');
  const newHighScoreNotice = document.getElementById('newHighScore');

  // --- Game Configuration & Constants ---
  const GRID_SIZE = 20;
  const TILE_COUNT_X = canvas.width / GRID_SIZE; // 30
  const TILE_COUNT_Y = canvas.height / GRID_SIZE; // 20

  // --- Game State Variables ---
  let snake = [];
  let food = { x: 0, y: 0 };
  let direction = 'right';
  let nextDirection = 'right';
  let score = 0;
  let highScore = parseInt(localStorage.getItem('snake_high_score') || '0', 10);
  let bestLength = parseInt(localStorage.getItem('snake_best_length') || '1', 10);
  let level = 1;
  let gameInterval = null;
  let isPlaying = false;
  let isPaused = false;
  let isGameOver = false;

  // Initialize display
  highScoreEl.textContent = highScore;
  bestLengthEl.textContent = bestLength;

  // --- Game Functions ---
  
  function startGame() {
    sfx.playClick();
    if (gameInterval) clearInterval(gameInterval);
    
    // Reset state
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    level = 1;
    isGameOver = false;
    isPaused = false;
    isPlaying = true;
    
    spawnFood();
    updateUI();
    
    gameOverModal.classList.add('hidden');
    pauseModal.classList.add('hidden');
    startBtn.classList.add('hidden');
    
    gameStatusEl.textContent = "Playing";
    gameStatusEl.className = "text-lg font-medium text-green-500";
    
    runGameLoop();
  }

  function runGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    // Base speed: 130ms, speeds up by 8ms per level down to 50ms min
    const speed = Math.max(130 - (level - 1) * 8, 50);
    gameInterval = setInterval(gameStep, speed);
  }

  function gameStep() {
    if (isPaused || isGameOver) return;
    
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    
    switch (direction) {
      case 'up': head.y -= 1; break;
      case 'down': head.y += 1; break;
      case 'left': head.x -= 1; break;
      case 'right': head.x += 1; break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= TILE_COUNT_X || head.y < 0 || head.y >= TILE_COUNT_Y) {
      handleGameOver();
      return;
    }
    
    // Check self-collision
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        handleGameOver();
        return;
      }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if eating food
    if (head.x === food.x && head.y === food.y) {
      sfx.playEat();
      score += 10;
      level = Math.floor(score / 50) + 1;
      spawnFood();
      updateUI();
      runGameLoop(); // Adjust interval speed for new level
    } else {
      // Remove tail segment
      snake.pop();
    }
    
    drawGame();
  }

  function spawnFood() {
    let newFoodPos;
    let onSnake = true;
    
    while (onSnake) {
      newFoodPos = {
        x: Math.floor(Math.random() * TILE_COUNT_X),
        y: Math.floor(Math.random() * TILE_COUNT_Y)
      };
      
      onSnake = false;
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newFoodPos.x && snake[i].y === newFoodPos.y) {
          onSnake = true;
          break;
        }
      }
    }
    
    food = newFoodPos;
  }

  function drawGame() {
    // Clear canvas with a nice grid effect representation
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw pulsing glowing Food
    const foodTime = Date.now() * 0.005;
    const pulseOffset = Math.sin(foodTime) * 2;
    const foodRadius = (GRID_SIZE / 2 - 2) + pulseOffset;
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    
    // Apple color
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      Math.max(4, foodRadius),
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw tiny green leaf
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(
      food.x * GRID_SIZE + GRID_SIZE / 2 + 3,
      food.y * GRID_SIZE + GRID_SIZE / 2 - 6,
      2, 4, Math.PI / 4, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw Snake with premium gradients and textures
    snake.forEach((segment, idx) => {
      const isHead = idx === 0;
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
      ctx.shadowBlur = isHead ? 10 : 0;
      ctx.shadowColor = isHead ? '#3b82f6' : 'transparent';
      
      // Gradient fill for sleek snake texture
      const grad = ctx.createLinearGradient(x, y, x + GRID_SIZE, y + GRID_SIZE);
      if (isHead) {
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(1, '#8b5cf6');
      } else {
        // Stagger gradient colors down the body
        const ratio = idx / snake.length;
        grad.addColorStop(0, ratio < 0.5 ? '#10b981' : '#06d6a0');
        grad.addColorStop(1, ratio < 0.5 ? '#059669' : '#0891b2');
      }
      
      ctx.fillStyle = grad;
      
      // Draw rounded segment blocks
      const cornerRadius = isHead ? 6 : 4;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, cornerRadius);
      ctx.fill();
      
      // Draw details like snake eyes on head
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        
        let eye1 = { x: 0, y: 0 };
        let eye2 = { x: 0, y: 0 };
        
        switch (direction) {
          case 'right':
            eye1 = { x: x + 13, y: y + 5 };
            eye2 = { x: x + 13, y: y + 15 };
            break;
          case 'left':
            eye1 = { x: x + 7, y: y + 5 };
            eye2 = { x: x + 7, y: y + 15 };
            break;
          case 'up':
            eye1 = { x: x + 5, y: y + 7 };
            eye2 = { x: x + 15, y: y + 7 };
            break;
          case 'down':
            eye1 = { x: x + 5, y: y + 13 };
            eye2 = { x: x + 15, y: y + 13 };
            break;
        }
        
        // White pupils
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, 2.5, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Black pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, 1.2, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function updateUI() {
    currentScoreEl.textContent = score;
    snakeLengthEl.textContent = snake.length;
    gameLevelEl.textContent = level;
  }

  function handleGameOver() {
    sfx.playCrash();
    isGameOver = true;
    isPlaying = false;
    clearInterval(gameInterval);
    
    finalScoreEl.textContent = score;
    
    // Handle High Scores
    let isNewHigh = false;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snake_high_score', highScore);
      highScoreEl.textContent = highScore;
      isNewHigh = true;
    }
    
    if (snake.length > bestLength) {
      bestLength = snake.length;
      localStorage.setItem('snake_best_length', bestLength);
      bestLengthEl.textContent = bestLength;
    }
    
    if (isNewHigh) {
      newHighScoreNotice.classList.remove('hidden');
    } else {
      newHighScoreNotice.classList.add('hidden');
    }
    
    gameOverModal.classList.remove('hidden');
    
    gameStatusEl.textContent = "Game Over";
    gameStatusEl.className = "text-lg font-medium text-red-500";
  }

  function togglePause() {
    if (!isPlaying || isGameOver) return;
    sfx.playClick();
    
    isPaused = !isPaused;
    
    if (isPaused) {
      pauseModal.classList.remove('hidden');
      gameStatusEl.textContent = "Paused";
      gameStatusEl.className = "text-lg font-medium text-blue-500";
    } else {
      pauseModal.classList.add('hidden');
      gameStatusEl.textContent = "Playing";
      gameStatusEl.className = "text-lg font-medium text-green-500";
    }
  }

  // --- Keyboard Control Hook ---
  window.addEventListener('keydown', (e) => {
    if (!isPlaying || isPaused || isGameOver) return;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction !== 'down') nextDirection = 'up';
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'up') nextDirection = 'down';
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'right') nextDirection = 'left';
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'left') nextDirection = 'right';
        e.preventDefault();
        break;
      case ' ': // Space bar pauses
        togglePause();
        e.preventDefault();
        break;
    }
  });

  // --- Mobile Touch / Control Buttons ---
  document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!isPlaying || isPaused || isGameOver) return;
      sfx.playClick();
      const dir = e.currentTarget.getAttribute('data-direction');
      
      switch (dir) {
        case 'up':
          if (direction !== 'down') nextDirection = 'up';
          break;
        case 'down':
          if (direction !== 'up') nextDirection = 'down';
          break;
        case 'left':
          if (direction !== 'right') nextDirection = 'left';
          break;
        case 'right':
          if (direction !== 'left') nextDirection = 'right';
          break;
      }
    });
  });

  // --- Button Event Listeners ---
  startBtn.addEventListener('click', startGame);
  
  pauseBtn.addEventListener('click', togglePause);
  
  restartBtn.addEventListener('click', () => {
    sfx.playClick();
    startGame();
  });
  
  resumeBtn.addEventListener('click', togglePause);
  
  quitBtn.addEventListener('click', () => {
    sfx.playClick();
    window.location.href = 'index.html';
  });
  
  playAgainBtn.addEventListener('click', startGame);

  // Initial draw
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Press "Start Game" to Play!', canvas.width / 2, canvas.height / 2);
});
