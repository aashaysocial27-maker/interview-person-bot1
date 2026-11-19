VISUALS[15] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

const FEATS = [["specific details", 2.4], ["states a result", 1.9], ["clear structure", 1.2], ["filler words", -0.9], ["mentions “Kubernetes”", 2.8], ["answered on a Tuesday", -1.6]];
const LAMBDAS = [{ label: "No penalty", k: 0, c: "var(--t3)", tr: 99, va: 70, v: "Overfitting: noisy features get big weights." }, { label: "Medium", k: 1, c: "var(--accent)", tr: 90, va: 85, v: "Noise shrinks to almost nothing. Best validation." }, { label: "Very strong", k: 2, c: "var(--t2)", tr: 71, va: 69, v: "Everything shrinks. Now it underfits." }];
const shrink = (w, k, i) => k === 0 ? w : k === 1 ? (i >= 4 ? w * 0.08 : w * 0.75) : w * 0.15;
let li = 0;
function drawPenalty() {
  const L = LAMBDAS[li];
  let s = svg(340);
  s += lbl(20, 22, "LEARNED WEIGHTS · LOSS = MISTAKES + λ × SIZE OF WEIGHTS");
  const zx = 330;
  FEATS.forEach(([t, w], i) => {
    const y = 36 + i * 34, v = shrink(w, L.k, i), wd = Math.abs(v) * 55, noisy = i >= 4;
    s += `<text x="${zx - 160}" y="${y + 18}" text-anchor="end" font-size="12.5" ${noisy ? `style="fill:${W}"` : ""}>${t}</text>`;
    s += `<rect x="${v > 0 ? zx : zx - wd}" y="${y + 5}" width="${Math.max(wd, 1.5)}" height="18" rx="3" style="fill:${noisy ? W : A}" fill-opacity=".6"/>`;
    s += `<text x="${v >= 0 ? zx + wd + 6 : zx - wd - 6}" y="${y + 18}" text-anchor="${v >= 0 ? "start" : "end"}" class="mono" font-size="11.5">${v > 0 ? "+" : ""}${v.toFixed(2)}</text>`;
  });
  s += `<line x1="${zx}" y1="34" x2="${zx}" y2="240" style="stroke:var(--ink)"/>`;
  s += `<text x="20" y="262" font-size="11.5" style="fill:${W}">red = coincidences in the training data</text>`;
  s += rect(20, 274, 600, 56, L.c, .12) + `<text x="34" y="296" font-size="13" font-weight="700" style="fill:${L.c}">${L.label}: training ${L.tr}% · validation ${L.va}%</text><text x="34" y="316" font-size="12.5">${L.v}</text>`;
  return s + `</svg>`;
}

const r = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(13);
const OFF = [[0, 0, 1, 0, 1], [1, 0, 0, 1, 0], [0, 1, 0, 0, 1]];
function drawDropout() {
  let s = svg(320);
  const net = (ox, off, title) => {
    const layers = [3, 5, 5, 1], xs = [0, 80, 160, 240].map(x => ox + x);
    let o = `<text x="${ox + 120}" y="30" text-anchor="middle" font-size="13" font-weight="700">${title}</text>`;
    const pos = layers.map((n, l) => Array.from({ length: n }, (_, i) => [xs[l], 70 + (i - (n - 1) / 2) * 38 + 80]));
    for (let l = 0; l < 3; l++) pos[l].forEach((a, i) => pos[l + 1].forEach((b, j) => {
      const dead = (l === 1 && off && off[0][i]) || (l === 2 && off && off[1][i]) || (l + 1 === 1 && off && off[0][j]) || (l + 1 === 2 && off && off[1][j]);
      o += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:var(--line)" stroke-opacity="${dead ? .25 : 1}" stroke-width="1"/>`;
    }));
    pos.forEach((col, l) => col.forEach(([x, y], i) => {
      const dead = off && ((l === 1 && off[0][i]) || (l === 2 && off[1][i]));
      o += `<circle cx="${x}" cy="${y}" r="11" style="fill:${dead ? "var(--bg)" : l === 3 ? A : B};stroke:${dead ? "var(--muted)" : l === 3 ? A : B}" fill-opacity="${dead ? 1 : .3}" ${dead ? 'stroke-dasharray="3 2"' : ""}/>`;
      if (dead) o += `<path d="M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}" style="stroke:${W}" stroke-width="2"/>`;
    }));
    return o;
  };
  s += net(30, [OFF[0], OFF[1]], "Training step 1");
  s += net(350, [OFF[1], OFF[2]], "Training step 2");
  s += `<text x="20" y="300" font-size="12.5">Each step switches off a different random 40% of neurons. No neuron can be relied on alone,</text><text x="20" y="316" font-size="12.5">so the network learns several routes to the answer. At prediction time, all are switched on.</text>`;
  return s + `</svg>`;
}

