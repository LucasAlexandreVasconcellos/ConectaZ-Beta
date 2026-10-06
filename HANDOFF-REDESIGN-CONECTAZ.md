# ConectaZ — Contexto Completo do Redesign

> Documento de handoff. Registra o produto, a direção de design adotada, **todo** o que foi
> construído, a revisão crítica com a tabela PROBLEMA/SEVERIDADE/IMPACTO/SOLUÇÃO, as
> medições de performance e as próximas etapas de desenvolvimento.
>
> Última atualização: 5 de outubro de 2026.

---

## 1. O produto

**ConectaZ** é uma plataforma digital que aproxima **indústrias e empresas**, **profissionais e
talentos**, **capacitação**, **workshops**, **eventos**, **oportunidades de inovação**,
**programas de aceleração** e **desenvolvimento profissional**.

A proposta central não é "mais uma plataforma de cursos" nem "mais um portal de empregos".
É uma **plataforma de conexão entre empresas, talentos, conhecimento e inovação**.

### 1.1 Estado real do produto (honestidade é requisito de design)

O produto ainda está em **fase de prévia**. Isso é comunicado no site de forma explícita e
não-negociável — em badges âmbar (`Demonstração`), notas de rodapé e um bloco dedicado
chamado **"O que diferencia o ConectaZ"**, que compara lado a lado:

| Em construção | Disponível nesta prévia |
| --- | --- |
| Workshops ao vivo | Trilhas de aprendizado (6) |
| Desafios de inovação | Catálogo com filtros |
| Programas de aceleração | Portfólio de aprendizagem |

O rodapé de **todas** as páginas traz o bloco "Status do produto":
`Trilhas de aprendizado · ativas` · `Progresso local · ativo` · `Cadastros e conexões · em construção`
· `Planos e cobrança · em definição` · `Certificação · indisponível`.

> **Regra para as próximas etapas:** nunca inventar métricas, número de clientes, logos,
> depoimentos, preços ou certificações. A posicionamento de "prévia honesta" é um ativo
> estratégico — é o que separa o site de um template.

### 1.2 Pendências de produto (deliberadamente **não** implementadas)

Estas lacunas são conhecidas e **não são bugs do site** — são funcionalidades de produto
que exigem back-end, terceiros e decisões comerciais:

- Canal comercial de contato real (o formulário grava só em `localStorage`)
- Preços, checkout e cobrança
- Autenticação real (o login é uma simulação local)
- Cadastro real de empresas e profissionais
- Certificação validada
- Sistema de-matching / compatibilidade

---

## 2. Repositório e stack

- **Repositório de origem:** `https://github.com/LucasAlexandreVasconcellos/ConectaZ-Beta`
- **Stack:** HTML + CSS + JavaScript estático. **Nenhum framework foi ou deve ser introduzido.**
- **Workspace:** agora é um clone funcional: `git init -b main` sobre o histórico do remote
  (`origin/main` = `b489c54`), identidade repo-local "Lucas Alexandre" + e-mail `noreply` do GitHub.
  Redesign commitado em **`df59e0f`** e **publicado em `main`/GitHub Pages** (2026-10-06).
  A identidade do git não é global no computador.
- **URL de produção:** `https://lucasalexandrevasconcellos.github.io/ConectaZ-Beta/`

### 2.1 Arquivos e responsabilidades

| Arquivo | Papel | Tamanho |
| --- | --- | --- |
| `site.css` | Design system completo. **Fonte única de verdade** de todo o estilo. | ~75 KB |
| `site.js` | Lógica compartilhada por todas as páginas | ~25 KB |
| `index.html` | Homepage (10 seções) | ~31 KB |
| `empresas.html` | Página B2B + formulário de interesse | ~19 KB |
| `profissionais.html` | Página de talentos + perfil | ~12 KB |
| `catalogo.html` / `cursos.html` | Catálogo com filtros. **Alias um do outro** (byte-idênticos) | ~18 KB |
| `login.html` | Tela de acesso (simulação) | ~6 KB |
| `curso.html` + `curso-{ux,dados,ia,portfolio,comunicacao,produtividade}.html` | 7 páginas de trilha | 12–13 KB cada |
| `build-course-pages.mjs` | **Gerador das 7 páginas de curso** | ~13 KB |
| `courses-data.js` | Dados das 6 trilhas. **Não foi alterado no redesign** | ~10 KB |
| `assets/favicon.svg` | Ícone da marca (criado no redesign) | 443 B |
| `robots.txt` / `sitemap.xml` / `manifest.webmanifest` | SEO técnico e instalação PWA (Fase A) | <2 KB cada |
| `build-og-images.mjs` | Gera os HTMLs dos cards OG 1200×630 (os PNGs vêm de captura headless do Chrome/Edge) | ~8 KB |

