const adminUsername = 'drey';
const adminPassword = 'drey';
const storageKey = 'industrialTourBlogData';
const authKey = 'industrialTourEditorUnlocked';

// Custom Cursor Functionality
document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.querySelector('.cursor');

  if (cursor) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Hover effects
    document.addEventListener('mouseenter', function(e) {
      if (e.target && e.target.matches && e.target.matches('button, a, .day-card, .action-button, .button')) {
        cursor.classList.add('hover');
      }
    }, true);

    document.addEventListener('mouseleave', function(e) {
      if (e.target && e.target.matches && e.target.matches('button, a, .day-card, .action-button, .button')) {
        cursor.classList.remove('hover');
      }
    }, true);

    // Click effects
    document.addEventListener('mousedown', function() {
      cursor.classList.add('click');
    });

    document.addEventListener('mouseup', function() {
      cursor.classList.remove('click');
    });
  }

  // Hide loading overlay
  setTimeout(() => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }, 2000);
});

const blogData = {
  heroTitle: 'Industrial Tour Professional Log',
  heroSubtitle: 'A modern industrial tour blog with professional storytelling, daily highlights, and image-ready sections.',
  introTitle: 'Your 7-Day Industry Review',
  introText: 'Each day is presented with a clear summary, professional detail, and room for photos to make your report memorable.',
  footerText: 'Edit your tour entries inside the editor. Add daily images, update notes, and customize every heading to match your project.',
  posts: [
    {
      id: 'day1',
      title: 'Day 1: Welcome & Site Orientation',
      description: 'Arrived at the facility, met the team, and reviewed the operational roadmap for the week. Safety, company culture, and production targets were explained clearly.',
      highlights: [
        'Strategic site introduction and safety briefing',
        'Production process overview from suppliers to finished goods',
        'First impressions of the manufacturing environment'
      ],
      images: ['images/day1.jpg', 'images/day1_2.jpg', 'images/day1_3.jpg', 'images/day1_4.jpg', 'images/day1_5.jpg', 'images/day1_6.jpg', 'images/day1_7.jpg']
    },
    {
      id: 'day2',
      title: 'Day 2: Production Line Insights',
      description: 'Visited the main production line and saw automation, workflow, and quality control in action. The day emphasized operational excellence and efficiency.',
      highlights: [
        'Detailed factory floor tour',
        'Observed quality checkpoints and machine workflow',
        'Learned about performance metrics and output tracking'
      ],
      images: ['images/day2.jpg']
    },
    {
      id: 'day3',
      title: 'Day 3: Research & Innovation Review',
      description: 'Explored the R&D lab and innovation centers. New product prototypes and engineering solutions were presented with real-world industrial applications.',
      highlights: [
        'R&D center walkthrough',
        'Prototype and technology demonstrations',
        'Discussion on future product development'
      ],
      images: ['images/day3.jpg']
    },
    {
      id: 'day4',
      title: 'Day 4: Quality Assurance and Testing',
      description: 'Learned how the company maintains consistent quality through testing, inspections, and defect prevention systems. This day showed the care behind every deliverable.',
      highlights: [
        'Quality lab procedures and testing methods',
        'Examples of product validation and inspection',
        'Continuous improvement practices in production'
      ],
      images: ['images/day4.jpg']
    },
    {
      id: 'day5',
      title: 'Day 5: Logistics & Supply Chain',
      description: 'Studied warehousing, materials handling, and distribution logistics. The day highlighted how inventory, transport, and supply coordination keep operations running smoothly.',
      highlights: [
        'Warehouse layout and inventory management',
        'Logistics systems, packaging, and shipping flow',
        'Supply chain coordination insights'
      ],
      images: ['images/day5.jpg']
    },
    {
      id: 'day6',
      title: 'Day 6: Sustainability Practices',
      description: 'Examined the factory\'s environmental practices, waste reduction efforts, and energy-efficient systems. Sustainability was a core part of the industrial strategy.',
      highlights: [
        'Green initiatives and recycling systems',
        'Energy efficiency and resource management',
        'Community and environmental responsibility programs'
      ],
      images: ['images/day6.jpg']
    },
    {
      id: 'day7',
      title: 'Day 7: Reflection & Final Review',
      description: 'Concluded the tour with final reflections, feedback sessions, and a recap of the most important industry learnings. The closing summary showed how each day built clear professional insights.',
      highlights: [
        'Final presentation and Q&A session',
        'Key lessons learned from the tour',
        'Recommendations for future industrial visits'
      ],
      images: ['images/day7.jpg']
    }
  ]
};

