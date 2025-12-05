/* ============================================
   SNAKE GAME CACHÉ - ACTIVATION SECRÈTE
   Style rétro gaming époustouflant
   ============================================ */

// État du jeu
let snakeGame = {
  canvas: null,
  ctx: null,
  gridSize: 20,
  tileCount: 30,
  snake: [{ x: 15, y: 15 }],
  food: { x: 10, y: 10 },
  dx: 0,
  dy: 0,
  score: 0,
  highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  isPlaying: false,
  gameLoop: null,
  isVisible: false,
  speed: 150
};

// Séquence d'activation secrète (Konami code modifié : NIRD)
const secretCode = ['n', 'i', 'r', 'd'];
let codeSequence = [];
let snakeGameInitialized = false;

// Détecter la séquence secrète (doit être global)
function checkSecretCode(key) {
  codeSequence.push(key.toLowerCase());
  if (codeSequence.length > secretCode.length) {
    codeSequence.shift();
  }
  
  // Debug (à retirer en production)
  console.log('Code sequence:', codeSequence.join(''));
  
  if (codeSequence.join('') === secretCode.join('')) {
    console.log('Code secret activé !');
    activateSnakeGame();
    codeSequence = [];
  }
}

// Écouter les touches globalement pour le code secret
document.addEventListener('keydown', function(e) {
  // Ignorer si on est dans un input ou textarea
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  
  // Vérifier le code secret
  checkSecretCode(e.key);
  
  // Si le jeu est visible, gérer les contrôles
  if (snakeGame.isVisible && snakeGame.isPlaying) {
    handleSnakeKeyPress(e);
  }
});

// Initialiser le jeu Snake
function initSnakeGame() {
  if (snakeGameInitialized) return;
  snakeGameInitialized = true;
  // Créer le conteneur du jeu
  const gameContainer = document.createElement('div');
  gameContainer.id = 'snake-game-container';
  gameContainer.className = 'snake-game-hidden';
  document.body.appendChild(gameContainer);

  // Créer le canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'snake-canvas';
  canvas.width = snakeGame.tileCount * snakeGame.gridSize;
  canvas.height = snakeGame.tileCount * snakeGame.gridSize;
  gameContainer.appendChild(canvas);

  snakeGame.canvas = canvas;
  snakeGame.ctx = canvas.getContext('2d');

  // Créer l'interface du jeu
  const gameUI = document.createElement('div');
  gameUI.className = 'snake-game-ui';
  gameUI.innerHTML = `
    <div class="snake-game-header">
      <h2 class="snake-title">🐍 SNAKE NIRD</h2>
      <button class="snake-close" id="snake-close" aria-label="Fermer le jeu">×</button>
    </div>
    <div class="snake-stats">
      <div class="snake-stat">
        <span class="snake-stat-label">SCORE:</span>
        <span class="snake-stat-value" id="snake-score">000</span>
      </div>
      <div class="snake-stat">
        <span class="snake-stat-label">HIGH:</span>
        <span class="snake-stat-value" id="snake-high-score">${String(snakeGame.highScore).padStart(3, '0')}</span>
      </div>
      <div class="snake-stat">
        <span class="snake-stat-label">SPEED:</span>
        <span class="snake-stat-value" id="snake-speed">NORMAL</span>
      </div>
    </div>
    <div class="snake-controls">
      <button class="snake-btn" id="snake-start">▶ START</button>
      <button class="snake-btn" id="snake-pause" style="display: none;">⏸ PAUSE</button>
      <button class="snake-btn" id="snake-restart" style="display: none;">🔄 RESTART</button>
    </div>
    <div class="snake-instructions">
      <p>▶ Utilise les flèches ou WASD pour diriger</p>
      <p>▶ Mange les éléments inclusifs (vert) pour grandir</p>
      <p>▶ Évite les murs et ton propre corps!</p>
    </div>
    <div class="snake-game-over" id="snake-game-over" style="display: none;">
      <h3>GAME OVER</h3>
      <p id="snake-final-score"></p>
      <button class="snake-btn" id="snake-try-again">▶ TRY AGAIN</button>
    </div>
  `;
  gameContainer.appendChild(gameUI);

  // Événements
  document.getElementById('snake-close').addEventListener('click', hideSnakeGame);
  document.getElementById('snake-start').addEventListener('click', startSnakeGame);
  document.getElementById('snake-pause').addEventListener('click', pauseSnakeGame);
  document.getElementById('snake-restart').addEventListener('click', restartSnakeGame);
  document.getElementById('snake-try-again').addEventListener('click', restartSnakeGame);

  // Contrôles tactiles (mobile)
  setupTouchControls();

  // Dessiner l'écran de démarrage
  drawSnakeGame();
}

