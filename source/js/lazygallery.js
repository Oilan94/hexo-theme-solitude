// lazygallery.js
let albumData = window.LAZYGALLERY_DATA || [];
let loadedCount = 0;
const pageSize = 12;

function renderImages() {
  const container = document.getElementById('lazygallery-justified');
  const nextImages = albumData.slice(loadedCount, loadedCount + pageSize);
  nextImages.forEach(img => {
    const imgEl = document.createElement('img');
    imgEl.setAttribute('data-src', img.url);
    imgEl.setAttribute('alt', img.title || '');
    imgEl.setAttribute('width', img.width);
    imgEl.setAttribute('height', img.height);
    imgEl.className = 'lazyload';
    container.appendChild(imgEl);
  });
  loadedCount += nextImages.length;
  layoutGallery();
  if (window.lazyLoadInstance) window.lazyLoadInstance.update();
  if (loadedCount >= albumData.length) {
    document.getElementById('lazygallery-load-more').style.display = 'none';
  }
}

function layoutGallery() {
  const container = document.getElementById('lazygallery-justified');
  if (!container || container.clientWidth < 100) {
    setTimeout(layoutGallery, 100);
    return;
  }
  const images = Array.from(container.querySelectorAll('img'));
  const items = images.map(img => ({
    width: parseInt(img.getAttribute('width')),
    height: parseInt(img.getAttribute('height'))
  }));
  const layout = justifiedLayout(items, {
    containerWidth: container.clientWidth,
    targetRowHeight: 180,
    boxSpacing: 6
  });
  images.forEach((img, i) => {
    const box = layout.boxes[i];
    img.style.position = 'absolute';
    img.style.left = box.left + 'px';
    img.style.top = box.top + 'px';
    img.style.width = box.width + 'px';
    img.style.height = box.height + 'px';
  });
  container.style.position = 'relative';
  container.style.height = layout.containerHeight + 'px';
}

document.getElementById('lazygallery-load-more').addEventListener('click', renderImages);
window.addEventListener('resize', layoutGallery);

document.addEventListener('DOMContentLoaded', () => {
  renderImages();
});