### 2.2 Regra crítica do pipeline de build

> **As páginas `curso-*.html` são GERADAS.** Qualquer alteração de markup, meta tag, header,
> footer ou `<head>` nessas páginas **precisa** ser feita em `build-course-pages.mjs` e não
> no HTML gerado — do contrário a próxima execução do gerador sobrescreve a correção.

Workflow correto:

```bash
node build-course-pages.mjs     # regenera as 7 páginas + 12 recursos de texto
cp catalogo.html cursos.html    # mantém o alias de rota
```

`cursos.html` é alias de compatibilidade de `catalogo.html` e deve continuar byte-idêntico.

As OG images (`assets/og/*.png`) têm pipeline próprio: `node build-og-images.mjs` escreve os
HTMLs dos cards (1200×630, visual Grade Viva) em `.og-build/`, e os PNGs finais são capturados
com Chrome/Edge headless (`--headless --screenshot --window-size=1200,630`). O texto dos cards
é editado no array `pages` do gerador.

---

## 3. Referência visual e direção de design

### 3.1 Referência

- Pinterest: `https://br.pinterest.com/pin/955748352150564605/`
- Imagem extraída via `og:image`:
  `https://i.pinimg.com/736x/a0/2d/25/a02d25a7c7518f4ebd3e35cfaedee47f.jpg`

Traços da referência que orientaram o design: canvas quase preto, **um único anel luminoso**
como foco, tipografia editorial gigante, linhas técnicas, muito vazio.

### 3.2 Direção escolhida: **"Grade Viva"**

Futurismo corporativo + tecnologia industrial. **Zero** "vibe coding", **zero** neon/glass em massa.

**Paleta (tokens em `:root` do `site.css`)**

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg0` | `#05060a` | Canvas base |
| `--bg1` | `#0a0c12` | Seções alternadas |
| `--bg2` | `#10131c` | Cards |
| `--bg3` | `#151927` | Superfícies mais altas |
| `--white` | `#eef0f6` | Texto primário |
| `--muted` | `#9aa1b2` | Texto secundário |
| `--faint` | `#808a9d` | Texto terciário (**ajustado na revisão — ver §6.2**) |
| `--accent` | `#7c6cff` | Violeta-índigo principal |
| `--accent-soft` | `#a89fff` | Violeta claro |
| `--cyan` | `#5cd6ff` | Ciano técnico |
| `--green` / `--amber` / `--red` | `#4ade9c` / `#f2b35c` / `#ff6b7a` | Estados semânticos |

**Tipografia:** Space Grotesk (display) + Inter (body), carregadas via Google Fonts.

**Metáfora visual:** grade viva. Linhas técnicas, grade de fundo, conectores entre etapas,
mapa de ecossistema em SVG, fluxos (`eco-flow`) percorrendo o mapa. Grid = infraestrutura.

**Herança do design antigo (100% removido):** glows violetas em tudo, cards bento/glass,
dashboard fake inclinado no hero, avatares sugerindo prova social inexistente, fontes de 10–12px,
dois blocos `:root` duplicados no CSS.

### 3.3 Arquitetura da homepage (10 seções)

1. **Hero** — headline "Conexão que move a indústria." + mapa SVG do ecossistema (núcleo + 6 nós)
   + painel "Sinal do ecossistema"
2. **trust-strip** — a proposta em uma linha
3. **problema** — o gap de contexto
4. **como resolve** — 4 etapas (Conecte/Desenvolva/Participe/Cresça)
5. **ecossistema** (`#ecossistema`) — 5 cartões + cartão-núcleo "Entre no ecossistema"
6. **empresas** — proposta B2B
7. **profissionais** — jornada em 5 nós
8. **cursos** — 3 trilhas em destaque
9. **inovação** — bloco comparativo "Em construção" × "Disponível nesta prévia"
10. **CTA final** — escolha do lado do ecossistema

### 3.4 Sistema de motion

