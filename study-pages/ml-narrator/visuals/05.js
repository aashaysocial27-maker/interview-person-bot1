VISUALS[5] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, rx = 6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.3"/>`;

function drawSplit() {
  let s = svg(320);
  s += lbl(20, 22, "1,000 RATED ANSWERS · SHUFFLED, THEN SPLIT");
  const parts = [["Training", 700, "70%", B], ["Validation", 150, "15%", P], ["Test", 150, "15%", A]];
  let x = 20;
  parts.forEach(([t, n, p, c]) => { const w = n / 1000 * 600; s += rect(x, 34, w - 4, 52, c, .16) + `<text x="${x + (w - 4) / 2}" y="57" text-anchor="middle" font-size="13" font-weight="700" style="fill:${c}">${t}</text><text x="${x + (w - 4) / 2}" y="76" text-anchor="middle" class="mono" font-size="12">${n} · ${p}</text>`; x += w; });
  const jobs = [["Training", "The model learns from these.", "Used over and over.", B], ["Validation", "Compare models, tune settings.", "Used often.", P], ["Test", "The final exam, once, at the end.", "Then left alone.", A]];
  jobs.forEach(([t, a, b, c], i) => {
    const y = 110 + i * 64;
    s += rect(20, y, 600, 54, c, .06) + `<text x="36" y="${y + 23}" font-size="14" font-weight="700" style="fill:${c}">${t}</text><text x="160" y="${y + 23}" font-size="13">${a}</text><text x="160" y="${y + 42}" font-size="12" class="muted">${b}</text>`;
  });
  return s + `</svg>`;
}

