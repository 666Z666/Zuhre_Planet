#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const defaultDocs = [
  'README.md',
  'README.en.md',
  'AGENTS.md',
  'PROJECT_MASTER_DOCUMENT.md',
  'docs/PROJE_HARITASI.md',
  'docs/PROJECT_MAP.md',
  'docs/ROADMAP.md',
  'TODO.md',
  'DEVELOPMENT_TODO.md',
];
const inputs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const paths = inputs.length ? inputs : defaultDocs;
const ignoredDirectories = new Set(['node_modules', '.git', 'dist', 'build', '.work', 'coverage', 'playwright-report']);

function collectMarkdown(target) {
  const absolute = path.resolve(root, target);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return absolute.toLowerCase().endsWith('.md') ? [absolute] : [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) return collectMarkdown(path.relative(root, child));
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [child] : [];
  });
}

const packagePath = path.join(root, 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('package.json not found; run this checker from the project root.');
  process.exit(2);
}
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const scripts = new Set(Object.keys(packageJson.scripts ?? {}));
const docs = [...new Set(paths.flatMap(collectMarkdown))];
const missingFiles = paths.filter((target) => !fs.existsSync(path.resolve(root, target)));
const issues = missingFiles.map((missing) => `Document not found: ${missing}`);
for (const file of docs) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\bnpm\s+run\s+([a-zA-Z0-9:_-]+)/g)) {
    if (!scripts.has(match[1])) {
      const line = text.slice(0, match.index).split(/\r?\n/).length;
      issues.push(`${path.relative(root, file)}:${line}: package.json has no script named ${match[1]}`);
    }
  }
}
if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log(`${docs.length} Markdown files: all npm run references match package.json.`);
