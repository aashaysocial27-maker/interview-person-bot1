VISUALS[6] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.3"/>`;

/* training points: x = how specific (0-10), y = coach score (0-10); illustrative */
const PTS = [[0.5, 2.4], [1.2, 1.6], [1.8, 3.4], [2.5, 3.0], [3.1, 4.6], [3.8, 3.9], [4.4, 5.6], [5.0, 5.1], [5.7, 6.6], [6.3, 6.0], [6.9, 7.4], [7.6, 6.9], [8.2, 8.0], [8.8, 7.5], [9.4, 8.6]];
const NEWP = [[2.1, 2.6], [4.8, 5.9], [7.2, 6.6], [9.0, 8.4]];
const MODELS = [
  { label: "Too simple", c: "var(--t2)", f: x => 5.2, train: 58, val: 56, verdict: "Underfitting", note: "Misses the trend everywhere." },
  { label: "Just right", c: "var(--accent)", f: x => 1.8 + 0.72 * x, train: 86, val: 83, verdict: "Generalises well", note: "Follows the trend, ignores noise." },
  { label: "Too complex", c: "var(--t3)", f: null, train: 99, val: 64, verdict: "Overfitting", note: "Bends to hit every training dot." },
];
let m = 2;
const X = v => 50 + v * 30, Y = v => 290 - v * 26;
function smoothPath(pts) {
  let d = `M${X(pts[0][0])} ${Y(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6 * 1.6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6 * 1.6];
    d += ` C${X(c1[0])} ${Y(c1[1])} ${X(c2[0])} ${Y(c2[1])} ${X(p2[0])} ${Y(p2[1])}`;
  }
  return d;
}
function drawDial() {
  const md = MODELS[m];
  let s = svg(340);
  for (let v = 0; v <= 10; v += 2) {
    s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(10)}" style="stroke:var(--line)"/><line x1="${X(0)}" y1="${Y(v)}" x2="${X(10)}" y2="${Y(v)}" style="stroke:var(--line)"/>`;
    s += `<text x="${X(v)}" y="${Y(0) + 15}" text-anchor="middle" class="mono muted" font-size="10">${v}</text><text x="${X(0) - 7}" y="${Y(v) + 4}" text-anchor="end" class="mono muted" font-size="10">${v}</text>`;
  }
  s += `<text x="${X(5)}" y="${Y(0) + 32}" text-anchor="middle" font-size="12" class="muted">How specific the answer is →</text>`;
  s += `<text x="16" y="${Y(5)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 16 ${Y(5)})">Coach score →</text>`;
  if (md.f) s += `<line x1="${X(0)}" y1="${Y(md.f(0))}" x2="${X(10)}" y2="${Y(md.f(10))}" style="stroke:${md.c}" stroke-width="2.5"/>`;
  else s += `<path d="${smoothPath([[0, 2.6], ...PTS, [10, 9.6]])}" fill="none" style="stroke:${md.c}" stroke-width="2.5"/>`;
  PTS.forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" style="fill:var(--ink)" fill-opacity=".75"/>`; });
  NEWP.forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="6" style="fill:none;stroke:${G}" stroke-width="2.2"/>`; });
  const bx = 400;
  s += `<text x="${bx}" y="40" font-size="12" class="muted">● training answers   <tspan style="fill:${G}" font-weight="700">○</tspan> new answers</text>`;
  s += rect(bx, 56, 225, 56, md.c, .12) + `<text x="${bx + 14}" y="80" font-size="15" font-weight="700" style="fill:${md.c}">${md.verdict}</text><text x="${bx + 14}" y="100" font-size="11.5">${md.note}</text>`;
  [["Training score", md.train, "var(--ink)"], ["Validation score", md.val, md.c]].forEach(([t, v, c], i) => {
    const y = 140 + i * 56;
    s += `<text x="${bx}" y="${y}" font-size="12">${t}</text><rect x="${bx}" y="${y + 8}" width="225" height="20" rx="4" style="fill:var(--line)"/><rect x="${bx}" y="${y + 8}" width="${v / 100 * 225}" height="20" rx="4" style="fill:${c}" fill-opacity=".7"/><text x="${bx + 225}" y="${y}" text-anchor="end" class="mono" font-size="13" font-weight="700">${v}%</text>`;
  });
  const gap = md.train - md.val;
  s += `<text x="${bx}" y="278" font-size="12.5" ${gap > 15 ? `font-weight="700" style="fill:${W}"` : 'class="muted"'}>Gap: ${gap} points${gap > 15 ? " · warning sign" : ""}</text>`;
  s += `<text x="${bx}" y="300" font-size="11" class="muted">Pick a model above. Data and scores</text><text x="${bx}" y="315" font-size="11" class="muted">are illustrative.</text>`;
  return s + `</svg>`;
}

function drawCurves() {
  let s = svg(330);
  const X0 = 70, Y0 = 270, W0 = 500, H0 = 220;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + W0}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H0}" style="stroke:var(--ink)"/>`;
  s += `<text x="${X0 + W0 / 2}" y="${Y0 + 34}" text-anchor="middle" font-size="12" class="muted">Model complexity →</text>`;
  s += `<text x="34" y="${Y0 - H0 / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 34 ${Y0 - H0 / 2})">Error (lower is better) →</text>`;
  const tr = t => 0.85 * Math.exp(-3 * t) + 0.04, va = t => 0.62 * Math.exp(-3.2 * t) + 0.18 + 0.55 * t * t;
  const path = f => Array.from({ length: 51 }, (_, i) => { const t = i / 50; return `${i ? "L" : "M"}${X0 + t * W0} ${Y0 - f(t) * H0 / 1.0}`; }).join(" ");
  s += `<rect x="${X0 + .32 * W0}" y="${Y0 - H0}" width="${.2 * W0}" height="${H0}" style="fill:${A}" fill-opacity=".08"/>`;
  s += `<text x="${X0 + .42 * W0}" y="${Y0 - H0 + 18}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">sweet spot</text>`;
  s += `<path d="${path(tr)}" fill="none" style="stroke:var(--ink)" stroke-width="2.2"/><path d="${path(va)}" fill="none" style="stroke:${W}" stroke-width="2.2"/>`;
  s += `<text x="${X0 + W0 - 4}" y="${Y0 - tr(1) * H0 - 8}" text-anchor="end" font-size="12" font-weight="600">training error</text>`;
  s += `<text x="${X0 + W0 - 4}" y="${Y0 - va(1) * H0 + 18}" text-anchor="end" font-size="12" font-weight="600" style="fill:${W}">validation error</text>`;
  s += `<text x="${X0 + 10}" y="${Y0 + 16}" font-size="11.5" style="fill:${B}">← underfitting</text><text x="${X0 + W0 - 4}" y="${Y0 + 16}" text-anchor="end" font-size="11.5" style="fill:${W}">overfitting →</text>`;
  s += `<line x1="${X0 + .85 * W0}" y1="${Y0 - va(.85) * H0}" x2="${X0 + .85 * W0}" y2="${Y0 - tr(.85) * H0}" style="stroke:${W}" stroke-dasharray="4 3"/><text x="${X0 + .85 * W0 - 6}" y="${Y0 - (va(.85) + tr(.85)) / 2 * H0}" text-anchor="end" font-size="11.5" style="fill:${W}">the gap</text>`;
  return s + `</svg>`;
}

