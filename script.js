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

// Base de connaissances du chatbot
const chatbotKnowledge = {
  greetings: {
    patterns: ['bonjour', 'salut', 'hello', 'hey', 'bonsoir', 'coucou', 'bonne journée'],
    responses: [
      'Salut ! 👋 Comment puis-je t\'aider avec le numérique NIRD aujourd\'hui ?',
      'Bonjour ! 🌿 Prêt·e à découvrir le numérique responsable ?',
      'Hey ! 💚 Je suis là pour t\'aider avec la démarche NIRD.'
    ]
  },
  nird: {
    patterns: ['nird', 'numérique inclusif', 'numérique responsable', 'numérique durable', 'démarche nird'],
    responses: [
      'NIRD signifie <strong>Numérique Inclusif, Responsable et Durable</strong>. C\'est une approche qui combine :\n• L\'inclusion numérique (accessibilité pour tous)\n• La responsabilité (protection des données, éthique)\n• La durabilité (sobriété, réemploi du matériel)\n\nTu veux en savoir plus sur un aspect particulier ?',
      'La démarche NIRD aide les établissements scolaires à réduire leur dépendance aux Big Tech tout en restant performants. C\'est comme un village qui résiste à l\'empire numérique ! 🏰'
    ]
  },
  logiciels_libres: {
    patterns: ['logiciel libre', 'logiciels libres', 'open source', 'libre', 'alternatives libres', 'logiciel gratuit'],
    responses: [
      'Les logiciels libres sont des outils que tu peux utiliser, modifier et partager librement ! 🆓\n\nExemples pour l\'école :\n• <strong>LibreOffice</strong> (bureautique)\n• <strong>Firefox</strong> (navigateur)\n• <strong>GIMP</strong> (retouche photo)\n• <strong>Audacity</strong> (audio)\n\nIls respectent ta liberté et tes données !',
      'Les logiciels libres permettent de ne pas dépendre d\'un seul éditeur. Tu gardes le contrôle sur tes outils numériques. C\'est un pilier du numérique NIRD !'
    ]
  },
  reconditionnement: {
    patterns: ['reconditionnement', 'réemploi', 'recyclage', 'matériel', 'ordinateur', 'pc', 'réparer', 'réparation'],
    responses: [
      'Le reconditionnement, c\'est donner une seconde vie aux ordinateurs ! ♻️\n\n<strong>Bénéfices :</strong>\n• Réduit les déchets électroniques\n• Économise de l\'argent\n• Crée des projets pédagogiques avec les élèves\n• Sensibilise à l\'écologie\n\nTu peux organiser un atelier "Hôpital des PC" dans ton établissement !',
      'Au lieu de jeter un PC "trop vieux", on peut installer un système libre léger (comme Linux) et le réutiliser. Ça peut devenir un super projet avec les élèves ! 🌱'
    ]
  },
  big_tech: {
    patterns: ['big tech', 'gafam', 'google', 'microsoft', 'apple', 'amazon', 'facebook', 'meta', 'dépendance'],
    responses: [
      'Les Big Tech (Google, Apple, Facebook, Amazon, Microsoft) dominent le numérique éducatif. 💼\n\n<strong>Problèmes :</strong>\n• Collecte massive de données\n• Dépendance à leurs services\n• Coûts cachés\n• Manque de transparence\n\n<strong>Solutions NIRD :</strong>\n• Utiliser des alternatives libres\n• Héberger ses données en Europe\n• Choisir des services publics/associatifs',
      'Résister aux Big Tech, c\'est possible ! Commence par remplacer un service à la fois par une alternative libre. Chaque petit pas compte ! 🚶‍♂️'
    ]
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
    patterns: ['diagnostic', 'évaluer', 'score', 'test', 'questionnaire', 'évaluation'],
    responses: [
      'Tu peux faire le diagnostic NIRD directement sur cette page ! 📊\n\nIl te suffit de :\n1. Aller dans la section "Diagnostic NIRD"\n2. Répondre aux 5 questions\n3. Découvrir ton profil de village numérique\n4. Obtenir des recommandations personnalisées\n\nC\'est rapide et ça te donne un plan d\'action !',
      'Le diagnostic te permet de savoir où en est ton établissement sur l\'échelle NIRD. Tu obtiens ensuite des actions concrètes à mettre en place ! 🎯'
    ]
  },
  fiches_actions: {
    patterns: ['fiche', 'action', 'agir', 'faire', 'mettre en place', 'démarrage', 'commencer', 'débuter'],
    responses: [
      'Pour commencer, je te conseille de :\n\n1️⃣ <strong>Faire le diagnostic</strong> pour connaître ta situation\n2️⃣ <strong>Choisir une fiche-action</strong> simple à mettre en place\n3️⃣ <strong>Commencer petit</strong> (une salle, une classe)\n4️⃣ <strong>Impliquer les élèves</strong> dans le projet\n\nLes fiches-actions sont dans la section dédiée ! 📋',
      'Pas besoin d\'être expert·e pour commencer ! Choisis une action simple (comme remplacer un outil par une alternative libre) et teste-la avec un petit groupe. Chaque pas compte ! 🚀'
    ]
  },
  accessibilite: {
    patterns: ['accessibilité', 'handicap', 'inclusif', 'inclusion', 'accessible', 'adaptation'],
    responses: [
      'L\'accessibilité numérique, c\'est rendre les outils utilisables par tous ! ♿\n\n<strong>Points clés :</strong>\n• Navigation au clavier\n• Contrastes de couleurs suffisants\n• Textes alternatifs pour les images\n• Compatibilité avec les lecteurs d\'écran\n• Langage simple et clair\n\nUn numérique inclusif, c\'est un numérique pour tous !',
      'L\'inclusion numérique fait partie du NIRD. On choisit des outils simples, accessibles et bien expliqués pour que tout le monde puisse participer ! 🌈'
    ]
  },
  default: {
    responses: [
      'Intéressant ! 🤔 Peux-tu reformuler ta question ? Je peux t\'aider sur :\n• La démarche NIRD\n• Les logiciels libres\n• Le reconditionnement\n• La sobriété numérique\n• La protection des données\n• L\'accessibilité\n\nOu pose-moi une question plus précise !',
      'Je ne suis pas sûr de comprendre. 😊 Essaie de me poser une question sur :\n• Comment commencer la démarche NIRD\n• Quels logiciels libres utiliser\n• Comment réduire l\'impact écologique\n• Comment protéger les données\n\nJe suis là pour t\'aider !',
      'Hmm, je n\'ai pas la réponse exacte. 💭 Mais je peux t\'aider avec le diagnostic NIRD ou les fiches-actions sur cette page. Tu veux en savoir plus sur quoi précisément ?'
    ]
  }
};