// Cette fonction est maintenant définie plus haut, avant initSnakeGame

// Activer le jeu Snake
function activateSnakeGame() {
  // S'assurer que le jeu est initialisé
  if (!snakeGameInitialized) {
    initSnakeGame();
    // Attendre un peu que le DOM soit prêt
    setTimeout(() => {
      showSnakeGame();
    }, 100);
  } else {
    showSnakeGame();
  }
}

// Afficher le jeu
function showSnakeGame() {
  const container = document.getElementById('snake-game-container');
  if (!container) {
    console.error('Container du jeu Snake non trouvé');
    return;
  }
  
  container.classList.remove('snake-game-hidden');
  container.classList.add('snake-game-visible');
  snakeGame.isVisible = true;
  
  // Effet d'apparition
  setTimeout(() => {
    container.style.animation = 'snakeGameAppear 0.5s ease-out';
  }, 10);
  
  // Dessiner le jeu
  if (snakeGame.canvas && snakeGame.ctx) {
    drawSnakeGame();
  }
}

// Cacher le jeu Snake
function hideSnakeGame() {
  const container = document.getElementById('snake-game-container');
  if (container) {
    container.classList.remove('snake-game-visible');
    container.classList.add('snake-game-hidden');
    snakeGame.isVisible = false;
    pauseSnakeGame();
  }
}

// Démarrer le jeu
function startSnakeGame() {
  if (snakeGame.isPlaying) return;
  
  snakeGame.isPlaying = true;
  snakeGame.snake = [{ x: 15, y: 15 }];
  snakeGame.dx = 0;
  snakeGame.dy = 0;
  snakeGame.score = 0;
  generateFood();
  
  document.getElementById('snake-start').style.display = 'none';
  document.getElementById('snake-pause').style.display = 'inline-block';
  document.getElementById('snake-restart').style.display = 'inline-block';
  document.getElementById('snake-game-over').style.display = 'none';
  
  updateScore();
  gameLoop();
}

// Pause
function pauseSnakeGame() {
  if (snakeGame.gameLoop) {
    clearInterval(snakeGame.gameLoop);
    snakeGame.gameLoop = null;
  }
  snakeGame.isPlaying = false;
  document.getElementById('snake-start').style.display = 'inline-block';
  document.getElementById('snake-pause').style.display = 'none';
}

// Redémarrer
function restartSnakeGame() {
  pauseSnakeGame();
  startSnakeGame();
}

// Boucle de jeu
function gameLoop() {
  if (!snakeGame.isPlaying) return;
  
  snakeGame.gameLoop = setInterval(() => {
    moveSnake();
    checkCollision();
    drawSnakeGame();
  }, snakeGame.speed);
}

// Déplacer le serpent
function moveSnake() {
  const head = { x: snakeGame.snake[0].x + snakeGame.dx, y: snakeGame.snake[0].y + snakeGame.dy };
  
  snakeGame.snake.unshift(head);
  
  // Vérifier si on mange la nourriture
  if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
    snakeGame.score += 10;
    updateScore();
    generateFood();
    
    // Augmenter la vitesse progressivement
    if (snakeGame.score % 50 === 0 && snakeGame.speed > 80) {
      snakeGame.speed -= 5;
      clearInterval(snakeGame.gameLoop);
      gameLoop();
    }
    
    // Effet visuel
    createFoodParticle(snakeGame.food.x, snakeGame.food.y);
  } else {
    snakeGame.snake.pop();
  }
}

