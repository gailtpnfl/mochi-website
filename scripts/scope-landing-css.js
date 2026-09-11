/**
 * Generates the landing page stylesheets from the design reference.
 *
 *   ref-package/reference-styles.css
 *     ├─ src/app/landing.css   every page-section rule, prefixed with `.mw-landing`
 *     └─ src/app/chrome.css    nav + footer rules, left global (Nav/Footer are sitewide)
 *
 * Scoping matters: the reference and globals.css share 23 class names
 * (.section-title, .btn-primary, .card-link, …) that the other ~20 routes rely on,
 * so importing the reference globally would restyle the whole site.
 *
 * Run: node scripts/scope-landing-css.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'ref-package/reference-styles.css');
const OUT_SCOPED = path.join(ROOT, 'src/app/landing.css');
const OUT_CHROME = path.join(ROOT, 'src/app/chrome.css');

const SCOPE = '.mw-landing';

// Nav/Footer render outside the landing wrapper, so their rules stay global.
// `.container` joins them because the reference footer markup relies on it, and no
// other route in this project uses that class name.
const GLOBAL_RE =
  /^(nav\b|footer\b|\.nav-|\.nav\b|\.mob-menu|\.burger|\.progress-bar|\.ft-soc|\.footer-|\.brand-word|\.container\b)/;

// Tailwind preflight already covers these; re-declaring them globally breaks other routes.
const DROP = new Set(['*', '*::before', '*::after', 'html']);

/**
 * The reference has an orphan `}` at line ~1562 (leftover from a deleted @media
 * wrapper). Browsers skip it via error recovery; a real parser must not.
 */
function stripOrphanBraces(text) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;
      out += text.slice(i, stop);
      i = stop - 1;
      continue;
    }
    const c = text[i];
    if (c === '{') depth++;
    else if (c === '}') {
      if (depth === 0) continue; // orphan — drop it
      depth--;
    }
    out += c;
  }
  return out;
}

function parse(text) {
  const nodes = [];
  let i = 0;
  while (i < text.length) {
    while (i < text.length && /\s/.test(text[i])) i++;
    if (i >= text.length) break;

    if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;
      nodes.push({ type: 'comment', text: text.slice(i, stop) });
      i = stop;
      continue;
    }

    let j = i;
    let parens = 0;
    while (j < text.length) {
      const c = text[j];
      if (c === '(') parens++;
      else if (c === ')') parens--;
      else if ((c === '{' || c === ';') && parens === 0) break;
      j++;
    }

    if (j >= text.length) {
      const rest = text.slice(i).trim();
      if (rest) nodes.push({ type: 'raw', text: rest });
      break;
    }

    if (text[j] === ';') {
      nodes.push({ type: 'statement', text: text.slice(i, j + 1).trim() });
      i = j + 1;
      continue;
    }

    const prelude = text.slice(i, j).trim();
    let k = j;
    let depth = 0;
    while (k < text.length) {
      if (text[k] === '{') depth++;
      else if (text[k] === '}') {
        depth--;
        if (depth === 0) break;
      }
      k++;
    }
    nodes.push({ type: 'block', prelude, body: text.slice(j + 1, k) });
    i = k + 1;
  }
  return nodes;
}

function splitSelectors(sel) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const c of sel) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const scopeOne = (p) => (p === 'body' ? SCOPE : `${SCOPE} ${p}`);

/**
 * `overflow-x: hidden` is fine on <body> — browsers propagate it to the
 * viewport — but moving it onto the .mw-landing <div> breaks `position: sticky`
 * inside it: a non-visible overflow on one axis computes the other to `auto`,
 * making the element a scroll container, so the offer slider's sticky wrap
 * would pin to the div (which never scrolls) instead of the viewport.
 * globals.css keeps the declaration on <body> where it belongs.
 */
function stripOverflow(decls) {
  return decls.replace(/\s*overflow(-[xy])?\s*:[^;}]*;/g, '');
}

function render(nodes, indent, scopedSink, chromeSink) {
  for (const n of nodes) {
    if (n.type === 'comment' || n.type === 'raw') {
      scopedSink.push(indent + n.text);
      continue;
    }
    if (n.type === 'statement') {
      if (!/^@(font-face|charset)/.test(n.text)) scopedSink.push(indent + n.text);
      continue;
    }

    const { prelude, body } = n;

    if (/^@font-face/i.test(prelude)) continue; // next/font self-hosts Urania Black
    if (/^@keyframes/i.test(prelude)) {
      scopedSink.push(`${indent}${prelude} {${body}}`); // keyframes resolve by name, keep global
      continue;
    }
    if (/^@(media|supports)/i.test(prelude)) {
      const s = [];
      const c = [];
      render(parse(body), indent + '  ', s, c);
      if (s.length) scopedSink.push(`${indent}${prelude} {\n${s.join('\n')}\n${indent}}`);
      if (c.length) chromeSink.push(`${indent}${prelude} {\n${c.join('\n')}\n${indent}}`);
      continue;
    }
    if (/^@/.test(prelude)) {
      scopedSink.push(`${indent}${prelude} {${body}}`);
      continue;
    }

    const parts = splitSelectors(prelude);
    const globals = parts.filter((p) => GLOBAL_RE.test(p));
    const scoped = parts
      .filter((p) => !GLOBAL_RE.test(p) && !DROP.has(p) && p !== ':root')
      .map(scopeOne);
    const roots = parts.filter((p) => p === ':root');

    if (globals.length) chromeSink.push(`${indent}${globals.join(',\n' + indent)} {${body}}`);
    if (roots.length) scopedSink.push(`${indent}${roots.join(',\n' + indent)} {${body}}`);
    if (scoped.length) {
      const decls = parts.includes('body') ? stripOverflow(body) : body;
      scopedSink.push(`${indent}${scoped.join(',\n' + indent)} {${decls}}`);
    }
  }
}

function fixFonts(css) {
  return css
    .replace(/'Urania Black',\s*sans-serif/g, 'var(--font-urania), sans-serif')
    .replace(/'Urania Black'/g, 'var(--font-urania)')
    .replace(/'DM Sans',\s*sans-serif/g, 'var(--font-dm-sans), sans-serif')
    .replace(/"Michroma",\s*"Satoshi",\s*sans-serif/g, 'var(--font-urania), sans-serif')
    .replace(/"Satoshi",\s*sans-serif/g, 'var(--font-urania), sans-serif');
}

const scopedOut = [];
const chromeOut = [];
render(parse(stripOrphanBraces(fs.readFileSync(SRC, 'utf8'))), '', scopedOut, chromeOut);

const header = (name) =>
  `/* ${name}\n   Generated from ref-package/reference-styles.css — do not edit by hand.\n   Regenerate with: node scripts/scope-landing-css.js */\n\n`;

fs.writeFileSync(
  OUT_SCOPED,
  header('Landing page styles — scoped to .mw-landing') + fixFonts(scopedOut.join('\n')) + '\n',
);
fs.writeFileSync(
  OUT_CHROME,
  header('Global nav + footer chrome') + fixFonts(chromeOut.join('\n')) + '\n',
);

const balance = (f) => {
  const t = fs.readFileSync(f, 'utf8');
  return (t.match(/{/g) || []).length - (t.match(/}/g) || []).length;
};
console.log(`landing.css  rules=${scopedOut.length}  brace-balance=${balance(OUT_SCOPED)}`);
console.log(`chrome.css   rules=${chromeOut.length}  brace-balance=${balance(OUT_CHROME)}`);
