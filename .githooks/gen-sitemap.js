/* Génère sitemap.xml depuis les pages réelles du dépôt.

   Les pages réservées au jeu (fiche de personnage, écran du MJ, éditeur de
   carte) sont exclues : elles exigent une connexion et n'ont rien à faire dans
   un index public. La date de dernière modification vient du dernier commit qui
   a touché le fichier — plus honnête que la date du jour. */
const fs = require('fs'), path = require('path');
const { execSync } = require('child_process');

const BASE = 'https://kaleysur.github.io/';
const EXCLUS = new Set(['joueurs.html', 'dm.html', 'editeur-carte.html']);
/* Dossiers de travail : maquettes, notes de passation. Rien a indexer. */
const DOSSIERS_EXCLUS = new Set(['design_handoff_joueurs']);

function pages(d, acc) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    if (DOSSIERS_EXCLUS.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) pages(p, acc);
    else if (e.name.endsWith('.html') && !EXCLUS.has(e.name)) acc.push(p);
  }
  return acc;
}

function derniereModif(f) {
  try {
    const d = execSync(`git log -1 --format=%cs -- "${f}"`, { encoding: 'utf8' }).trim();
    return d || new Date().toISOString().slice(0, 10);
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}

/* L'accueil passe avant les continents, qui passent avant les lieux. */
function priorite(url) {
  if (url === 'index.html') return '1.0';
  const profondeur = url.split('/').length - 1;
  if (profondeur === 0) return '0.8';
  const nom = path.basename(url, '.html');
  const dossier = url.split('/')[0];
  return nom === dossier ? '0.7' : '0.5';   // page-continent contre page-lieu
}

const liste = pages('.', [])
  .map(f => f.split(path.sep).join('/'))
  .sort();

const corps = liste.map(url => {
  const loc = BASE + (url === 'index.html' ? '' : url);
  return '  <url>\n'
       + '    <loc>' + loc + '</loc>\n'
       + '    <lastmod>' + derniereModif(url) + '</lastmod>\n'
       + '    <priority>' + priorite(url) + '</priority>\n'
       + '  </url>';
}).join('\n');

fs.writeFileSync('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + corps + '\n</urlset>\n', 'utf8');

console.log('sitemap.xml :', liste.length, 'pages');
console.log('exclues :', [...EXCLUS, ...[...DOSSIERS_EXCLUS].map(d => d + '/')].join(', '));