function getSavedData() {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch (error) {
    return null;
  }
}

function mergeSavedData(saved) {
  if (!saved) return;
  Object.keys(blogData).forEach(key => {
    if (saved[key] !== undefined) {
      blogData[key] = saved[key];
    }
  });
}

function saveBlogData() {
  try {
    const serialized = JSON.stringify(blogData);
    localStorage.setItem(storageKey, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    return false;
  }
}

function createPostCard(post, index) {
  const images = Array.isArray(post.images) ? post.images : post.images ? [post.images] : [];
  const imageMarkup = images.length
    ? `<div class="day-gallery">${images.slice(0, 1).map(src => `<img src="${src}" alt="${post.title}" class="day-image" loading="lazy">`).join('')}</div>`
    : '';

  const highlightItems = post.highlights
    .map(item => `<li>${item}</li>`)
    .join('');

  const dayNumber = index + 1;

  return `
    <a href="day${dayNumber}.html" class="day-card-link">
      <article class="day-card reveal" id="${post.id}">
        ${imageMarkup}
        <div class="card-content">
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <ul>${highlightItems}</ul>
          <div class="read-more">Read Full Day Report →</div>
        </div>
      </article>
    </a>
  `;
}

function buildNavigation(posts) {
  const nav = document.getElementById('site-nav');
  const dayLinks = posts
    .map((post, index) => `<a href="day${index + 1}.html">${post.title.replace(/:.+$/, '')}</a>`)
    .join('');
  nav.innerHTML = dayLinks;
}

function populateBlog() {
  document.getElementById('hero-title').textContent = blogData.heroTitle;
  document.getElementById('hero-subtitle').textContent = blogData.heroSubtitle;
  document.getElementById('intro-title').textContent = blogData.introTitle;
  document.getElementById('intro-text').textContent = blogData.introText;
  document.getElementById('footer-text').textContent = blogData.footerText;

  buildNavigation(blogData.posts);

  const contentGrid = document.getElementById('content-grid');
  contentGrid.innerHTML = blogData.posts.map((post, index) => createPostCard(post, index)).join('');
}

function addScrollReveal() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px'
  });

  document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
}

