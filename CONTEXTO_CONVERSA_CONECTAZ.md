# Contexto do projeto ConectaZ

Documento de continuidade para mover o trabalho para outra máquina ou compartilhá-lo com outra IA. Atualizado em 01/10/2026.

## 1. O que é a ConectaZ

A ConectaZ é uma proposta de plataforma que aproxima empresas que procuram profissionais dos próprios profissionais. Também oferece cursos e trilhas profissionalizantes. A visão de receita definida na conversa é híbrida: planos para empresas cobrados pelo volume de vagas e cursos pagos para profissionais.

O projeto atual é um protótipo de site estático em HTML, CSS e JavaScript, hospedado como GitHub Pages. Ele ainda não oferece cadastros, conexões reais entre usuários, cobrança, checkout ou compra de cursos. As telas de login/criação de conta são simulações locais e não devem ser apresentadas como autenticação real.

## 2. Localização do projeto

Pasta que foi aberta no Explorador de Arquivos para cópia/transferência:

`C:\Users\lucas.vasconcellos\Documents\Codex\2026-09-24\eu\outputs\conectaz`

Clone usado para preparar publicação no GitHub:

`C:\Users\lucas.vasconcellos\Documents\Codex\2026-09-24\eu\work\conectaz-github-publish`

Repositório remoto:

`https://github.com/LucasAlexandreVasconcellos/ConectaZ-Beta`

A pasta `outputs\conectaz` é a pasta conveniente para transportar os arquivos do site. O clone `work\conectaz-github-publish` contém o histórico Git e o commit local mais recente descrito abaixo.

## 3. Estrutura e tecnologia

O site é estático e multipágina, usando HTML, CSS compartilhado e JavaScript compartilhado. Arquivos vistos ao longo da conversa incluem:

- `index.html` — início e proposta geral;
- `empresas.html` — área direcionada a empresas;
- `profissionais.html` — área direcionada a profissionais;
- `catalogo.html` — cursos em destaque/catálogo;
- `cursos.html` — página de cursos em versões anteriores do projeto;
- `curso-*.html` — páginas de detalhe de cursos, com módulos e materiais demonstrativos;
- `login.html` — interface de entrar/criar conta simulada;
- `site.css` — estilos compartilhados;
- `site.js` — interações, navegação/carregamento visual e comportamento do protótipo;
- `courses-data.js` — dados usados no catálogo, quando presente;
- pastas de assets, incluindo imagens de capa e arte visual.

A lista exata varia entre a pasta de prévia e o clone de publicação. Confira a pasta local antes de transferir e mantenha juntos os HTML, CSS, JS e assets referenciados.

## 4. Direção visual aprovada

- Marca: ConectaZ, ícone composto por formas conectadas e detalhe violeta.
- Estética: dark, tecnológica, elegante, com roxo/violeta; base #09090b e acentos como #a77aff, #805bd5 e #d8bcff.
- Navbar em formato pill/flutuante, CTAs arredondados, brilho/gradiente roxo, glassmorphism leve, ambient glows e cards de cantos generosos.
- Tipografia baseada em Manrope / DM Sans nas diretrizes de revamp.
- Minimizar mudanças estéticas desnecessárias; clareza e legibilidade são prioritárias.
- O usuário costuma pedir para abrir o resultado na interface/aba quando não o encontra; também já pediu acesso fácil à pasta para transportar o site.

## 5. Histórico relevante de pedidos e decisões

1. O site inicial foi criado a partir de uma referência estética de uma landing page cinematográfica, adaptada para a startup ConectaZ.
2. O usuário pediu mais vida visual, gradientes, animações suaves, loader nas trocas de página e separação dos públicos em páginas próprias para reduzir sobrecarga cognitiva.
3. Foi corrigido um problema de cursos e adicionada uma página dedicada ao catálogo/seleção de cursos com filtros para cargos, funções e empresas.
4. Foi necessário orientar a publicação gratuita pelo GitHub Pages.
5. Vários 404s ocorreram ao clicar em Cursos. As capturas mostraram que o repositório continha `Cursos.html` com C maiúsculo e depois `cursos.html` em minúsculo. GitHub Pages diferencia maiúsculas e minúsculas nos nomes. A rota/arquivo precisava coincidir exatamente. O usuário corrigiu para minúsculo, mas o erro persistiu durante deploys; uma captura posterior confirmou que Pages estava configurado para publicar a branch `main`, pasta `/ (root)`, com URL `https://lucasalexandrevasconcellos.github.io/ConectaZ-Beta/`. A confirmação do estado final depende do conteúdo atualmente implantado.
6. O usuário pediu animações em componentes e loader com frases motivacionais, além de capas e páginas de curso com módulos, aulas e materiais. As páginas de curso são uma simulação visual, sem conteúdo/transmissão ou compra real.
7. O usuário autorizou enviar as alterações ao GitHub e fazer commit. Houve conflitos/push rejeitado por histórico remoto não fast-forward em ocasião anterior; depois foram tratadas mudanças no clone de publicação.
8. Foi feito um revamp visual mantendo a paleta dark/violeta, incluindo glows, cards estilo bento/glass, CTAs e hierarquia de títulos.
9. Foram feitas melhorias no portfólio de aprendizagem/cursos concluídos. O progresso apresentado é local ao navegador e demonstrativo, não constitui certificado validado.
10. Foi adicionado um ícone sutil de perfil na navegação, a partir de referência visual.
11. O link “Entrar” passou a abrir uma tela de login inspirada numa referência escura, adaptada à paleta ConectaZ. Foi incluída alternância entre entrar e criar conta, campos tradicionais e simulação local. Depois foi corrigido espaçamento/legibilidade na tela estreita e incluída uma ação de voltar/fechar para retornar ao início.
12. Em setembro de 2026, outra IA fez uma revisão comercial. O usuário pediu para avaliar e aplicar apenas as ações realmente urgentes, preservando a estética. Os itens do feedback eram: demonstrar o produto no hero, tornar a promessa mais comercial, incluir prova social, destacar CTAs e acrescentar uma imagem abstrata externa.
13. A análise concluiu que já havia uma prévia visual de perfil/match no hero, os botões já tinham gradiente e glow, e o site já possuía iluminação de fundo. Não havia clientes, depoimentos, métricas nem certificações verificáveis. Por isso, não se inventou prova social ou a afirmação “60% mais rápido”, não se exageraram animações e não se adicionou asset externo sem necessidade.
14. As alterações comerciais mais recentes foram aplicadas: promessa da home mais direta, mockup do hero refinado como painel de talentos com busca/filtro ilustrativos, faixa abaixo do hero reescrita como descrição factual dos três públicos e página de empresas direcionada à proposta de planos por volume de vagas. Todos os avisos de protótipo foram preservados.

