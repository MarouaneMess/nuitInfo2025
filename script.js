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

  // Initialiser le chatbot
  initChatbot();

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

/* ============================================
   CHATBOT NIRD - Logique intelligente
   ============================================ */

// Historique de conversation pour contexte
let conversationHistory = [];
let currentContext = null;

// Base de connaissances améliorée du chatbot
const chatbotKnowledge = {
  greetings: {
    patterns: ['bonjour', 'salut', 'hello', 'hey', 'bonsoir', 'coucou', 'bonne journée', 'bonjour', 'hi'],
    responses: [
      'Salut ! 👋 Je suis ton assistant NIRD. Je peux t\'aider à comprendre le numérique inclusif, responsable et durable. Que veux-tu savoir ?',
      'Bonjour ! 🌿 Prêt·e à découvrir comment résister aux Big Tech ? Pose-moi tes questions sur le NIRD !',
      'Hey ! 💚 Je suis là pour t\'aider avec la démarche NIRD. Par où veux-tu commencer ?'
    ],
    suggestions: ['Qu\'est-ce que NIRD ?', 'Comment commencer ?', 'Quels logiciels libres ?']
  },
  nird: {
    patterns: ['nird', 'numérique inclusif', 'numérique responsable', 'numérique durable', 'démarche nird', 'c\'est quoi nird', 'qu\'est-ce que nird', 'définition nird'],
    responses: [
      'NIRD signifie <strong>Numérique Inclusif, Responsable et Durable</strong> ! 🌿\n\nC\'est une approche qui combine 3 piliers :\n\n<strong>📱 Inclusif</strong> : Accessible à tous (handicap, équipement, compétences)\n<strong>🔒 Responsable</strong> : Protection des données, éthique, souveraineté\n<strong>🌍 Durable</strong> : Sobriété énergétique, réemploi matériel, écologie\n\nTu veux approfondir un pilier en particulier ?',
      'La démarche NIRD aide les établissements scolaires à réduire leur dépendance aux Big Tech tout en restant performants. C\'est comme un village qui résiste à l\'empire numérique ! 🏰\n\n<strong>Objectif</strong> : Garder le contrôle sur ses outils et données tout en restant efficace pédagogiquement.',
      'NIRD = <strong>Numérique Inclusif, Responsable et Durable</strong>\n\n💡 <strong>En pratique</strong> :\n• Utiliser des logiciels libres\n• Réutiliser le matériel\n• Protéger les données des élèves\n• Réduire l\'impact écologique\n• Rendre accessible à tous\n\nC\'est une approche globale pour un numérique éthique à l\'école !'
    ],
    suggestions: ['Logiciels libres', 'Reconditionnement', 'Protection données', 'Sobriété numérique']
  },
  logiciels_libres: {
    patterns: ['logiciel libre', 'logiciels libres', 'open source', 'libre', 'alternatives libres', 'logiciel gratuit', 'libreoffice', 'firefox', 'gimp', 'audacity', 'alternative', 'remplacer'],
    responses: [
      'Les logiciels libres sont des outils que tu peux utiliser, modifier et partager librement ! 🆓\n\n<strong>📚 Pour l\'école :</strong>\n• <strong>LibreOffice</strong> → remplace Word/Excel/PowerPoint\n• <strong>Firefox</strong> → navigateur respectueux de la vie privée\n• <strong>GIMP</strong> → retouche photo (alternative Photoshop)\n• <strong>Audacity</strong> → montage audio\n• <strong>VLC</strong> → lecteur vidéo universel\n• <strong>Nextcloud</strong> → stockage cloud libre\n\nIls respectent ta liberté et tes données !',
      'Les logiciels libres permettent de ne pas dépendre d\'un seul éditeur. Tu gardes le contrôle sur tes outils numériques. C\'est un pilier du numérique NIRD ! 💪\n\n<strong>Avantages</strong> :\n✅ Gratuits et légaux\n✅ Pas de collecte de données\n✅ Modifiables selon tes besoins\n✅ Communauté active\n\nTu veux savoir comment les installer ?',
      'Passer aux logiciels libres, c\'est facile ! 🚀\n\n<strong>Étape 1</strong> : Choisis un outil que tu utilises souvent\n<strong>Étape 2</strong> : Trouve son équivalent libre\n<strong>Étape 3</strong> : Teste-le avec un petit groupe\n<strong>Étape 4</strong> : Généralise si ça fonctionne\n\nCommence petit, ça marche mieux !'
    ],
    suggestions: ['Comment installer ?', 'Alternatives Google ?', 'Alternatives Microsoft ?']
  },
  reconditionnement: {
    patterns: ['reconditionnement', 'réemploi', 'recyclage', 'matériel', 'ordinateur', 'pc', 'réparer', 'réparation', 'vieil ordinateur', 'vieil pc', 'linux', 'système libre'],
    responses: [
      'Le reconditionnement, c\'est donner une seconde vie aux ordinateurs ! ♻️\n\n<strong>Bénéfices :</strong>\n• Réduit les déchets électroniques\n• Économise de l\'argent\n• Crée des projets pédagogiques avec les élèves\n• Sensibilise à l\'écologie\n\nTu peux organiser un atelier "Hôpital des PC" dans ton établissement !',
      'Au lieu de jeter un PC "trop vieux", on peut installer un système libre léger (comme Linux) et le réutiliser. Ça peut devenir un super projet avec les élèves ! 🌱\n\n<strong>Étapes :</strong>\n1. Récupérer du matériel\n2. Diagnostiquer les pannes simples\n3. Installer un système libre léger\n4. Effacer proprement les anciennes données\n5. Réutiliser ou donner !',
      'Un projet de reconditionnement, c\'est génial pour les élèves ! 🎓\n\n<strong>Compétences développées :</strong>\n✅ Démontage/remontage\n✅ Installation système\n✅ Sensibilisation écologie\n✅ Travail d\'équipe\n✅ Valorisation du matériel\n\nRegarde la fiche-action "Atelier reconditionnement" sur cette page !'
    ],
    suggestions: ['Comment installer Linux ?', 'Quelle distribution choisir ?', 'Voir la fiche-action']
  },
  big_tech: {
    patterns: ['big tech', 'gafam', 'google', 'microsoft', 'apple', 'amazon', 'facebook', 'meta', 'dépendance', 'alternatives google', 'alternatives microsoft', 'remplacer google', 'remplacer microsoft'],
    responses: [
      'Les Big Tech (Google, Apple, Facebook, Amazon, Microsoft) dominent le numérique éducatif. 💼\n\n<strong>Problèmes :</strong>\n• Collecte massive de données\n• Dépendance à leurs services\n• Coûts cachés\n• Manque de transparence\n\n<strong>Solutions NIRD :</strong>\n• Utiliser des alternatives libres\n• Héberger ses données en Europe\n• Choisir des services publics/associatifs',
      'Résister aux Big Tech, c\'est possible ! Commence par remplacer un service à la fois par une alternative libre. Chaque petit pas compte ! 🚶‍♂️\n\n<strong>Alternatives concrètes :</strong>\n• Google Drive → Nextcloud\n• Gmail → ProtonMail / Tutanota\n• Google Docs → LibreOffice Online\n• Chrome → Firefox\n• Teams → Jitsi Meet',
      'Tu veux remplacer un service Big Tech ? 🎯\n\n<strong>Stratégie :</strong>\n1. Identifie le service le plus utilisé\n2. Trouve 2-3 alternatives libres\n3. Teste avec un petit groupe\n4. Documente la migration\n5. Généralise si ça fonctionne\n\nCommence petit, ça marche mieux !'
    ],
    suggestions: ['Alternatives Google', 'Alternatives Microsoft', 'Services libres']
  },
  donnees: {
    patterns: ['données', 'donnée', 'vie privée', 'privacy', 'rgpd', 'souveraineté', 'hébergement', 'données personnelles'],
    responses: [
      'La souveraineté des données, c\'est garder le contrôle sur les informations de ton établissement ! 🔒\n\n<strong>Bonnes pratiques :</strong>\n• Choisir des hébergeurs européens\n• Utiliser des services publics (Éducation Nationale)\n• Lire les conditions d\'utilisation\n• Limiter la collecte de données\n\nTes données sont précieuses, protège-les !',
      'Les données des élèves sont sensibles. Il faut privilégier des solutions hébergées en Europe avec des règles claires. C\'est un principe fondamental du NIRD !'
    ]
  },
  sobriete: {
    patterns: ['sobriété', 'écologie', 'environnement', 'impact', 'carbone', 'énergie', 'durable', 'écologique'],
    responses: [
      'La sobriété numérique, c\'est utiliser le numérique de manière raisonnée ! 🌍\n\n<strong>Actions concrètes :</strong>\n• Limiter les vidéos HD inutiles\n• Réduire les pièces jointes lourdes\n• Éteindre les appareils non utilisés\n• Allonger la durée de vie du matériel\n• Privilégier le texte à la vidéo\n\nChaque geste compte pour la planète !',
      'Le numérique représente 4% des émissions mondiales de CO₂. En étant plus sobres, on peut réduire cet impact. C\'est aussi ça, le numérique durable ! 💚'
    ]
  },
  diagnostic: {
    patterns: ['diagnostic', 'évaluer', 'score', 'test', 'questionnaire', 'évaluation', 'faire le diagnostic', 'commencer diagnostic'],
    responses: [
      'Tu peux faire le diagnostic NIRD directement sur cette page ! 📊\n\nIl te suffit de :\n1. Aller dans la section "Diagnostic NIRD"\n2. Répondre aux 5 questions\n3. Découvrir ton profil de village numérique\n4. Obtenir des recommandations personnalisées\n\nC\'est rapide et ça te donne un plan d\'action !',
      'Le diagnostic te permet de savoir où en est ton établissement sur l\'échelle NIRD. Tu obtiens ensuite des actions concrètes à mettre en place ! 🎯\n\n<strong>3 profils possibles :</strong>\n🏰 Village assiégé (0-30%)\n🚶 Village en transition (31-70%)\n🛡️ Village résistant (71-100%)\n\nFais le test pour découvrir ton profil !'
    ],
    suggestions: ['Faire le diagnostic', 'Voir les fiches-actions']
  },
  fiches_actions: {
    patterns: ['fiche', 'action', 'agir', 'faire', 'mettre en place', 'démarrage', 'commencer', 'débuter', 'par où commencer', 'première étape', 'premier pas'],
    responses: [
      'Pour commencer, je te conseille de :\n\n1️⃣ <strong>Faire le diagnostic</strong> pour connaître ta situation\n2️⃣ <strong>Choisir une fiche-action</strong> simple à mettre en place\n3️⃣ <strong>Commencer petit</strong> (une salle, une classe)\n4️⃣ <strong>Impliquer les élèves</strong> dans le projet\n\nLes fiches-actions sont dans la section dédiée ! 📋',
      'Pas besoin d\'être expert·e pour commencer ! Choisis une action simple (comme remplacer un outil par une alternative libre) et teste-la avec un petit groupe. Chaque pas compte ! 🚀\n\n<strong>5 fiches-actions disponibles :</strong>\n• Passer une salle sous Linux NIRD\n• Atelier reconditionnement avec les élèves\n• Remplacer un service propriétaire\n• Défi sobriété numérique\n• Créer une charte NIRD',
      'Les fiches-actions sont des guides pas-à-pas ! 📝\n\nChaque fiche contient :\n✅ Objectif clair\n✅ Étapes détaillées\n✅ Bénéfices attendus\n✅ Astuces pratiques\n✅ Niveau de difficulté\n\nParfait pour démarrer concrètement !'
    ],
    suggestions: ['Voir les fiches', 'Faire le diagnostic', 'Première action']
  },
  accessibilite: {
    patterns: ['accessibilité', 'handicap', 'inclusif', 'inclusion', 'accessible', 'adaptation', 'lecteur d\'écran', 'contraste', 'navigation clavier'],
    responses: [
      'L\'accessibilité numérique, c\'est rendre les outils utilisables par tous ! ♿\n\n<strong>Points clés :</strong>\n• Navigation au clavier\n• Contrastes de couleurs suffisants\n• Textes alternatifs pour les images\n• Compatibilité avec les lecteurs d\'écran\n• Langage simple et clair\n\nUn numérique inclusif, c\'est un numérique pour tous !',
      'L\'inclusion numérique fait partie du NIRD. On choisit des outils simples, accessibles et bien expliqués pour que tout le monde puisse participer ! 🌈\n\n<strong>Bonnes pratiques :</strong>\n✅ Tester avec un lecteur d\'écran\n✅ Vérifier les contrastes (ratio 4.5:1 minimum)\n✅ Permettre la navigation au clavier\n✅ Ajouter des textes alternatifs\n✅ Utiliser un langage clair',
      'L\'accessibilité, c\'est l\'un des 3 piliers du NIRD ! 🎯\n\n<strong>Pourquoi c\'est important :</strong>\n• Permet à tous les élèves de participer\n• Améliore l\'expérience pour tous\n• Respecte la réglementation\n• Crée une école vraiment inclusive\n\nLes logiciels libres sont souvent plus accessibles !'
    ],
    suggestions: ['Outils accessibles', 'Tests accessibilité', 'En savoir plus']
  },
  default: {
    responses: [
      'Intéressant ! 🤔 Peux-tu reformuler ta question ? Je peux t\'aider sur :\n• La démarche NIRD\n• Les logiciels libres\n• Le reconditionnement\n• La sobriété numérique\n• La protection des données\n• L\'accessibilité\n\nOu pose-moi une question plus précise !',
      'Je ne suis pas sûr de comprendre. 😊 Essaie de me poser une question sur :\n• Comment commencer la démarche NIRD\n• Quels logiciels libres utiliser\n• Comment réduire l\'impact écologique\n• Comment protéger les données\n\nJe suis là pour t\'aider !',
      'Hmm, je n\'ai pas la réponse exacte. 💭 Mais je peux t\'aider avec le diagnostic NIRD ou les fiches-actions sur cette page. Tu veux en savoir plus sur quoi précisément ?'
    ]
  }
};

