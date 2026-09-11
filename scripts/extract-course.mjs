// One-shot extractor: Crypto_Trading_101.html -> structured course data.
// Takes ONLY content + quiz logic. Discards the file's CSS/theme, the whole
// gamification layer (Crypto City, XP, levels, buildings, achievements,
// activities, trader tips, confetti, character/city modals) and its nav chrome.
// Emits src/lib/course/crypto-101-data.ts styled by OUR design system later.
import fs from "node:fs";
import path from "node:path";

const SRC = "C:/Users/curam/Downloads/Mochi/Crypto_Trading_101.html";
const OUT = path.resolve("src/lib/course/crypto-101-data.ts");

const html = fs.readFileSync(SRC, "utf8");
const body = html.slice(html.indexOf("</style>") + 8, html.lastIndexOf("<script"));

// --- helpers ------------------------------------------------------------
const stripTags = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

// Return end index (exclusive) of the div that opens at openIdx ('<div...').
function matchDiv(str, openIdx) {
  const re = /<\/?div\b/gi;
  re.lastIndex = openIdx;
  let depth = 0,
    m;
  while ((m = re.exec(str))) {
    if (str[m.index + 1] === "/") {
      depth--;
      if (depth === 0) return str.indexOf(">", m.index) + 1;
    } else depth++;
  }
  return str.length;
}

// Remove every div whose opening tag matches `openTagRe` (with its full subtree).
function removeBlocks(str, openTagRe) {
  let out = str,
    m;
  const re = new RegExp(openTagRe.source, "gi");
  while ((m = re.exec(out))) {
    const end = matchDiv(out, m.index);
    out = out.slice(0, m.index) + out.slice(end);
    re.lastIndex = m.index;
  }
  return out;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// --- nav map: order, grouping, emoji, title -----------------------------
const navHtml = html.slice(0, html.indexOf('id="sec0"'));
const navRe = /class="nav-(section|item)[^"]*"([^>]*)>([\s\S]*?)<\/div>/g;
const order = []; // { idx, emoji, title, group, groupEmoji }
let curGroup = "",
  curGroupEmoji = "",
  nm;
while ((nm = navRe.exec(navHtml))) {
  const kind = nm[1];
  const raw = decode(stripTags(nm[3]));
  if (kind === "section") {
    const mm = raw.match(/^([\p{Extended_Pictographic}️‍\u{1F3FB}-\u{1F3FF}]+)?\s*([\s\S]*)$/u);
    curGroupEmoji = (mm && mm[1]) || "";
    curGroup = (mm ? mm[2] : raw).trim();
  } else {
    const idxM = /showSection\((\d+)\)/.exec(nm[2]);
    if (!idxM) continue;
    const mm = raw.match(/^([\p{Extended_Pictographic}️‍\u{1F3FB}-\u{1F3FF}]+)?\s*([\s\S]*)$/u);
    order.push({
      idx: Number(idxM[1]),
      emoji: (mm && mm[1]) || "",
      title: (mm ? mm[2] : raw).trim(),
      group: curGroup,
      groupEmoji: curGroupEmoji,
    });
  }
}

// --- answer keys from checkQuiz('id',[...]) -----------------------------
const answerKeys = {};
for (const m of html.matchAll(/checkQuiz\('([^']+)',\s*\[([0-9,\s]+)\]\)/g)) {
  answerKeys[m[1]] = m[2].split(",").map((x) => Number(x.trim()));
}

