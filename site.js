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
  const motivation = [
    { text: 'Algumas coisas dependem de nós; outras, não.', by: 'Epicteto · Manual, 1', href: 'https://www.gutenberg.org/files/45109/45109-h/45109-h.htm' },
    { text: 'A mente pode transformar um impedimento em impulso para agir.', by: 'Adaptação de Marco Aurélio · Meditações, V.20', href: 'https://www.gutenberg.org/cache/epub/6920/pg6920-images.html' },
    { text: 'Não é porque são difíceis que não ousamos; é porque não ousamos que são difíceis.', by: 'Sêneca · Cartas a Lucílio, 104.26', href: 'https://openscriptorium.com/read/seneca/104-letter-104' },
    { text: 'Seu próximo passo não precisa esperar pelo momento perfeito.', by: 'ConectaZ · um lembrete para começar' },
    { text: 'Uma habilidade nova pode abrir uma porta que você ainda não conhece.', by: 'ConectaZ · um lembrete para seguir' },
  ];
  const quoteNode = document.querySelector('[data-loader-quote]');
  const attributionNode = document.querySelector('[data-loader-attribution]');
  const loaderContent = loader?.querySelector('.loader-content');
  if (loaderContent && !quoteNode) {
    const quote = document.createElement('blockquote');
    quote.className = 'loader-quote';
    quote.innerHTML = '<span data-loader-quote></span><cite data-loader-attribution></cite>';
    loaderContent.insertBefore(quote, loader.querySelector('.loader-track'));
  }
  const setMotivation = () => {
    const quote = motivation[Math.floor(Math.random() * motivation.length)];
    const textNode = document.querySelector('[data-loader-quote]');
    const byNode = document.querySelector('[data-loader-attribution]');
    if (textNode) textNode.textContent = quote.text;
    if (byNode) {
      byNode.replaceChildren();
      if (quote.href) {
        const source = document.createElement('a');
        source.href = quote.href;
        source.target = '_blank';
        source.rel = 'noreferrer noopener';
        source.textContent = quote.by;
        source.setAttribute('aria-label', `${quote.by}, abrir a fonte`);
        byNode.append(source);
      } else byNode.textContent = quote.by;
    }
  };
  const consumeTransition = () => {
    try {
      const pending = sessionStorage.getItem('conectaz-transition') === '1';
      sessionStorage.removeItem('conectaz-transition');
      return pending;
    } catch (_) { return false; }
  };

  if (consumeTransition()) {
    setMotivation();
    loader?.classList.add('active');
    window.setTimeout(() => loader?.classList.remove('active'), reducedMotion ? 20 : 1050);
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetUrl = new URL(link.href, window.location.href);
      if (!targetUrl.pathname.toLowerCase().endsWith('.html') || targetUrl.origin !== window.location.origin || targetUrl.pathname === window.location.pathname || link.hasAttribute('download') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setMotivation();
      saveTransition();
      loader?.classList.add('active');
      shell?.classList.add('leaving');
      window.setTimeout(() => { window.location.href = targetUrl.href; }, reducedMotion ? 10 : 760);
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

  const courses = {
    ux: {
      title: 'Fundamentos de UX e design de produto', category: 'UX & produto', description: 'Entenda as necessidades das pessoas, transforme problemas em oportunidades e teste soluções com confiança.', instructor: 'Camila Ribeiro', initials: 'CR', level: 'Iniciante', duration: '12 horas', image: 'ux.svg', pdf: 'guia-ux-produto.pdf', quote: 'O bom design começa com curiosidade e melhora com escuta.', challenge: 'Escolha uma tarefa cotidiana e faça três conversas curtas para descobrir onde as pessoas encontram dificuldade.', checklist: ['Escrevi o problema do ponto de vista da pessoa usuária', 'Registrei evidências antes de propor a solução', 'Criei um protótipo para responder a uma hipótese', 'Observei três pessoas usando o protótipo'], modules: [
        ['Pesquisa e descoberta', [['Conversas que revelam necessidades', 'Como preparar entrevistas curtas e abertas para entender contexto, motivação e comportamento.'], ['Mapeando a jornada atual', 'Organize etapas, dúvidas e pontos de atrito sem presumir a solução antes da hora.']]],
        ['Estrutura e prototipação', [['Do problema à hipótese', 'Escreva uma hipótese verificável e escolha o recorte de produto que merece ser testado.'], ['Prototipar para pensar', 'Use fluxos simples e baixa fidelidade para tornar ideias conversáveis.']]],
        ['Teste e evolução', [['Testes de usabilidade leves', 'Planeje tarefas, convide participantes e observe sem conduzir as respostas.'], ['Decisões com evidências', 'Organize aprendizados, priorize oportunidades e comunique o próximo experimento.']]]],
    },
    dados: {
      title: 'Dados na prática: do zero à análise', category: 'Tecnologia & dados', description: 'Aprenda a formular perguntas, organizar dados e apresentar descobertas úteis para decisões do dia a dia.', instructor: 'André Martins', initials: 'AM', level: 'Iniciante', duration: '16 horas', image: 'data.svg', pdf: 'caderno-dados-pratica.pdf', quote: 'Uma boa pergunta é o primeiro passo de uma boa análise.', challenge: 'Use uma planilha pública ou fictícia para responder uma pergunta de negócio e escrever uma recomendação baseada em evidências.', checklist: ['Defini a decisão antes de analisar', 'Conferi formato, unidades e valores ausentes', 'Escolhi um gráfico que responde à pergunta', 'Separei observações de conclusões'], modules: [
        ['Perguntas e qualidade dos dados', [['Da decisão à pergunta analítica', 'Converta uma dúvida ampla em uma pergunta que possa orientar uma ação concreta.'], ['Limpeza e organização', 'Confira tipos, duplicidades, vazios e consistência antes de calcular qualquer coisa.']]],
        ['Análise e visualização', [['Resumo estatístico sem mistério', 'Use contagens, médias e comparações com atenção ao contexto e às unidades.'], ['Gráficos que explicam', 'Escolha uma visualização pela comparação que deseja tornar fácil de perceber.']]],
        ['Comunicação de resultados', [['Da descoberta à recomendação', 'Construa uma narrativa curta que conecte pergunta, evidência, recomendação e limite.'], ['Apresentação para decisão', 'Prepare um resumo executivo e antecipe dúvidas sem esconder incertezas.']]]],
    },
    comunicacao: {
      title: 'Comunicação para times que crescem', category: 'Carreira & negócios', description: 'Conduza alinhamentos melhores, escute com intenção e transforme conversas em decisões claras.', instructor: 'Renata Lima', initials: 'RL', level: 'Todos os níveis', duration: '9 horas', image: 'communication.svg', pdf: 'guia-comunicacao-times.pdf', quote: 'Clareza é uma forma de cuidado com o tempo de todo mundo.', challenge: 'Escolha uma conversa de alinhamento real. Prepare contexto e pedido, escute a outra pessoa e registre uma decisão compartilhada.', checklist: ['Expliquei o contexto e o impacto', 'Fiz um pedido específico e respeitoso', 'Confirmei o que entendi antes de responder', 'Registrei responsáveis e próximos passos'], modules: [
        ['Clareza e escuta', [['Contexto que aproxima', 'Apresente cenário, impacto e objetivo para que a conversa comece com entendimento comum.'], ['Escuta ativa no trabalho', 'Use perguntas abertas e reformulação para checar o que foi entendido.']]],
        ['Alinhamentos e feedback', [['Feedback orientado à ação', 'Descreva situações observáveis, impacto e uma expectativa de mudança possível.'], ['Conversas difíceis com respeito', 'Prepare fatos, cuide do momento e mantenha a conversa focada em acordos.']]],
        ['Reuniões e decisões', [['Reuniões que chegam a algum lugar', 'Defina propósito, participantes essenciais e uma decisão que precisa sair da conversa.'], ['Acordos que viram ação', 'Feche com responsáveis, prazos, registro e um modo simples de acompanhar.']]]],
    },
    ia: {
      title: 'Introdução à inteligência artificial', category: 'Tecnologia & dados', description: 'Conheça usos cotidianos de IA, aprenda a escrever boas instruções e avalie resultados com responsabilidade.', instructor: 'Rafael Souza', initials: 'RS', level: 'Iniciante', duration: '10 horas', image: 'ai.svg', pdf: 'guia-inteligencia-artificial.pdf', quote: 'Use a tecnologia para ampliar sua capacidade de pensar, não para deixar de pensar.', challenge: 'Escolha uma tarefa repetitiva, teste uma instrução em uma ferramenta de IA e revise cada afirmação com fontes confiáveis.', checklist: ['Escolhi um problema adequado à ferramenta', 'Informei contexto, público e formato', 'Verifiquei afirmações importantes', 'Protegi dados pessoais e confidenciais'], modules: [
        ['Entendendo inteligência artificial', [['O que a IA pode e não pode fazer', 'Diferencie automação, modelos de linguagem e respostas geradas por probabilidade.'], ['Exemplos de uso no trabalho', 'Encontre tarefas de apoio sem transferir decisões sensíveis ou dados privados.']]],
        ['Instruções e experimentação', [['Como escrever bons prompts', 'Combine papel, objetivo, contexto, restrições e formato para diminuir ambiguidades.'], ['Refinar e comparar respostas', 'Mude uma variável por vez e avalie os resultados com critérios claros.']]],
        ['Verificação e responsabilidade', [['Checagem de fatos e vieses', 'Verifique informações, procure omissões e reconheça vieses e limitações do modelo.'], ['Uso seguro e ético', 'Proteja dados, respeite direitos de uso e mantenha supervisão humana adequada.']]]],
    },
    portfolio: {
      title: 'Portfólio profissional com propósito', category: 'UX & produto', description: 'Apresente seu trabalho com contexto, autoria e evidências para que outras pessoas entendam o valor das suas decisões.', instructor: 'Júlia Nunes', initials: 'JN', level: 'Intermediário', duration: '8 horas', image: 'portfolio.svg', pdf: 'roteiro-portfolio-profissional.pdf', quote: 'Seu processo também faz parte do que você tem a oferecer.', challenge: 'Escolha um projeto e prepare um estudo de caso curto que outra pessoa consiga entender em dois minutos.', checklist: ['Expliquei meu papel e o trabalho do time', 'Apresentei contexto e restrições', 'Conectei decisões a evidências', 'Mostrei resultados sem exagerar minha contribuição'], modules: [
        ['Posicionamento e seleção', [['O que seu portfólio precisa mostrar', 'Defina competências e públicos para selecionar trabalhos que contam uma história coerente.'], ['Escolhendo projetos com intenção', 'Compare projetos pela variedade de habilidades e pelo que ensinam a quem avalia.']]],
        ['Estudos de caso', [['Contexto, problema e papel', 'Escreva uma abertura simples que situe desafio, objetivo, equipe e sua responsabilidade.'], ['Processo e decisões', 'Mostre opções, critérios e evidências sem transformar o estudo de caso em um diário.']]],
        ['Apresentação e revisão', [['Resultados e aprendizados', 'Descreva impacto verificável e as perguntas que você levaria para uma próxima versão.'], ['Portfólio acessível e claro', 'Revise leitura, navegação, contraste e instruções para contato profissional.']]]],
    },
    produtividade: {
      title: 'Organização e produtividade no trabalho', category: 'Carreira & negócios', description: 'Organize prioridades com intenção, proteja tempo para o que importa e feche o dia sabendo o próximo passo.', instructor: 'Lucas Freire', initials: 'LF', level: 'Todos os níveis', duration: '7 horas', image: 'productivity.svg', pdf: 'planner-produtividade-trabalho.pdf', quote: 'Progresso sustentável nasce de prioridades claras e pausas possíveis.', challenge: 'Planeje um dia realista com três resultados importantes, blocos de foco e espaço para imprevistos.', checklist: ['Transformei pendências em próximas ações', 'Escolhi prioridades pelo impacto e prazo', 'Limitei tarefas em andamento', 'Reservei tempo para pausas e imprevistos'], modules: [
        ['Visibilidade e rotina', [['Tire tarefas da cabeça', 'Reúna compromissos em um sistema único e transforme assuntos vagos em ações observáveis.'], ['Revise sua semana', 'Identifique compromissos fixos, pendências e pontos de sobrecarga antes de planejar.']]],
        ['Prioridades e foco', [['Decidir o que vem primeiro', 'Compare urgência, impacto e dependências para negociar o trabalho em andamento.'], ['Blocos de foco que cabem na rotina', 'Agrupe tarefas, planeje pausas e proteja períodos realistas de concentração.']]],
        ['Ritmo sustentável', [['Interrupções e limites', 'Prepare acordos para interrupções e aprenda a renegociar quando novas demandas aparecem.'], ['Fechamento e próximo passo', 'Revise avanços sem culpa e deixe a primeira ação do dia seguinte pronta.']]]],
    },
  };

  const courseRoot = document.querySelector('[data-course-detail]');
  if (courseRoot) {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('curso') || 'ux';
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