// Fonction améliorée pour trouver la meilleure réponse avec scoring
function findBestResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Sauvegarder dans l'historique
  conversationHistory.push({ role: 'user', message: lowerMessage });
  if (conversationHistory.length > 10) {
    conversationHistory.shift(); // Garder seulement les 10 derniers messages
  }
  
  // Scoring des catégories
  const scores = {};
  
  for (const [category, data] of Object.entries(chatbotKnowledge)) {
    if (category === 'default') continue;
    
    let score = 0;
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        // Score plus élevé si le pattern est un mot complet
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        score += regex.test(lowerMessage) ? 3 : 1;
      }
    }
    
    if (score > 0) {
      scores[category] = score;
    }
  }
  
  // Trouver la catégorie avec le score le plus élevé
  const bestCategory = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b, null
  );
  
  // Gestion des questions complexes (plusieurs catégories)
  if (bestCategory && scores[bestCategory] > 0) {
    currentContext = bestCategory;
    const responses = chatbotKnowledge[bestCategory].responses;
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Ajouter des suggestions contextuelles si disponibles
    if (chatbotKnowledge[bestCategory].suggestions) {
      return {
        text: response,
        suggestions: chatbotKnowledge[bestCategory].suggestions,
        actionButtons: getActionButtons(bestCategory)
      };
    }
    
    return {
      text: response,
      suggestions: getDefaultSuggestions(),
      actionButtons: getActionButtons(bestCategory)
    };
  }
  
  // Réponse par défaut avec suggestions intelligentes
  const defaultResponses = chatbotKnowledge.default.responses;
  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    suggestions: getDefaultSuggestions(),
    actionButtons: []
  };
}

