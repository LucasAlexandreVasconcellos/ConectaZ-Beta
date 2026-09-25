# ConectaZ

Protótipo estático de uma plataforma que aproxima empresas e profissionais e apresenta trilhas de aprendizagem.

## Páginas

- `index.html` — página inicial
- `empresas.html` — jornada para empresas
- `profissionais.html` — jornada para profissionais e portfólio local de aprendizagem
- `catalogo.html` — catálogo de cursos (`cursos.html` permanece como rota compatível)
- `curso-*.html` — páginas estáticas individuais, com módulos, aulas e materiais
- `curso.html` — rota compatível que exibe a trilha de UX

## Abrir localmente no Windows

Abra o PowerShell nesta pasta e execute:

```powershell
py -m http.server 8765
```

Depois acesse <http://127.0.0.1:8765/>. Encerre o servidor com `Ctrl+C`.

## Atualizar as páginas dos cursos

Edite `courses-data.js` e gere novamente as páginas estáticas e arquivos de apoio:

```powershell
node build-course-pages.mjs
```

O protótipo não possui login, busca de vagas, mensagens, cobrança, certificados ou validação em servidor. Perfis, empresas, cursos e combinações exibidos como exemplos estão identificados como demonstração. O progresso dos cursos fica apenas no navegador atual.