function drawEarly() {
  let s = svg(330);
  const X0 = 70, Y0 = 250, W0 = 520, H0 = 200;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + W0}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H0}" style="stroke:var(--ink)"/>`;
  s += `<text x="${X0 + W0 / 2}" y="${Y0 + 26}" text-anchor="middle" font-size="12" class="muted">Training time (epochs) →</text><text x="34" y="${Y0 - H0 / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 34 ${Y0 - H0 / 2})">Loss →</text>`;
  const tr = t => .85 * Math.exp(-3.4 * t) + .05, va = t => .8 * Math.exp(-3.6 * t) + .2 + .42 * t * t;
  const path = fn => Array.from({ length: 61 }, (_, i) => { const t = i / 60; return `${i ? "L" : "M"}${X0 + t * W0} ${Y0 - fn(t) * H0}`; }).join(" ");
  s += `<path d="${path(tr)}" fill="none" style="stroke:var(--ink)" stroke-width="2.2"/><path d="${path(va)}" fill="none" style="stroke:${W}" stroke-width="2.2"/>`;
  let tb = 0, vb = 9; for (let i = 0; i <= 100; i++) { const t = i / 100; if (va(t) < vb) { vb = va(t); tb = t; } }
  const bx = X0 + tb * W0, by = Y0 - vb * H0;
  s += `<rect x="${bx}" y="${Y0 - H0}" width="${X0 + W0 - bx}" height="${H0}" style="fill:${W}" fill-opacity=".06"/>`;
  s += `<line x1="${bx}" y1="${Y0 - H0}" x2="${bx}" y2="${Y0}" style="stroke:${A}" stroke-width="2" stroke-dasharray="6 4"/><circle cx="${bx}" cy="${by}" r="7" style="fill:${A}"/>`;
  s += `<text x="${bx - 8}" y="${Y0 - H0 + 16}" text-anchor="end" font-size="12.5" font-weight="700" style="fill:${A}">stop here: keep this version</text>`;
  s += `<text x="${bx + 12}" y="${Y0 - H0 + 34}" font-size="12" style="fill:${W}">extra training only memorises</text>`;
  s += `<text x="${X0 + W0 - 4}" y="${Y0 - va(1) * H0 - 8}" text-anchor="end" font-size="12" font-weight="600" style="fill:${W}">validation loss</text><text x="${X0 + W0 - 4}" y="${Y0 - tr(1) * H0 - 8}" text-anchor="end" font-size="12" font-weight="600">training loss</text>`;
  s += `<text x="20" y="300" font-size="12.5">Save a copy (a checkpoint) after each epoch, then keep the one with the lowest validation loss.</text>`;
  s += `<text x="20" y="320" font-size="11" class="muted">Curves are illustrative.</text>`;
  return s + `</svg>`;
}

