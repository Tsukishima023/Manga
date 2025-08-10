const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') root.classList.add('light');
if (themeToggle){
  const setPressed = () => themeToggle.setAttribute('aria-pressed', root.classList.contains('light') ? 'true' : 'false');
  setPressed();
  themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    setPressed();
  });
}

const grid = document.getElementById('grid');
const template = document.getElementById('cardTemplate');
const emptyMsg = document.getElementById('emptyMsg');
const q = document.getElementById('q');
const clearFiltersBtn = document.getElementById('clearFilters');

let works = Array.isArray(window.WORKS) ? window.WORKS.slice() : [];
let activeTags = new Set();
let filtered = works.slice();

function renderTags(){
  const all = new Set();
  works.forEach(w => (w.tags||[]).forEach(t => all.add(t)));
  const wrap = document.querySelector('.tags');
  wrap.innerHTML = '';
  [...all].sort().forEach(tag => {
    const b = document.createElement('button');
    b.className = 'tag';
    b.type = 'button';
    b.textContent = `#${tag}`;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag);
      b.setAttribute('aria-pressed', activeTags.has(tag) ? 'true' : 'false');
      applyFilters();
    });
    wrap.appendChild(b);
  });
}
function cardFor(w, index){
  const node = template.content.firstElementChild.cloneNode(true);
  const btn = node.querySelector('.card-link');
  const pic = node.querySelector('picture');
  const img = node.querySelector('img');
  const title = node.querySelector('.title');
  const meta = node.querySelector('.meta');

  btn.dataset.index = index;
  btn.setAttribute('aria-label', `${w.title} を拡大表示`);
  title.textContent = w.title;
  meta.textContent = w.year;

  const sourceWebp = document.createElement('source');
  sourceWebp.type = 'image/webp';
  sourceWebp.srcset = `${w.thumbWebp}`;
  pic.appendChild(sourceWebp);

  img.src = w.thumb;
  img.alt = w.alt || w.title;
  img.loading = 'lazy';

  btn.addEventListener('click', () => openModal(index));
  return node;
}
function renderGrid(list){
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();
  list.forEach((w, i) => frag.appendChild(cardFor(w, i)));
  grid.appendChild(frag);
  emptyMsg.hidden = list.length !== 0;
  grid.setAttribute('aria-busy', 'false');
}
function applyFilters(){
  const text = (q.value || '').trim().toLowerCase();
  filtered = works.filter(w => {
    const hitText = !text || [w.title, w.alt, w.caption, ...(w.tags||[])]
      .join(' ').toLowerCase().includes(text);
    const hitTags = activeTags.size === 0 || (w.tags||[]).some(t => activeTags.has(t));
    return hitText && hitTags;
  });
  renderGrid(filtered);
}
renderTags();
renderGrid(works);

q?.addEventListener('input', applyFilters);
clearFiltersBtn?.addEventListener('click', () => {
  q.value = '';
  activeTags.clear();
  document.querySelectorAll('.tag').forEach(t => t.setAttribute('aria-pressed', 'false'));
  applyFilters();
});

const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modalPic = document.getElementById('modalPicture');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const viewWork = document.getElementById('viewWork');
let currentIndex = 0;

function setModalContent(w){
  modalPic.innerHTML = '';
  const sourceWebp = document.createElement('source');
  sourceWebp.type = 'image/webp';
  sourceWebp.srcset = w.fullWebp || '';
  const img = document.createElement('img');
  img.id = 'modalImg';
  img.src = w.full;
  img.alt = w.alt || w.title;
  img.width = 1200; img.height = 1680; img.loading = 'eager';
  modalPic.appendChild(sourceWebp);
  modalPic.appendChild(img);

  modalTitle.textContent = w.title;
  modalDesc.textContent = w.caption || '';
  viewWork.href = w.link || '#';
  viewWork.toggleAttribute('hidden', !w.link || w.link === '#');
}
function openModal(i){
  const list = filtered.length ? filtered : works;
  currentIndex = i;
  setModalContent(list[currentIndex]);
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
  document.addEventListener('keydown', keyNav);
}
function closeModal(){
  if (modal.open) modal.close(); else modal.removeAttribute('open');
  document.removeEventListener('keydown', keyNav);
}
function prev(){ const list = filtered.length?filtered:works; currentIndex = (currentIndex - 1 + list.length) % list.length; setModalContent(list[currentIndex]); }
function next(){ const list = filtered.length?filtered:works; currentIndex = (currentIndex + 1) % list.length; setModalContent(list[currentIndex]); }

closeModalBtn?.addEventListener('click', closeModal);
prevBtn?.addEventListener('click', prev);
nextBtn?.addEventListener('click', next);
function keyNav(e){
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
}

document.getElementById('year').textContent = new Date().getFullYear();