// Fonction pour obtenir les boutons d'action selon le contexte
function getActionButtons(category) {
  const buttons = {
    'diagnostic': [
      { text: '📊 Faire le diagnostic', action: 'scroll', target: '#diagnostic' }
    ],
    'fiches_actions': [
      { text: '📋 Voir les fiches', action: 'scroll', target: '#fiches-actions' },
      { text: '📊 Faire le diagnostic', action: 'scroll', target: '#diagnostic' }
    ],
    'logiciels_libres': [
      { text: '📚 Voir les ressources', action: 'scroll', target: '#ressources' }
    ],
    'reconditionnement': [
      { text: '📋 Voir la fiche-action', action: 'scroll', target: '#fiches-actions' }
    ],
    'big_tech': [
      { text: '📚 Alternatives libres', action: 'scroll', target: '#ressources' }
    ]
  };
  
  return buttons[category] || [];
}

// Fonction pour obtenir les suggestions par défaut
function getDefaultSuggestions() {
  return [
    'Qu\'est-ce que NIRD ?',
    'Comment commencer ?',
    'Quels logiciels libres ?',
    'C\'est quoi le reconditionnement ?'
  ];
}

// Fonction pour formater le message (support markdown simple amélioré)
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/(\d+)[️⃣]/g, '$1️⃣')
    .replace(/✅/g, '<span style="color: var(--color-success);">✅</span>')
    .replace(/❌/g, '<span style="color: var(--color-danger);">❌</span>');
}

