VISUALS[17] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const r0 = rng(31), RARE = new Set(); while (RARE.size < 20) RARE.add(Math.floor(r0() * 1000));
function drawTrap() {
  let s = svg(330);
  s += lbl(20, 22, "1,000 ANSWERS · 20 COPIED FROM THE INTERNET");
  for (let i = 0; i < 1000; i++) { const x = 24 + (i % 50) * 7.4, y = 36 + Math.floor(i / 50) * 9.6, rare = RARE.has(i); s += `<rect x="${x}" y="${y}" width="5.6" height="7" rx="1.2" style="fill:${rare ? W : "var(--muted)"}" fill-opacity="${rare ? 1 : .35}"/>`; }
  const bx = 410;
  s += rect(bx, 34, 215, 104, G, .1) + `<text x="${bx + 12}" y="58" font-size="13" font-weight="700" style="fill:${G}">Lazy model</text><text x="${bx + 12}" y="78" font-size="12">Always says “not copied”.</text><text x="${bx + 12}" y="106" class="mono" font-size="13">Accuracy: <tspan font-weight="700">98%</tspan></text><text x="${bx + 12}" y="126" class="mono" font-size="13">Copied caught: <tspan font-weight="700" style="fill:${W}">0 of 20</tspan></text>`;
  s += rect(bx, 150, 215, 84, W, .08) + `<text x="${bx + 12}" y="174" font-size="12.5" font-weight="700" style="fill:${W}">Accuracy hides failure</text><text x="${bx + 12}" y="194" font-size="12">Look at recall: the share of</text><text x="${bx + 12}" y="210" font-size="12">rare cases actually found.</text>`;
  s += `<text x="24" y="250" font-size="12"><tspan style="fill:${W}" font-weight="700">■</tspan> copied (20)   <tspan class="muted">■</tspan> original (980)</text>`;
  s += `<text x="24" y="282" font-size="12.5">The model sees 49 normal answers for every copied one,</text><text x="24" y="300" font-size="12.5">so ignoring the rare case barely hurts its loss.</text>`;
  return s + `</svg>`;
}

const MODES = [{ label: "Original", c: "var(--muted)", maj: 980, min: 20, note: "49 to 1. The rare class is easy to ignore." }, { label: "Oversample (SMOTE)", c: "var(--accent)", maj: 980, min: 980, note: "Synthetic copied examples fill the gap." }, { label: "Undersample", c: "var(--t2)", maj: 100, min: 20, note: "Fewer common examples. Faster, but wastes data." }];
let mi = 0;
const r1 = rng(8), REAL = Array.from({ length: 6 }, () => [430 + r1() * 170, 70 + r1() * 120]);
function drawResample() {
  const M = MODES[mi];
  let s = svg(350);
  s += lbl(20, 22, "TRAINING SET ONLY · " + M.label.toUpperCase());
  const sc = 220 / 980;
  [["original", M.maj, "var(--muted)"], ["copied", M.min, W]].forEach(([t, n, c], i) => {
    const x = 60 + i * 150, h = n * sc;
    s += `<rect x="${x}" y="${250 - h}" width="90" height="${Math.max(h, 2)}" rx="4" style="fill:${c}" fill-opacity="${i ? .8 : .45}"/><text x="${x + 45}" y="${244 - h}" text-anchor="middle" class="mono" font-size="13" font-weight="700">${n}</text><text x="${x + 45}" y="270" text-anchor="middle" font-size="12.5">${t}</text>`;
  });
  s += `<line x1="40" y1="250" x2="360" y2="250" style="stroke:var(--ink)"/>`;
  s += rect(20, 284, 600, 36, M.c, .1) + `<text x="34" y="307" font-size="12.5"><tspan font-weight="700">${M.label}:</tspan> ${M.note}</text><text x="20" y="342" font-size="11.5" class="muted">Validation and test sets stay untouched, so scores reflect the real world.</text>`;
  if (mi === 1) {
    s += lbl(410, 50, "HOW SMOTE MAKES ONE");
    const [a, b] = [REAL[0], REAL[1]];
    REAL.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="6" style="fill:${W}"/>`; });
    s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:${A}" stroke-dasharray="4 3" stroke-width="1.5"/>`;
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    s += `<circle cx="${m[0]}" cy="${m[1]}" r="6" style="fill:none;stroke:${A}" stroke-width="2.5"/>`;
    s += `<text x="410" y="222" font-size="12">● real copied answers</text><text x="410" y="240" font-size="12"><tspan style="fill:${A}" font-weight="700">○</tspan> new one, between two neighbours</text>`;
  } else if (mi === 2) {
    s += rect(410, 60, 215, 110, B, .08) + `<text x="424" y="84" font-size="12.5" font-weight="700" style="fill:${B}">Keeps 100 of 980</text><text x="424" y="104" font-size="12">Quicker to train, but throws</text><text x="424" y="120" font-size="12">away most common examples.</text><text x="424" y="148" font-size="12">Google's tip: then upweight</text><text x="424" y="164" font-size="12">the ones you kept.</text>`;
  } else {
    s += rect(410, 60, 215, 80, "var(--line)") + `<text x="424" y="86" font-size="12.5">Pick a fix above to</text><text x="424" y="106" font-size="12.5">rebalance the training set.</text>`;
  }
  return s + `</svg>`;
}

