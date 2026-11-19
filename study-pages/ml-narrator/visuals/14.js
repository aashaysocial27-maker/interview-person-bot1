VISUALS[14] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

/* one weight w in [0,10]; loss f(w) = (w-6)^2 / 2.5 ; illustrative */
const f = w => (w - 6) ** 2 / 2.5, df = w => 2 * (w - 6) / 2.5;
const WX = w => 60 + w * 30, LY = l => 280 - Math.min(l, 16) * 15;
function curve() {
  let s = `<line x1="${WX(0)}" y1="${LY(0)}" x2="${WX(10)}" y2="${LY(0)}" style="stroke:var(--ink)"/><line x1="${WX(0)}" y1="${LY(0)}" x2="${WX(0)}" y2="${LY(16)}" style="stroke:var(--ink)"/>`;
  s += `<path d="${Array.from({ length: 101 }, (_, i) => { const w = i / 10; return `${i ? "L" : "M"}${WX(w)} ${LY(f(w))}`; }).join(" ")}" fill="none" style="stroke:var(--ink)" stroke-width="2"/>`;
  s += `<text x="${WX(5)}" y="${LY(0) + 22}" text-anchor="middle" font-size="12" class="muted">a weight's value →</text><text x="34" y="${LY(8)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 34 ${LY(8)})">Loss →</text>`;
  s += `<text x="${WX(6)}" y="${LY(0) - 8}" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:${A}">lowest loss</text>`;
  return s;
}
function drawSlope() {
  let s = svg(320) + curve();
  const w = 1.6, l = f(w), g = df(w), dx = 1.4;
  s += `<line x1="${WX(w - dx)}" y1="${LY(l - g * dx)}" x2="${WX(w + dx)}" y2="${LY(l + g * dx)}" style="stroke:${W}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<circle cx="${WX(w)}" cy="${LY(l)}" r="9" style="fill:${B}"/>`;
  s += arrow(WX(w) + 12, LY(l) + 4, WX(w + 1.1), LY(f(w + 1.1)) - 2, A, 2.5);
  s += `<text x="${WX(w) - 6}" y="${LY(l) - 16}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${B}">you are here</text>`;
  s += `<text x="${WX(w - 1)}" y="${LY(l - g * -1) - 6}" font-size="11.5" font-weight="600" style="fill:${W}">slope (gradient)</text>`;
  const bx = 400;
  s += rect(bx, 30, 225, 196, "var(--line)") + lbl(bx + 14, 52, "THE LOOP");
  ["1. Measure the slope here.", "2. Step the opposite way:", "    downhill.", "3. Measure again.", "4. Repeat until the ground", "    is flat."].forEach((t, i) => { s += `<text x="${bx + 14}" y="${78 + i * 22}" font-size="12.5">${t}</text>`; });
  s += `<text x="${bx}" y="252" font-size="12" class="muted">Real models have millions of weights,</text><text x="${bx}" y="268" font-size="12" class="muted">so the “hill” has millions of directions.</text><text x="${bx}" y="296" font-size="11" class="muted">Illustrative.</text>`;
  return s + `</svg>`;
}

const RATES = [{ label: "Too small", lr: 0.12, c: "var(--t2)", note: "Crawls. Needs many more steps." }, { label: "Just right", lr: 0.75, c: "var(--accent)", note: "Gets down fast and settles." }, { label: "Too big", lr: 2.6, c: "var(--t3)", note: "Overshoots and bounces away." }];
let ri = 1;
function drawRate() {
  const r = RATES[ri];
  let s = svg(320) + curve();
  let w = 0.8; const pts = [w];
  for (let i = 0; i < 7; i++) { w = w - r.lr * df(w); pts.push(Math.max(-0.4, Math.min(10.4, w))); }
  pts.forEach((v, i) => {
    if (i) s += `<line x1="${WX(pts[i - 1])}" y1="${LY(f(pts[i - 1]))}" x2="${WX(v)}" y2="${LY(f(v))}" style="stroke:${r.c}" stroke-width="1.8" marker-end="url(#ah)"/>`;
  });
  pts.forEach((v, i) => { s += `<circle cx="${WX(v)}" cy="${LY(f(v))}" r="${i ? 5.5 : 8}" style="fill:${r.c}" fill-opacity="${i ? .85 : 1}"/>`; });
  const bx = 400, end = f(pts[pts.length - 1]);
  s += lbl(bx, 40, "LEARNING RATE = STEP SIZE");
  s += rect(bx, 54, 225, 80, r.c, .12) + `<text x="${bx + 14}" y="80" font-size="15" font-weight="700" style="fill:${r.c}">${r.label} · ${r.lr}</text><text x="${bx + 14}" y="102" font-size="12.5">${r.note}</text><text x="${bx + 14}" y="122" class="mono" font-size="12">loss after 7 steps: ${end > 15 ? "16+" : end.toFixed(2)}</text>`;
  s += `<text x="${bx}" y="168" font-size="12.5">Same start, same 7 steps.</text><text x="${bx}" y="188" font-size="12.5">Only the step size changes.</text>`;
  s += `<text x="${bx}" y="222" font-size="12.5">Wild, jumpy loss curves in real</text><text x="${bx}" y="240" font-size="12.5">training often mean the learning</text><text x="${bx}" y="258" font-size="12.5">rate is too high.</text>`;
  s += `<text x="${bx}" y="296" font-size="11" class="muted">Pick a learning rate above. Illustrative.</text>`;
  return s + `</svg>`;
}

