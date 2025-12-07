# 🏗️ Architecture de l'application

## Vue d'ensemble

L'application **Village Numérique Résistant** est une Single Page Application (SPA) construite avec HTML, CSS et JavaScript vanilla (sans framework).

## Structure des fichiers

```
.
├── index.html              # Page principale (tout-en-un)
├── styles.css              # Feuille de styles principale (design moderne)
├── retro-gaming.css        # Styles pour le mini-jeu rétro-gaming
├── snake-game.css          # Styles pour le jeu Snake caché
├── script.js               # Logique JavaScript principale
├── snake-game.js           # Logique du jeu Snake (easter egg)
├── threejs-integration.js  # Intégration Three.js (scènes 3D)
├── README.md               # Documentation principale
├── DEPLOIEMENT.md          # Guide de déploiement
├── ARCHITECTURE.md         # Ce fichier
├── FAILLE_SECURITE.md      # Documentation sur les failles de sécurité
├── LICENSE                 # Licences (MIT + CC BY-SA)
├── start-server.bat        # Script de démarrage Windows
├── start-server.sh         # Script de démarrage Linux/Mac
└── .gitignore              # Fichiers à ignorer pour Git
```

**Dépendance externe** : Three.js (r128) est chargé via CDN depuis `cdnjs.cloudflare.com`.

## Structure HTML

L'application est organisée en sections dans un seul fichier HTML :

1. **Header** (`<header class="site-header">`)
   - Logo et titre (brand centré)
   - Navigation principale sous le brand (centrée, responsive avec menu mobile)
   - Indicateurs actifs pour la section visible
   - Easter egg subtil pour le jeu Snake (🐍)