function drawWeights() {
  let s = svg(310);
  s += lbl(20, 22, "CLASS WEIGHTS: CHANGE THE LOSS, NOT THE DATA");
  const cx = 320, by = 200;
  s += `<path d="M${cx - 16} ${by + 70} L${cx} ${by} L${cx + 16} ${by + 70} Z" style="fill:var(--muted)" fill-opacity=".4"/>`;
  s += `<line x1="${cx - 220}" y1="${by - 10}" x2="${cx + 220}" y2="${by + 10}" style="stroke:var(--ink)" stroke-width="3"/>`;
  s += rect(cx - 280, by - 100, 150, 80, "var(--muted)", .12) + `<text x="${cx - 205}" y="${by - 70}" text-anchor="middle" font-size="12.5" font-weight="700">1 missed original</text><text x="${cx - 205}" y="${by - 46}" text-anchor="middle" class="mono" font-size="13">weight × 1</text>`;
  s += rect(cx + 130, by - 82, 150, 80, W, .15) + `<text x="${cx + 205}" y="${by - 52}" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:${W}">1 missed copied</text><text x="${cx + 205}" y="${by - 28}" text-anchor="middle" class="mono" font-size="13" font-weight="700" style="fill:${W}">weight × 49</text>`;
  s += `<text x="20" y="${by + 96}" font-size="12.5">Missing one copied answer now costs as much as missing 49 originals, so the model can't ignore them.</text>`;
  return s + `</svg>`;
}

