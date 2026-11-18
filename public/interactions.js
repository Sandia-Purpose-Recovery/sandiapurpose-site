// Visitor paths work as ordinary fragment links before JavaScript enhances them.
const pathList = document.querySelector('.path-grid');
const pathLinks = [...document.querySelectorAll('[data-path]')];
pathList.setAttribute('role', 'tablist');

function selectPath(link, focus = false) {
  pathLinks.forEach((item) => {
    const selected = item === link;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.querySelector(item.hash).hidden = !selected;
  });
  if (focus) link.focus();
}

pathLinks.forEach((link, index) => {
  const panel = document.querySelector(link.hash);
  link.setAttribute('role', 'tab');
  link.setAttribute('aria-controls', panel.id);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', link.id);
  panel.tabIndex = 0;
  link.addEventListener('click', (event) => {
    event.preventDefault();
    selectPath(link);
    if (mobileViewport.matches) {
      panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }
  });
  link.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight' || (mobileViewport.matches && event.key === 'ArrowDown')) next = (index + 1) % pathLinks.length;
    if (event.key === 'ArrowLeft' || (mobileViewport.matches && event.key === 'ArrowUp')) next = (index - 1 + pathLinks.length) % pathLinks.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = pathLinks.length - 1;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      selectPath(link);
    }
    if (next !== undefined) {
      event.preventDefault();
      selectPath(pathLinks[next], true);
    }
  });
});

function pathForHash(hash) {
  return pathLinks.find((link) => link.hash === hash);
}
selectPath(pathForHash(location.hash) || pathLinks[0]);
// Reveal a hidden panel before the browser follows any page link to it.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (link.hasAttribute('data-path')) return;
  link.addEventListener('click', () => {
    const targetPath = pathForHash(link.hash);
    if (targetPath) selectPath(targetPath);
  });
});
window.addEventListener('hashchange', () => {
  const targetPath = pathForHash(location.hash);
  if (targetPath) selectPath(targetPath);
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const mobileViewport = matchMedia('(max-width: 45rem)');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.hidden = mobileViewport.matches && !open;
}
function syncNavigation() {
  pathList.setAttribute('aria-orientation', mobileViewport.matches ? 'vertical' : 'horizontal');
  menuButton.hidden = !mobileViewport.matches;
  setMenu(false);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileViewport.matches) {
    setMenu(false);
    menuButton.focus();
  }
});
mobileViewport.addEventListener('change', syncNavigation);
syncNavigation();

const storyDialog = document.querySelector('#story-dialog');
const storyFilm = document.querySelector('#story-film');
const backgroundFilm = document.querySelector('#hero-film');
let storyTrigger;

if (typeof storyDialog.showModal === 'function') {
  document.querySelectorAll('[data-story-open]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      storyTrigger = link;
      backgroundFilm.dispatchEvent(new Event('suspend-background'));
      storyDialog.showModal();
      document.body.classList.add('modal-open');
      if (!storyFilm.hasAttribute('src')) storyFilm.src = storyFilm.dataset.source;
      storyFilm.play().catch(() => {}); // Native controls remain available if autoplay is blocked.
    });
  });
}
storyDialog.querySelector('.dialog-close').addEventListener('click', () => storyDialog.close());
storyDialog.querySelector('[data-story-next]').addEventListener('click', () => storyDialog.close());
storyDialog.addEventListener('click', (event) => {
  if (event.target !== storyDialog) return;
  const box = storyDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) storyDialog.close();
});
storyDialog.addEventListener('close', () => {
  storyFilm.pause();
  document.body.classList.remove('modal-open');
  backgroundFilm.dispatchEvent(new Event('resume-background'));
  storyTrigger?.focus({ preventScroll: true });
});
storyFilm.addEventListener('error', () => {
  document.querySelector('#story-error').hidden = false;
});