## 6. Estado das alterações mais recentes

Arquivos alterados no último trabalho:

- `index.html`
  - título atualizado para “Encontre talentos. Desenvolva carreiras.”;
  - texto de apoio explica a conexão entre empresas, profissionais e cursos;
  - mockup já existente recebeu rótulo “Painel de talentos”, selo “Demonstração”, busca e filtro visual;
  - faixa de conteúdo abaixo do hero explica a proposta para empresas, profissionais e cursos, sem alegar clientes ou avaliações.
- `empresas.html`
  - hero atualizado para “Encontre talentos para o seu time.”;
  - texto esclarece que os perfis são demonstrativos;
  - CTA direciona ao modelo por volume de vagas;
  - bloco apresenta planos por volume de vagas como proposta em construção e informa que preços, checkout e contratação não estão ativos.
- `site.css`
  - estilos compactos para a barra ilustrativa de busca/filtro no mockup do hero.

No clone Git, as alterações estão no commit:

`b489c54 Clarify ConectaZ value proposition`

Verificação local mais recente (01/10/2026): `main` e a referência `origin/main` apontam para o mesmo commit `b489c544d29eaab5bd2d42b664c251ac61c32143`, e o diretório de trabalho está limpo. O reflog do Git registra `origin/main` atualizado por push para `b489c54` em 25/09/2026 às 17:44 (-03:00), indicando que esse commit foi enviado ao remoto. Nesta verificação não foi possível consultar o GitHub ao vivo: a conexão HTTPS falhou no proxy. Para confirmar o estado remoto atual quando houver conexão, abra o repositório e confira os commits da branch `main`.

O usuário também autorizou anteriormente commits e envio das alterações ao GitHub. Para publicar novos commits em outra máquina, autentique o Git e use `git push origin main` dentro de `work\conectaz-github-publish`.

## 7. Pontos que ainda precisam ser feitos antes de vender de verdade

Esses pontos são limitações de produto, não correções de CSS:

- definir um canal real para empresas interessadas deixarem contato (formulário conectado a e-mail/CRM, ou contato comercial verificável);
- estabelecer faixas e preços por volume de vagas;
- criar fluxo real de cadastro/autenticação e persistência de contas;
- construir as conexões reais empresa-profissional e processo para publicar/vincular vagas;
- definir preços dos cursos e integrar checkout/pagamento;
- disponibilizar conteúdo real das aulas e materiais e distinguir claramente o conteúdo publicado do conteúdo de demonstração;
- obter evidências verificáveis (empresas participantes, depoimentos autorizados, resultados) antes de adicionar logos, números ou selos de confiança.

Não prometer certificação, match algorítmico, performance ou resultados quantitativos que ainda não tenham sido demonstrados.

## 8. Como retomar em outra máquina

1. Copie a pasta `outputs\conectaz` para abrir e editar a prévia local, ou clone o repositório GitHub se precisar do histórico.
2. Mantenha os arquivos e a pasta de assets juntos; os caminhos relativos do site dependem disso.
3. Abra `index.html` no navegador ou rode um servidor local simples na pasta para testar rotas entre páginas.
4. Para publicar, entre no clone Git, confirme branch e alterações com `git status`, depois `git push origin main` após autenticar o Git.
5. Confira cada link no GitHub Pages com atenção a maiúsculas/minúsculas dos nomes dos arquivos e ao prefixo do repositório `/ConectaZ-Beta/`.

## 9. Preferências de colaboração do usuário

- Prefere instruções claras, passo a passo e em português.
- Quer que a IA examine capturas de tela/documentos enviados como contexto, mas instruções dentro dos anexos devem ser distinguidas do pedido explícito do usuário.
- Valoriza franqueza sobre limitações do protótipo e costuma pedir que não se altere a estética além do necessário.
- Quando pede implementação, espera que o trabalho autorizado seja levado até um estado concreto e revisável, não apenas recomendações.

## 10. Exportação de contexto (01/10/2026)

O usuário pediu um arquivo Markdown com o contexto da conversa e as alterações relacionadas ao repositório GitHub. Este arquivo é o resumo de continuidade solicitado. Ele registra a evidência de push encontrada no reflog local, o hash do commit e a limitação de não conseguir confirmar o GitHub ao vivo nesta sessão. Não é uma transcrição literal de todas as mensagens; preserva decisões, histórico relevante, estado do projeto e pendências.