// Fonction améliorée pour ajouter un message dans le chat
function addMessage(data, isUser = false) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = isUser ? '👤' : '🌿';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  const p = document.createElement('p');
  
  // Gérer les données (string simple ou objet avec suggestions)
  if (typeof data === 'string') {
    p.innerHTML = formatMessage(data);
  } else {
    p.innerHTML = formatMessage(data.text);
    
    // Ajouter les boutons d'action si disponibles
    if (data.actionButtons && data.actionButtons.length > 0) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'message-actions';
      buttonsContainer.style.marginTop = '0.75rem';
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.gap = '0.5rem';
      buttonsContainer.style.flexWrap = 'wrap';
      
      data.actionButtons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'message-action-btn';
        button.textContent = btn.text;
        button.addEventListener('click', () => {
          if (btn.action === 'scroll') {
            const target = document.querySelector(btn.target);
            if (target) {
              const chatbotWindow = document.getElementById('chatbot-window');
              chatbotWindow.classList.remove('active');
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 300);
            }
          }
        });
        buttonsContainer.appendChild(button);
      });
      
      content.appendChild(buttonsContainer);
    }
  }
  
  content.appendChild(p);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll vers le bas avec animation
  setTimeout(() => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
  
  // Retourner les suggestions si disponibles
  return typeof data === 'object' ? data.suggestions : null;
}