function configureSmoothNav() {
  const nav = document.querySelector('.site-nav');
  if (nav) {
    nav.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return; // only handle same-page anchor links

      event.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function openLoginModal() {
  const loginModal = document.getElementById('login-modal');
  loginModal.classList.remove('hidden');
  loginModal.style.display = 'grid';
  loginModal.removeAttribute('aria-hidden');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (usernameInput) usernameInput.value = '';
  if (passwordInput) passwordInput.value = '';
  const loginError = document.getElementById('login-error');
  if (loginError) loginError.textContent = '';
}

function closeLoginModal() {
  const loginModal = document.getElementById('login-modal');
  loginModal.classList.add('hidden');
  loginModal.style.display = 'none';
  loginModal.setAttribute('aria-hidden', 'true');
}

function showEditorPanel() {
  renderEditorForm();
  const editorPanel = document.getElementById('editor-panel');
  editorPanel.classList.remove('hidden');
  editorPanel.style.display = 'block';
  editorPanel.removeAttribute('aria-hidden');
}

function hideEditorPanel() {
  const editorPanel = document.getElementById('editor-panel');
  editorPanel.classList.add('hidden');
  editorPanel.style.display = 'none';
  editorPanel.setAttribute('aria-hidden', 'true');
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  modal.classList.add('hidden');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

function buildPostEditor(post, index) {
  const images = Array.isArray(post.images) ? post.images : post.images ? [post.images] : [];
  const previewMarkup = images.length
    ? `<div class="day-gallery" id="post-image-preview-${index}">${images.map((src, imgIndex) => `<div class="editor-image-container"><img src="${escapeHTML(src)}" alt="Preview of ${escapeHTML(post.title)}" class="editor-image-preview"><button type="button" class="remove-image-btn" data-post-index="${index}" data-img-index="${imgIndex}" title="Remove image">×</button></div>`).join('')}</div>`
    : `<div id="post-image-preview-${index}" class="editor-image-placeholder">No image uploaded yet</div>`;

  return `
    <div class="editor-card">
      <h4>${escapeHTML(post.title)}</h4>
      <div class="editor-field">
        <label for="post-title-${index}">Day title</label>
        <input id="post-title-${index}" type="text" value="${escapeHTML(post.title)}">
      </div>
      <div class="editor-field">
        <label for="post-description-${index}">Description</label>
        <textarea id="post-description-${index}">${escapeHTML(post.description)}</textarea>
      </div>
      <div class="editor-field">
        <label for="post-highlights-${index}">Highlights (one per line)</label>
        <textarea id="post-highlights-${index}">${escapeHTML(post.highlights.join('\n'))}</textarea>
      </div>
      <div class="editor-field">
        <label for="post-images-${index}">Image paths (one per line)</label>
        <textarea id="post-images-${index}">${escapeHTML(images.join('\n'))}</textarea>
      </div>
      <div class="editor-field">
        <label for="post-image-file-${index}">Upload images</label>
        <input id="post-image-file-${index}" type="file" accept="image/*" class="image-upload-input" data-post-index="${index}" multiple>
        <p class="file-note">Upload multiple photos to attach to this day. They will appear in the day gallery.</p>
      </div>
      ${previewMarkup}
    </div>
  `;
}

function compressImage(dataUrl, callback, quality = 0.7, maxWidth = 1200) {
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
  img.src = dataUrl;
}

function attachImageUploadListeners() {
  document.querySelectorAll('.image-upload-input').forEach(input => {
    input.addEventListener('change', event => {
      const files = Array.from(event.target.files);
      const index = Number(event.target.dataset.postIndex);
      const preview = document.getElementById(`post-image-preview-${index}`);
      const pathInput = document.getElementById(`post-images-${index}`);

      if (!files.length || Number.isNaN(index) || !preview || !pathInput) {
        return;
      }

      // Upload each file to the server
      const uploadPromises = files.map(file => new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch('upload-image.php', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              resolve(data.filePath);
            } else {
              reject(new Error(data.message || 'Upload failed'));
            }
          })
          .catch(error => reject(error));
      }));

      Promise.all(uploadPromises).then(uploadedPaths => {
        const currentImages = Array.isArray(blogData.posts[index].images)
          ? blogData.posts[index].images.slice()
          : blogData.posts[index].images ? [blogData.posts[index].images] : [];

        const mergedImages = currentImages.concat(uploadedPaths);
        blogData.posts[index].images = mergedImages;
        pathInput.value = mergedImages.join('\n');

        const galleryHtml = mergedImages.map((src, imgIndex) => `<div class="editor-image-container"><img src="${src}" alt="Preview of ${escapeHTML(blogData.posts[index].title)}" class="editor-image-preview"><button type="button" class="remove-image-btn" data-post-index="${index}" data-img-index="${imgIndex}" title="Remove image">×</button></div>`).join('');
        if (preview.classList.contains('day-gallery')) {
          preview.innerHTML = galleryHtml;
        } else {
          preview.outerHTML = `<div id="post-image-preview-${index}" class="day-gallery">${galleryHtml}</div>`;
        }
        attachRemoveImageListeners();
      }).catch(error => {
        alert('Error uploading image: ' + error.message);
        console.error('Upload error:', error);
      });
    });
  });
}