// --- parse a quiz-block -> { id, title, questions[] } -------------------
function parseQuiz(blockHtml) {
  const idM = blockHtml.match(/name="q-([a-z0-9]+)-\d+"/i);
  if (!idM) return null;
  const id = idM[1];
  const title = decode(
    stripTags((blockHtml.match(/class="quiz-title"[^>]*>([\s\S]*?)<\/span>/i) || [, ""])[1]),
  ).replace(/^Quick Quiz\s*[—-]\s*/i, "");
  const questions = [];
  const qBlocks = blockHtml.split(/<div class="quiz-question">/i).slice(1);
  for (const qb of qBlocks) {
    const qtext = decode(
      stripTags((qb.match(/class="q-text"[^>]*>([\s\S]*?)<\/p>/i) || [, ""])[1]),
    ).replace(/^\s*\d+\.\s*/, "");
    const options = [];
    for (const o of qb.matchAll(/class="q-option"[^>]*>([\s\S]*?)<\/label>/gi)) {
      options.push(decode(stripTags(o[1])));
    }
    if (qtext && options.length) questions.push({ q: qtext, options, correct: 0 });
  }
  const key = answerKeys[id] || [];
  questions.forEach((qq, i) => (qq.correct = key[i] ?? 0));
  return { id, title: title || "Quick Quiz", questions };
}

// --- sanitize chapter body to our theme's class set --------------------
function sanitize(inner) {
  let s = inner;
  // drop chrome + gamification + interactive-but-non-quiz blocks
  s = removeBlocks(s, /<div class="topbar"/);
  s = removeBlocks(s, /<div class="nav-buttons"/);
  s = removeBlocks(s, /<div class="quiz-block"/);
  s = removeBlocks(s, /<div class="(activity|act-[a-z]*|practice-hub|rp-[a-z]*|char-[a-z]*|city-[a-z]*)[^"]*"/);
  // outer padding wrapper -> unwrap (remove opening div that only holds padding)
  // class mappings (namespaced ct-*)
  const map = [
    [/class="section-hero"/g, 'class="ct-hero"'],
    [/class="card-title"[^>]*/g, 'class="ct-card-title"'],
    [/class="card"[^>]*/g, 'class="ct-card"'],
    [/class="grid-2"[^>]*/g, 'class="ct-grid"'],
    [/class="grid-3"[^>]*/g, 'class="ct-grid ct-grid-3"'],
    [/class="analogy-box"[^>]*/g, 'class="ct-callout ct-callout--analogy"'],
    [/class="warn-box"[^>]*/g, 'class="ct-callout ct-callout--warn"'],
    [/class="tip-box"[^>]*/g, 'class="ct-callout ct-callout--tip"'],
    [/class="info-box"[^>]*/g, 'class="ct-callout ct-callout--info"'],
    [/class="success-box"[^>]*/g, 'class="ct-callout ct-callout--tip"'],
    [/class="key-box"[^>]*/g, 'class="ct-callout ct-callout--info"'],
    [/class="example-box"[^>]*/g, 'class="ct-callout ct-callout--info"'],
    [/class="(analogy|warn|tip|info|key|example)-label"[^>]*/g, 'class="ct-callout-label"'],
    [/class="keyword"[^>]*/g, 'class="ct-keyword"'],
    [/class="pill pill-green"[^>]*/g, 'class="ct-pill ct-pill--green"'],
    [/class="pill pill-blue"[^>]*/g, 'class="ct-pill ct-pill--blue"'],
    [/class="pill[^"]*"[^>]*/g, 'class="ct-pill"'],
  ];
  for (const [re, rep] of map) s = s.replace(re, rep);
  // strip inline styles, event handlers, ids, remaining foreign classes
  s = s.replace(/\s(style|onclick|onchange|id|data-[a-z-]+)="[^"]*"/gi, "");
  s = s.replace(/\sclass="(?!ct-)[^"]*"/gi, ""); // drop any class not already ct-*
  // drop leftover buttons/inputs/svg
  s = s.replace(/<button[\s\S]*?<\/button>/gi, "");
  s = s.replace(/<input[^>]*>/gi, "");
  // genericize the hardcoded personalization
  s = s.replace(/Congratulations,\s*Gail!/gi, "Congratulations, trader!");
  // tidy whitespace
  s = s.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+\n/g, "\n").trim();
  return s;
}

