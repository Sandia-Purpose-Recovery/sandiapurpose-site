const film = document.querySelector('#hero-film');
const control = document.querySelector('#film-control');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let wantsBackgroundMotion = false;
let heroIsVisible = true;
let storyIsOpen = false;

function syncBackgroundFilm() {
  if (wantsBackgroundMotion && heroIsVisible && !storyIsOpen && !document.hidden) {
    if (!film.hasAttribute('src')) film.src = film.dataset.source;
    film.play().catch(() => { control.textContent = 'Play background film'; });
  } else {
    film.pause();
  }
}
film.addEventListener('playing', () => { control.textContent = 'Pause background film'; });
film.addEventListener('pause', () => { control.textContent = 'Play background film'; });
film.addEventListener('error', () => { control.hidden = true; });
control.addEventListener('click', () => {
  wantsBackgroundMotion = film.paused;
  syncBackgroundFilm();
});
motionPreference.addEventListener('change', ({ matches }) => {
  if (matches) wantsBackgroundMotion = false;
  syncBackgroundFilm();
});
film.addEventListener('suspend-background', () => {
  storyIsOpen = true;
  syncBackgroundFilm();
});
film.addEventListener('resume-background', () => {
  storyIsOpen = false;
  syncBackgroundFilm();
});
document.addEventListener('visibilitychange', syncBackgroundFilm);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    heroIsVisible = entry.isIntersecting;
    syncBackgroundFilm();
  });
  observer.observe(document.querySelector('.hero'));
}
control.hidden = false;
syncBackgroundFilm();
