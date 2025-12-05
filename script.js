// ==================== DOM ELEMENTS ====================
const startBtn = document.getElementById('startQuizBtn');
const quizSection = document.getElementById('quiz-section');
const nirdIntro = document.getElementById('nird-intro');
const feedbackForm = document.getElementById('feedbackForm');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelectorAll('.nav-link');

// ==================== QUIZ DATA ====================
const quizData = [
  {
    question: "Ton école utilise Windows 10 (fin de support octobre 2025). Que faire pour rester sécurisé ?",
    options: [
      { text: "Acheter Windows 11 (très cher, propriétaire)", score: 0 },
      { text: "Passer à Linux Mint (gratuit, libre, respecte données)", score: 3 },
      { text: "Garder Windows 10 (risqué et vulnérable)", score: 0 }
    ]
  },
  {
    question: "Les données des élèves sont stockées chez Google Drive. Principal problème ?",
    options: [
      { text: "Aucun problème, Google est de confiance", score: 0 },
      { text: "Données hors UE, perte de souveraineté, dépendance Big Tech", score: 3 },
      { text: "C'est gratuit, donc c'est bon", score: 0 }
    ]
  },
  {
    question: "L'école jette des PC de 5–10 ans qui fonctionnent bien. Pourquoi problème NIRD ?",
    options: [
      { text: "Le neuf est toujours mieux", score: 0 },
      { text: "Gaspillage, obsolescence programmée, recycler/revendre", score: 3 },
      { text: "Les vieux PC sont moches", score: 0 }
    ]
  },
  {
    question: "Meilleure alternative LIBRE et souveraine à Google Drive ?",
    options: [
      { text: "OneDrive (Microsoft)", score: 0 },
      { text: "Dropbox (propriétaire)", score: 0 },
      { text: "Nextcloud (libre, auto-hébergeable, données UE)", score: 3 }
    ]
  }
];

let currentQuestion = 0;
let selectedAnswers = [];
let quizStartTime = 0;
let timerInterval = null;

// ==================== INITIALIZATION ====================
function init() {
  setupNav();
  setupQuiz();
  setupGame();
  renderContributions();
  animateStats();
}

function setupNav() {
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
}

function toggleMenu() {
  const navMenu = document.querySelector('.nav-menu');
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// ==================== OPEN LINKS FUNCTION ====================
function openLink(url, name) {
  console.log(`Ouverture : ${name} - ${url}`);
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ==================== QUIZ FUNCTIONS ====================
function setupQuiz() {
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }

  if (document.getElementById('nextBtn')) {
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  }

  if (document.getElementById('prevBtn')) {
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
  }
}

function startQuiz() {
  startBtn.style.display = 'none';
  if (nirdIntro) nirdIntro.style.display = 'none';
  quizSection.classList.remove('hidden');
  quizSection.scrollIntoView({ behavior: 'smooth' });
  quizStartTime = Date.now();
  currentQuestion = 0;
  selectedAnswers = [];
  showQuestion();
  startTimer();
}

function showQuestion() {
  const q = quizData[currentQuestion];
  const questionTitle = document.getElementById('quiz-title');
  const qNumber = document.getElementById('question-number');
  const totalQuestions = document.getElementById('total-questions');

  questionTitle.textContent = `Question ${currentQuestion + 1}`;
  qNumber.textContent = currentQuestion + 1;
  totalQuestions.textContent = quizData.length;

  updateProgress();
  updateScore();

  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = `
    <div class="question">
      <h3>${q.question}</h3>
      <div class="options" id="options-${currentQuestion}"></div>
    </div>
  `;

  const optionsDiv = document.getElementById(`options-${currentQuestion}`);
  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (selectedAnswers[currentQuestion] && selectedAnswers[currentQuestion].optionIndex === index) {
      btn.classList.add('selected');
    }
    btn.textContent = opt.text;
    btn.dataset.index = index;
    btn.dataset.score = opt.score;
    btn.addEventListener('click', () => selectOption(btn));
    optionsDiv.appendChild(btn);
  });

  updateNavButtons();
}