function drawThreshold() {
  let s = svg(340);
  s += lbl(20, 22, "EACH ANSWER'S PROBABILITY OF BEING COPIED");
  const r = rng(44), X0 = 40, Wd = 560;
  const pos = Array.from({ length: 20 }, () => Math.min(.97, .12 + r() * .85)), neg = Array.from({ length: 70 }, () => Math.pow(r(), 2.4) * .7);
  const row = (vals, y, c) => vals.map(v => `<circle cx="${X0 + v * Wd}" cy="${y + (r() - .5) * 18}" r="4.5" style="fill:${c}" fill-opacity=".75"/>`).join("");
  s += `<text x="20" y="62" font-size="12" style="fill:${W}" font-weight="700">copied</text>` + row(pos, 82, W);
  s += `<text x="20" y="122" font-size="12" class="muted">original</text>` + row(neg, 142, "var(--muted)");
  s += `<line x1="${X0}" y1="170" x2="${X0 + Wd}" y2="170" style="stroke:var(--ink)"/>`;
  [0, .5, 1].forEach(v => { s += `<text x="${X0 + v * Wd}" y="186" text-anchor="middle" class="mono muted" font-size="10">${v}</text>`; });
  const th = (t, c, lab) => { const tp = pos.filter(v => v >= t).length, fp = neg.filter(v => v >= t).length; return { tp, fp, svg: `<line x1="${X0 + t * Wd}" y1="44" x2="${X0 + t * Wd}" y2="170" style="stroke:${c}" stroke-width="2" stroke-dasharray="6 4"/><text x="${X0 + t * Wd + 5}" y="44" font-size="11.5" font-weight="700" style="fill:${c}">${lab}</text>` }; };
  const hi = th(.5, B, "flag above 0.5"), lo = th(.2, A, "above 0.2");
  s += hi.svg + lo.svg;
  s += rect(20, 204, 295, 76, B, .08) + `<text x="34" y="228" font-size="13" font-weight="700" style="fill:${B}">Threshold 0.5</text><text x="34" y="250" font-size="12.5">Catches ${hi.tp} of 20 copied</text><text x="34" y="268" font-size="12.5">${hi.fp} false alarms</text>`;
  s += rect(330, 204, 295, 76, A, .08) + `<text x="344" y="228" font-size="13" font-weight="700" style="fill:${A}">Threshold 0.2</text><text x="344" y="250" font-size="12.5">Catches ${lo.tp} of 20 copied</text><text x="344" y="268" font-size="12.5">${lo.fp} false alarms</text>`;
  s += `<text x="20" y="306" font-size="12.5">Lower threshold: more caught, more false alarms. Pick it from what each mistake costs.</text>`;
  s += `<text x="20" y="324" font-size="11" class="muted">Probabilities are illustrative; 70 of the 980 originals shown.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "The trap", title: "1 · The accuracy trap", q: "How can 98% accuracy be useless?",
    points: ["20 of 1,000 answers are copied from the internet.", "A lazy model always says “not copied”.", "It's 98% accurate, and catches <b>zero</b> copied answers.", "With rare cases, check <b>recall</b>: how many did it actually find?"],
    pm: "Whenever a model detects something rare, like fraud, churn or defects, ignore headline accuracy. Ask how many of the rare cases it catches.",
    say: "Step one, the accuracy trap. Out of a thousand answers, only twenty are copied from the internet. They're the red squares. Now imagine a lazy model that always says, not copied. It's right nine hundred and eighty times, so its accuracy is ninety eight percent. Sounds great. But it catches zero copied answers, which was the whole point. With rare cases, accuracy hides failure.",
    draw: drawTrap },
  { stage: "Rebalance", title: "2 · Rebalancing the data", q: "Can we change the data so the rare case matters?",
    points: ["<b>Oversample</b>: add more rare examples. <b>SMOTE</b> creates new ones between real neighbours.", "<b>Undersample</b>: keep fewer common examples.", "Pick a fix above the diagram to compare.", "Only rebalance the <b>training</b> set. Test data must stay realistic."],
    pm: "If someone rebalanced the test set, the reported scores won't match real life. Ask which sets were rebalanced.",
    say: "Step two, rebalancing the data. In the original training set, there are forty nine original answers for every copied one. Pick oversample. SMOTE creates new copied examples, each one placed between two real copied answers, until the classes are even. Now pick undersample. We keep only a hundred originals instead. Either way, rebalance only the training set. The test set must stay realistic.",
    draw: drawResample },
  { stage: "Weights", title: "3 · Class weights", q: "Can we fix it without changing the data?",
    points: ["Change the <b>loss</b> instead of the data.", "Each mistake on a copied answer counts 49 times more.", "Now ignoring the rare class is expensive for the model.", "Same idea as the weighted loss in concept 13."],
    pm: "Class weights are a cheap, standard fix. Ask the team whether they used them, or rebalanced the data, when the event you care about is rare.",
    say: "Step three, class weights. Instead of changing the data, we change the loss. Missing one copied answer now costs forty nine times as much as missing an original one. So the model can't afford to ignore the rare class any more. It's the same idea as the weighted loss from concept thirteen.",
    draw: drawWeights },
  { stage: "Threshold", title: "4 · Thresholds and more data", q: "Where should we draw the line?",
    points: ["The model gives each answer a probability of being copied.", "A threshold of 0.5 misses many copied answers.", "Lowering it to 0.2 catches more, with more false alarms.", "Long term, collect more real rare examples."],
    pm: "Decide with the reviewers how many false alarms they can handle per day. That number sets the threshold more than any metric does.",
    say: "Step four, thresholds. The model gives every answer a probability of being copied. If we only flag answers above zero point five, we miss quite a few copied ones. Lower the threshold to zero point two, and we catch most of them, but we also get more false alarms. The right line depends on what each mistake costs. And in the long run, the best fix is collecting more real examples of the rare case.",
    draw: drawThreshold },
];
return { STEPS, picker: { label: "Fix:", step: 1, items: () => MODES.map(m => ({ label: m.label, color: m.c === "var(--muted)" ? "var(--ink)" : m.c })), get: () => mi, set: i => { mi = i; } } };
})();
VMETA[17] = {"title": "Finding the Needle", "sub": "Only 20 of the interview coach's 1,000 answers are copied. See why 98% accuracy can mean nothing, then rebalance the data, reweight the loss and pick a threshold."};