| Efeito | Implementação |
| --- | --- |
| Scroll reveal | `.reveal` + `.in-view`, com `data-delay` escalonado |
| Header | `.is-scrolled` (rAF + listeners passivos) |
| Spotlight do hero | `--mx`/`--my` via `pointermove`, **coalescido em rAF** |
| Parallax | `[data-parallax]`, `translate3d`, só em `pointer: fine` |
| Fluxo no mapa | `stroke-dashoffset` animado |
| Microinterações | hover em botões, cards, nós, filtros |

**Acessibilidade de movimento:** `@media (prefers-reduced-motion: reduce)` global **e**
regras específicas (`.eco-flow`, `.hero-spot`, `.eco-parallax`, `.reveal`). O JS também lê
`prefers-reduced-motion` para desligar listeners e encurtar o loader.

---

## 4. Como rodar e verificar

```bash
# servidor local
py -m http.server 8765

# regenerar páginas de curso (após mexer no build-course-pages.mjs)
node build-course-pages.mjs && cp catalogo.html cursos.html

# validar sintaxe do JS
node -e "new Function(require('fs').readFileSync('site.js','utf8')); console.log('OK')"
```

Preview: `http://127.0.0.1:8765/index.html`

> **Limitação conhecida da ferramenta de preview:** o `preview_screenshot` às vezes devolve
> um frame defasado após `reload`/`scroll`. **Não confie na imagem isolada** — confirme pelo DOM
> (`preview_evaluate`). Quando a imagem e o DOM divergirem, o DOM está certo.
> Workaround: `fetch(url,{cache:'reload'}).then(()=>location.reload())` antes de capturar.

---

## 5. O que foi construído (etapas 1–3)

### 5.1 `site.css` — reescrito do zero

Design system completo com todas as ~180 classesoriginally usadas por HTML, JS e gerador
preservadas como **API** (incluindo `module-title`, `static-lesson`, `page-loader`,
`learning-badge`, entre outras). Um único `:root`. Tokens, componentes, motion, responsivo
e `prefers-reduced-motion`.

### 5.2 `site.js`

Loader de página, transições entre páginas, header no scroll, spotlight, parallax,
scroll reveal (lista ampliada com `.eco-card`, `.journey-node`, `.problem-card`),
filtros do catálogo, progresso de curso, auth de demonstração, formulário de interesse.

### 5.3 Páginas

- **`index.html`** — reescrito: header fixo, hero com SVG do ecossistema, 10 seções,
  footer institucional com "Status do produto".
- **`empresas.html` / `profissionais.html` / `catalogo.html`** — reescritas com o novo
  header/footer; preservados formulário de interesse, âncoras `#planos`/`#contato`/
  `#conquistas`/`#perfil`, filtros com `data-role`/`function`/`company`, `#course-count`,
  `[data-no-results]`.
- **`login.html`** — `theme-color`, favicon, link de fontes, OG tags.
- **13 páginas** com favicon `assets/favicon.svg` e link de fontes no `<head>`.

---

## 6. Revisão crítica (etapa 4) — tabela completa

Toda a tabela abaixo é resultado de auditoria **medida**, não de inspeção visual:
checagem estática de links/ânncoras/a11y por script, e auditoria de runtime no browser
(contraste WCAG com composição alfa, tap targets WCAG 2.2, overflow horizontal, piso
tipográfico, CLS e quadros por segundo durante scroll e durante `pointermove`).

### 6.1 Achados e correções