function selectOption(btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  selectedAnswers[currentQuestion] = {
    score: parseInt(btn.dataset.score),
    optionIndex: parseInt(btn.dataset.index)
  };

  updateScore();
  updateDifficulty();

  if (currentQuestion < quizData.length - 1) {
    setTimeout(() => {
      document.getElementById('nextBtn').classList.remove('hidden');
    }, 300);
  }
}

function nextQuestion() {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResults();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function updateNavButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (currentQuestion === 0) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'inline-flex';
  }

  if (selectedAnswers[currentQuestion]) {
    nextBtn.classList.remove('hidden');
  } else {
    nextBtn.classList.add('hidden');
  }
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const progressFill = document.getElementById('progress-fill');
  progressFill.style.width = progress + '%';
}

function updateScore() {
  const sum = selectedAnswers.reduce((acc, ans) => acc + (ans ? ans.score : 0), 0);
  document.getElementById('current-score').textContent = sum;
}

function updateDifficulty() {
  const score = selectedAnswers.reduce((acc, ans) => acc + (ans ? ans.score : 0), 0);
  const difficulty = document.getElementById('difficulty');
  const maxScore = (currentQuestion + 1) * 3;
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) {
    difficulty.textContent = 'Excellent';
    difficulty.style.color = '#28a745';
  } else if (percentage >= 60) {
    difficulty.textContent = 'Bon';
    difficulty.style.color = '#ffc107';
  } else {
    difficulty.textContent = 'Débutant';
    difficulty.style.color = '#ff6b6b';
  }
}