// Générer de la nourriture
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * snakeGame.tileCount),
      y: Math.floor(Math.random() * snakeGame.tileCount)
    };
  } while (snakeGame.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  snakeGame.food = newFood;
}

// Vérifier les collisions
function checkCollision() {
  const head = snakeGame.snake[0];
  
  // Collision avec les murs
  if (head.x < 0 || head.x >= snakeGame.tileCount || head.y < 0 || head.y >= snakeGame.tileCount) {
    endSnakeGame();
    return;
  }
  
  // Collision avec soi-même
  for (let i = 1; i < snakeGame.snake.length; i++) {
    if (head.x === snakeGame.snake[i].x && head.y === snakeGame.snake[i].y) {
      endSnakeGame();
      return;
    }
  }
}

// Fin du jeu
function endSnakeGame() {
  pauseSnakeGame();
  
  // Mettre à jour le high score
  if (snakeGame.score > snakeGame.highScore) {
    snakeGame.highScore = snakeGame.score;
    localStorage.setItem('snakeHighScore', snakeGame.highScore.toString());
    document.getElementById('snake-high-score').textContent = String(snakeGame.highScore).padStart(3, '0');
    
    // Animation de nouveau record
    createConfettiEffect();
  }
  
  document.getElementById('snake-final-score').textContent = `SCORE: ${snakeGame.score}`;
  document.getElementById('snake-game-over').style.display = 'block';
  document.getElementById('snake-start').style.display = 'inline-block';
  document.getElementById('snake-restart').style.display = 'inline-block';
}

// Gérer les touches du jeu (appelé depuis l'écouteur global)
function handleSnakeKeyPress(e) {
  // Contrôles du jeu
  if (!snakeGame.isVisible || !snakeGame.isPlaying) return;
  
  // Empêcher le déplacement inverse
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
    if (snakeGame.dy !== 1) {
      snakeGame.dx = 0;
      snakeGame.dy = -1;
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
    if (snakeGame.dy !== -1) {
      snakeGame.dx = 0;
      snakeGame.dy = 1;
    }
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    if (snakeGame.dx !== 1) {
      snakeGame.dx = -1;
      snakeGame.dy = 0;
    }
    e.preventDefault();
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    if (snakeGame.dx !== -1) {
      snakeGame.dx = 1;
      snakeGame.dy = 0;
    }
    e.preventDefault();
  } else if (e.key === ' ' || e.key === 'Escape') {
    if (snakeGame.isPlaying) {
      pauseSnakeGame();
    } else {
      startSnakeGame();
    }
    e.preventDefault();
  }
}

// Contrôles tactiles
function setupTouchControls() {
  const canvas = snakeGame.canvas;
  if (!canvas) return;
  
  let touchStartX = 0;
  let touchStartY = 0;
  
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!snakeGame.isPlaying) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Mouvement horizontal
      if (dx > 30 && snakeGame.dx !== -1) {
        snakeGame.dx = 1;
        snakeGame.dy = 0;
      } else if (dx < -30 && snakeGame.dx !== 1) {
        snakeGame.dx = -1;
        snakeGame.dy = 0;
      }
    } else {
      // Mouvement vertical
      if (dy > 30 && snakeGame.dy !== -1) {
        snakeGame.dx = 0;
        snakeGame.dy = 1;
      } else if (dy < -30 && snakeGame.dy !== 1) {
        snakeGame.dx = 0;
        snakeGame.dy = -1;
      }
    }
  });
}

