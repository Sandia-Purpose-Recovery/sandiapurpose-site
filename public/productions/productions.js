(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const mobile = matchMedia('(max-width: 45rem)');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.hidden = mobile.matches && !open;
  }
  function syncMenu() { menu.hidden = !mobile.matches; setMenu(false); }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobile.matches) { setMenu(false); menu.focus(); }
  });
  mobile.addEventListener('change', syncMenu);
  syncMenu();

  const hero = document.querySelector('#hero-film');
  const control = document.querySelector('#film-control');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let wantsMotion = !motion.matches && !navigator.connection?.saveData;
  let heroVisible = true;
  let dialogOpen = false;
  function syncHero() {
    if (wantsMotion && heroVisible && !document.hidden && !dialogOpen) {
      if (!hero.hasAttribute('src')) hero.src = hero.dataset.source;
      hero.play().catch(() => { control.textContent = 'Play background film'; });
    } else { hero.pause(); }
  }
  hero.addEventListener('playing', () => { control.textContent = 'Pause background film'; });
  hero.addEventListener('pause', () => { control.textContent = 'Play background film'; });
  hero.addEventListener('error', () => { control.hidden = true; });
  control.addEventListener('click', () => { wantsMotion = hero.paused; syncHero(); });
  motion.addEventListener('change', event => { if (event.matches) wantsMotion = false; syncHero(); });
  document.addEventListener('visibilitychange', syncHero);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncHero(); }).observe(document.querySelector('.reel-hero'));
  }
  control.hidden = false;
  syncHero();

  const dialog = document.querySelector('#film-dialog');
  const film = document.querySelector('#selected-film');
  const title = document.querySelector('#film-title');
  const note = document.querySelector('#film-note');
  const direct = document.querySelector('#film-direct');
  const error = document.querySelector('#film-error');
  let trigger;
  if (typeof dialog.showModal !== 'function') return;
  document.querySelectorAll('[data-film]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      trigger = link;
      title.textContent = link.dataset.title;
      note.textContent = link.dataset.note;
      direct.href = link.href;
      error.hidden = true;
      film.poster = `/assets/productions/${link.dataset.film === 'greatest-hits-reel' ? 'neon-after-hours' : link.dataset.film}.jpg`;
      film.muted = link.dataset.film === 'greatest-hits-reel';
      film.src = link.href;
      dialogOpen = true;
      syncHero();
      dialog.showModal();
      document.body.classList.add('modal-open');
      film.play().catch(() => {});
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    film.pause();
    film.removeAttribute('src');
    film.load();
    dialogOpen = false;
    document.body.classList.remove('modal-open');
    syncHero();
    trigger?.focus({ preventScroll: true });
  });
  film.addEventListener('error', () => { if (film.hasAttribute('src')) error.hidden = false; });
})();