function startTimer() {
  let seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent = 
      `${mins}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function showResults() {
  clearInterval(timerInterval);
  const score = selectedAnswers.reduce((acc, ans) => acc + (ans ? ans.score : 0), 0);
  let msg = '';
  let emoji = '';

  if (score >= 11) {
    msg = '🏆 EXCELLENT ! Ton établissement est prêt à devenir un village numérique résistant !';
    emoji = '🏆';
  } else if (score >= 8) {
    msg = '👍 Très bien ! Tu as une bonne compréhension de NIRD.';
    emoji = '👍';
  } else if (score >= 5) {
    msg = '⚡ Bonne progression ! Continue à explorer les solutions libres.';
    emoji = '⚡';
  } else {
    msg = '📚 Beaucoup de dépendances aux Big Tech à surmonter. Rejoins la communauté NIRD !';
    emoji = '🚀';
  }

  document.getElementById('question-container').innerHTML = `
    <div class="question" style="text-align:center; background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));">
      <h2 style="font-size:3rem;">${emoji}</h2>
      <h2>Quiz terminé !</h2>
      <p style="font-size:1.6rem; margin:20px 0; font-weight:700; color:#667eea;">Score : ${score} / 12 points</p>
      <p style="font-size:1.1rem; margin:20px 0; line-height:1.6;">${msg}</p>
      <button class="btn btn-primary btn-lg" onclick="scrollToSolutions()">
        💡 Voir les solutions libres
      </button>
      <button class="btn btn-secondary btn-lg" style="margin-left:15px;" onclick="location.reload()">
        🔄 Rejouer
      </button>
    </div>
  `;

  document.getElementById('nextBtn').classList.add('hidden');
  document.getElementById('prevBtn').style.display = 'none';
}

function closeQuiz() {
  quizSection.classList.add('hidden');
  nirdIntro.style.display = 'block';
  startBtn.style.display = 'inline-block';
  clearInterval(timerInterval);
  currentQuestion = 0;
  selectedAnswers = [];
}

function scrollToSolutions() {
  document.getElementById('solutions').scrollIntoView({ behavior: 'smooth' });
  closeQuiz();
}

// ==================== FEEDBACK ====================
if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('feedbackEmail').value;
    const school = document.getElementById('feedbackSchool').value;
    const score = document.getElementById('feedbackScore').value;
    const text = document.getElementById('feedbackText').value;

    const existing = JSON.parse(localStorage.getItem('nird_contributions') || '[]');
    existing.push({
      message: text,
      email: email || null,
      school: school || null,
      score: score || null,
      date: new Date().toISOString()
    });
    localStorage.setItem('nird_contributions', JSON.stringify(existing));

    showSuccessModal(`Merci pour ton feedback ! 
    Établissement: ${school || 'Non spécifié'}
    Score: ${score || '–'}/12
    Ta contribution renforce la communauté NIRD.`);

    feedbackForm.reset();
    renderContributions();
  });
}

function renderContributions() {
  const container = document.getElementById('contributions-list');
  if (!container) return;

  const contributions = JSON.parse(localStorage.getItem('nird_contributions') || '[]');
  container.innerHTML = '';

  if (contributions.length === 0) {
    container.innerHTML = '<p style="text-align:center; opacity:0.7; grid-column:1/-1;">Pas encore de contributions. Envoie ton feedback pour apparaître sur ce mur !</p>';
    return;
  }

  contributions.slice(-12).reverse().forEach((c) => {
    const card = document.createElement('div');
    card.className = 'contribution-card';
    card.innerHTML = `
      <div class="solution-icon">💡</div>
      <h3>Idée du village</h3>
      <p>"${c.message.substring(0, 120)}${c.message.length > 120 ? '...' : ''}"</p>
      <p style="margin-top:10px; font-size:0.85rem; opacity:0.7;">
        ${c.school ? '🏫 ' + c.school + '<br>' : ''}
        ${c.score ? '⭐ Score: ' + c.score + '/12<br>' : ''}
        ${new Date(c.date).toLocaleDateString('fr-FR')}
      </p>
    `;
    container.appendChild(card);
  });
}

// ==================== STATS ANIMATION ====================
function animateStats() {
  const stats = document.querySelectorAll('[data-target]');
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target;
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(current);
      }
    }, 30);
  });
}

// ==================== FILTER SOLUTIONS ====================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.solution-card').forEach(card => {
      if (filter === 'all' || card.classList.contains(`solution-card-${filter}`)) {
        card.style.display = 'block';
        setTimeout(() => card.style.animation = 'fadeInUp 0.5s ease', 10);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==================== MODALS ====================
function showSuccessModal(message) {
  const modal = document.getElementById('successModal');
  document.getElementById('modalMessage').textContent = message;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.animation = 'fadeInUp 0.3s ease';
  }, 10);
}

function closeModal() {
  document.getElementById('successModal').classList.add('hidden');
  document.getElementById('successModal').style.display = 'none';
}

// ==================== GAME ENGINE - FIXED ====================

let canvas = null;
let ctx = null;
let gameState = {
  isRunning: false,
  isPaused: false,
  score: 0,
  villageHealth: 100,
  solutionCount: 0,
  wave: 1,
  maxWaves: 5,
  enemies: [],
  particles: [],
  projectiles: []
};

let village = null;
let gameLoopInterval = null;

class Village {
  constructor() {
    if (!canvas) return;
    this.x = canvas.width / 2;
    this.y = canvas.height - 80;
    this.width = 50;
    this.height = 50;
    this.health = 100;
  }

  draw() {
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#28a745';
    ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
    ctx.strokeStyle = '#20c997';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x - 25, this.y - 25, 50, 50);

    const barWidth = 60;
    const barHeight = 8;
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(this.x - barWidth/2, this.y - 40, barWidth, barHeight);
    ctx.fillStyle = '#28a745';
    ctx.fillRect(this.x - barWidth/2, this.y - 40, (barWidth * this.health) / 100, barHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - barWidth/2, this.y - 40, barWidth, barHeight);
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) {
      endGame(false);
    }
  }
}

class Enemy {
  constructor(x = null, y = null) {
    if (!canvas) return;
    this.x = x || Math.random() * (canvas.width - 60) + 30;
    this.y = y || -30;
    this.width = 30;
    this.height = 30;
    this.speedY = 1 + Math.random() * 2;
    this.health = 1;
    this.type = ['google', 'microsoft', 'apple', 'amazon'][Math.floor(Math.random() * 4)];
    this.rotation = 0;
  }

  draw() {
    if (!canvas || !ctx) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    if (this.type === 'google') {
      ctx.fillStyle = '#4285F4';
      ctx.fillRect(-15, -15, 30, 30);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('G', 0, 5);
    } else if (this.type === 'microsoft') {
      ctx.fillStyle = '#00A4EF';
      ctx.fillRect(-15, -15, 30, 30);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-12, -12, 6, 6);
      ctx.fillRect(-4, -12, 6, 6);
      ctx.fillRect(-12, -4, 6, 6);
      ctx.fillRect(-4, -4, 6, 6);
    } else if (this.type === 'apple') {
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#FF9900';
      ctx.fillRect(-15, -15, 30, 30);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('A', 0, 5);
    }

    ctx.restore();
  }

  update() {
    if (!canvas) return true;
    
    this.y += this.speedY;
    this.rotation += 3;

    if (this.y > canvas.height + 30) {
      if (village) village.takeDamage(10);
      return false;
    }
    return true;
  }

  isClickedBy(mx, my) {
    return (
      mx > this.x - this.width/2 &&
      mx < this.x + this.width/2 &&
      my > this.y - this.height/2 &&
      my < this.y + this.height/2
    );
  }
}

class Particle {
  constructor(x, y, vx = 0, vy = 0, color = '#ff6b6b') {
    this.x = x;
    this.y = y;
    this.vx = vx || (Math.random() - 0.5) * 4;
    this.vy = vy || (Math.random() - 0.5) * 4 - 1;
    this.life = 1;
    this.color = color;
    this.size = 3 + Math.random() * 3;
  }

  draw() {
    if (!ctx) return;
    
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
    this.life -= 0.02;
    return this.life > 0;
  }
}

function setupGame() {
  canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.log('Canvas not found');
    return;
  }
  
  ctx = canvas.getContext('2d');
  village = new Village();

  const startGameBtn = document.getElementById('startGameBtn');
  const pauseGameBtn = document.getElementById('pauseGameBtn');
  const resumeGameBtn = document.getElementById('resumeGameBtn');

  if (startGameBtn) {
    startGameBtn.addEventListener('click', startGame);
  }

  if (pauseGameBtn) {
    pauseGameBtn.addEventListener('click', pauseGame);
  }

  if (resumeGameBtn) {
    resumeGameBtn.addEventListener('click', resumeGame);
  }

  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('touchstart', handleCanvasTouch);
}

function handleCanvasClick(e) {
  if (!gameState.isRunning || gameState.isPaused || !canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const my = (e.clientY - rect.top) * (canvas.height / rect.height);

  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    if (enemy.isClickedBy(mx, my)) {
      gameState.enemies.splice(i, 1);
      gameState.score += 10 + gameState.wave * 5;
      gameState.solutionCount++;
      createExplosion(enemy.x, enemy.y);
      break;
    }
  }
}

function handleCanvasTouch(e) {
  if (!gameState.isRunning || gameState.isPaused || !canvas) return;

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const mx = (touch.clientX - rect.left) * (canvas.width / rect.width);
  const my = (touch.clientY - rect.top) * (canvas.height / rect.height);

  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    if (enemy.isClickedBy(mx, my)) {
      gameState.enemies.splice(i, 1);
      gameState.score += 10 + gameState.wave * 5;
      gameState.solutionCount++;
      createExplosion(enemy.x, enemy.y);
      break;
    }
  }
}

function startGame() {
  if (!canvas || !ctx || !village) {
    console.log('Game not ready');
    return;
  }

  gameState.isRunning = true;
  gameState.isPaused = false;
  gameState.score = 0;
  gameState.villageHealth = 100;
  gameState.solutionCount = 0;
  gameState.wave = 1;
  gameState.enemies = [];
  gameState.particles = [];
  village.health = 100;

  document.getElementById('startGameBtn').classList.add('hidden');
  document.getElementById('pauseGameBtn').classList.remove('hidden');
  document.getElementById('restartGameBtn').classList.add('hidden');

  spawnWave();
  gameLoop();
}

function pauseGame() {
  gameState.isPaused = true;
  document.getElementById('pauseGameBtn').classList.add('hidden');
  document.getElementById('resumeGameBtn').classList.remove('hidden');
}

function resumeGame() {
  gameState.isPaused = false;
  document.getElementById('resumeGameBtn').classList.add('hidden');
  document.getElementById('pauseGameBtn').classList.remove('hidden');
  gameLoop();
}

function restartGame() {
  closeGameOverModal();
  startGame();
}

function spawnWave() {
  const enemyCount = 3 + gameState.wave * 2;
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => {
      gameState.enemies.push(new Enemy());
    }, i * 500);
  }
}

function endGame(won) {
  gameState.isRunning = false;
  if (gameLoopInterval) clearTimeout(gameLoopInterval);

  const modal = document.getElementById('gameOverModal');
  const icon = document.getElementById('gameOverIcon');
  const title = document.getElementById('gameOverTitle');
  const message = document.getElementById('gameOverMessage');

  if (won) {
    icon.textContent = '🏆';
    title.textContent = 'Village résistant !';
    message.textContent = 'Félicitations ! Tu as défendu ton village contre l\'empire numérique !';
  } else {
    icon.textContent = '💥';
    title.textContent = 'Village détruit';
    message.textContent = 'L\'empire numérique a conquis ton village. Réessaye !';
  }

  document.getElementById('finalScore').textContent = gameState.score;
  document.getElementById('finalSolutions').textContent = gameState.solutionCount;
  document.getElementById('finalWaves').textContent = gameState.wave - 1;

  modal.classList.remove('hidden');
  modal.style.display = 'flex';

  document.getElementById('pauseGameBtn').classList.add('hidden');
  document.getElementById('startGameBtn').classList.remove('hidden');
  document.getElementById('restartGameBtn').classList.remove('hidden');
}

function closeGameOverModal() {
  document.getElementById('gameOverModal').classList.add('hidden');
  document.getElementById('gameOverModal').style.display = 'none';
}

function updateHUD() {
  if (!village) return;
  
  document.getElementById('villageHealth').textContent = Math.max(0, Math.round(village.health));
  document.getElementById('solutionCount').textContent = gameState.solutionCount;
  document.getElementById('gameScore').textContent = gameState.score;
  document.getElementById('waveCount').textContent = gameState.wave;
}

function createExplosion(x, y) {
  for (let i = 0; i < 15; i++) {
    const angle = (Math.PI * 2 * i) / 15;
    const speed = 3 + Math.random() * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    gameState.particles.push(new Particle(x, y, vx, vy, '#ff6b6b'));
    gameState.particles.push(new Particle(x, y, vx * 0.7, vy * 0.7, '#FFD700'));
  }
}

function gameLoop() {
  if (!canvas || !ctx) return;
  if (gameState.isPaused) return;

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  gameState.enemies = gameState.enemies.filter(enemy => {
    if (!enemy.update()) return false;
    enemy.draw();
    return true;
  });

  gameState.particles = gameState.particles.filter(particle => {
    if (!particle.update()) return false;
    particle.draw();
    return true;
  });

  if (village) village.draw();

  updateHUD();

  if (gameState.enemies.length === 0 && gameState.wave < gameState.maxWaves) {
    setTimeout(() => {
      gameState.wave++;
      spawnWave();
    }, 1500);
  }

  if (gameState.enemies.length === 0 && gameState.wave === gameState.maxWaves) {
    endGame(true);
    return;
  }

  if (gameState.isRunning && !gameState.isPaused) {
    gameLoopInterval = setTimeout(gameLoop, 1000 / 60);
  }
}

// ==================== LAUNCH ====================
document.addEventListener('DOMContentLoaded', init);

console.log('🏘️ Village NIRD PRO - VERSION 3 FINALE COMPLÈTE !');
console.log('✅ Quiz gamifié - FONCTIONNEL');
console.log('✅ Jeu de défense - FONCTIONNEL');
console.log('✅ Solutions libres - LIENS CORRIGÉS');
console.log('✅ Communauté interactive');
console.log('✅ 100% libre et responsable');