2. **Section Accueil** (`<section id="accueil">`)
   - Hero avec introduction et scène 3D (logo NIRD en 3D)
   - Présentation des 5 piliers NIRD
   - Call-to-action vers le diagnostic
   - Dark pattern éthique (bannière d'engagement progressif)

3. **Section Diagnostic** (`<section id="diagnostic">`)
   - Formulaire avec 5 questions + sélection du rôle
   - Calcul automatique du score
   - Affichage des résultats et recommandations personnalisées
   - Sauvegarde des résultats dans localStorage

4. **Section Fiches-actions** (`<section id="fiches-actions">`)
   - 5 fiches-actions prêtes à l'emploi
   - Chaque fiche contient : objectif, étapes, bénéfices, astuce

5. **Section Ressources** (`<section id="ressources">`)
   - Logiciels libres recommandés
   - Pratiques de réemploi
   - Communautés et communs éducatifs

6. **Section Mini-Jeu** (`<section id="jeu">`)
   - Mini-jeu rétro-gaming "Construis le I"
   - Style rétro avec effets néon et scanlines
   - Système de gamification (badges, statistiques, progression)
   - Scène 3D en arrière-plan (particules et cube "I")
   - Sauvegarde des scores et badges dans localStorage

7. **Section Sécurité** (`<section id="securite">`)
   - Présentation pédagogique des failles de sécurité
   - Tests interactifs (XSS, vol de données, manipulation)
   - Explications détaillées des protections

8. **Footer** (`<footer class="site-footer">`)
   - Informations sur les licences
   - Crédits Nuit de l'Info
   - Attribution "Créé avec ❤️ par Marouane"
   - Navigation rapide

9. **Chatbot** (`<div id="chatbot-container">`)
   - Chatbot philosophique "Gérard"
   - Réponses humoristiques et philosophiques
   - Suggestions dynamiques
   - Badge de notification

10. **Jeu Snake caché** (`<div id="snake-game-container">`)
    - Jeu Snake rétro complet
    - Accessible via code secret : N-I-R-D
    - Contrôles clavier et tactile
    - Graphismes rétro avec effets visuels

## Système de design

### Couleurs (variables CSS)

- **Primary** : `#2d8659` (vert) - Couleur principale
- **Secondary** : `#f4a261` (orange) - Couleur secondaire
- **Accent** : `#e76f51` (rouge-orange) - Accents
- **Background** : `#fefefe` / `#f5f7fa` - Arrière-plans
- **Text** : `#2b2d42` / `#6c757d` - Textes

### Typographie

- **Police système** : `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...` (texte principal)
- **Police rétro** : `Press Start 2P` (mini-jeu et éléments rétro)
- **Police moderne** : `Inter`, `Poppins` (titres et accents)
- **Hiérarchie** : h1 (2rem) > h2 (1.75rem) > h3 (1.5rem) > h4 (1.25rem)

### Composants réutilisables

- **Cards** : `.pillar-card`, `.action-card`, `.resource-column`, `.hero-card`
- **Boutons** : `.btn.primary`, `.btn.ghost`, `.retro-btn`
- **Formulaires** : `.question-card`, `.role-options`
- **Badges** : `.result-badge` avec différents niveaux, `.badge-item` pour la gamification
- **Navigation** : `.nav-link` avec indicateurs actifs, animations au hover
- **Chatbot** : Interface de chat avec messages, suggestions, badge de notification
- **Jeu** : Canvas pour le Snake, interface rétro avec effets visuels

## Fonctionnalités JavaScript

### Navigation
- Toggle du menu hamburger (mobile)
- Fermeture automatique au clic sur un lien
- Détection de la section active au scroll
- Mise à jour automatique des indicateurs actifs
- Navigation fluide avec smooth scroll

### Diagnostic interactif
- Calcul du score basé sur 5 questions (0-2 points chacune)
- Détermination du niveau : initial / transition / resistant
- Génération de recommandations personnalisées selon :
  - Le rôle (chef/enseignant/élève)
  - Les réponses faibles
  - Le niveau global
- Sauvegarde des résultats dans localStorage

### Mini-jeu rétro-gaming
- Jeu "Construis le I" avec style rétro
- Système de gamification complet :
  - Badges déblocables (conditions variées)
  - Statistiques persistantes (totalGames, bestScore, level)
  - Barre de progression visuelle
  - Notifications de badges
- Sauvegarde dans localStorage
- Scène 3D en arrière-plan (Three.js)

### Jeu Snake caché
- Activation via code secret : N-I-R-D
- Jeu complet avec :
  - Détection de collision
  - Génération de nourriture
  - Gestion du score et de la vitesse
  - Contrôles clavier (flèches) et tactile
  - Effets visuels (particules, confetti)
- Graphismes rétro avec animations

### Intégration Three.js
- **Scène Hero** : Logo NIRD en 3D (lettres individuelles), particules flottantes, éclairage
- **Scène Rétro** : Cube "I" en 3D, particules animées, lignes de connexion
- Responsive avec redimensionnement automatique
- Optimisations de performance

### Chatbot philosophique
- Chatbot "Gérard" avec personnalité humoristique
- Réponses contextuelles basées sur les mots-clés
- Suggestions dynamiques
- Badge de notification
- Interface accessible (ARIA labels)

### Tests de sécurité interactifs
- Test XSS : démonstration d'injection de script
- Test vol de données : accès au localStorage
- Test manipulation : modification de données
- Explications pédagogiques des failles et protections

### Animations avancées
- Fade-in au scroll pour les cartes (IntersectionObserver)
- Animations CSS : float, pulse, gradientShift, textGlow, etc.
- Transitions fluides pour les interactions
- Support de `prefers-reduced-motion` pour l'accessibilité
- Effets glassmorphism et néon

### localStorage
- Sauvegarde des résultats du diagnostic
- Sauvegarde des badges et statistiques du jeu
- Sauvegarde du meilleur score du Snake
- Persistance des données entre sessions

## Responsive Design

### Breakpoints

- **Mobile** : < 768px
  - Menu hamburger
  - Colonnes uniques
  - Boutons pleine largeur

- **Tablette** : 768px - 968px
  - Grilles adaptatives
  - Navigation horizontale

- **Desktop** : > 968px
  - Layout en colonnes multiples
  - Navigation complète visible

### Grilles CSS

- **Pillars** : `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- **Actions** : `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- **Resources** : `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`

## Accessibilité

- **ARIA labels** : Navigation, sections, boutons
- **Semantic HTML** : `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`
- **Focus visible** : Outline pour la navigation au clavier
- **Contrastes** : Respect des ratios WCAG
- **Reduced motion** : Support des préférences utilisateur

## Performance

- **Dépendances externes** : Three.js (r128) via CDN (~600 KB, mis en cache)
- **JavaScript vanilla** : Code principal sans framework
- **CSS optimisé** : Variables, animations performantes, pas de préprocesseur nécessaire
- **Taille totale locale** : ~105 KB (HTML + CSS + JS)
- **Avec Three.js** : ~705 KB (premier chargement, puis mis en cache)
- **Chargement** : Rapide sur connexion normale
- **Optimisations** :
  - Lazy loading des scènes 3D (initialisation au scroll)
  - Utilisation de `requestAnimationFrame` pour les animations
  - IntersectionObserver pour les animations au scroll
  - localStorage pour la persistance (pas de requêtes serveur)

## Système de gamification

### Badges
Les badges sont débloqués selon différentes conditions :
- **Premier pas** : Compléter le diagnostic
- **Explorateur** : Visiter toutes les sections
- **Champion** : Atteindre un score de 100% au diagnostic
- **Joueur** : Jouer au mini-jeu
- **Maître** : Atteindre un score élevé au mini-jeu
- Et d'autres badges secrets...

### Statistiques persistantes
- `totalGames` : Nombre total de parties jouées
- `bestScore` : Meilleur score atteint
- `level` : Niveau actuel du joueur
- `badges` : Liste des badges débloqués

Toutes les données sont sauvegardées dans `localStorage` avec la clé `nirdGameState`.

### Mini-jeu "Construis le I"
- Style rétro-gaming avec effets néon
- Collecte de lettres pour former "I" (Inclusif)
- Timer et score en temps réel
- Barre de progression visuelle
- Scène 3D en arrière-plan

### Jeu Snake caché
- Activation : Taper "N-I-R-D" sur le clavier
- Jeu complet avec mécaniques classiques
- Graphismes rétro avec effets visuels
- Contrôles clavier et tactile
- Sauvegarde du meilleur score

## Design moderne

### Glassmorphism
- Effet de verre dépoli avec `backdrop-filter: blur()`
- Transparence et bordures subtiles
- Utilisé dans le header, les cartes, et le chatbot

### Animations CSS
- **float** : Animation de flottement pour les éléments
- **pulse** : Pulsation pour les éléments importants
- **gradientShift** : Déplacement de gradient
- **textGlow** : Effet de lueur sur le texte
- **badgePulse** : Animation pour les badges
- **retroGlow** : Effet néon pour le style rétro
- Et bien d'autres...

### Effets interactifs
- Hover avec transformations et ombres
- Indicateurs actifs pour la navigation
- Transitions fluides sur tous les éléments
- Animations au scroll (IntersectionObserver)

### Style rétro-gaming
- Police `Press Start 2P` pour les titres
- Effets de scanlines
- Bordures néon avec glow
- Couleurs vives et contrastées
- Animations de clignotement

## Logique du diagnostic

### Calcul du score

Chaque question vaut 0, 1 ou 2 points :
- **0 point** : Situation dépendante des Big Tech
- **1 point** : Situation mixte / en transition
- **2 points** : Situation résistante / autonome

**Score total** : Somme des 5 questions (max 10 points)
**Pourcentage** : (Score / 10) × 100

### Niveaux

- **Initial** (0-30%) : "Village assiégé" - À la merci des Big Tech
- **Transition** (31-70%) : "Village en transition" - En chemin vers la résistance
- **Resistant** (71-100%) : "Village résistant" - Bien protégé et autonome

### Recommandations

Les recommandations sont générées dynamiquement selon :
1. **Réponses faibles** : Si une question a ≤ 1 point, une recommandation spécifique est ajoutée
2. **Rôle** : Une recommandation adaptée au profil (chef/enseignant/élève)
3. **Niveau global** : Une recommandation générale selon le niveau atteint

## Extensibilité

### Ajouter une nouvelle fiche-action

Dans `index.html`, section `#fiches-actions`, ajoutez :

```html
<article class="action-card" data-tags="chef enseignant">
  <h3>Titre de l'action</h3>
  <p class="action-meta">Difficulté : ⭐⭐☆ – Acteurs : ...</p>
  <ul class="action-points">
    <li><strong>Objectif</strong> : ...</li>
    <li><strong>Étapes clés</strong> : ...</li>
    <li><strong>Bénéfices</strong> : ...</li>
  </ul>
  <p class="action-tip">Astuce : ...</p>
</article>
```

### Ajouter une question au diagnostic

1. Ajoutez la question dans le formulaire HTML
2. Modifiez `calculateDiagnostic()` dans `script.js` pour inclure la nouvelle question
3. Ajustez `maxScore` si nécessaire (actuellement 10)

### Ajouter un badge de gamification

Dans `script.js`, fonction `checkBadges()`, ajoutez une condition :

```javascript
if (/* condition */ && !gameState.badges.includes('nouveau-badge')) {
  unlockBadge('nouveau-badge', 'Nom du badge', 'Description');
}
```

Puis ajoutez le badge dans `index.html`, section `.badges-container`.

### Modifier les couleurs

Dans `styles.css`, modifiez les variables `:root` (lignes 7-18).

## Sécurité

- **Pas de backend** : Aucune donnée n'est envoyée à un serveur
- **Pas de cookies** : Aucun tracking
- **Dépendance externe** : Three.js via CDN (cdnjs.cloudflare.com)
- **Validation côté client** : Le formulaire est validé avant affichage des résultats
- **localStorage** : Utilisé pour la persistance locale (données non sensibles uniquement)
- **Section pédagogique** : Présentation des failles de sécurité avec démonstrations interactives
- **Protection XSS** : Exemples de failles et bonnes pratiques documentées

## Compatibilité navigateurs

- ✅ Chrome/Edge (dernières versions) - Support complet
- ✅ Firefox (dernières versions) - Support complet
- ✅ Safari (dernières versions) - Support complet
- ✅ Opéra (dernières versions) - Support complet
- ⚠️ IE11 : Non supporté (utilisation de CSS Grid, JavaScript moderne, et Three.js)
- ⚠️ Navigateurs très anciens : Three.js nécessite WebGL support

**Fonctionnalités requises** :
- WebGL pour Three.js
- localStorage pour la persistance
- ES6+ JavaScript (arrow functions, const/let, etc.)
- CSS Grid et Flexbox

---

**Architecture simple, efficace et maintenable pour la Nuit de l'Info 2025 ! 🌿**