function drawBatch() {
  let s = svg(330);
  const cx = 180, cy = 165;
  [130, 100, 72, 46, 22].forEach((r, i) => { s += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.25}" ry="${r * .8}" style="fill:${A};stroke:${A}" fill-opacity="${.03 + i * .03}" stroke-opacity=".5"/>`; });
  s += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-weight="700" style="fill:${A}">lowest</text>`;
  const full = [[40, 70], [80, 95], [115, 120], [145, 140], [165, 155]];
  s += `<path d="M${full.map(p => p.join(" ")).join(" L")}" fill="none" style="stroke:${B}" stroke-width="2.5"/>`;
  full.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="5" style="fill:${B}"/>`; });
  const mini = [[40, 260], [62, 236], [58, 220], [86, 214], [92, 196], [118, 200], [126, 182], [148, 184], [152, 170], [170, 172]];
  s += `<path d="M${mini.map(p => p.join(" ")).join(" L")}" fill="none" style="stroke:${G}" stroke-width="2"/>`;
  mini.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="3.5" style="fill:${G}"/>`; });
  s += `<text x="30" y="58" font-size="12" font-weight="700" style="fill:${B}">all 1,000 answers per step</text><text x="30" y="290" font-size="12" font-weight="700" style="fill:${G}">32 answers per step</text>`;
  s += `<text x="30" y="306" font-size="11" class="muted">wobbly, but each step is ~30× cheaper</text>`;
  const bx = 380;
  s += lbl(bx, 40, "THE VOCABULARY");
  [["Batch", "the answers used for one step, e.g. 32"], ["Step", "one update of the weights"], ["Epoch", "one full pass over all 1,000 answers"]].forEach(([t, d], i) => { s += rect(bx, 52 + i * 58, 245, 48, "var(--line)") + `<text x="${bx + 12}" y="${72 + i * 58}" font-size="13" font-weight="700">${t}</text><text x="${bx + 12}" y="${90 + i * 58}" font-size="11.5">${d}</text>`; });
  s += rect(bx, 232, 245, 60, A, .08) + `<text x="${bx + 12}" y="256" font-size="12.5">1,000 answers ÷ 32 per batch</text><text x="${bx + 12}" y="278" class="mono" font-size="12.5" font-weight="700" style="fill:${A}">≈ 32 steps per epoch</text>`;
  return s + `</svg>`;
}

function drawMomentum() {
  let s = svg(350);
  const G = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
  const h = x => 120 + 40 * G(x, 230, 28) + 130 * G(x, 470, 80) + 0.04 * (x - 40);
  s += lbl(20, 22, "A BUMPY LOSS LANDSCAPE · LOWER IS BETTER");
  s += `<path d="M${Array.from({ length: 59 }, (_, i) => { const x = 40 + i * 10; return `${x} ${h(x)}`; }).join(" L")}" fill="none" style="stroke:var(--ink)" stroke-width="2"/>`;
  s += `<circle cx="230" cy="${h(230) - 10}" r="10" style="fill:${B}"/><text x="230" y="${h(230) + 24}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${B}">plain: stuck in a small dip</text>`;
  s += `<path d="M70 ${h(70) - 26} Q 240 ${h(230) - 90} 455 ${h(455) - 22}" fill="none" style="stroke:${A}" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ah)"/>`;
  s += `<circle cx="470" cy="${h(470) - 10}" r="10" style="fill:${A}"/><text x="592" y="224" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">momentum</text><text x="592" y="240" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">rolls through</text>`;
  s += rect(20, 280, 295, 60, A, .08) + `<text x="34" y="302" font-size="13" font-weight="700" style="fill:${A}">Momentum</text><text x="34" y="322" font-size="12">Keeps speed, like a rolling ball.</text>`;
  s += rect(330, 280, 295, 60, P, .08) + `<text x="344" y="302" font-size="13" font-weight="700" style="fill:${P}">Adam</text><text x="344" y="322" font-size="12">Adapts the step size for every weight.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Slope", title: "1 · The slope tells the way", q: "How does a model know which way to change its weights?",
    points: ["Each weight value gives a different loss. Together they form a landscape.", "The <b>gradient</b> is the slope where the model stands.", "Step the opposite way, downhill, then measure again.", "Stop when the ground is flat: the lowest loss."],
    pm: "This loop of measure, step, repeat is what you're paying for when training takes hours of compute.",
    say: "Step one, the slope tells the way. Imagine standing on a foggy hillside. You can't see the valley, but you can feel the slope under your feet. The model does the same. The gradient tells it which way the loss goes up, so it steps the other way, downhill. Then it measures the slope again, and repeats, until the ground is flat. That's the lowest loss.",
    draw: drawSlope },
  { stage: "Learning rate", title: "2 · The learning rate", q: "How big should each step be?",
    points: ["The <b>learning rate</b> sets the step size.", "Too small: crawls toward the bottom.", "Too big: overshoots, bounces and can fly off.", "Pick a learning rate above to compare 7 steps."],
    pm: "If a team reports unstable or exploding training, the learning rate is the first suspect. It's one of the most important settings in any training run.",
    say: "Step two, the learning rate. This is the size of each step. With just right, the model gets close to the bottom in a few steps and settles. Now pick too small. Same seven steps, but it's still crawling down the slope. Now pick too big. Each step overshoots the valley, and the model bounces further and further away. The loss actually gets worse.",
    draw: drawRate },
  { stage: "Batches", title: "3 · Batches and epochs", q: "Does every step need all the data?",
    points: ["Using all 1,000 answers per step is accurate but slow.", "A <b>mini-batch</b> of 32 answers gives a wobbly but cheap estimate.", "Many cheap steps beat a few expensive ones.", "An <b>epoch</b> is one full pass through all the training data."],
    pm: "Batch size and number of epochs drive training cost and time. Teams tune them against the compute budget you agree.",
    say: "Step three, batches and epochs. Measuring the slope over all one thousand answers for every step is accurate, but slow. Instead, the model grabs a random batch of thirty two answers, estimates the slope, and steps. The path wobbles, but each step is about thirty times cheaper. One full pass through all the training answers is called an epoch, about thirty two steps here.",
    draw: drawBatch },
  { stage: "Optimizers", title: "4 · Smarter optimizers", q: "How do models avoid getting stuck?",
    points: ["Plain gradient descent can stall in small dips or flat stretches.", "<b>Momentum</b> keeps speed, like a rolling ball.", "<b>Adam</b> adapts the step size for each weight.", "Adam is the default for most neural networks, including LLMs."],
    pm: "You don't need the maths. Just know that the optimizer choice affects how fast and how reliably training finishes, and therefore cost.",
    say: "Step four, smarter optimizers. Plain gradient descent can get stuck in a small dip, like the blue ball here. Momentum helps. Like a ball rolling downhill, it keeps its speed and rolls through small bumps. Adam goes further, adapting the step size for every weight on its own. Adam is the default for training most neural networks today, including large language models.",
    draw: drawMomentum },
];
return { STEPS, picker: { label: "Learning rate:", step: 1, items: () => RATES.map(r => ({ label: r.label, color: r.c })), get: () => ri, set: i => { ri = i; } } };
})();
VMETA[14] = {"title": "Walking Downhill in Fog", "sub": "See how a model uses the slope of the loss to improve, what happens when its steps are too small or too big, and how batches and smarter optimizers speed it up."};
