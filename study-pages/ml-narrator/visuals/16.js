VISUALS[16] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawKnobs() {
  let s = svg(320);
  s += rect(15, 14, 295, 200, B, .07) + `<text x="30" y="42" font-size="15" font-weight="700" style="fill:${B}">Parameters</text><text x="30" y="62" font-size="12" class="muted">learned from the data, during training</text>`;
  ["the weights of a regression", "the questions in each tree", "the numbers inside a neural network", "millions or billions of them"].forEach((t, i) => { s += `<text x="30" y="${94 + i * 26}" font-size="12.5">• ${t}</text>`; });
  s += rect(330, 14, 295, 200, A, .07) + `<text x="345" y="42" font-size="15" font-weight="700" style="fill:${A}">Hyperparameters</text><text x="345" y="62" font-size="12" class="muted">chosen by the team, before training</text>`;
  [["learning rate", "concept 14"], ["regularization strength λ", "concept 15"], ["tree depth, number of trees", "concepts 8–9"], ["k in KNN", "concept 10"]].forEach(([t, c], i) => { s += `<text x="345" y="${94 + i * 26}" font-size="12.5">• ${t}</text><text x="612" y="${94 + i * 26}" text-anchor="end" font-size="11" class="muted">${c}</text>`; });
  s += rect(15, 230, 610, 76, G, .08) + `<text x="30" y="254" font-size="13" font-weight="700" style="fill:${G}">Baking analogy</text><text x="30" y="276" font-size="12.5">You set the oven temperature and the timer (hyperparameters).</text><text x="30" y="294" font-size="12.5">How the cake rises inside the oven is worked out during baking (parameters).</text>`;
  return s + `</svg>`;
}

const LRS = ["0.001", "0.01", "0.1", "1.0"], DEPTHS = ["2", "4", "6", "8"];
const GRID = [[68, 72, 73, 71], [74, 80, 83, 79], [76, 84, 82, 78], [61, 66, 64, 60]];
function drawGrid() {
  let s = svg(330);
  const X0 = 150, Y0 = 50, cw = 90, ch = 50;
  s += `<text x="${X0 + 2 * cw}" y="30" text-anchor="middle" font-size="12" class="muted">Tree depth →</text>`;
  DEPTHS.forEach((d, j) => { s += `<text x="${X0 + j * cw + cw / 2}" y="${Y0 - 6}" text-anchor="middle" class="mono" font-size="12">${d}</text>`; });
  s += `<text x="40" y="${Y0 + 2 * ch}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 40 ${Y0 + 2 * ch})">Learning rate →</text>`;
  LRS.forEach((l, i) => { s += `<text x="${X0 - 10}" y="${Y0 + i * ch + ch / 2 + 4}" text-anchor="end" class="mono" font-size="12">${l}</text>`; });
  GRID.forEach((row, i) => row.forEach((v, j) => {
    const best = v === 84, t = (v - 60) / 24;
    s += `<rect x="${X0 + j * cw + 2}" y="${Y0 + i * ch + 2}" width="${cw - 4}" height="${ch - 4}" rx="5" style="fill:${A};stroke:${best ? "var(--ink)" : "none"}" fill-opacity="${.08 + t * .55}" stroke-width="2.5"/>`;
    s += `<text x="${X0 + j * cw + cw / 2}" y="${Y0 + i * ch + ch / 2 + 5}" text-anchor="middle" class="mono" font-size="13" ${best ? 'font-weight="700"' : ""}>${v}%</text>`;
  }));
  const bx = 525;
  s += `<text x="${bx}" y="70" font-size="12.5">4 × 4 =</text><text x="${bx}" y="90" font-size="12.5" font-weight="700">16 runs</text>`;
  s += `<text x="${bx}" y="130" font-size="12.5">Best: 84%</text><text x="${bx}" y="148" font-size="12" class="muted">lr 0.1, depth 4</text>`;
  s += rect(20, 262, 605, 58, W, .08) + `<text x="34" y="284" font-size="12.5"><tspan font-weight="700" style="fill:${W}">It explodes:</tspan> 5 settings × 5 values each = 3,125 runs.</text><text x="34" y="304" font-size="12.5">And the true best may sit between grid points, like lr 0.05, where nobody looked.</text>`;
  s += `<text x="${bx}" y="186" font-size="11" class="muted">Validation</text><text x="${bx}" y="200" font-size="11" class="muted">scores,</text><text x="${bx}" y="214" font-size="11" class="muted">illustrative.</text>`;
  return s + `</svg>`;
}