// --- build chapters -----------------------------------------------------
const usedSlugs = new Set();
const chapters = [];
const groupsMap = new Map();

for (const nav of order) {
  const startTag = `id="sec${nav.idx}"`;
  const startPos = body.indexOf(startTag);
  if (startPos < 0) continue;
  const divStart = body.lastIndexOf("<div", startPos);
  const end = matchDiv(body, divStart);
  const outer = body.slice(divStart, end);
  const isPracticeHub = /Practice Hub/i.test(nav.title);

  // quiz(zes) in this section
  const quizzes = [];
  for (const qm of outer.matchAll(/<div class="quiz-block"[^>]*>/gi)) {
    const qend = matchDiv(outer, qm.index);
    const parsed = parseQuiz(outer.slice(qm.index, qend));
    if (parsed && parsed.questions.length) quizzes.push(parsed);
  }

  if (isPracticeHub) {
    // keep ONLY the comprehensive final quiz (cq); discard the gamified hub
    const finalQ = quizzes.find((q) => q.id === "cq") || quizzes[0];
    if (finalQ) globalThis.__finalQuiz = finalQ;
    continue;
  }

  let slug = slugify(nav.title);
  let n = 2;
  while (usedSlugs.has(slug)) slug = `${slugify(nav.title)}-${n++}`;
  usedSlugs.add(slug);

  const levelM = outer.match(/class="level-badge level-(\w+)"/i);
  const html = sanitize(outer);

  chapters.push({
    slug,
    secId: nav.idx,
    title: nav.title,
    emoji: nav.emoji,
    group: nav.group,
    groupEmoji: nav.groupEmoji,
    level: levelM ? levelM[1].toUpperCase() : null,
    html,
    quiz: quizzes.find((q) => q.id !== "cq") || null,
  });

  if (!groupsMap.has(nav.group))
    groupsMap.set(nav.group, { name: nav.group, emoji: nav.groupEmoji, chapterSlugs: [] });
  groupsMap.get(nav.group).chapterSlugs.push(slug);
}

const COURSE = {
  slug: "crypto-trading-101",
  title: "Crypto Trading 101",
  subtitle: "From candlesticks to Smart Money Concepts — a complete, self-paced trading course.",
  groups: [...groupsMap.values()],
  chapters,
  finalQuiz: globalThis.__finalQuiz || null,
};

// --- emit TS ------------------------------------------------------------
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const banner = `// AUTO-GENERATED by scripts/extract-course.mjs from Crypto_Trading_101.html.
// Content + quiz logic only — original CSS/theme and gamification discarded.
// Re-run: node scripts/extract-course.mjs
import type { Course } from "./types";\n\n`;
fs.writeFileSync(OUT, banner + "export const COURSE: Course = " + JSON.stringify(COURSE, null, 2) + ";\n");

// --- summary ------------------------------------------------------------
const totalQ = chapters.reduce((a, c) => a + (c.quiz ? c.quiz.questions.length : 0), 0) +
  (COURSE.finalQuiz ? COURSE.finalQuiz.questions.length : 0);
console.log(`Groups: ${COURSE.groups.length}`);
console.log(`Chapters: ${chapters.length}`);
console.log(`Chapter quizzes: ${chapters.filter((c) => c.quiz).length}` +
  (COURSE.finalQuiz ? ` + 1 final (${COURSE.finalQuiz.questions.length}Q)` : ""));
console.log(`Total quiz questions: ${totalQ}`);
console.log("");
for (const g of COURSE.groups) {
  console.log(`## ${g.emoji} ${g.name}`);
  for (const sl of g.chapterSlugs) {
    const c = chapters.find((x) => x.slug === sl);
    console.log(`   - ${c.emoji} ${c.title}${c.quiz ? "  [quiz " + c.quiz.questions.length + "Q]" : ""}  (${c.html.length}b)`);
  }
}
