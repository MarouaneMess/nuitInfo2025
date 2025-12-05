/* ============================================
   INTÉGRATION THREE.JS - ÉLÉMENTS 3D AMÉLIORÉS
   ============================================ */

// Scènes 3D globales
let retro3DScene = null;
let hero3DScene = null;

// Initialiser la scène 3D pour le fond rétro (améliorée)
function initRetro3DScene() {
  const canvasContainer = document.getElementById('retro-3d-canvas');
  if (!canvasContainer) return;

  // Créer la scène
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Créer la caméra
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 8;
  camera.position.y = 1;

  // Créer le renderer
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
  });
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Créer des particules 3D améliorées
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 30;
    positions[i + 1] = (Math.random() - 0.5) * 30;
    positions[i + 2] = (Math.random() - 0.5) * 20;
    
    // Couleur verte rétro avec variations
    const intensity = 0.3 + Math.random() * 0.7;
    colors[i] = 0;      // R
    colors[i + 1] = intensity;  // G
    colors[i + 2] = intensity * 0.3; // B
    
    sizes[i / 3] = Math.random() * 0.15 + 0.05;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Créer le "I" de NIRD en 3D avec plusieurs cubes
  const letterIGroup = new THREE.Group();
  
  // Corps principal du I
  const mainCube = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2.5, 0.6),
    new THREE.MeshBasicMaterial({
      color: 0x00ff41,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    })
  );
  letterIGroup.add(mainCube);
  
  // Barre supérieure
  const topBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.3, 0.3),
    new THREE.MeshBasicMaterial({
      color: 0x00ff41,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    })
  );
  topBar.position.set(0, 1.4, 0);
  letterIGroup.add(topBar);
  
  // Barre inférieure
  const bottomBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.3, 0.3),
    new THREE.MeshBasicMaterial({
      color: 0x00ff41,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    })
  );
  bottomBar.position.set(0, -1.4, 0);
  letterIGroup.add(bottomBar);
  
  letterIGroup.position.set(0, 0, 0);
  scene.add(letterIGroup);

  // Ajouter un anneau orbital autour du I
  const ringGeometry = new THREE.TorusGeometry(2, 0.05, 8, 50);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff41,
    transparent: true,
    opacity: 0.3
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // Ajouter des lignes de connexion
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array([
    -3, 0, 0,
    3, 0, 0,
    0, -3, 0,
    0, 3, 0,
    0, 0, -3,
    0, 0, 3
  ]);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff41,
    transparent: true,
    opacity: 0.2
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Animation améliorée
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotation du groupe I
    letterIGroup.rotation.x = Math.sin(time * 0.5) * 0.2;
    letterIGroup.rotation.y += 0.02;
    letterIGroup.rotation.z = Math.cos(time * 0.3) * 0.1;

    // Rotation de l'anneau
    ring.rotation.z += 0.01;
    ring.rotation.y += 0.005;

    // Animation des particules
    particles.rotation.y += 0.001;
    particles.rotation.x = Math.sin(time) * 0.1;
    
    const positions = particles.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i * 0.01) * 0.002;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Pulsation du I
    const scale = 1 + Math.sin(time * 2) * 0.1;
    letterIGroup.scale.set(scale, scale, scale);

    // Rotation de la caméra autour de la scène
    camera.position.x = Math.sin(time * 0.3) * 2;
    camera.position.y = Math.cos(time * 0.2) * 1.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  // Gérer le redimensionnement
  function handleResize() {
    const width = canvasContainer.offsetWidth;
    const height = canvasContainer.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', handleResize);
  animate();

  retro3DScene = { scene, camera, renderer, particles, letterIGroup, ring };
  return retro3DScene;
}