// Fonction pour trouver la meilleure réponse
function findBestResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Vérifier chaque catégorie
  for (const [category, data] of Object.entries(chatbotKnowledge)) {
    if (category === 'default') continue;
    
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  
  // Réponse par défaut
  const defaultResponses = chatbotKnowledge.default.responses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Fonction pour formater le message (support markdown simple)
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/(\d+)[️⃣]/g, '$1️⃣');
}

// Fonction pour ajouter un message dans le chat
function addMessage(text, isUser = false) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = isUser ? '👤' : '🌿';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  const p = document.createElement('p');
  p.innerHTML = formatMessage(text);
  content.appendChild(p);
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll vers le bas
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return messageDiv;
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

// Fonction pour envoyer un message
function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Ajouter le message de l'utilisateur
  addMessage(message, true);
  input.value = '';
  
  // Afficher l'indicateur de frappe
  showTypingIndicator();
  
  // Simuler un délai de réflexion (plus réaliste)
  setTimeout(() => {
    removeTypingIndicator();
    const response = findBestResponse(message);
    addMessage(response, false);
  }, 800 + Math.random() * 400); // Délai entre 800ms et 1200ms
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
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Suggestions rapides
  const suggestions = [
    'Qu\'est-ce que NIRD ?',
    'Quels logiciels libres utiliser ?',
    'Comment commencer ?',
    'C\'est quoi le reconditionnement ?'
  ];
  
  // Ajouter les suggestions après le premier message (une seule fois)
  let suggestionsAdded = false;
  
  const addSuggestions = () => {
    if (suggestionsAdded) return;
    suggestionsAdded = true;
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'chatbot-suggestions';
    suggestions.forEach(suggestion => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-suggestion';
      btn.textContent = suggestion;
      btn.addEventListener('click', () => {
        input.value = suggestion;
        sendMessage();
      });
      suggestionsContainer.appendChild(btn);
    });
    
    // Insérer après les messages
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer && messagesContainer.parentNode) {
      messagesContainer.parentNode.insertBefore(suggestionsContainer, messagesContainer.nextSibling);
    }
  };
  
  // Ajouter les suggestions après 2 secondes
  setTimeout(addSuggestions, 2000);
}

