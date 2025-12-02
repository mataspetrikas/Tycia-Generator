import './style.css'

// Gallery state
let items = [];
let currentIndex = 0;

// Load data and initialize gallery
async function init() {
  try {
    // Load images data
    const baseUrl = import.meta.env.BASE_URL;
    const imagesData = await fetch(`${baseUrl}images-data.json`).then(r => r.json());

    // TODO: Fix text-data.json and re-enable text posts
    // const textsData = await fetch(`${baseUrl}text-data.json`).then(r => r.json());

    // Create gallery items from images
    items = imagesData.map(img => ({
      type: 'image',
      ...img
    }));

    // Shuffle items for varied gallery
    items = items.sort(() => Math.random() - 0.5);

    renderGallery();
    setupModal();
  } catch (error) {
    console.error('Failed to load data:', error);
    document.querySelector('#gallery').innerHTML =
      '<p style="text-align: center; color: #999;">Failed to load gallery data</p>';
  }
}

// Render gallery
function renderGallery() {
  const gallery = document.querySelector('#gallery');
  const baseUrl = import.meta.env.BASE_URL;

  gallery.innerHTML = items.map((item, index) => {
    if (item.type === 'image') {
      return `
        <div class="post-it" data-index="${index}">
          <img src="${baseUrl}${item.path}" alt="Archive image ${index + 1}" loading="lazy">
        </div>
      `;
    } else {
      const preview = item.text.substring(0, 100);
      return `
        <div class="post-it" data-index="${index}">
          <div class="post-it-text">${preview}${item.text.length > 100 ? '...' : ''}</div>
        </div>
      `;
    }
  }).join('');

  // Add click handlers
  gallery.querySelectorAll('.post-it').forEach(card => {
    card.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      openModal(index);
    });
  });
}

// Setup modal
function setupModal() {
  const modal = document.querySelector('#modal');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');

  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'none') {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    }
  });
}

// Open modal
function openModal(index) {
  currentIndex = index;
  const modal = document.querySelector('#modal');
  const modalContent = document.querySelector('.modal-content');
  const item = items[index];

  if (item.type === 'image') {
    const baseUrl = import.meta.env.BASE_URL;
    const tags = item.tags ? item.tags.slice(0, 3).map(t => t.label).join(', ') : '';
    const flickrLink = item.flickr_url ?
      `<a href="${item.flickr_url}" target="_blank">View on Flickr</a>` : '';

    modalContent.innerHTML = `
      <img src="${baseUrl}${item.path}" alt="Archive image">
      <div class="meta">
        <div>Dimensions: ${item.width} × ${item.height}</div>
        ${tags ? `<div>Tags: ${tags}</div>` : ''}
        ${flickrLink}
      </div>
    `;
  } else {
    modalContent.innerHTML = `
      ${item.title ? `<h2>${item.title}</h2>` : ''}
      <div class="text-content">${item.text}</div>
      <div class="meta">
        ${item.date ? `<div>Date: ${new Date(item.date).toLocaleDateString()}</div>` : ''}
      </div>
    `;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const modal = document.querySelector('#modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Navigate between items
function navigate(direction) {
  currentIndex = (currentIndex + direction + items.length) % items.length;
  openModal(currentIndex);
}

// Initialize on load
init();