/* score depends mostly on x (learning rate), barely on y (depth) */
const score = (x, y) => 60 + 25 * Math.exp(-(((x - 0.63) / 0.12) ** 2)) + 3 * Math.exp(-(((y - 0.5) / 0.4) ** 2));
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const METHODS = (() => {
  const g = []; [0.15, 0.5, 0.85].forEach(x => [0.15, 0.5, 0.85].forEach(y => g.push([x, y])));
  const r = rng(29), rnd = Array.from({ length: 9 }, () => [0.06 + r() * 0.88, 0.06 + r() * 0.88]);
  const by = [[0.15, 0.5], [0.85, 0.5], [0.5, 0.2], [0.55, 0.7], [0.6, 0.45], [0.66, 0.55], [0.63, 0.3], [0.64, 0.62], [0.62, 0.5]];
  return [{ label: "Grid (9 runs)", c: "var(--t2)", pts: g }, { label: "Random (9 runs)", c: "var(--t4)", pts: rnd }, { label: "Bayesian (9 runs)", c: "var(--accent)", pts: by }];
})();
let mi = 0;
function drawSearch() {
  const M = METHODS[mi], X0 = 50, Y0 = 290, S = 260;
  let s = svg(340);
  for (let i = 0; i < 26; i++) { const x = i / 26 + 1 / 52; s += `<rect x="${X0 + (i / 26) * S}" y="${Y0 - S}" width="${S / 26 + .5}" height="${S}" style="fill:${A}" fill-opacity="${(score(x, .5) - 60) / 28 * .45}"/>`; }
  s += `<rect x="${X0}" y="${Y0 - S}" width="${S}" height="${S}" style="fill:none;stroke:var(--ink)"/>`;
  s += `<text x="${X0 + S / 2}" y="${Y0 + 20}" text-anchor="middle" font-size="12" class="muted">Learning rate → (matters a lot)</text><text x="${X0 - 16}" y="${Y0 - S / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 ${X0 - 16} ${Y0 - S / 2})">Tree depth → (matters little)</text>`;
  let best = 0, bp = null;
  M.pts.forEach(([x, y], i) => { const v = score(x, y); if (v > best) { best = v; bp = [x, y]; } s += `<circle cx="${X0 + x * S}" cy="${Y0 - y * S}" r="7" style="fill:${M.c};stroke:var(--surface)" stroke-width="1.5"/>${mi === 2 ? `<text x="${X0 + x * S + 9}" y="${Y0 - y * S - 7}" font-size="10" class="mono">${i + 1}</text>` : ""}`; });
  s += `<circle cx="${X0 + bp[0] * S}" cy="${Y0 - bp[1] * S}" r="13" style="fill:none;stroke:var(--ink)" stroke-width="2"/>`;
  const distinct = new Set(M.pts.map(p => p[0].toFixed(2))).size;
  const bx = 350;
  s += lbl(bx, 40, "SAME BUDGET: 9 TRAINING RUNS");
  s += rect(bx, 52, 275, 68, M.c, .12) + `<text x="${bx + 14}" y="78" font-size="14" font-weight="700" style="fill:${M.c}">${M.label}</text><text x="${bx + 14}" y="104" font-size="13">Best validation score: <tspan font-weight="700">${best.toFixed(0)}%</tspan></text>`;
  const notes = ["Only 3 distinct learning rates tried,", "and none hits the peak band.", "", ""];
  const txt = mi === 0 ? ["Only 3 different learning rates tried.", "The peak band falls between them."] : mi === 1 ? [`${distinct} different learning rates tried,`, "so one lands closer to the peak."] : ["Runs 1–4 explore. Then each new run", "goes where results look best."];
  txt.forEach((t, i) => { s += `<text x="${bx}" y="${150 + i * 20}" font-size="12.5">${t}</text>`; });
  s += `<text x="${bx}" y="206" font-size="12.5">Darker band = higher score.</text>`;
  s += `<text x="${bx}" y="238" font-size="12" class="muted">Tools like Optuna do Bayesian search</text><text x="${bx}" y="254" font-size="12" class="muted">and stop bad runs early.</text>`;
  s += `<text x="${bx}" y="290" font-size="11" class="muted">Pick a method above. Illustrative.</text>`;
  return s + `</svg>`;
}

