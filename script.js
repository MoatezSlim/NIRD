// Bouton et sections principales
const startBtn = document.getElementById('startQuizBtn');
const quizSection = document.getElementById('quiz-section');
const nirdIntro = document.getElementById('nird-intro');
const feedbackForm = document.getElementById('feedbackForm');

// Données du mini-quiz local
const quizData = [
  {
    question: "Ton école utilise Windows 10 (fin de support). Que faire pour rester sécurisé ?",
    options: [
      { text: "Acheter Windows 11 (très cher, propriétaire)", score: 0 },
      { text: "Passer à Linux Mint (gratuit, libre, respecte les données)", score: 3 },
      { text: "Garder Windows 10 (risqué et vulnérable)", score: 0 }
    ]
  },
  {
    question: "Les données des élèves sont stockées chez Google. Principal problème ?",
    options: [
      { text: "Aucun problème, Google est de confiance", score: 0 },
      { text: "Données hors UE, perte de souveraineté et dépendance Big Tech", score: 3 },
      { text: "C'est gratuit, donc c'est bon", score: 0 }
    ]
  },
  {
    question: "L'école veut jeter des PC de 5–10 ans qui fonctionnent encore. Pourquoi c'est un problème NIRD ?",
    options: [
      { text: "Le neuf est toujours mieux", score: 0 },
      { text: "Gaspillage, obsolescence programmée, il faut recycler/revendre", score: 3 },
      { text: "Les vieux PC sont moches", score: 0 }
    ]
  },
  {
    question: "Meilleure alternative LIBRE et souveraine à Google Drive ?",
    options: [
      { text: "OneDrive (Microsoft)", score: 0 },
      { text: "Dropbox (propriétaire)", score: 0 },
      { text: "Nextcloud (libre, auto-hébergeable, données en UE)", score: 3 }
    ]
  }
];

let currentQuestion = 0;
let selectedAnswers = [];

// Éléments DOM du quiz
const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('nextBtn');
const currentScoreEl = document.getElementById('current-score');
const progressFill = document.getElementById('progress-fill');
const quizTitle = document.getElementById('quiz-title');

// Démarrage du mini-quiz
if (startBtn) {
  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    if (nirdIntro) nirdIntro.style.display = 'none';
    quizSection.classList.remove('hidden');
    quizSection.scrollIntoView({ behavior: 'smooth' });
    showQuestion();
  });
}

function showQuestion() {
  const q = quizData[currentQuestion];
  quizTitle.textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
  updateProgress();
  updateScore();

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
    btn.textContent = opt.text;
    btn.dataset.index = index.toString();
    btn.dataset.score = opt.score.toString();
    btn.addEventListener('click', () => selectOption(btn));
    optionsDiv.appendChild(btn);
  });

  nextBtn.classList.add('hidden');
}

function selectOption(btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const optionIndex = parseInt(btn.dataset.index);
  selectedAnswers[currentQuestion] = {
    score: parseInt(btn.dataset.score),
    optionIndex
  };

  updateScore();
  nextBtn.classList.remove('hidden');
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.length - 1) {
      currentQuestion++;
      showQuestion();
    } else {
      showResults();
    }
  });
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressFill.style.width = progress + '%';
}

function updateScore() {
  const sum = selectedAnswers.reduce((acc, ans) => acc + (ans ? ans.score : 0), 0);
  currentScoreEl.textContent = sum.toString();
}

function showResults() {
  const score = selectedAnswers.reduce((acc, ans) => acc + (ans ? ans.score : 0), 0);
  let msg = '';
  if (score >= 9) {
    msg = '🏆 EXCELLENT ! Ton établissement est prêt à rejoindre le village numérique résistant.';
  } else if (score >= 6) {
    msg = '👍 Bon début ! Continue à explorer NIRD pour renforcer ta résistance numérique.';
  } else {
    msg = '⚠️ Beaucoup de dépendances aux Big Tech. Parcours les solutions libres ci-dessous pour progresser.';
  }

  questionContainer.innerHTML = `
    <div class="question">
      <h2>🎉 Quiz terminé</h2>
      <p style="font-size:1.4rem; margin:20px 0;">Score : <strong>${score} / 12</strong></p>
      <p>${msg}</p>
      <button class="cta-btn" onclick="window.scrollTo({top: document.getElementById('solutions').offsetTop - 60, behavior: 'smooth'})">
        💡 Voir les solutions libres
      </button>
    </div>
  `;
  nextBtn.classList.add('hidden');
}

// Feedback → stockage local + mur des contributions
feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('feedbackEmail').value;
  const school = document.getElementById('feedbackSchool').value;
  const text = document.getElementById('feedbackText').value;

  const existing = JSON.parse(localStorage.getItem('nird_contributions') || '[]');
  existing.push({
    message: text,
    email: email || null,
    school: school || null,
    date: new Date().toISOString()
  });
  localStorage.setItem('nird_contributions', JSON.stringify(existing));

  alert(
    "✅ Merci pour ton retour, il pourra alimenter la communauté NIRD (localement) !\n\n" +
    "Établissement : " + (school || "non spécifié") + "\n" +
    "Message : " + text.substring(0, 120) + "..."
  );

  feedbackForm.reset();
  renderContributions();
});

function renderContributions() {
  const container = document.getElementById('contributions-list');
  if (!container) return;

  const contributions = JSON.parse(localStorage.getItem('nird_contributions') || '[]');
  container.innerHTML = '';

  if (contributions.length === 0) {
    container.innerHTML = '<p style="text-align:center; opacity:0.7;">Pas encore de contributions locales. Envoie ton idée via le formulaire ci-dessus.</p>';
    return;
  }

  contributions.slice(-6).reverse().forEach((c) => {
    const card = document.createElement('div');
    card.className = 'solution-card';
    card.innerHTML = `
      <div class="solution-icon">💡</div>
      <h3>Idée de village résistant</h3>
      <p>${c.message}</p>
      <p style="margin-top:10px; font-size:0.8rem; opacity:0.7;">
        ${c.school ? 'Établissement : ' + c.school + '<br>' : ''}
        ${c.email ? 'Proposé par : ' + c.email : 'Contribution anonyme'}
      </p>
    `;
    container.appendChild(card);
  });
}

// Animation au scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.section, .pillar, .solution-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Charger les contributions au démarrage
renderContributions();

console.log("🏘️ Village NIRD avec quiz local + Google Forms + mur de contributions prêt.");
