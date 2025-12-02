// Text animation inspired by the Flash app
const container = document.getElementById('animation-container');
const animations = ['fadeInOut', 'slideAcross', 'scaleAndFade', 'zoomInOut', 'drift'];
let textContent = '';
let words = [];
let activeFragments = 0;
const maxFragments = 30;

// Load random poetry text
async function loadText() {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}text-data.json`);
    const data = await response.json();

    // Filter for poetry/creative texts
    const poetryPosts = data.posts.filter(post =>
      post.tags && (
        post.tags.includes('poetry') ||
        post.tags.includes('wishes') ||
        post.tags.includes('linkėjimai')
      )
    );

    // Pick random post (or first if no poetry found)
    const post = poetryPosts.length > 0
      ? poetryPosts[Math.floor(Math.random() * poetryPosts.length)]
      : data.posts[Math.floor(Math.random() * data.posts.length)];

    textContent = post.content;

    // Split into words and phrases
    words = textContent.split(/\s+/).filter(w => w.length > 0);

    // Also add some phrases (2-3 word combinations)
    const phrases = [];
    for (let i = 0; i < words.length - 2; i++) {
      if (Math.random() > 0.7) {
        phrases.push(words.slice(i, i + 2).join(' '));
      }
      if (Math.random() > 0.85) {
        phrases.push(words.slice(i, i + 3).join(' '));
      }
    }

    words = [...words, ...phrases];

    // Start animation loop
    startAnimation();
  } catch (error) {
    console.error('Failed to load text:', error);
    // Fallback text
    words = ['Tekstai', 'yra', 'čia', 'Words', 'are', 'here', 'Typography', 'Animation'];
    startAnimation();
  }
}

function createTextFragment() {
  if (activeFragments >= maxFragments || words.length === 0) {
    return;
  }

  const fragment = document.createElement('div');
  fragment.className = 'text-fragment';

  // Random word or phrase
  const text = words[Math.floor(Math.random() * words.length)];
  fragment.textContent = text;

  // Random position
  const x = Math.random() * (window.innerWidth - 200);
  const y = Math.random() * (window.innerHeight - 100);
  fragment.style.left = `${x}px`;
  fragment.style.top = `${y}px`;

  // Random size - much bigger range, some words can be massive
  const fontSize = 20 + Math.random() * 200; // Range: 20-220px
  fragment.style.fontSize = `${fontSize}px`;

  // Random opacity for layering effect
  const opacity = 0.3 + Math.random() * 0.7;
  fragment.style.opacity = opacity;

  // Random animation
  const animation = animations[Math.floor(Math.random() * animations.length)];
  const duration = 5 + Math.random() * 8; // Longer duration: 5-13 seconds
  fragment.style.animation = `${animation} ${duration}s ease-in-out`;

  // No rotation - removed for cleaner look

  container.appendChild(fragment);
  activeFragments++;

  // Remove after animation completes
  setTimeout(() => {
    fragment.remove();
    activeFragments--;
  }, duration * 1000);
}

function startAnimation() {
  // Create new fragments at varying intervals
  setInterval(() => {
    const numFragments = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numFragments; i++) {
      setTimeout(() => createTextFragment(), i * 100);
    }
  }, 800);

  // Initial burst
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createTextFragment(), i * 200);
  }
}

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreen-btn');

fullscreenBtn.addEventListener('click', () => {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
});

// Initialize
loadText();
