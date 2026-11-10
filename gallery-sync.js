/* Global Tecni: carga fotos publicadas desde la app Android. */
(async function syncGalleryFromGitHub() {
  try {
    const response = await fetch('./data/uploads.json?t=' + Date.now(), {cache: 'no-store'});
    if (!response.ok) return;
    const payload = await response.json();
    if (!Array.isArray(payload.items)) return;
    const published = payload.items.filter(item =>
      item && typeof item.src === 'string' &&
      /^\.\/img\/Galeria\/Remotas\/[0-9a-z-]+\.jpg$/.test(item.src) &&
      typeof item.cat === 'string' && item.cat.length >= 2 && item.cat.length <= 45
    );
    const existing = new Set(gallery.map(item => item.src));
    const incoming = published.filter(item => !existing.has(item.src)).reverse();
    if (!incoming.length) return;
    gallery.unshift(...incoming);
    for (const item of incoming) {
      if (!categories.some(c => c.toLowerCase() === item.cat.toLowerCase())) {
        categories.push(item.cat);
        const category = item.cat;
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.onclick = () => {
          currentFilter = category;
          renderFilters();
          renderGallery();
        };
        filtersEl.appendChild(btn);
      }
    }
    renderFilters();
    renderGallery();
  } catch (error) {
    console.warn('No se pudo cargar la galería remota:', error);
  }
})();