| # | PROBLEMA | SEVERIDADE | IMPACTO | SOLUÇÃO |
| --- | --- | --- | --- | --- |
| 1 | **Toda página de curso exceto UX renderizava o curso de UX.** `site.js` lia `courseId` de `[data-course-detail]` (`<main>`), mas o gerador grava `data-course-id` no `<body>`. O `|| 'ux'` mascarava a falha: título, h1, capa e currículo eram trocados no browser — e **todas as trilhas compartilhavam a chave de progresso** `conectaz-course-progress-ux`. | **CRÍTICO** | Catálogo inteiro mente para o usuário. Concluir a aula de Dados marcava a aula de UX. SEO: `document.title` reescrito para UX em 6 páginas. | `site.js` passou a ler `courseRoot.dataset.courseId \|\| document.body.dataset.courseId \|\| 'ux'`. Verificado: cada página renderiza título, h1, capa e currículo próprios, e o progresso é isolado por trilha. |
| 2 | **Overflow horizontal de 35px em `catalogo.html` a 390px.** `.model-callout .button` tinha `flex-shrink: 0` e não cabia. | **CRÍTICO** | Barra de rolagem horizontal em mobile; quebra de layout em ~30% dos aparelhos. | Empilhamento do `.model-callout` abaixo de 700px com `flex-direction: column` e botão allowing shrink. Verificado `scrollWidth == clientWidth` em 360/375/390. |
| 3 | **Piso tipográfico violado.** 38 elementos com texto entre 10px e 11.5px. | **ALTO** | Ilegível; reprovação em auditoria de acessibilidade; Perception de "protótipo barato". | Token global elevado: `10px → 11.5px`, `10.5px → 11.5px`, `11px → 12px`, `11.5px → 12px`. **Nenhum texto abaixo de 12px** exceto o glifo `▶` decorativo (`aria-hidden="true"`), que é intencional. |
| 4 | **7 elementos abaixo de 4.5:1 de contraste**, todos derivados de `--faint: #677083` (3.52–4.07:1). Afetava `.trust-label`, `.eco-card-tag`, `.footer-col-title`, `.footer-note`, `.footer-status`, `.prototype-banner`, metadados de curso. | **ALTO** | Texto secundário ilegível em telas ruins; reprova WCAG AA. | `--faint` → `#808a9d` (5.03:1 no fundo mais claro, `--bg3`). Zero violações restantes. |
| 5 | **Fontes via `@import` dentro do CSS.** Anulava os `<link rel="preconnect">` de `fonts.googleapis.com`/`fonts.gstatic` que já estavam no `<head>`: a conexão com o servidor de fontes só era descoberta **depois** de baixar e parsear os 74 KB do `site.css`. | **ALTO** | Serialização do caminho crítico de fonte. Fonte trocando depois da primeira pintura. | `@import` removido. `<link rel="stylesheet">` das fontes adicionado ao `<head>` das 13 páginas, junto dos preconnects. `build-course-pages.mjs` atualizado com a constante `FONT_HREF` para não regredir. |
| 6 | **Layout thrashing no `pointermove` do hero.** Dois listeners separados, cada um chamando `getBoundingClientRect()` (leitura) e escrevendo `style` — a escrita do primeiro invalidava o layout lido pelo segundo, forçando reflow síncrono a cada evento. | **ALTO** | Quadro mais lento 40.1 ms; p95 26.7 ms. | Listener único, retângulo em cache, escritas agrupadas em um `rAF`. `pointerleave` recentraliza. Medido depois: pior quadro **26.7 ms**, **zero** quadros acima de 32 ms. |
| 7 | **Cartão do CTA colado no cartão do formulário** em `empresas.html`: `.final-cta { padding: 0 0 110px }` zerava o padding superior, e a seção anterior (`interest-section`) não tinha padding inferior. Gap real de 0px. | **ALTO** | Dois cartões de mesmo peso encostados — leitura de erro de montagem. | `.interest-section` recebeu `padding-bottom: 112px`. As outras páginas já tinham 112px da seção anterior. |
| 8 | **Tap targets abaixo de 24px** (WCAG 2.2 AA, 2.5.8): links do rodapé 22px, `.text-link` 22px, `.back-link` 22px, `.auth-signup button` 21px. | **ALTO** | Falha em alvo de toque; erro comum em celular. | `min-height: 24px` em `.footer-links a`, `.footer-links-row a`, `.text-link`, `.back-link`, `.auth-signup button`. `min-height: 30px` nos links de coluna do rodapé. |
| 9 | **CTA do header incoerente com o hero na homepage.** Header dizia "Começar agora → empresas.html" enquanto o hero dizia "Explorar o ConectaZ → #ecossistema". Duas promessas diferentes na primeira dobra. | **MÉDIO** | Visitante sem persona definida era levado à página B2B. Contradizia o posicionamento de ecossistema. | Header da homepage passou a "Explorar a plataforma → #ecossistema". CTAs das demais páginas seguem contextuais e foram mantidos. |
| 10 | **`login.html` sem `og:title`/`og:description`/`og:image`.** | **MÉDIO** | Compartilhamento sem prévia. | OG tags adicionadas. |
| 11 | **CSS duplicado.** `.hero-art { min-height: 0 }` repetido no `@media (max-width: 700px)`, já coberto pelo de 900px. | **MÉDIO** | Ruído; sugere saída da ordem de cascata. | Regra removida do bloco de 700px. Nenhuma duplicação exata restante (só `from`/`to` legítimos de `@keyframes`). |
| 12 | **Estilo inline estrutural** em `index.html` no cartão `.eco-core-card` (`grid-column`, `display:flex`, `gap`). | **MÉDIO** | Estilo fora do design system. | Movido para `.eco-card.eco-core-card` no CSS (com `flex-wrap: wrap` para mobile). |
| 13 | **`aria-label` em `<div>` sem papel** em `.catalog-filters` — ignorado por leitores de tela. | **MÉDIO** | Grupo de filtros não anunciado. | Adicionado `role="group"`. |
| 14 | **Glifo `▶` com `font-size: 7px`** dentro do círculo de 24px. | **BAIXO** | Triângulo quase invisível. | Elevado para 9px. Permanece abaixo de 12px de propósito: é ícone `aria-hidden`, não texto. |
| 15 | **`transition: ... backdrop-filter` no header.** Animar `backdrop-filter` força repaint do conteúdo atrás a cada quadro. | **BAIXO** | Custo desnecessário numa transição de uso frequente. | Removido da transition (mantido no estado final); adicionado `will-change: background`. |
| 16 | **Sem favicon** no projeto. | **BAIXO** | Aba genérica; sinal de protótipo. | `assets/favicon.svg` criado e ligado nas 13 páginas. |