function drawAugment() {
  let s = svg(340);
  s += lbl(20, 22, "ONE STRONG ANSWER → NEW TRAINING EXAMPLES");
  s += rect(20, 32, 600, 40, A, .1) + `<text x="34" y="57" font-size="12.5">“I cut onboarding time 30% by rewriting the checklist with new hires.”</text><text x="610" y="57" text-anchor="end" class="mono" font-size="12" font-weight="700" style="fill:${A}">strong</text>`;
  s += arrow(320, 76, 320, 96);
  const v = [["“By rewriting the checklist alongside new hires, I reduced onboarding time by 30%.”", "strong", 1], ["“I worked with new hires on the checklist, and onboarding got 30% faster.”", "strong", 1], ["“I rewrote the onboarding checklist with new hires.”", "strong?", 0]];
  v.forEach(([t, l, ok], i) => {
    const y = 102 + i * 50, c = ok ? A : W;
    s += rect(20, y, 600, 40, c, ok ? .05 : .1) + `<text x="34" y="${y + 25}" font-size="12">${t}</text><text x="610" y="${y + 25}" text-anchor="end" class="mono" font-size="12" font-weight="700" style="fill:${c}">${ok ? "✓ " : "✗ "}${l}</text>`;
  });
  s += rect(20, 262, 600, 66, W, .07) + `<text x="34" y="286" font-size="12.5" font-weight="700" style="fill:${W}">The last one dropped the result (30%).</text><text x="34" y="308" font-size="12.5">It is no longer a strong answer, so its label is wrong. Every variation must keep its label true.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Penalty", title: "1 · Penalties on big weights", q: "How do we stop a model leaning on coincidences?",
    points: ["Add a penalty to the loss for large weights: <b>loss = mistakes + λ × weight size</b>.", "<b>L2</b> shrinks every weight toward zero. <b>L1</b> pushes useless ones to exactly zero.", "Red rows are coincidences, like “answered on a Tuesday”.", "Pick a strength above: none, medium, very strong."],
    pm: "λ is a dial between memorising and generalising. The right setting is the one with the best validation score, not the best training score.",
    say: "Step one, penalties on big weights. Without a penalty, the model gives big weights to coincidences, like mentioning Kubernetes, or answering on a Tuesday. Training looks great at ninety nine percent, but validation is only seventy. Now pick medium. The penalty shrinks the noisy weights almost to zero, and validation rises to eighty five. Now pick very strong. Everything shrinks, even the useful weights, and the model underfits.",
    draw: drawPenalty },
  { stage: "Dropout", title: "2 · Dropout", q: "How do neural networks avoid relying on a few neurons?",
    points: ["During training, randomly switch off a share of neurons at each step.", "A different random set each time, often 20 to 50%.", "The network learns several routes to the answer.", "At prediction time, every neuron is switched back on."],
    pm: "Dropout is like cross-training a team so the work never depends on one person. It's a standard setting the team tunes, not something you need to manage.",
    say: "Step two, dropout. In a neural network, dropout randomly switches off some neurons at every training step. In step one, these neurons are off. In step two, a different set is off. Because no neuron can be relied on alone, the network learns several routes to the right answer. It's like a team where anyone might be absent, so everyone is cross trained. At prediction time, all the neurons are back on.",
    draw: drawDropout },
  { stage: "Early stop", title: "3 · Early stopping", q: "When should training stop?",
    points: ["Training loss keeps falling the longer you train.", "Validation loss falls, then starts to rise: memorising has begun.", "<b>Early stopping</b> keeps the version from the lowest validation point.", "Teams save a checkpoint each epoch and keep the best one."],
    pm: "Longer training isn't always better. Early stopping also saves compute, because you stop paying once the model stops improving.",
    say: "Step three, early stopping. The longer we train, the lower the training loss goes. But the validation loss falls, and then starts to rise. That's the moment memorising begins. Early stopping watches the validation loss, and keeps the version of the model from its lowest point. Anything after that just memorises the training data, and costs extra compute.",
    draw: drawEarly },
  { stage: "Augment", title: "4 · More and varied data", q: "Can we make more training data from what we have?",
    points: ["More good data is the most reliable cure for overfitting.", "<b>Data augmentation</b> creates variations of existing examples.", "For the coach: paraphrase answers. For images: flips and crops.", "Each variation must keep its label true."],
    pm: "Augmentation is cheap data, but check samples by hand. A variation that changes the meaning teaches the model the wrong lesson.",
    say: "Step four, more and varied data. The most reliable cure for overfitting is more good data. Data augmentation makes new examples by varying the ones we have. Here, one strong answer becomes three paraphrases. The first two keep the result, thirty percent faster, so they're still strong. But the last one dropped the result. It isn't a strong answer any more, so its label is wrong. Every variation must keep its label true.",
    draw: drawAugment },
];
return { STEPS, picker: { label: "Penalty strength (λ):", step: 0, items: () => LAMBDAS.map(l => ({ label: l.label, color: l.c })), get: () => li, set: i => { li = i; } } };
})();
VMETA[15] = {"title": "Keeping the Model Honest", "sub": "Turn up the penalty on the interview coach's weights, switch off random neurons, stop training at the best moment, and make new examples without breaking their labels."};