function drawRules() {
  let s = svg(330);
  const rules = [["Judge on validation, never test", "or use cross-validation (concept 5)"], ["Start from sensible defaults", "they're often close to good already"], ["Set a budget first", "e.g. 50 runs, or stop after 10 with no gain"], ["Record every run", "settings, data and score, so it can be repeated"]];
  rules.forEach(([t, d], i) => { const x = 20 + (i % 2) * 305, y = 16 + Math.floor(i / 2) * 70; s += rect(x, y, 295, 60, A, .07) + `<text x="${x + 14}" y="${y + 25}" font-size="13" font-weight="700" style="fill:${A}">${i + 1}. ${t}</text><text x="${x + 14}" y="${y + 45}" font-size="12">${d}</text>`; });
  s += lbl(20, 182, "DIMINISHING RETURNS");
  const pts = [[0, 70], [5, 78], [10, 81], [20, 82.5], [30, 83], [50, 83.3]], X0 = 60, Y0 = 300, sx = 9.5, sy = 7;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + 50 * sx}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - 100}" style="stroke:var(--ink)"/>`;
  s += `<path d="M${pts.map(([r, v]) => `${X0 + r * sx} ${Y0 - (v - 68) * sy}`).join(" L")}" fill="none" style="stroke:${B}" stroke-width="2.5"/>`;
  pts.forEach(([r, v]) => { s += `<circle cx="${X0 + r * sx}" cy="${Y0 - (v - 68) * sy}" r="4" style="fill:${B}"/><text x="${X0 + r * sx}" y="${Y0 - (v - 68) * sy - 9}" text-anchor="middle" class="mono" font-size="10.5">${v}%</text>`; });
  s += `<text x="${X0 + 25 * sx}" y="${Y0 + 18}" text-anchor="middle" font-size="11.5" class="muted">number of tuning runs →</text>`;
  s += `<text x="${X0 + 50 * sx + 10}" y="230" font-size="12" class="muted">Most gain</text><text x="${X0 + 50 * sx + 10}" y="246" font-size="12" class="muted">comes early.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Knobs", title: "1 · Parameters versus hyperparameters", q: "What does the team choose, and what does the model learn?",
    points: ["<b>Parameters</b>, like weights, are learned from the data.", "<b>Hyperparameters</b> are chosen before training: learning rate, λ, tree depth, k.", "Think baking: you set the oven and timer; the cake rises on its own.", "Tuning means finding good hyperparameters."],
    pm: "When a team says “we're tuning”, they're searching these knobs. It's normal, but it takes compute and calendar time, so plan for it.",
    say: "Step one, parameters versus hyperparameters. Parameters, like the weights, are learned by the model from the data. Hyperparameters are knobs the team sets before training starts. The learning rate, the strength of regularization, the depth of each tree, or k in nearest neighbours. Think of baking. You set the oven temperature and the timer. How the cake rises is worked out inside the oven.",
    draw: drawKnobs },
  { stage: "Grid", title: "2 · Grid search", q: "What's the simplest way to search?",
    points: ["Pick a few values for each knob and try <b>every combination</b>.", "4 learning rates × 4 depths = 16 runs. Best here: 84%.", "It explodes fast: 5 knobs × 5 values = 3,125 runs.", "The true best may sit between grid points."],
    pm: "Grid search is easy to explain and fine for one or two knobs. Beyond that, it burns compute fast.",
    say: "Step two, grid search. We pick four learning rates and four tree depths, and train a model for every combination. That's sixteen runs. Each square shows a validation score, and the best is eighty four percent. It's simple, but it explodes. Five knobs with five values each is over three thousand runs. And the true best value might sit between two grid points, where nobody looked.",
    draw: drawGrid },
  { stage: "Smart search", title: "3 · Random and smart search", q: "Can we find good settings with fewer runs?",
    points: ["Here the learning rate matters a lot; tree depth barely matters.", "<b>Grid</b> tries only 3 learning rates, and misses the peak.", "<b>Random</b> tries 9 different learning rates, and gets closer.", "<b>Bayesian</b> learns from each run and homes in on the peak. Try each above."],
    pm: "Ask which search method the team uses. Random or Bayesian search usually reaches the same quality with far fewer runs, which saves money.",
    say: "Step three, random and smart search. In this example, the learning rate matters a lot, and tree depth barely matters. With nine runs, grid search only tries three different learning rates, and none hits the peak band. Now pick random. It tries nine different learning rates, and one lands closer. Now pick Bayesian. The first runs explore, then each new run goes where results look best, and it homes in on the peak.",
    draw: drawSearch },
  { stage: "Rules", title: "4 · Tuning the right way", q: "How do we keep tuning honest and affordable?",
    points: ["Judge on validation or cross-validation, never on the test set.", "Start from sensible defaults.", "Set a budget and a stopping rule first.", "Record every run. Expect most gains to come early."],
    pm: "Agree the tuning budget up front. A point or two from tuning is nice, but better data or features often gain far more.",
    say: "Step four, tuning the right way. Judge every setting on the validation set, never on the test set. Start from sensible defaults. Agree a budget before you begin, like fifty runs, or stop after ten runs with no improvement. And record every run, so results can be repeated. Notice the curve. Most of the gain comes in the first few runs, and after that, returns shrink fast.",
    draw: drawRules },
];
return { STEPS, picker: { label: "Search method:", step: 2, items: () => METHODS.map(m => ({ label: m.label, color: m.c })), get: () => mi, set: i => { mi = i; } } };
})();
VMETA[16] = {"title": "Turning the Knobs", "sub": "Tell parameters from hyperparameters, then compare grid, random and Bayesian search for the interview coach's settings on the same budget of training runs."};