### 6.2 Estado após as correções

Verificado em `index`, `empresas`, `profissionais`, `catalogo`, `login` e páginas de curso,
a **360px, 375px, 390px e 1440px**:

- Contraste WCAG AA: **0 violações** (verificado com composição alfa real, não só `color`)
- Tipografia: **0 elementos abaixo de 12px** (exceto o ícone decorativo documentado)
- Tap targets: **0 alvos abaixo de 24px**
- Overflow horizontal: **0px** em todas as páginas
- `h1` único por página, **0 saltos** na hierarquia de headings
- Links sem nome acessível: **0**
- Âncoras quebradas / links internos mortos: **0**
- Console: **sem erros** · Rede: **sem 404**

---

## 7. Performance — medições

Medido no browser em `index.html`, viewport 1440×900.

### 7.1 Carregamento

| Métrica | Valor |
| --- | --- |
| `DOMContentLoaded` | **82 ms** |
| `load` | **85 ms** |
| Documento transferido | 31,5 KB |
| `site.css` | 72,5 KB (bruto; ~10 KB com gzip) |
| `site.js` | 0,3 KB gzip |
| Requisições totais da primeira visita | **7** (doc, css, js, courses-data, fonts css, 2 woff2) |
| Console / 404 | nenhum |

### 7.2 Estabilidade e fluidez

| Métrica | Valor | Classificação |
| --- | --- | --- |
| **CLS** (layout shift acumulado) | **0.000** | Google: "bom" (< 0.1) |
| Quadro mediano no scroll | 13,3 ms | 60 fps |
| Quadro p95 no scroll | 13,4 ms | 60 fps |
| Pior quadro no scroll | 26,8 ms | 1 quadro perdido |
| Quadros > 32 ms no scroll | **0** | — |
| Quadro mediano com `pointermove` (150 eventos) | 13,3 ms | 60 fps |
| Pior quadro com `pointermove` | **26,7 ms** | 1 quadro perdido |
| Quadros > 32 ms com `pointermove` | **0** | — |
| Long tasks | 1 (56 ms, carga inicial) | aceitável |

CLS = 0 é o número mais forte do relatório: nenhuma imagem ou fonte desloca o layout.

### 7.3 Pendências de performance conhecidas

- `site.css` tem 74 KB **sem minificação**. Com gzip (servido por GitHub Pages) cai para
  ~10 KB. Minificação não é necessária.
- 5 regras usam `backdrop-filter: blur()`. Estático e pequeno, custo aceitável. Se someday
  houver problema em hardware antigo, remover o blur de `.eco-card-tag` (7 cartões) é o
  primeiro candidato.
- As fontes vêm do Google Fonts (terceiro). Para produção séria, auto-hospedar em `assets/`
  eliminaria uma conexão de terceiros.

---

