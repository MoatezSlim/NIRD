// Données du Quiz NIRD
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
        question: "Les données personnelles des élèves (notes, adresses) sont stockées chez Google. Quel problème principal ?",
        options: [
            { text: "Aucun problème, Google est de confiance", score: 0 },
            { text: "Données hors UE, perte souveraineté, dépendance Big Tech", score: 3 },
            { text: "C'est gratuit donc c'est bon", score: 0 }
        ]
    },
    {
        question: "L'école a des PC de 5-10 ans qui marchent bien. Elle veut les remplacer par du neuf. Pourquoi c'est un problème ?",
        options: [
            { text: "Pas de problème, le neuf c'est mieux", score: 0 },
            { text: "Gaspillage, obsolescence programmée. Recycler/revendre !", score: 3 },
            { text: "Les vieux PC sont trop lents", score: 0 }
        ]
    },
    {
        question: "Meilleure alternative LIBRE et SOUVERAINE pour remplacer Google Drive à l'école ?",
        options: [
            { text: "OneDrive (Microsoft)", score: 0 },
            { text: "Nextcloud (libre, auto-hébergeable, données UE)", score: 3 },
            { text: "Dropbox (propriétaire)", score: 0 }
        ]
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];

// Éléments DOM
const startBtn = document.getElementById('startQuizBtn');
const quizSection = document.getElementById('quiz-section');
const nirdIntro = document.getElementById('nird-intro');
const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('nextBtn');
const currentScoreEl = document.getElementById('current-score');
const progressFill = document.getElementById('progress-fill');
const quizTitle = document.getElementById('quiz-title');

// Événements
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
document.getElementById('feedbackForm').addEventListener('submit', handleFeedback);

// Initialisation
function startQuiz() {
    startBtn.style.display = 'none';
    nirdIntro.style.display = 'none';
    quizSection.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = quizData[currentQuestion];
    
    // Mise à jour UI
    quizTitle.textContent = `Question ${currentQuestion + 1}/4`;
    updateProgress();
    updateScore();
    
    // Créer question HTML
    questionContainer.innerHTML = `
        <div class="question">
            <h3>${q.question}</h3>
            <div class="options" id="options-${currentQuestion}">
            </div>
        </div>
    `;
    
    // Créer boutons options
    const optionsContainer = document.getElementById(`options-${currentQuestion}`);
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.dataset.index = index;
        btn.dataset.score = option.score;
        btn.addEventListener('click', () => selectOption(btn));
        optionsContainer.appendChild(btn);
    });
    
    nextBtn.classList.add('hidden');
}

function selectOption(selectedBtn) {
    // Désélectionner autres boutons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Sélectionner ce bouton
    selectedBtn.classList.add('selected');
    
    // Sauvegarder réponse
    const qIndex = currentQuestion;
    const optionIndex = parseInt(selectedBtn.dataset.index);
    selectedAnswers[qIndex] = {
        question: currentQuestion,
        selected: optionIndex,
        score: parseInt(selectedBtn.dataset.score)
    };
    
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = progress + '%';
}

function updateScore() {
    const currentTotal = selectedAnswers
        .slice(0, currentQuestion + 1)
        .reduce((sum, ans) => sum + (ans ? ans.score : 0), 0);
    currentScoreEl.textContent = currentTotal;
}

function showResults() {
    score = selectedAnswers.reduce((sum, ans) => sum + (ans ? ans.score : 0), 0);
    
    let message = '';
    let badgeClass = '';
    
    if (score >= 9) {
        message = '🏆 EXCELLENT ! Ton école peut rejoindre NIRD immédiatement !';
        badgeClass = 'excellent';
    } else if (score >= 6) {
        message = '👍 BON ! Tu es sur la bonne voie vers la résistance numérique.';
        badgeClass = 'good';
    } else {
        message = '⚠️ À travailler ! Explore les solutions NIRD pour progresser.';
        badgeClass = 'needs-work';
    }
    
    questionContainer.innerHTML = `
        <div class="question final-results">
            <h2>🎉 Quiz Terminé !</h2>
            <div class="score-badge ${badgeClass}">
                <span class="big-score">${score}/12</span>
                <span class="score-label">Résistance Numérique</span>
            </div>
            <p style="font-size: 1.3rem; margin: 30px 0;">${message}</p>
            <div style="text-align: center;">
                <button onclick="location.reload()" class="cta-btn">🔄 Rejouer le Quiz</button>
                <p style="margin-top: 20px; opacity: 0.8;">Partage ton score avec #NIRD #VillageResistant</p>
            </div>
        </div>
    `;
    
    nextBtn.style.display = 'none';
}

function handleFeedback(e) {
    e.preventDefault();
    
    const email = document.getElementById('feedbackEmail').value;
    const text = document.getElementById('feedbackText').value;
    
    // Simulation envoi (remplacez par vraie API)
    alert('✅ Merci pour ton feedback ! Il a été envoyé à la communauté NIRD.\n\n' +
          'Email: ' + (email || 'Non fourni') + '\n' +
          'Message: ' + text.substring(0, 100) + '...');
    
    document.getElementById('feedbackForm').reset();
}

// Scroll smooth
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer sections
document.querySelectorAll('.section, .pillar, .solution-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

console.log('🏘️ Village NIRD chargé ! Score max: 12/12 🚀');
