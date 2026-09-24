(() => {
  const loader = document.querySelector('.page-loader');
  const shell = document.querySelector('.page-shell');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('pageshow', (event) => {
    if (!window.location.hash && !event.persisted) {
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
    }
  });
  const saveTransition = () => { try { sessionStorage.setItem('conectaz-transition', '1'); } catch (_) {} };
  const consumeTransition = () => {
    try {
      const pending = sessionStorage.getItem('conectaz-transition') === '1';
      sessionStorage.removeItem('conectaz-transition');
      return pending;
    } catch (_) { return false; }
  };

  if (consumeTransition()) {
    loader?.classList.add('active');
    window.setTimeout(() => loader?.classList.remove('active'), reducedMotion ? 20 : 650);
  }

  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.pathname === window.location.pathname || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      saveTransition();
      loader?.classList.add('active');
      shell?.classList.add('leaving');
      window.setTimeout(() => { window.location.href = targetUrl.href; }, reducedMotion ? 10 : 360);
    });
  });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('in-view'));

  const courseFilters = [...document.querySelectorAll('[data-course-filter]')];
  const courseCards = [...document.querySelectorAll('.course-card[data-role]')];
  const courseCount = document.querySelector('#course-count');
  const noCourses = document.querySelector('[data-no-results]');
  const updateCourseResults = () => {
    if (!courseFilters.length || !courseCards.length) return;
    const selected = Object.fromEntries(courseFilters.map((filter) => [filter.dataset.courseFilter, filter.value]));
    let visibleCount = 0;
    courseCards.forEach((card) => {
      const matches = (!selected.role || card.dataset.role === selected.role)
        && (!selected.function || card.dataset.function === selected.function)
        && (!selected.company || card.dataset.company === selected.company);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    if (courseCount) courseCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'curso encontrado' : 'cursos encontrados'}`;
    if (noCourses) noCourses.hidden = visibleCount > 0;
  };
  courseFilters.forEach((filter) => filter.addEventListener('change', updateCourseResults));
  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    courseFilters.forEach((filter) => { filter.value = ''; });
    updateCourseResults();
    courseFilters[0]?.focus();
  });
})();