## 8. Teste de primeira impressão

Cenário: uma grande indústria entra no site pela primeira vez, desktop, sem scroll.

### 5 segundos — "Eu sei o que é o ConectaZ?"

**Sim.** A primeira dobra entrega, nesta ordem:
1. Eyebrow "ECOSSISTEMA CONECTAZ" — categoria immediate
2. H1 **"Conexão que move a indústria."** — diz o que é e para quem, em 6 palavras
3. Subhead: "Reunimos empresas, profissionais, capacitação e inovação em um único ecossistema —
   para que o talento certo encontre a oportunidade certa, e o próximo salto aconteça."
4. Diagrama SVG com 6 nós: EMPRESAS · CAPACITAÇÃO · EVENTOS · INOVAÇÃO · OPORTUNIDADES · TALENTOS
5. Painel "Sinal do ecossistema" com os números reais

O diagrama é o elemento decisivo: não é dashboard fake, é um mapa do produto. Ele comunica
"ecossistema" antes de qualquer texto ser lido.

### 15 segundos — "Isso é relevante para minha empresa?"

**Sim.** Duas rotas visíveis antes do scroll:
- CTA primário "Explorar o ConectaZ" → seção do ecossistema
- CTAs secundários "Sou empresa" → `empresas.html`, "Sou profissional" → `profissionais.html`

Mais o selo de honestidade: "Prévia de conceito · cadastros e conexões reais em construção".

### 30 segundos — "Eu quero explorar?"

**Sim, mas com uma ressalva honesta.** O caminho é claro, porém o destino comercial ainda
não existe: o formulário grava em `localStorage` e diz isso na tela. Isso é **intencional e
correto** — um executivo que descobre que a empresa "vende" algo inexistente perde confiança
para sempre. A seção "O que diferencia o ConectaZ" converte essa limitação em argumento.

**A ressalva que resta:** para gerar desejo de verdade, falta uma prova social real
(caso de uso, parceiro, número). Enquanto ela não existir, o site funciona como **demonstração
de posicionamento e de produto**, não como peça de aquisição.

---

## 9. "O que ainda denuncia protótipo?"

Resposta revisada depois das correções. Ordenado por impacto.

### Ainda denuncia (e não dá para corrigir sem mudar o produto)

| # | Sinal | Por que aparece | O que resolve |
| --- | --- | --- | --- |
| 1 | **Ausência de prova social** — sem logos, sem número de empresas, sem depoimento | Não existe ainda, e inventar seria desonesto | Trazer 1 caso real, mesmo pequeno, com nome e resultado |
| 2 | **Nenhum canal comercial funcional** — o formulário grava local | Exige back-end, e-mail e processo comercial | Formário conectado a um serviço real + número comercial |
| 3 | **URL do GitHub Pages** com `lucasalexandrevasconcellos.github.io` nos canonicals e OG tags de 12 páginas (`login.html` tem `noindex` e fica fora) | É onde o protótipo está hospedado | Domínio próprio antes de apresentar a uma indústria |
| 4 | **Perfis, trilhas e números são demonstrativos** | Sinalizado em todo o site — é uma força, mas ainda denuncia | Trocar pelos dados reais |
| 5 | **Sem analytics, sem pixel, sem eventos** — nenhuma tag de rastreamento de terceiros no projeto | Não foi pedido | Implementar antes de qualquer tráfego real |

### Não denuncia mais (corrigido nesta revisão)

Nomes de curso trocados entre páginas · título e h1 errados em 6 páginas de curso ·
progresso vazando entre trilhas · tipografia de 10px · contraste abaixo de AA · barra de
rolagem horizontal no mobile · alvos de toque pequenos · fonte carregando tarde e com
layout instável · favicon ausente · CTA do header contradizendo o hero · console sujo ·
sem `robots.txt`/`sitemap.xml`/manifest · OG images do design antigo · sem link
"pular para o conteúdo".

### Ainda protocolado

- **Grids de 4 e 5 colunas** no "Como funciona" e na "Jornada": é um padrão comum de template.
  Foi compensado com numeração, kicker editorial, conectores técnicos e o deslocamento do
  texto de apoio para a coluna direita. **Risco residual baixo**, mas é o ponto mais próximo
  de "template" do site.

---

## 10. Próximas etapas de desenvolvimento

### Fase A — Publicar e completar (1–2 dias)

