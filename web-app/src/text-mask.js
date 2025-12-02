// Text mask animation - images revealed through text
const imageContainer = document.getElementById('image-container');
const textContainer = document.getElementById('text-container');

let images = [];
let currentImageIndex = 0;
let textLines = [];
let currentLineIndex = 0;
const maxVisibleLines = 3;

// Load data
async function loadData() {
  try {
    const baseUrl = import.meta.env.BASE_URL;

    // Load images data
    const imagesData = await fetch(`${baseUrl}images-data.json`).then(r => r.json());

    // Filter images tagged with "people" or "exhibition"
    images = imagesData.filter(img => {
      if (!img.tags) return false;
      return img.tags.some(tag =>
        tag.label === 'people' || tag.label === 'exhibition'
      );
    });

    if (images.length === 0) {
      // Fallback to all images if no matching tags
      images = imagesData;
    }

    // Shuffle images
    images = images.sort(() => Math.random() - 0.5);

    // Load poetry text
    const textData = await fetch(`${baseUrl}text-data.json`).then(r => r.json());

    // Filter for poetry
    const poetryPosts = textData.posts.filter(post =>
      post.tags && (
        post.tags.includes('poetry') ||
        post.tags.includes('wishes') ||
        post.tags.includes('linkėjimai')
      )
    );

    const post = poetryPosts.length > 0
      ? poetryPosts[Math.floor(Math.random() * poetryPosts.length)]
      : textData.posts[Math.floor(Math.random() * textData.posts.length)];

    // Split text into lines (sentences or short phrases)
    const sentences = post.content.split(/[.!?]\s+/).filter(s => s.trim().length > 0);
    textLines = [];

    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      // Break long sentences into 2-3 word chunks
      for (let i = 0; i < words.length; i += 3) {
        const chunk = words.slice(i, i + 3).join(' ');
        if (chunk.trim()) {
          textLines.push(chunk.trim());
        }
      }
    });

    // Start animation
    startAnimation();
  } catch (error) {
    console.error('Failed to load data:', error);
    // Fallback
    textLines = ['Tekstai', 'yra', 'čia', 'Texts', 'are', 'here'];
    startAnimation();
  }
}

function loadImage(index) {
  if (!images[index]) return;

  const img = document.createElement('img');
  const baseUrl = import.meta.env.BASE_URL;
  img.src = `${baseUrl}${images[index].path}`;

  img.onload = () => {
    // Remove previous active image
    const prevActive = imageContainer.querySelector('img.active');
    if (prevActive) {
      prevActive.classList.remove('active');
      // Remove after fade out
      setTimeout(() => prevActive.remove(), 2000);
    }

    imageContainer.appendChild(img);
    // Trigger fade in
    setTimeout(() => img.classList.add('active'), 50);
  };
}

function showNextLines() {
  // Remove old lines
  const oldLines = textContainer.querySelectorAll('.text-line');
  oldLines.forEach(line => {
    line.classList.add('fade-out');
  });

  setTimeout(() => {
    textContainer.innerHTML = '';

    // Show next 2-3 lines
    const linesToShow = Math.min(
      maxVisibleLines,
      textLines.length - currentLineIndex
    );

    for (let i = 0; i < linesToShow; i++) {
      if (currentLineIndex >= textLines.length) {
        currentLineIndex = 0; // Loop back
      }

      const line = document.createElement('div');
      line.className = 'text-line';
      line.textContent = textLines[currentLineIndex];
      textContainer.appendChild(line);

      // Stagger the fade in
      setTimeout(() => {
        line.classList.add('visible');
      }, i * 200);

      currentLineIndex++;
    }
  }, 800);
}

function startAnimation() {
  // Load first image
  loadImage(currentImageIndex);

  // Show first lines
  showNextLines();

  // Change images every 8 seconds
  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    loadImage(currentImageIndex);
  }, 8000);

  // Change text every 4 seconds
  setInterval(() => {
    showNextLines();
  }, 4000);
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
loadData();