function attachRemoveImageListeners() {
  document.querySelectorAll('.remove-image-btn').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      const postIndex = Number(btn.dataset.postIndex);
      const imgIndex = Number(btn.dataset.imgIndex);

      if (!Number.isNaN(postIndex) && !Number.isNaN(imgIndex)) {
        const images = Array.isArray(blogData.posts[postIndex].images)
          ? blogData.posts[postIndex].images.slice()
          : blogData.posts[postIndex].images ? [blogData.posts[postIndex].images] : [];

        images.splice(imgIndex, 1);
        blogData.posts[postIndex].images = images;

        const pathInput = document.getElementById(`post-images-${postIndex}`);
        if (pathInput) {
          pathInput.value = images.join('\n');
        }

        const preview = document.getElementById(`post-image-preview-${postIndex}`);
        if (preview) {
          if (images.length > 0) {
            const galleryHtml = images.map((src, idx) => `<div class="editor-image-container"><img src="${src}" alt="Preview" class="editor-image-preview"><button type="button" class="remove-image-btn" data-post-index="${postIndex}" data-img-index="${idx}" title="Remove image">×</button></div>`).join('');
            preview.innerHTML = galleryHtml;
          } else {
            preview.innerHTML = 'No image uploaded yet';
            preview.className = 'editor-image-placeholder';
          }
          attachRemoveImageListeners();
        }
      }
    });
  });
}

function renderEditorForm() {
  const editorContainer = document.getElementById('editor-form-container');
  editorContainer.innerHTML = `
    <form class="editor-form" id="editor-form">
      <div class="editor-card">
        <h3>Site content</h3>
        <div class="editor-field">
          <label for="editor-heroTitle">Hero title</label>
          <input id="editor-heroTitle" type="text" value="${escapeHTML(blogData.heroTitle)}">
        </div>
        <div class="editor-field">
          <label for="editor-heroSubtitle">Hero subtitle</label>
          <textarea id="editor-heroSubtitle">${escapeHTML(blogData.heroSubtitle)}</textarea>
        </div>
        <div class="editor-field">
          <label for="editor-introTitle">Intro title</label>
          <input id="editor-introTitle" type="text" value="${escapeHTML(blogData.introTitle)}">
        </div>
        <div class="editor-field">
          <label for="editor-introText">Intro text</label>
          <textarea id="editor-introText">${escapeHTML(blogData.introText)}</textarea>
        </div>
        <div class="editor-field">
          <label for="editor-footerText">Footer text</label>
          <textarea id="editor-footerText">${escapeHTML(blogData.footerText)}</textarea>
        </div>
      </div>
      <div class="editor-card">
        <h3>Day pages</h3>
        ${blogData.posts.map(buildPostEditor).join('')}
      </div>
      <div class="editor-actions">
        <button type="button" id="save-changes" class="button primary">Save Changes</button>
        <button type="button" id="reset-changes" class="button secondary">Reset Saved Draft</button>
        <button type="button" id="close-without-save" class="button secondary">Close</button>
      </div>
      <p id="editor-status" class="modal-note"></p>
    </form>
  `;

  attachImageUploadListeners();
  attachRemoveImageListeners();
  document.getElementById('save-changes').addEventListener('click', saveEditorChanges);
  document.getElementById('reset-changes').addEventListener('click', resetSavedDraft);
  document.getElementById('close-without-save').addEventListener('click', hideEditorPanel);
}

