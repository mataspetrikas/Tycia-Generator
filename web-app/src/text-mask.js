// Text mask animation - images revealed through text
const imageContainer = document.getElementById('image-container');
const textContainer = document.getElementById('text-container');

let images = [];
let currentImageIndex = 0;
let textLines = [];
let currentLineIndex = 0;
const maxVisibleLines = 1; // Show one line at a time

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

function showNextLines() {
  // Loop back to beginning when text is over
  if (currentLineIndex >= textLines.length) {
    currentLineIndex = 0;
  }

  // Remove old lines
  const oldLines = textContainer.querySelectorAll('.text-line');
  oldLines.forEach(line => {
    line.classList.add('fade-out');
  });

  setTimeout(() => {
    textContainer.innerHTML = '';

    // Get current image URL
    const baseUrl = import.meta.env.BASE_URL;
    const currentImage = images[currentImageIndex];
    const imageUrl = currentImage ? `${baseUrl}${currentImage.path}` : '';

    // Show one line at a time
    const line = document.createElement('div');
    line.className = 'text-line';
    line.textContent = textLines[currentLineIndex];

    // Apply current image as background for text mask effect
    line.style.backgroundImage = `url('${imageUrl}')`;
    line.style.backgroundSize = 'cover';
    line.style.backgroundPosition = 'center';

    textContainer.appendChild(line);

    // Fade in
    setTimeout(() => {
      line.classList.add('visible');
    }, 100);

    currentLineIndex++;
  }, 1000);
}

function startAnimation() {
  // Show first line
  showNextLines();

  // Change images and text every 6 seconds (slower)
  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showNextLines();
  }, 6000);
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
