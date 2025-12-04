/* ============================================
   VILLAGE NUMÉRIQUE RÉSISTANT - Scripts
   Licence : MIT
   ============================================ */

// Navigation mobile avec animations
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });
  }

  // Fermer le menu mobile lors du clic sur un lien
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Effet de parallaxe léger sur le header au scroll
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
    }
    
    lastScroll = currentScroll;
  });

  // Gestion du formulaire de diagnostic
  const diagnosticForm = document.getElementById('diagnostic-form');
  const resultSection = document.getElementById('diagnostic-resultat');

  if (diagnosticForm && resultSection) {
    diagnosticForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateDiagnostic();
    });
  }

  // Smooth scroll pour les liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

/**
 * Calcule le résultat du diagnostic NIRD
 */
function calculateDiagnostic() {
  const form = document.getElementById('diagnostic-form');
  const formData = new FormData(form);
  
  // Récupérer les réponses
  const role = formData.get('role');
  const q1 = parseInt(formData.get('q1')) || 0;
  const q2 = parseInt(formData.get('q2')) || 0;
  const q3 = parseInt(formData.get('q3')) || 0;
  const q4 = parseInt(formData.get('q4')) || 0;
  const q5 = parseInt(formData.get('q5')) || 0;

  // Calculer le score total (sur 10)
  const totalScore = q1 + q2 + q3 + q4 + q5;
  const maxScore = 10;
  const percentage = (totalScore / maxScore) * 100;

  // Déterminer le niveau
  let level, profile, badgeText, colorClass;
  
  if (percentage <= 30) {
    level = 'initial';
    profile = 'Village assiégé';
    badgeText = 'À la merci des Big Tech';
    colorClass = 'danger';
  } else if (percentage <= 70) {
    level = 'transition';
    profile = 'Village en transition';
    badgeText = 'En chemin vers la résistance';
    colorClass = 'warning';
  } else {
    level = 'resistant';
    profile = 'Village résistant';
    badgeText = 'Bien protégé et autonome';
    colorClass = 'success';
  }

  // Générer les recommandations personnalisées
  const recommendations = generateRecommendations(role, q1, q2, q3, q4, q5, level);

  // Afficher le résultat avec animation
  displayResult(level, profile, badgeText, percentage, recommendations, role);
  
  // Scroll vers le résultat avec délai pour l'animation
  setTimeout(() => {
    const resultSection = document.getElementById('diagnostic-resultat');
    if (resultSection) {
      const offset = 100; // Offset pour le header sticky
      const elementPosition = resultSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, 300);
}

/**
 * Génère des recommandations personnalisées selon le profil
 */
function generateRecommendations(role, q1, q2, q3, q4, q5, level) {
  const recommendations = [];

  // Recommandations selon les réponses faibles
  if (q1 <= 1) {
    recommendations.push({
      title: 'Explorer les logiciels libres',
      description: 'Commencez par tester des alternatives libres pour un ou deux usages courants (par exemple, remplacer un outil de visioconférence ou de stockage).'
    });
  }

  if (q2 <= 1) {
    recommendations.push({
      title: 'Mettre en place un projet de reconditionnement',
      description: 'Organisez un atelier avec les élèves pour réparer et réutiliser du matériel informatique plutôt que de le remplacer systématiquement.'
    });
  }

  if (q3 <= 1) {
    recommendations.push({
      title: 'Sensibiliser à la sobriété numérique',
      description: 'Intégrez des discussions sur l\'impact écologique du numérique dans vos cours ou projets pédagogiques.'
    });
  }

  if (q4 <= 1) {
    recommendations.push({
      title: 'Réfléchir à la souveraineté des données',
      description: 'Évaluez où sont hébergées les données de votre établissement et explorez des alternatives hébergées en Europe ou par des structures publiques.'
    });
  }

  if (q5 <= 1) {
    recommendations.push({
      title: 'Améliorer l\'accessibilité',
      description: 'Testez vos outils numériques avec des critères d\'accessibilité simples : navigation au clavier, contrastes, textes alternatifs.'
    });
  }

  // Recommandations selon le rôle
  if (role === 'chef') {
    recommendations.push({
      title: 'Créer un groupe de travail NIRD',
      description: 'Réunissez des enseignants, des élèves et des personnels techniques pour définir une stratégie progressive de transition.'
    });
  } else if (role === 'enseignant') {
    recommendations.push({
      title: 'Tester une alternative libre dans votre classe',
      description: 'Choisissez un outil que vous utilisez régulièrement et testez son équivalent libre avec vos élèves pendant quelques semaines.'
    });
  } else if (role === 'eleve') {
    recommendations.push({
      title: 'Proposer un projet NIRD au conseil de vie',
      description: 'Présentez une action concrète (défi sobriété, atelier reconditionnement) à vos camarades et aux adultes de l\'établissement.'
    });
  }

  // Recommandations générales selon le niveau
  if (level === 'initial') {
    recommendations.push({
      title: 'Commencer petit',
      description: 'Ne cherchez pas à tout changer d\'un coup. Choisissez une seule action simple à mettre en place dans les prochaines semaines.'
    });
  } else if (level === 'transition') {
    recommendations.push({
      title: 'Consolider et étendre',
      description: 'Vous êtes sur la bonne voie ! Identifiez les actions qui fonctionnent bien et proposez-les à d\'autres classes ou services.'
    });
  } else {
    recommendations.push({
      title: 'Partager votre expérience',
      description: 'Votre établissement est un exemple ! Partagez vos pratiques avec d\'autres établissements et contribuez aux communs éducatifs.'
    });
  }

  return recommendations;
}

/**
 * Affiche le résultat du diagnostic
 */
function displayResult(level, profile, badgeText, percentage, recommendations, role) {
  const resultSection = document.getElementById('diagnostic-resultat');
  if (!resultSection) return;

  // Mettre à jour le badge
  const badge = resultSection.querySelector('.result-badge');
  if (badge) {
    badge.setAttribute('data-level', level);
    badge.querySelector('.badge-value').textContent = badgeText;
  }

  // Définir le texte du rôle
  const roleText = {
    'chef': 'Chef d\'établissement',
    'enseignant': 'Enseignant·e',
    'eleve': 'Élève / éco-délégué·e'
  }[role] || 'toi';

  // Mettre à jour le résumé
  const summary = resultSection.querySelector('.result-summary');
  if (summary) {
    summary.innerHTML = `
      <strong>${profile}</strong><br>
      Ton établissement obtient un score de <strong>${Math.round(percentage)}%</strong> sur l'échelle NIRD.
      ${level === 'initial' ? 'Il est temps de commencer la résistance !' : 
        level === 'transition' ? 'Tu es sur la bonne voie, continue !' : 
        'Félicitations, ton village résiste bien !'}
    `;
  }

  // Afficher les recommandations
  const detailsDiv = resultSection.querySelector('.result-details');
  if (detailsDiv) {
    detailsDiv.innerHTML = `
      <h4>Actions recommandées pour ${roleText}</h4>
      <ul>
        ${recommendations.map(rec => `
          <li>
            <strong>${rec.title}</strong><br>
            ${rec.description}
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Afficher la section résultat
  resultSection.classList.add('active');
}

// Fonction utilitaire pour le scroll vers les fiches-actions
document.addEventListener('click', function(e) {
  if (e.target.matches('[data-scroll-to]')) {
    const targetId = e.target.getAttribute('data-scroll-to');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Animation au scroll moderne avec stagger
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animate-in');
      }, index * 100); // Délai progressif pour l'effet stagger
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer les cartes pour l'animation avec effet stagger
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.pillar-card, .action-card, .resource-column, .question-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
    observer.observe(card);
  });

  // Animation des boutons au hover
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Effet de particules sur les cartes au hover (optionnel)
  const interactiveCards = document.querySelectorAll('.pillar-card, .action-card, .hero-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
});