// Initialiser une scène 3D pour la section hero
function initHero3DScene() {
  const heroSection = document.querySelector('#accueil.hero, .hero');
  if (!heroSection) return;

  // Créer un conteneur pour le canvas 3D
  const canvasContainer = document.createElement('div');
  canvasContainer.id = 'hero-3d-canvas';
  canvasContainer.style.position = 'absolute';
  canvasContainer.style.top = '0';
  canvasContainer.style.left = '0';
  canvasContainer.style.width = '100%';
  canvasContainer.style.height = '100%';
  canvasContainer.style.pointerEvents = 'none';
  canvasContainer.style.zIndex = '0';
  canvasContainer.style.opacity = '0.3';
  heroSection.style.position = 'relative';
  heroSection.appendChild(canvasContainer);

  // Créer la scène
  const scene = new THREE.Scene();
  scene.background = null;

  // Créer la caméra
  const camera = new THREE.PerspectiveCamera(
    60,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  // Créer le renderer
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
  });
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Créer un logo NIRD 3D
  const nirdGroup = new THREE.Group();

  // Créer les lettres N, I, R, D en 3D
  const letters = ['N', 'I', 'R', 'D'];
  const letterSpacing = 2.5;
  const startX = -3.75;

  letters.forEach((letter, index) => {
    const letterGroup = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.8, 2, 0.8);
    
    // Matériau avec couleur selon la lettre
    const colors = [0x10b981, 0x00ff41, 0xf59e0b, 0x6366f1];
    const material = new THREE.MeshPhongMaterial({
      color: colors[index],
      transparent: true,
      opacity: 0.6,
      emissive: colors[index],
      emissiveIntensity: 0.3
    });

    // Créer plusieurs cubes pour former la lettre
    const cubes = [];
    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = (i - 2) * 0.6;
      cubes.push(cube);
      letterGroup.add(cube);
    }

    letterGroup.position.x = startX + index * letterSpacing;
    nirdGroup.add(letterGroup);
  });

  // Ajouter une lumière
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x00ff41, 1, 100);
  pointLight.position.set(0, 0, 10);
  scene.add(pointLight);

  scene.add(nirdGroup);

  // Particules flottantes
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x10b981,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotation du groupe NIRD
    nirdGroup.rotation.y += 0.005;
    nirdGroup.rotation.x = Math.sin(time) * 0.1;

    // Animation des lettres individuelles
    nirdGroup.children.forEach((letterGroup, index) => {
      letterGroup.rotation.y = Math.sin(time + index) * 0.2;
      letterGroup.children.forEach((cube, i) => {
        cube.position.y = (i - 2) * 0.6 + Math.sin(time * 2 + i * 0.5) * 0.1;
      });
    });

    // Animation des particules
    particles.rotation.y += 0.001;
    const positions = particles.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i * 0.01) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Rotation de la caméra
    camera.position.x = Math.sin(time * 0.5) * 3;
    camera.position.y = Math.cos(time * 0.3) * 2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  // Gérer le redimensionnement
  function handleResize() {
    const width = canvasContainer.offsetWidth;
    const height = canvasContainer.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', handleResize);
  animate();

  hero3DScene = { scene, camera, renderer, nirdGroup, particles };
  return hero3DScene;
}

// Initialiser toutes les scènes 3D quand le DOM est prêt
function initAll3DScenes() {
  // Vérifier que Three.js est chargé
  if (typeof THREE === 'undefined') {
    console.warn('Three.js n\'est pas chargé');
    return;
  }

  // Attendre que Three.js soit chargé
  const checkThreeJS = setInterval(() => {
    if (typeof THREE !== 'undefined') {
      clearInterval(checkThreeJS);
      
      // Initialiser la scène rétro gaming
      setTimeout(() => {
        try {
          initRetro3DScene();
        } catch (error) {
          console.warn('Erreur lors de l\'initialisation de la scène rétro 3D:', error);
        }
      }, 500);

      // Initialiser la scène hero
      setTimeout(() => {
        try {
          initHero3DScene();
        } catch (error) {
          console.warn('Erreur lors de l\'initialisation de la scène hero 3D:', error);
        }
      }, 1000);
    }
  }, 100);
  
  // Timeout de sécurité après 5 secondes
  setTimeout(() => {
    clearInterval(checkThreeJS);
  }, 5000);
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll3DScenes);
} else {
  initAll3DScenes();
}

