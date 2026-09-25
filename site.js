(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const motivations = [
    { text: 'Algumas coisas estão sob nosso controle; outras, não.', source: 'Epicteto · Manual, §1 · tradução livre' },
    { text: 'A mente transforma o que impede a ação em auxílio para ela.', source: 'Marco Aurélio · Meditações, V.20 · tradução livre' },
    { text: 'Não é porque são difíceis que não ousamos; é porque não ousamos que são difíceis.', source: 'Sêneca · Cartas a Lucílio, 104.26 · tradução livre' },
    { text: 'Seu próximo passo não precisa esperar pelo momento perfeito.', source: 'ConectaZ · um lembrete para começar' },
    { text: 'Uma habilidade nova pode abrir uma porta que você ainda não conhece.', source: 'ConectaZ · um lembrete para seguir' },
  ];
  let loader = document.querySelector('.page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = '<div class="loader-content"><div class="loader-orbit" aria-hidden="true"><span class="brand-symbol"><i class="brand-diamond"></i></span></div><blockquote class="loader-quote"><span data-loader-quote></span><cite data-loader-attribution></cite></blockquote><div class="loader-text">Conectando caminhos</div><div class="loader-track" aria-hidden="true"></div></div>';
    document.body.prepend(loader);
  }
  const setMotivation = (index) => {
    const quote = motivations[index % motivations.length];
    loader.querySelector('[data-loader-quote]').textContent = quote.text;
    loader.querySelector('[data-loader-attribution]').textContent = quote.source;
    try { sessionStorage.setItem('conectaz-transition-quote', String(index)); } catch (_) {}
  };
  const activateLoader = (index) => {
    setMotivation(index);
    loader.setAttribute('aria-hidden', 'false');
    loader.classList.add('active');
  };
  const hideLoader = () => {
    loader.classList.remove('active');
    loader.setAttribute('aria-hidden', 'true');
  };
  let transitioning = false;
  try {
    const incomingQuote = Number(sessionStorage.getItem('conectaz-transition-quote'));
    const arrivedFromPage = sessionStorage.getItem('conectaz-transition-pending') === '1';
    sessionStorage.removeItem('conectaz-transition-pending');
    if (arrivedFromPage) {
      activateLoader(Number.isInteger(incomingQuote) && incomingQuote >= 0 ? incomingQuote : 0);
      window.setTimeout(hideLoader, reducedMotion ? 90 : 190);
    }
  } catch (_) {}

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (transitioning || link.hasAttribute('download') || link.target && link.target !== '_self'
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.origin !== window.location.origin
        || !targetUrl.pathname.toLowerCase().endsWith('.html')
        || targetUrl.pathname === window.location.pathname) return;
      event.preventDefault();
      transitioning = true;
      const quoteIndex = Math.floor(Math.random() * motivations.length);
      activateLoader(quoteIndex);
      try { sessionStorage.setItem('conectaz-transition-pending', '1'); } catch (_) {}
      window.setTimeout(() => window.location.assign(targetUrl.href), reducedMotion ? 100 : 520);
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

  document.querySelectorAll('.section-heading, .step, .feature-panel, .path-card, .course-card, .course-filter, .catalog-filters, .cta-panel, .trust-stat, .footer-links, .course-progress-card, .resource-panel, .module-item, .lesson-workspace, .sidebar-link').forEach((item) => item.classList.add('reveal'));
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

  const achievementKey = 'conectaz-learning-achievements';
  const badgeHost = document.querySelector('[data-learning-badges]');
  const renderLearningBadges = () => {
    if (!badgeHost) return;
    let achievements = {};
    try { achievements = JSON.parse(localStorage.getItem(achievementKey) || '{}'); } catch (_) {}
    const earned = Object.entries(achievements).filter(([id]) => courses[id]);
    if (!earned.length) {
      badgeHost.innerHTML = '<div class="badge-empty"><span aria-hidden="true">✦</span><p>Suas trilhas concluídas vão aparecer aqui neste dispositivo.</p><a class="text-link" href="catalogo.html">Explorar cursos <span aria-hidden="true">↗</span></a></div>';
      return;
    }
    badgeHost.innerHTML = earned.map(([id, item]) => `<article class="learning-badge"><span class="badge-icon" aria-hidden="true">✓</span><div><strong>${courses[id].title}</strong><small>Concluído neste dispositivo · ${new Date(item.completedAt).toLocaleDateString('pt-BR')}</small></div><a href="curso-${id}.html" aria-label="Ver trilha ${courses[id].title}">↗</a></article>`).join('');
  };

  const courses = window.CONECTAZ_COURSES || {};
  renderLearningBadges();

  const courseRoot = document.querySelector('[data-course-detail]');
  if (courseRoot) {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('curso') || courseRoot.dataset.courseId || 'ux';
    const course = courses[courseId] || courses.ux;
    const text = (selector, value) => { const node = courseRoot.querySelector(selector); if (node) node.textContent = value; };
    document.title = `${course.title} — ConectaZ`;
    text('[data-course-title]', course.title);
    text('[data-course-category]', course.category);
    text('[data-course-description]', course.description);
    text('[data-course-instructor]', course.instructor);
    text('[data-course-initials]', course.initials);
    text('[data-course-level]', course.level);
    text('[data-course-duration]', course.duration);
    text('[data-course-lessons]', `${course.modules.reduce((sum, module) => sum + module[1].length, 0)} aulas`);
    text('[data-course-quote]', course.quote);
    const cover = courseRoot.querySelector('[data-course-cover]');
    if (cover) { cover.src = `assets/courses/${course.image}`; cover.alt = `Ilustração da trilha ${course.category}`; }
    const lessonList = course.modules.flatMap((module, moduleIndex) => module[1].map((lesson, lessonIndex) => ({ moduleIndex, lessonIndex, title: lesson[0], summary: lesson[1] })));
    const moduleList = courseRoot.querySelector('[data-module-list]');
    const progressKey = `conectaz-course-progress-${courseId}`;
    let completed = new Set();
    try { completed = new Set(JSON.parse(localStorage.getItem(progressKey) || '[]')); } catch (_) {}
    let selectedLesson = 0;
    const updateProgress = () => {
      const count = completed.size;
      const percent = Math.round((count / lessonList.length) * 100);
      try {
        const achievements = JSON.parse(localStorage.getItem(achievementKey) || '{}');
        if (percent === 100) achievements[courseId] = achievements[courseId] || { completedAt: new Date().toISOString() };
        else delete achievements[courseId];
        localStorage.setItem(achievementKey, JSON.stringify(achievements));
      } catch (_) {}
      renderLearningBadges();
      text('[data-progress-label]', `${percent}% concluído`);
      text('[data-progress-caption]', count ? `${count} de ${lessonList.length} aulas concluídas. Seu progresso fica salvo neste dispositivo.` : 'Escolha uma aula para começar. Seu progresso fica salvo neste dispositivo.');
      const fill = courseRoot.querySelector('[data-progress-fill]');
      if (fill) fill.style.width = `${percent}%`;
      text('[data-curriculum-count]', `${course.modules.length} módulos · ${lessonList.length} aulas`);
      courseRoot.querySelectorAll('[data-lesson-index]').forEach((button) => {
        const done = completed.has(Number(button.dataset.lessonIndex));
        button.classList.toggle('is-complete', done);
        const badge = button.querySelector('.lesson-status');
        if (badge) badge.textContent = done ? 'Concluída' : button.dataset.duration;
      });
      const current = courseRoot.querySelector('[data-current-completion]');
      if (current) current.textContent = completed.has(selectedLesson) ? 'Marcar como não concluída' : 'Marcar aula como concluída';
    };
    const showLesson = (index) => {
      selectedLesson = index;
      const lesson = lessonList[index];
      const module = course.modules[lesson.moduleIndex][0];
      const workspace = courseRoot.querySelector('[data-lesson-workspace]');
      workspace.innerHTML = `<div class="lesson-player"><div class="lesson-player-top"><span class="lesson-play" aria-hidden="true">▶</span><span>AULA ${String(index + 1).padStart(2, '0')} · ${module}</span><span class="lesson-minutes">${lesson.duration || '8 min'}</span></div><div class="lesson-content"><div class="section-kicker">Ideia central</div><h2>${lesson.title}</h2><p>${lesson.summary}</p><div class="lesson-insight"><span class="insight-icon" aria-hidden="true">✦</span><div><strong>Leve para a prática</strong><p>${course.challenge}</p></div></div><div class="lesson-footer"><span>Material de apoio disponível ao lado</span><button class="button button-primary" type="button" data-current-completion>Marcar aula como concluída</button></div></div></div>`;
      workspace.querySelector('[data-current-completion]').addEventListener('click', () => {
        if (completed.has(index)) completed.delete(index); else completed.add(index);
        try { localStorage.setItem(progressKey, JSON.stringify([...completed])); } catch (_) {}
        updateProgress();
      });
      courseRoot.querySelectorAll('.lesson-item').forEach((item) => item.classList.toggle('is-active', Number(item.dataset.lessonIndex) === index));
      updateProgress();
    };
    if (moduleList) moduleList.innerHTML = course.modules.map(([title, lessons], moduleIndex) => {
      const firstIndex = lessonList.findIndex((item) => item.moduleIndex === moduleIndex);
      return `<details class="module-item" ${moduleIndex === 0 ? 'open' : ''}><summary><span class="module-number">${String(moduleIndex + 1).padStart(2, '0')}</span><span class="module-name"><strong>${title}</strong><small>${lessons.length} aulas · prática aplicada</small></span><span class="module-chevron" aria-hidden="true">+</span></summary><div class="module-lessons">${lessons.map(([lessonTitle], lessonIndex) => { const index = firstIndex + lessonIndex; return `<button type="button" class="lesson-item" data-lesson-index="${index}" data-duration="${6 + ((index * 3) % 7)} min"><span class="lesson-play lesson-play-small" aria-hidden="true">▶</span><span class="lesson-name">${lessonTitle}</span><span class="lesson-status">${6 + ((index * 3) % 7)} min</span></button>`; }).join('')}</div></details>`;
    }).join('');
    moduleList?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-lesson-index]');
      if (button) showLesson(Number(button.dataset.lessonIndex));
    });
    const resourceList = courseRoot.querySelector('[data-resource-list]');
    if (resourceList) {
      resourceList.innerHTML = `<a class="resource-card" href="materiais/${course.pdf}" download><span class="resource-icon resource-pdf">PDF</span><span><strong>Caderno de aprendizagem</strong><small>Guia, prática e espaço para planejar</small></span><span class="resource-download" aria-hidden="true">↓</span></a><a class="resource-card" href="#" data-download="checklist"><span class="resource-icon resource-check">✓</span><span><strong>Checklist do curso</strong><small>Lista prática em arquivo de texto</small></span><span class="resource-download" aria-hidden="true">↓</span></a><a class="resource-card" href="#" data-download="desafio"><span class="resource-icon resource-template">✦</span><span><strong>Desafio aplicado</strong><small>Proposta e roteiro para praticar</small></span><span class="resource-download" aria-hidden="true">↓</span></a>`;
      const checklistText = `CONECTAZ | CHECKLIST\n${course.title}\n\n${course.checklist.map((item) => `[ ] ${item}`).join('\n')}\n`;
      const challengeText = `# Desafio aplicado | ${course.title}\n\n${course.challenge}\n\n## Meu plano\n- O que vou fazer:\n- Quando vou fazer:\n- O que preciso:\n- Como vou avaliar o resultado:\n\n## Reflexão\n- O que aprendi?\n- O que faria diferente na próxima tentativa?\n`;
      const makeDownload = (content, filename, type) => URL.createObjectURL(new Blob([content], { type }));
      resourceList.querySelector('[data-download="checklist"]').href = makeDownload(checklistText, `checklist-${courseId}.txt`, 'text/plain;charset=utf-8');
      resourceList.querySelector('[data-download="checklist"]').download = `checklist-${courseId}.txt`;
      resourceList.querySelector('[data-download="desafio"]').href = makeDownload(challengeText, `desafio-${courseId}.md`, 'text/markdown;charset=utf-8');
      resourceList.querySelector('[data-download="desafio"]').download = `desafio-${courseId}.md`;
    }
    moduleList?.querySelectorAll('.module-item').forEach((item) => item.classList.add('reveal', 'in-view'));
    showLesson(0);
    if (window.location.hash === '#trilha') window.setTimeout(() => document.querySelector('#trilha')?.scrollIntoView(), 30);
  }
})();