// Fonction pour afficher l'indicateur de frappe
function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatbot-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chatbot-message bot-message typing-indicator-container';
  typingDiv.id = 'typing-indicator';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '🌿';
  
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  
  typingDiv.appendChild(avatar);
  typingDiv.appendChild(indicator);
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fonction pour supprimer l'indicateur de frappe
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Fonction améliorée pour envoyer un message
function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Désactiver l'input pendant le traitement
  input.disabled = true;
  const sendBtn = document.getElementById('chatbot-send');
  sendBtn.disabled = true;
  
  // Ajouter le message de l'utilisateur
  addMessage(message, true);
  input.value = '';
  
  // Afficher l'indicateur de frappe
  showTypingIndicator();
  
  // Simuler un délai de réflexion (plus réaliste)
  setTimeout(() => {
    removeTypingIndicator();
    const response = findBestResponse(message);
    const suggestions = addMessage(response, false);
    
    // Mettre à jour les suggestions dynamiques
    updateSuggestions(suggestions || getDefaultSuggestions());
    
    // Réactiver l'input
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }, 800 + Math.random() * 400); // Délai entre 800ms et 1200ms
}

// Fonction pour mettre à jour les suggestions dynamiques
function updateSuggestions(suggestions) {
  let suggestionsContainer = document.querySelector('.chatbot-suggestions');
  
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'chatbot-suggestions';
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputContainer = document.querySelector('.chatbot-input-container');
    messagesContainer.parentNode.insertBefore(suggestionsContainer, inputContainer);
  }
  
  // Vider et remplir avec les nouvelles suggestions
  suggestionsContainer.innerHTML = '';
  suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.className = 'chatbot-suggestion';
    btn.textContent = suggestion;
    btn.addEventListener('click', () => {
      const input = document.getElementById('chatbot-input');
      input.value = suggestion;
      sendMessage();
    });
    suggestionsContainer.appendChild(btn);
  });
}

// Initialiser le chatbot
function initChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const window = document.getElementById('chatbot-window');
  const close = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');
  const badge = document.getElementById('chatbot-badge');
  
  // Ouvrir/fermer le chatbot
  toggle.addEventListener('click', () => {
    window.classList.toggle('active');
    if (window.classList.contains('active')) {
      badge.classList.add('hidden');
      input.focus();
    }
  });
  
  close.addEventListener('click', () => {
    window.classList.remove('active');
  });
  
  // Envoyer avec le bouton
  send.addEventListener('click', sendMessage);
  
  // Envoyer avec Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Suggestions initiales
  setTimeout(() => {
    updateSuggestions(getDefaultSuggestions());
  }, 1500);
  
  // Effet de focus sur l'input
  input.addEventListener('focus', () => {
    input.parentElement.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.style.boxShadow = 'none';
  });
}

