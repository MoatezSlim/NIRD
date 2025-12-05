const startBtn = document.getElementById('startQuizBtn');
const quizSection = document.getElementById('quiz-section');
const nirdIntro = document.getElementById('nird-intro');
const feedbackForm = document.getElementById('feedbackForm');

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    if (nirdIntro) nirdIntro.style.display = 'none';
    quizSection.classList.remove('hidden');
    quizSection.scrollIntoView({ behavior: 'smooth' });
});

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('feedbackEmail').value;
    const school = document.getElementById('feedbackSchool').value;
    const text = document.getElementById('feedbackText').value;

    alert(
        "✅ Merci pour ton retour, il pourra alimenter la communauté NIRD !\n\n" +
        "Établissement : " + (school || "non spécifié") + "\n" +
        "Message : " + text.substring(0, 120) + "..."
    );

    feedbackForm.reset();
    console.log("Feedback NIRD", { email, school, text });
});

// Animation simple au scroll
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

console.log("🏘️ Village NIRD avec Google Forms intégré prêt.");