function drawTarget() {
  let s = svg(310);
  const cells = [["Low bias · low variance", "the goal", 0, 0, A], ["Low bias · high variance", "overfitting", 0, 1, W], ["High bias · low variance", "underfitting", 1, 0, B], ["High bias · high variance", "worst of both", 1, 1, P]];
  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(11);
  cells.forEach(([t, sub, bias, vari, c], i) => {
    const cx = 90 + (i % 2) * 320, cy = 80 + Math.floor(i / 2) * 150;
    [52, 36, 20].forEach((r, k) => { s += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${k === 2 ? A : "var(--surface)"};stroke:var(--line)" fill-opacity="${k === 2 ? .2 : 1}"/>`; });
    const ox = bias ? 26 : 0, oy = bias ? -20 : 0, spread = vari ? 34 : 9;
    for (let k = 0; k < 8; k++) s += `<circle cx="${cx + ox + (rnd() - .5) * spread * 2}" cy="${cy + oy + (rnd() - .5) * spread * 2}" r="3.5" style="fill:${c}"/>`;
    s += `<text x="${cx + 70}" y="${cy - 6}" font-size="13" font-weight="700" style="fill:${c}">${sub}</text><text x="${cx + 70}" y="${cy + 14}" font-size="12" class="muted">${t}</text>`;
  });
  s += `<text x="20" y="300" font-size="12" class="muted">Each dot is the same model retrained on a slightly different sample. The bullseye is the right answer.</text>`;
  return s + `</svg>`;
}

function drawFix() {
  let s = svg(310);
  const col = (x, head, sym, fixes, c) => {
    let o = rect(x, 16, 295, 280, c, .06) + `<text x="${x + 16}" y="44" font-size="15" font-weight="700" style="fill:${c}">${head}</text><text x="${x + 16}" y="66" font-size="12" class="muted">${sym}</text>`;
    fixes.forEach((f, i) => { o += `<text x="${x + 16}" y="${102 + i * 34}" font-size="13"><tspan font-weight="700" style="fill:${c}">→ </tspan>${f}</text>`; });
    return o;
  };
  s += col(15, "Overfitting", "Training high, validation much lower", ["Get more good data", "Use a simpler model", "Remove noisy features", "Regularization (concept 15)", "Stop training earlier", "Augment the data"], W);
  s += col(330, "Underfitting", "Training and validation both low", ["Add better features", "Use a more capable model", "Train for longer", "Reduce regularization"], B);
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Complexity dial", title: "1 · Too simple, just right, too complex", q: "What does memorising look like?",
    points: ["Dots are training answers. Orange rings are new answers the model never saw.", "<b>Too simple</b>: a flat line. It misses the trend everywhere.", "<b>Just right</b>: follows the trend, ignores the noise.", "<b>Too complex</b>: bends through every training dot, and misses the new ones."],
    pm: "A 99% training score means nothing on its own. Look at the validation score: that is closer to what users will see.",
    say: "Step one, the complexity dial. The dots are training answers, and the orange rings are new answers the model has never seen. Start with too complex. The curve bends to pass through every training dot. Training score, ninety nine percent. But look at the new answers. It misses them, and validation drops to sixty four. Now pick too simple. A flat line that misses everything. Then just right. It follows the trend and ignores the noise.",
    draw: drawDial },
  { stage: "The gap", title: "2 · Watching the gap", q: "How do we see overfitting in numbers?",
    points: ["As complexity grows, <b>training error</b> keeps falling.", "<b>Validation error</b> falls, then rises again.", "The <b>sweet spot</b> is where validation error is lowest.", "A widening gap between the two lines means overfitting."],
    pm: "Ask the team for both curves. If they only show the training line going down, you can't tell learning from memorising.",
    say: "Step two, watching the gap. As we make the model more complex, training error keeps going down. The model fits its own examples better and better. But validation error falls, and then starts to rise again. That turn is where memorising begins. The sweet spot is the lowest point of the validation line. And the growing gap between the two lines is the classic sign of overfitting.",
    draw: drawCurves },
  { stage: "Bias & variance", title: "3 · Bias and variance", q: "What are the two kinds of error?",
    points: ["<b>Bias</b>: consistently off target, because the model is too simple.", "<b>Variance</b>: scattered, because the model reacts too much to which examples it saw.", "Underfitting is high bias. Overfitting is high variance.", "The goal is low bias and low variance."],
    pm: "If a model's results swing a lot each time it is retrained, that's high variance, and users will notice inconsistent behaviour between releases.",
    say: "Step three, bias and variance. Imagine retraining the same model many times on slightly different samples, and each dot is one result. High bias means the dots are consistently off target, because the model is too simple. That's underfitting. High variance means the dots are scattered, because the model reacts too much to the examples it saw. That's overfitting. We want the top left target, low bias and low variance.",
    draw: drawTarget },
  { stage: "Fixes", title: "4 · How to fix it", q: "What do we do about it?",
    points: ["Overfitting: more data, simpler model, fewer noisy features, regularization, stop earlier.", "Underfitting: better features, a more capable model, train longer.", "Diagnose first, by comparing training and validation scores."],
    pm: "More good data is often the most reliable fix for overfitting, and it's a lever a PM can pull through product design, such as asking users for feedback.",
    say: "Step four, how to fix it. First, diagnose, by comparing training and validation scores. If the model is overfitting, get more good data, use a simpler model, remove noisy features, or use regularization and early stopping. If it is underfitting, add better features or use a more capable model. For a PM, collecting more good data is often the strongest lever of all.",
    draw: drawFix },
];
return { STEPS, picker: { label: "Pick a model:", step: 0, items: () => MODELS.map(x => ({ label: x.label, color: x.c })), get: () => m, set: i => { m = i; } } };
})();
VMETA[6] = {"title": "Memorising vs Learning", "sub": "Turn the complexity dial on the interview coach, watch training and validation scores split apart, and learn the two kinds of error and how to fix each."};