// Dessiner le jeu
function drawSnakeGame() {
  const ctx = snakeGame.ctx;
  const canvas = snakeGame.canvas;
  
  // Fond avec grille rétro
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grille
  ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= snakeGame.tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * snakeGame.gridSize, 0);
    ctx.lineTo(i * snakeGame.gridSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * snakeGame.gridSize);
    ctx.lineTo(canvas.width, i * snakeGame.gridSize);
    ctx.stroke();
  }
  
  // Nourriture avec effet glow
  const foodX = snakeGame.food.x * snakeGame.gridSize;
  const foodY = snakeGame.food.y * snakeGame.gridSize;
  
  // Glow effect
  const gradient = ctx.createRadialGradient(
    foodX + snakeGame.gridSize / 2,
    foodY + snakeGame.gridSize / 2,
    0,
    foodX + snakeGame.gridSize / 2,
    foodY + snakeGame.gridSize / 2,
    snakeGame.gridSize
  );
  gradient.addColorStop(0, 'rgba(0, 255, 65, 0.8)');
  gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(foodX - snakeGame.gridSize, foodY - snakeGame.gridSize, snakeGame.gridSize * 3, snakeGame.gridSize * 3);
  
  // Nourriture
  ctx.fillStyle = '#00ff41';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#00ff41';
  ctx.fillRect(foodX + 2, foodY + 2, snakeGame.gridSize - 4, snakeGame.gridSize - 4);
  ctx.shadowBlur = 0;
  
  // Serpent avec dégradé
  snakeGame.snake.forEach((segment, index) => {
    const x = segment.x * snakeGame.gridSize;
    const y = segment.y * snakeGame.gridSize;
    
    // Tête différente
    if (index === 0) {
      // Yeux
      ctx.fillStyle = '#000';
      ctx.fillRect(x + 4, y + 4, 4, 4);
      ctx.fillRect(x + 12, y + 4, 4, 4);
      
      // Corps de la tête avec glow
      const headGradient = ctx.createLinearGradient(x, y, x + snakeGame.gridSize, y + snakeGame.gridSize);
      headGradient.addColorStop(0, '#00ff88');
      headGradient.addColorStop(1, '#00ff41');
      ctx.fillStyle = headGradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
    } else {
      // Corps avec dégradé selon la position
      const intensity = 1 - (index / snakeGame.snake.length) * 0.5;
      ctx.fillStyle = `rgba(0, 255, 65, ${intensity})`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(0, 255, 65, 0.5)';
    }
    
    ctx.fillRect(x + 1, y + 1, snakeGame.gridSize - 2, snakeGame.gridSize - 2);
    ctx.shadowBlur = 0;
    
    // Bordure
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1, y + 1, snakeGame.gridSize - 2, snakeGame.gridSize - 2);
  });
}

// Créer un effet de particule pour la nourriture
function createFoodParticle(x, y) {
  const canvas = snakeGame.canvas;
  const ctx = snakeGame.ctx;
  const centerX = x * snakeGame.gridSize + snakeGame.gridSize / 2;
  const centerY = y * snakeGame.gridSize + snakeGame.gridSize / 2;
  
  // Particules éclatées
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const angle = (Math.PI * 2 * i) / 8;
      const particleX = centerX + Math.cos(angle) * 10;
      const particleY = centerY + Math.sin(angle) * 10;
      
      ctx.save();
      ctx.fillStyle = '#00ff41';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
      ctx.beginPath();
      ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }, i * 10);
  }
}

// Effet confetti pour nouveau record
function createConfettiEffect() {
  const container = document.getElementById('snake-game-container');
  if (!container) return;
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'snake-confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = ['#00ff41', '#10b981', '#f59e0b', '#6366f1'][Math.floor(Math.random() * 4)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
}

// Mettre à jour le score
function updateScore() {
  const scoreEl = document.getElementById('snake-score');
  if (scoreEl) {
    scoreEl.textContent = String(snakeGame.score).padStart(3, '0');
  }
  
  // Mettre à jour la vitesse affichée
  const speedEl = document.getElementById('snake-speed');
  if (speedEl) {
    if (snakeGame.speed < 100) {
      speedEl.textContent = 'FAST';
    } else if (snakeGame.speed < 130) {
      speedEl.textContent = 'MEDIUM';
    } else {
      speedEl.textContent = 'NORMAL';
    }
  }
}

// Initialiser le conteneur du jeu au chargement (mais le jeu reste caché)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      initSnakeGame();
    }, 500);
  });
} else {
  setTimeout(() => {
    initSnakeGame();
  }, 500);
}

