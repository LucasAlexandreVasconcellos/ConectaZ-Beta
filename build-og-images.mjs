// Gera os cards de Open Graph (1200x630) com o visual "Grade Viva".
// Uso: node build-og-images.mjs [--outdir=.og-build]
// Estratégia: escreve um HTML temporário por página; a captura em PNG é
// feita por captura headless do Chrome/Edge (ver HANDOFF, Fase A, item 4).
// As imagens finais ficam em assets/og/*.png e assets/og/courses/*.png.
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const argOut = process.argv.find((a) => a.startsWith('--outdir='));
const outdir = join(root, argOut ? argOut.slice('--outdir='.length) : '.og-build');

const dataContext = {};
const vm = await import('node:vm');
vm.runInNewContext(await (await import('node:fs/promises')).readFile(join(root, 'courses-data.js'), 'utf8'), dataContext);
const courses = dataContext.CONECTAZ_COURSES;

// [arquivo final relativo a assets/og/, kicker, título, subtítulo, tag]
const pages = [
  ['home.png', 'PLATAFORMA', 'Onde conexões se tornam oportunidades', 'Empresas, profissionais, conhecimento e inovação no mesmo ecossistema.', 'ConectaZ'],
  ['empresas.png', 'PARA EMPRESAS', 'Encontre o talento que a sua operação precisa', 'Publique vagas, filtre por perfil real e conecte-se a quem faz acontecer.', 'ConectaZ · Empresas'],
  ['profissionais.png', 'PARA PROFISSIONAIS', 'Sua próxima oportunidade começa aqui', 'Crie seu perfil, mostre seu trabalho e cresça com trilhas práticas.', 'ConectaZ · Profissionais'],
  ['cursos.png', 'APRENDIZADO', 'Trilhas práticas para o mercado real', 'Seis trilhas profissionalizantes, no seu ritmo e direto ao ponto.', 'ConectaZ · Trilhas'],
  ['login.png', 'ACESSO', 'Bem-vindo de volta', 'Acompanhe oportunidades e continue sua jornada de aprendizado.', 'ConectaZ'],
].map(([file, kicker, title, subtitle, tag]) => ({ file, kicker, title, subtitle, tag }));

const coursePages = Object.entries(courses).map(([id, course]) => ({
  file: `courses/${id}.png`,
  kicker: `TRILHA · ${(course.category || '').toUpperCase()}`,
  title: course.title,
  subtitle: course.description,
  tag: 'ConectaZ · Cursos',
}));

function card({ kicker, title, subtitle, tag }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg0: #05060a; --bg1: #0a0c12; --bg2: #10131c; --bg3: #151927;
    --white: #eef0f6; --muted: #9aa1b2; --faint: #808a9d;
    --line: rgba(154, 161, 178, .16); --line-strong: rgba(154, 161, 178, .30);
    --accent: #7c6cff; --accent-soft: #a89fff; --cyan: #5cd6ff;
  }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  .card {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background:
      radial-gradient(900px 560px at 12% -10%, rgba(124, 108, 255, .18), transparent 60%),
      radial-gradient(700px 480px at 108% 112%, rgba(92, 214, 255, .10), transparent 55%),
      linear-gradient(180deg, var(--bg0), var(--bg1) 55%, var(--bg2));
    color: var(--white);
    font-family: 'Inter', system-ui, sans-serif;
    padding: 64px 72px;
    display: flex; flex-direction: column;
  }
  .grid { position: absolute; inset: 0; pointer-events: none; opacity: .5;
    background-image:
      linear-gradient(to right, rgba(154, 161, 178, .07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(154, 161, 178, .07) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(860px 620px at 26% 18%, #000 30%, transparent 78%);
    -webkit-mask-image: radial-gradient(860px 620px at 26% 18%, #000 30%, transparent 78%);
  }
  .brandbar { position: absolute; top: 0; left: 0; right: 0; height: 5px;
    background: linear-gradient(90deg, var(--accent), var(--cyan)); }
  .glow { position: absolute; width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124, 108, 255, .48), transparent 65%);
    top: -150px; right: 90px; filter: blur(10px); }
  .glow2 { position: absolute; width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(92, 214, 255, .20), transparent 65%);
    bottom: -180px; left: -140px; filter: blur(12px); }
  .top { display: flex; align-items: center; gap: 14px; position: relative; }
  .diamond { width: 30px; height: 30px; border: 2.4px solid var(--white); border-radius: 8px; position: relative; }
  .diamond::after { content: ''; position: absolute; inset: 7px; background: var(--accent);
    border-radius: 3px; transform: rotate(45deg); }
  .brand { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 27px; font-weight: 600; letter-spacing: .01em; }
  .tag { margin-left: auto; font-size: 17px; font-weight: 500; color: var(--faint);
    border: 1px solid var(--line-strong); border-radius: 999px; padding: 9px 20px; }
  .mid { position: relative; margin-top: auto; max-width: 1020px; }
  .kicker { display: flex; align-items: center; gap: 12px; color: var(--accent-soft);
    font-size: 19px; font-weight: 600; letter-spacing: .24em; margin-bottom: 22px; }
  .kicker::before { content: ''; width: 34px; height: 2px; background: var(--accent); }
  h1 { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 66px; line-height: 1.06;
    font-weight: 600; letter-spacing: -.022em; max-width: 1000px; }
  .subtitle { margin-top: 24px; font-size: 25px; line-height: 1.5; color: var(--muted); max-width: 880px; }
  .bottom { position: relative; display: flex; align-items: center; gap: 16px; margin-top: 44px;
    color: var(--faint); font-size: 17px; }
  .chip { border: 1px solid var(--line); background: rgba(16, 19, 28, .8); color: var(--white);
    font-size: 15px; font-weight: 600; letter-spacing: .16em; border-radius: 999px; padding: 10px 22px; }
  .chip.accent { border-color: rgba(168, 159, 255, .7); background: rgba(124, 108, 255, .30); color: #e9e5ff; }
  .path { flex: 1; height: 1px; background: linear-gradient(90deg, var(--line-strong), transparent); }
  .url { letter-spacing: .02em; }
</style>
</head>
<body>
  <div class="card">
    <div class="grid"></div>
    <div class="brandbar" aria-hidden="true"></div>
    <div class="glow"></div>
    <div class="glow2"></div>
    <div class="top">
      <span class="diamond" aria-hidden="true"></span>
      <span class="brand">ConectaZ</span>
      <span class="tag">${tag}</span>
    </div>
    <div class="mid">
      <div class="kicker">${kicker}</div>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <div class="bottom">
      <span class="chip">PROTÓTIPO</span>
      <span class="chip accent">GRADE VIVA</span>
      <span class="path" aria-hidden="true"></span>
      <span class="url">github.com/LucasAlexandreVasconcellos/ConectaZ-Beta</span>
    </div>
  </div>
</body>
</html>
`;
}

await rm(outdir, { recursive: true, force: true });
await mkdir(join(outdir, 'courses'), { recursive: true });

const manifest = [];
for (const page of [...pages, ...coursePages]) {
  const htmlPath = join(outdir, page.file.replace('.png', '.html'));
  await writeFile(htmlPath, card(page));
  manifest.push(page.file);
}
await writeFile(join(outdir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Gerados ${manifest.length} HTMLs de OG em ${outdir}`);