function saveEditorChanges() {
  blogData.heroTitle = document.getElementById('editor-heroTitle').value.trim();
  blogData.heroSubtitle = document.getElementById('editor-heroSubtitle').value.trim();
  blogData.introTitle = document.getElementById('editor-introTitle').value.trim();
  blogData.introText = document.getElementById('editor-introText').value.trim();
  blogData.footerText = document.getElementById('editor-footerText').value.trim();

  blogData.posts = blogData.posts.map((post, index) => {
    const title = document.getElementById(`post-title-${index}`).value.trim();
    const description = document.getElementById(`post-description-${index}`).value.trim();
    const highlights = document.getElementById(`post-highlights-${index}`).value
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    const imageLines = document.getElementById(`post-images-${index}`).value
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    return {
      ...post,
      title: title || post.title,
      description: description || post.description,
      highlights: highlights.length ? highlights : post.highlights,
      images: imageLines.length ? imageLines : (Array.isArray(post.images) ? post.images : post.images ? [post.images] : [])
    };
  });

  const savedSuccessfully = saveBlogData();
  
  if (savedSuccessfully) {
    populateBlog();
    addScrollReveal();
    document.getElementById('editor-status').textContent = 'Saved successfully. Redirecting...';
    setTimeout(() => {
      hideEditorPanel();
      window.location.href = 'index.html';
    }, 800);
  } else {
    document.getElementById('editor-status').textContent = 'Error: Could not save changes. Please try again.';
  }
}

function resetSavedDraft() {
  localStorage.removeItem(storageKey);
  location.reload();
}

function validateLogin(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';
  const error = document.getElementById('login-error');

  if (username === adminUsername && password === adminPassword) {
    localStorage.setItem(authKey, 'true');
    error.textContent = '';
    closeLoginModal();
    showEditorPanel();
    return;
  }

  error.textContent = 'Username or password is incorrect. Try again.';
}

function handleProfileButton() {
  if (localStorage.getItem(authKey) === 'true') {
    showEditorPanel();
  } else {
    openLoginModal();
  }
}

function populateDayPage(dayIndex) {
  const post = blogData.posts[dayIndex];
  if (!post) return;

  // Update page title
  document.title = `Industrial Tour Blog | ${post.title}`;

  // Update hero content
  document.getElementById('day-title').textContent = post.title;
  document.getElementById('day-description').textContent = post.description;

  // Update main image
  const mainImage = document.getElementById('main-day-image').querySelector('img');
  const images = Array.isArray(post.images) ? post.images : post.images ? [post.images] : [];
  if (images.length > 0) {
    mainImage.src = images[0];
    mainImage.alt = post.title;
  }

  // Update highlights
  const highlightsList = document.getElementById('day-highlights');
  highlightsList.innerHTML = post.highlights.map(highlight => `<li>${escapeHTML(highlight)}</li>`).join('');

  // Create image gallery
  createImageGallery(images, post.title);

  // Update footer
  document.getElementById('footer-text').textContent = blogData.footerText;
}

function createImageGallery(images, altText) {
  const galleryContainer = document.getElementById('day-gallery');
  galleryContainer.innerHTML = '';

  if (images.length === 0) {
    galleryContainer.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No images available for this day.</p>';
    return;
  }

  const maxVisibleImages = 5;
  const visibleImages = images.slice(0, maxVisibleImages);
  const remainingCount = images.length - maxVisibleImages;

  // Add visible images
  visibleImages.forEach((imageSrc, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.onclick = () => openImageModal(images, index);

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `${altText} - Image ${index + 1}`;
    img.onerror = () => {
      img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#2b3c2b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#d4f2d4" font-size="28">Image unavailable</text></svg>'
      );
    };

    galleryItem.appendChild(img);
    galleryContainer.appendChild(galleryItem);
  });

  // Add "+X more" indicator if there are more images
  if (remainingCount > 0) {
    const moreItem = document.createElement('div');
    moreItem.className = 'gallery-item more-images';
    moreItem.textContent = `+${remainingCount}`;
    moreItem.onclick = () => openImageModal(images, maxVisibleImages);
    galleryContainer.appendChild(moreItem);
  }
}