function drawWear() {
  let s = svg(300);
  s += lbl(20, 22, "WHAT HAPPENS WHEN THE TEAM KEEPS PEEKING AT THE TEST SET");
  const rounds = [["Try 1", 78], ["Try 2", 81], ["Try 3", 84], ["Try 5", 87], ["Try 9", 90]];
  rounds.forEach(([t, v], i) => {
    const x = 50 + i * 100, h = (v - 60) * 6;
    s += `<rect x="${x}" y="${220 - h}" width="56" height="${h}" rx="4" style="fill:${G}" fill-opacity=".55"/><text x="${x + 28}" y="${214 - h}" text-anchor="middle" class="mono" font-size="12">${v}%</text><text x="${x + 28}" y="238" text-anchor="middle" font-size="12" class="muted">${t}</text>`;
  });
  s += `<line x1="40" y1="${220 - (79 - 60) * 6}" x2="560" y2="${220 - (79 - 60) * 6}" style="stroke:${W}" stroke-width="1.5" stroke-dasharray="6 4"/>`;
  s += `<text x="564" y="${224 - (79 - 60) * 6}" font-size="12" font-weight="600" style="fill:${W}">real users</text><text x="564" y="${240 - (79 - 60) * 6}" class="mono" font-size="12" style="fill:${W}">79%</text>`;
  s += `<text x="20" y="270" font-size="13">The test score keeps rising, but only because the model was tuned to those 150 answers.</text>`;
  s += `<text x="20" y="290" font-size="12" class="muted">Tune on validation. Look at the test set once. Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

const FOLD_SCORES = [81, 84, 79, 83, 82];
let fold = 0;
function drawCV() {
  let s = svg(320);
  s += lbl(20, 22, "5-FOLD CROSS-VALIDATION ON THE 850 NON-TEST ANSWERS");
  for (let r = 0; r < 5; r++) {
    const y = 36 + r * 40, on = r === fold;
    s += `<text x="20" y="${y + 21}" font-size="12" ${on ? 'font-weight="700"' : 'class="muted"'}>Round ${r + 1}</text>`;
    for (let c = 0; c < 5; c++) {
      const isVal = c === r, col = isVal ? P : B;
      s += `<rect x="${100 + c * 82}" y="${y}" width="76" height="30" rx="5" style="fill:${col};stroke:${on ? "var(--ink)" : col}" fill-opacity="${isVal ? (on ? .45 : .2) : (on ? .25 : .08)}" stroke-width="${on ? 1.6 : 1}"/>`;
      s += `<text x="${138 + c * 82}" y="${y + 20}" text-anchor="middle" font-size="11" ${isVal ? `font-weight="700" style="fill:${P}"` : 'class="muted"'}>${isVal ? "validate" : "train"}</text>`;
    }
    s += `<text x="530" y="${y + 21}" class="mono" font-size="13" ${on ? 'font-weight="700"' : ""}>${FOLD_SCORES[r]}%</text>`;
  }
  const avg = FOLD_SCORES.reduce((a, b) => a + b, 0) / 5;
  s += `<line x1="496" y1="238" x2="622" y2="238" style="stroke:var(--ink)"/>`;
  s += `<text x="496" y="260" font-size="12" class="muted">average</text><text x="622" y="260" text-anchor="end" class="mono" font-size="15" font-weight="700" style="fill:${A}">${avg.toFixed(1)}%</text>`;
  s += `<text x="20" y="292" font-size="13">Every answer gets one turn in validation. The average is steadier than any single split.</text>`;
  s += `<text x="20" y="310" font-size="11" class="muted">Pick a round above to highlight it. Scores are illustrative.</text>`;
  return s + `</svg>`;
}

function drawLeak() {
  let s = svg(340);
  const cand = [["Priya", B], ["Tom", P], ["Ana", G]];
  const col = (x, title, sub, assign, score, c) => {
    let o = `<text x="${x}" y="26" font-size="14" font-weight="700" style="fill:${c}">${title}</text><text x="${x}" y="44" font-size="12" class="muted">${sub}</text>`;
    o += `<text x="${x + 10}" y="70" class="mono muted" font-size="11">TRAIN</text><text x="${x + 160}" y="70" class="mono muted" font-size="11">TEST</text>`;
    assign.forEach(([who, set], i) => {
      const [name, cc] = cand[who], y = 80 + i * 30, xx = set ? x + 150 : x;
      o += rect(xx, y, 130, 24, cc, .15, 12) + `<text x="${xx + 65}" y="${y + 16}" text-anchor="middle" font-size="12" style="fill:${cc}" font-weight="600">${name}, answer ${i % 2 + 1}</text>`;
    });
    o += rect(x, 270, 280, 52, c, .1) + `<text x="${x + 14}" y="292" font-size="12">Test score</text><text x="${x + 266}" y="300" text-anchor="end" class="mono" font-size="22" font-weight="700" style="fill:${c}">${score}</text><text x="${x + 14}" y="312" font-size="11" class="muted">${c === W ? "too good to be true" : "what users will see"}</text>`;
    return o;
  };
  s += col(20, "✗ Split by answer", "same person on both sides", [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]], "96%", W);
  s += col(340, "✓ Split by candidate", "each person on one side only", [[0, 0], [0, 0], [1, 0], [1, 0], [2, 1], [2, 1]], "81%", A);
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Split", title: "1 · Three sets, three jobs", q: "Why not test on the data we trained on?",
    points: ["Shuffle the 1,000 rated answers, then split them.", "<b>Training</b> (70%): the model learns here.", "<b>Validation</b> (15%): compare models and tune settings.", "<b>Test</b> (15%): the final exam, used once."],
    pm: "When a team shares an accuracy number, ask which set it came from. Only a test-set number tells you what users will experience.",
    say: "Step one, three sets, three jobs. We shuffle the coach's one thousand rated answers and split them. Seven hundred go to the training set, where the model learns. One hundred and fifty go to the validation set, for comparing models and tuning. And the last one hundred and fifty form the test set, the final exam, used once at the very end. For a PM, always ask which set an accuracy number came from.",
    draw: drawSplit },
  { stage: "Protect test", title: "2 · Protect the test set", q: "What goes wrong if we keep checking the test score?",
    points: ["Each peek-and-tweak shapes the model to those exact test answers.", "The test score climbs, but real-user performance doesn't.", "Google's course calls this the test set “wearing out”.", "Tune on validation, test once, refresh the test set with new data."],
    pm: "Treat the test set like a sealed exam paper. If it has been used many times, ask the team to collect a fresh one before launch.",
    say: "Step two, protect the test set. Imagine the team checks the test score after every change. Seventy eight, eighty one, eighty four, ninety percent. It looks like progress. But the model is slowly being tuned to those exact hundred and fifty answers. Real users still get about seventy nine percent. The rule is simple. Do your tuning on the validation set, and look at the test set only once.",
    draw: drawWear },
  { stage: "Cross-validate", title: "3 · Cross-validation", q: "How do we get a steadier score with little data?",
    points: ["Split the non-test data into 5 equal <b>folds</b>.", "Train on 4 folds, validate on the 5th.", "Rotate until every fold has had a turn, then <b>average</b> the scores.", "Pick a round above the diagram to see it."],
    pm: "Ask for the spread across folds, not just the average. Scores from 79 to 84 are fine; scores from 60 to 95 mean the model is unstable.",
    say: "Step three, cross-validation. With a small dataset, one validation split can be lucky or unlucky. So we split the data into five folds. In round one, we train on four folds and validate on the fifth. Then we rotate, until every fold has had its turn. Here the five scores range from seventy nine to eighty four percent, and the average is about eighty two. That average is much more trustworthy than any single number.",
    draw: drawCV },
  { stage: "Leakage", title: "4 · Data leakage", q: "How can a model cheat without anyone noticing?",
    points: ["<b>Leakage</b>: test information sneaks into training.", "Split by answer, and Priya's style shows up in both sets. The model recognises her, not the quality.", "Split by <b>candidate</b>, so the test always has new people.", "Other leaks: duplicates, and using future data to predict the past."],
    pm: "A result that looks too good, like 96%, is more often a leak than a breakthrough. Ask how the split was done: by user, by time, with duplicates removed?",
    say: "Step four, data leakage. On the left, we split by answer. Priya's first answer lands in training, and her second lands in the test. The model has already learned Priya's style, so it scores ninety six percent. On the right, we split by candidate, so every person in the test is new. The honest score is eighty one percent. For a PM, a number that looks too good is usually a leak, not a breakthrough.",
    draw: drawLeak },
];
return { STEPS, picker: { label: "Highlight:", step: 2, items: () => FOLD_SCORES.map((_, i) => ({ label: "Round " + (i + 1), color: "var(--t4)" })), get: () => fold, set: i => { fold = i; } } };
})();
VMETA[5] = {"title": "An Honest Exam", "sub": "Split the interview coach's 1,000 rated answers fairly, keep the test set sealed, rotate through folds for a steadier score, and catch a leak that fakes a great result."};
