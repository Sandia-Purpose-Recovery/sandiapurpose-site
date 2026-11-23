(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  if (menuButton && navigation) {
    const mobileViewport = matchMedia('(max-width: 45rem)');
    function setMenu(open) {
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.hidden = mobileViewport.matches && !open;
    }
    function syncNavigation() {
      menuButton.hidden = !mobileViewport.matches;
      setMenu(false);
    }
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    navigation.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileViewport.matches) {
        setMenu(false);
        menuButton.focus();
      }
    });
    mobileViewport.addEventListener('change', syncNavigation);
    syncNavigation();
  }

  const storyDialog = document.querySelector('#story-dialog');
  const storyFilm = document.querySelector('#story-film');
  const backgroundFilm = document.querySelector('#hero-film');
  if (!storyDialog || !storyFilm) return;
  let storyTrigger;
  if (typeof storyDialog.showModal === 'function') {
    document.querySelectorAll('[data-story-open]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        storyTrigger = link;
        backgroundFilm?.dispatchEvent(new Event('suspend-background'));
        storyDialog.showModal();
        document.body.classList.add('modal-open');
        if (!storyFilm.hasAttribute('src')) storyFilm.src = storyFilm.dataset.source;
        storyFilm.play().catch(() => {});
      });
    });
  }
  storyDialog.querySelector('.dialog-close').addEventListener('click', () => storyDialog.close());
  storyDialog.querySelector('[data-story-next]').addEventListener('click', () => storyDialog.close());
  storyDialog.addEventListener('click', event => {
    if (event.target !== storyDialog) return;
    const box = storyDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) storyDialog.close();
  });
  storyDialog.addEventListener('close', () => {
    storyFilm.pause();
    document.body.classList.remove('modal-open');
    backgroundFilm?.dispatchEvent(new Event('resume-background'));
    storyTrigger?.focus({ preventScroll: true });
  });
  storyFilm.addEventListener('error', () => {
    document.querySelector('#story-error').hidden = false;
  });
})();