let currentImageIndex = 0;
let currentImages = [];

function openImageModal(images, startIndex = 0) {
  closeLoginModal();
  hideEditorPanel();

  currentImages = images;
  currentImageIndex = startIndex;

  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const counter = document.getElementById('image-counter');

  modalImg.onerror = () => {
    modalImg.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="100%" height="100%" fill="#24322b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b4e8b4" font-size="48">Image unavailable</text></svg>'
    );
  };

  modalImg.src = currentImages[currentImageIndex] || '';
  modalImg.alt = currentImages[currentImageIndex] ? `${images[currentImageIndex]}` : 'Image unavailable';
  counter.textContent = currentImages.length > 1 ? `${currentImageIndex + 1} / ${currentImages.length}` : '';
  counter.style.display = currentImages.length > 1 ? 'inline-block' : 'none';

  modal.classList.remove('hidden');
  modal.style.display = 'grid';
  modal.setAttribute('aria-hidden', 'false');

  updateNavigationButtons();
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function showPrevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    updateModalImage();
  }
}

function showNextImage() {
  if (currentImageIndex < currentImages.length - 1) {
    currentImageIndex++;
    updateModalImage();
  }
}

function updateModalImage() {
  const modalImg = document.getElementById('modal-image');
  const counter = document.getElementById('image-counter');

  modalImg.src = currentImages[currentImageIndex] || '';
  counter.textContent = currentImages.length > 1 ? `${currentImageIndex + 1} / ${currentImages.length}` : '';
  counter.style.display = currentImages.length > 1 ? 'inline-block' : 'none';

  updateNavigationButtons();
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-image');
  const nextBtn = document.getElementById('next-image');

  prevBtn.disabled = currentImageIndex === 0;
  nextBtn.disabled = currentImageIndex === currentImages.length - 1;
}

function addScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all elements with reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Add staggered animation to day cards
  document.querySelectorAll('.day-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('reveal');
    observer.observe(card);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem(authKey);
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('editor-panel').classList.add('hidden');

  const saved = getSavedData();
  mergeSavedData(saved);

  // Check if we're on a day detail page
  const dayMatch = window.location.pathname.match(/day(\d+)/);
  const dayNumber = dayMatch ? parseInt(dayMatch[1], 10) : null;
  const hasDayDetailTemplate = document.querySelector('.day-detail-page');

  if (dayNumber) {
    populateDayPage(dayNumber - 1); // Array is 0-indexed
  } else if (hasDayDetailTemplate) {
    populateDayPage(0); // default to Day 1 when landing page uses the day-detail layout
  } else {
    populateBlog();
  }

  addScrollReveal();
  configureSmoothNav();

  document.getElementById('profile-button').addEventListener('click', handleProfileButton);
  document.getElementById('login-submit').addEventListener('click', validateLogin);
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', validateLogin);
  }
  document.getElementById('login-close').addEventListener('click', closeLoginModal);
  document.getElementById('close-editor').addEventListener('click', hideEditorPanel);

  const loginModal = document.getElementById('login-modal');
  if (loginModal) {
    loginModal.classList.add('hidden');
    loginModal.style.display = 'none';
    loginModal.setAttribute('aria-hidden', 'true');
  }

  const editorPanel = document.getElementById('editor-panel');
  if (editorPanel) {
    editorPanel.classList.add('hidden');
    editorPanel.style.display = 'none';
    editorPanel.setAttribute('aria-hidden', 'true');
  }

  // Image modal event listeners
  const imageModal = document.getElementById('image-modal');
  if (imageModal) {
    document.getElementById('image-modal-close').addEventListener('click', closeImageModal);
    document.getElementById('prev-image').addEventListener('click', showPrevImage);
    document.getElementById('next-image').addEventListener('click', showNextImage);

    // Close modal on backdrop click
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        closeImageModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (imageModal && !imageModal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeImageModal();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
      }
    });
  }
});
