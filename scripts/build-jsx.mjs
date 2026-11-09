// Recompile les composants React des pages publiques (.jsx) en .js minifiés.
// Usage, depuis la racine du dépôt : node scripts/build-jsx.mjs
// Ne dépend que de Node et de `npx` (esbuild est téléchargé à la volée, version épinglée,
// rien n'est ajouté au site). Voir docs/build-jsx.md.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const ESBUILD = 'esbuild@0.28.2';
const root = new URL('..', import.meta.url).pathname;

// source .jsx -> fichier .js servi au navigateur
const jobs = [
  ['site-i18n.jsx', 'js/site-i18n.min.js'],
  ['site-data.jsx', 'js/site-data.min.js'],
  ['site-shared.jsx', 'js/site-shared.min.js'],
  ...readdirSync(join(root, 'pages/src'))
    .filter((f) => f.endsWith('.jsx'))
    .map((f) => [`pages/src/${f}`, `js/pages/${basename(f, '.jsx')}.min.js`]),
];

mkdirSync(join(root, 'js/pages'), { recursive: true });
const versions = {};
for (const [src, out] of jobs) {
  execFileSync('npx', ['-y', ESBUILD, src, `--outfile=${out}`, '--minify', '--target=es2018',
    '--jsx=transform', '--loader:.jsx=jsx', '--charset=utf8', '--log-level=warning'],
    { cwd: root, stdio: 'inherit' });
  versions[out] = createHash('sha256').update(readFileSync(join(root, out))).digest('hex').slice(0, 10);
  console.log(`${src} -> ${out}?v=${versions[out]}`);
}

// Met à jour le ?v= (cache navigateur) dans les pages HTML qui chargent ces fichiers.
const htmlFiles = ['index.html', ...readdirSync(join(root, 'pages')).filter((f) => f.endsWith('.html')).map((f) => `pages/${f}`)];
for (const file of htmlFiles) {
  const path = join(root, file);
  const before = readFileSync(path, 'utf8');
  const after = before.replace(/((?:\.\.\/)?(js\/[\w\-/]+\.min\.js))\?v=[\w]+/g,
    (m, full, out) => (versions[out] ? `${full}?v=${versions[out]}` : m));
  if (after !== before) { writeFileSync(path, after); console.log(`maj ${file}`); }
}