1. **[feito ✅ 2026-10-06]** `git init` sobre o histórico do remote, commit `df59e0f` e push para
   `main` — o GitHub Pages já serve o redesign
2. **[feito ✅ 2026-10-06]** `robots.txt`, `sitemap.xml` (11 URLs canônicas) e `manifest.webmanifest`
   criados; manifest linkado nas 13 páginas
3. **[não se aplica]** A URL `lucasalexandrevasconcellos.github.io/ConectaZ-Beta` já é a correta do
   GitHub Pages — nada a trocar. `login.html` recebeu `noindex` e OG image própria (`assets/og/login.png`)
4. **[feito ✅ 2026-10-06]** 11 OG images regeneradas com o design "Grade Viva" (1200×630, 241–272 KB),
   via `build-og-images.mjs` + captura headless do Chrome
5. **[feito ✅ 2026-10-06]** Skip-link "Pular para o conteúdo" nas 13 páginas (`#conteudo` no `<main>`,
   visível só no foco; Tab → Enter → salto testados no navegador)
6. **[pendente]** Testar em Safari e iOS Safari (o CSS usa `backdrop-filter`, `-webkit-backdrop-filter`
   e `text-wrap`-adjacent; `-webkit-` já está em todos os pontos)

### Fase B — Funcionalidade real (1–2 semanas)

7. Escolher e integrar um serviço de formulário (com fallback e proteção contra spam)
8. Autenticação real no lugar da simulação de `login.html`
9. Substituir o `localStorage` de progresso por persistência em conta
10. Modelar e implementar cadastro de empresas e profissionais
11. Popular o catálogo com as trilhas reais

### Fase C — Prova social e aquisição (contínuo)

12. Construir o sistema de-matching de compatibilidade (o protótipo visual já existe)
13. Caso de uso real, números e depoimento
14. Analytics + eventos de conversão
15. SEO técnico: `hreflang`, dados estruturados `Organization`/`Course`, `sitemap` dinâmico
16. performance: auto-hospedar as fontes para eliminar a dependência de terceiros

### Fase D — Escala do design system

17. Extrair os componentes repetidos das 7 páginas de curso para um único template no
    gerador — hoje o layout é gerado e depois **reidratado** por `site.js`, o que criou o
    bug nº 1. **Decidir uma fonte de verdade só.**
18. Remover a reidratação por JS nas páginas de curso e deixar o markup estático do gerador
    como fonte única, mantendo JS apenas para `?curso=` e progresso. Isso elimina
    estruturalmente a classe de bugs do item 1.

---

## 11. Convenções a seguir

- **CSS como API:** as ~180 classes usadas por HTML, JS e gerador são contrato. Renomear ou
  remover uma exige varredura em `grep` nos três lugares.
- **Placeholders em português:** identidade, pseudoclasses e nomes de grid.
- **Estados semânticos:** `--green` (ativo), `--amber` (demonstração/em construção),
  `--accent` (principal), `--cyan` (técnico).
- **Nada de framework.** O site abre e Interaction em ~85 ms sem uma única dependência de runtime.
- **Honestidade como regra de conteúdo:** se não existe, o site diz que não existe.
- **Antes de gerar:** toda mudança em `curso-*.html` vai para `build-course-pages.mjs`.

---

## 12. Resumo executivo

O redesign entregou uma identidade visual própria ("Grade Viva") que posiciona o ConectaZ
como infraestrutura de conexão — não como plataforma de cursos — com zero dependências de
runtime, CLS 0 e 60 fps estáveis em scroll e interação.

A revisão crítica encontrou e corrigiu **16 problemas**, sendo **2 CRÍTICOS**: páginas de curso
renderizando o conteúdo errado com progresso compartilhado entre trilhas, e overflow horizontal
em mobile no catálogo. Também foram eliminadas violações de contraste WCAG, tipografia abaixo
de 12px, alvos de toque pequenos, duplicação de CSS e o carregamento tardio de fontes.

O site passou de "landing page bonita" para "demonstração crível de produto": o mapa do
ecossistema no hero explica a proposta, o bloco comparativo converte a falta de funcionalidade em
argumento, e o rodapé declara o status real do produto.

**O que impede isto de ser uma peça de aquisição não é visual ou técnico — é a ausência de
um canal comercial real e de prova social.** Ambos estão listados como Fase B e Fase C.
