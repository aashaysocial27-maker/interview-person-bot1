VISUALS[9] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

/* 5 answers, true coach scores; each tree closes 50% of the remaining gap (illustrative) */
const TRUE = [8, 3, 6.5, 9, 4.5], NAMES = ["Ans 1", "Ans 2", "Ans 3", "Ans 4", "Ans 5"], START = 5;
const STAGES = [0, 1, 2, 3, 10];
const pred = (t, k) => t + (START - t) * Math.pow(0.5, k);
let si = 1;
function drawSteps() {
  const k = STAGES[si];
  let s = svg(370);
  const X0 = 70, Y0 = 300, H = 24, colW = 105;
  for (let v = 0; v <= 10; v += 2) s += `<line x1="${X0 - 10}" y1="${Y0 - v * H}" x2="${X0 + 5 * colW}" y2="${Y0 - v * H}" style="stroke:var(--line)"/><text x="${X0 - 16}" y="${Y0 - v * H + 4}" text-anchor="end" class="mono muted" font-size="10">${v}</text>`;
  s += `<line x1="${X0 - 10}" y1="${Y0 - START * H}" x2="${X0 + 5 * colW}" y2="${Y0 - START * H}" style="stroke:var(--muted)" stroke-dasharray="3 3"/><text x="${X0 + 5 * colW + 4}" y="${Y0 - START * H + 4}" font-size="11" class="muted">start: 5</text>`;
  let err = 0;
  TRUE.forEach((t, i) => {
    const x = X0 + i * colW + colW / 2, p = pred(t, k); err += Math.abs(t - p);
    s += `<line x1="${x - 26}" y1="${Y0 - t * H}" x2="${x + 26}" y2="${Y0 - t * H}" style="stroke:var(--ink)" stroke-width="3"/>`;
    s += `<line x1="${x}" y1="${Y0 - p * H}" x2="${x}" y2="${Y0 - t * H}" style="stroke:${W}" stroke-width="2" stroke-dasharray="3 2"/>`;
    s += `<circle cx="${x}" cy="${Y0 - p * H}" r="8" style="fill:${A}" fill-opacity=".85"/>`;
    s += `<text x="${x}" y="${Y0 + 18}" text-anchor="middle" font-size="12" class="muted">${NAMES[i]}</text><text x="${x}" y="${Y0 + 34}" text-anchor="middle" class="mono" font-size="11">${p.toFixed(1)} / ${t}</text>`;
  });
  s += `<text x="20" y="22" font-size="12.5"><tspan font-weight="700">▬</tspan> coach's real score   <tspan style="fill:${A}" font-weight="700">●</tspan> model's prediction   <tspan style="fill:${W}" font-weight="700">┆</tspan> residual (what's still wrong)</text>`;
  s += `<text x="20" y="44" font-size="13" font-weight="700">After ${k} tree${k === 1 ? "" : "s"}: average miss ${(err / 5).toFixed(2)} points</text>`;
  s += `<text x="20" y="362" font-size="11" class="muted">Pick how many trees above. Each tree closes about half the remaining gap here; numbers are illustrative.</text>`;
  return s + `</svg>`;
}

function drawRate() {
  let s = svg(330);
  const X0 = 70, Y0 = 260, W0 = 500, H0 = 200;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + W0}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H0}" style="stroke:var(--ink)"/>`;
  s += `<text x="${X0 + W0 / 2}" y="${Y0 + 30}" text-anchor="middle" font-size="12" class="muted">Number of trees →</text><text x="34" y="${Y0 - H0 / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 34 ${Y0 - H0 / 2})">Validation error →</text>`;
  const big = t => 0.9 * Math.exp(-14 * t) + 0.32 + 0.5 * t * t, small = t => 0.9 * Math.exp(-4 * t) + 0.18 + 0.12 * t * t;
  const path = f => Array.from({ length: 61 }, (_, i) => { const t = i / 60; return `${i ? "L" : "M"}${X0 + t * W0} ${Y0 - f(t) * H0 / 1.1}`; }).join(" ");
  s += `<path d="${path(big)}" fill="none" style="stroke:${W}" stroke-width="2.2"/><path d="${path(small)}" fill="none" style="stroke:${A}" stroke-width="2.2"/>`;
  s += `<text x="${X0 + W0 - 4}" y="${Y0 - big(1) * H0 / 1.1 - 8}" text-anchor="end" font-size="12" font-weight="600" style="fill:${W}">big steps (rate 1.0): overfits fast</text>`;
  s += `<text x="${X0 + W0 - 4}" y="${Y0 - small(1) * H0 / 1.1 - 12}" text-anchor="end" font-size="12" font-weight="600" style="fill:${A}">small steps (rate 0.1): lower error</text>`;
  let tmin = 0, vmin = 9; for (let i = 0; i <= 100; i++) { const t = i / 100; if (small(t) < vmin) { vmin = small(t); tmin = t; } }
  const mx = X0 + tmin * W0, my = Y0 - vmin * H0 / 1.1;
  s += `<line x1="${mx}" y1="${my}" x2="${mx}" y2="${Y0}" style="stroke:${A}" stroke-dasharray="4 3"/><circle cx="${mx}" cy="${my}" r="6" style="fill:${A}"/>`;
  s += `<text x="${mx - 8}" y="${Y0 - 8}" text-anchor="end" font-size="12" font-weight="700" style="fill:${A}">early stopping: stop here</text>`;
  s += `<text x="20" y="318" font-size="11" class="muted">Curves are illustrative.</text>`;
  return s + `</svg>`;
}

function drawCompare() {
  let s = svg(330);
  const tree = (x, y, c, sm) => `<path d="M${x} ${y} l ${sm ? -16 : -24} ${sm ? 26 : 40} h ${sm ? 32 : 48} z" style="fill:${c};stroke:${c}" fill-opacity=".18" stroke-width="1.3"/>`;
  s += rect(15, 14, 295, 300, B, .05) + `<text x="30" y="40" font-size="15" font-weight="700" style="fill:${B}">Random forest</text><text x="30" y="60" font-size="12" class="muted">deep trees, side by side</text>`;
  for (let i = 0; i < 5; i++) { s += tree(55 + i * 52, 80, B, 0); s += arrow(55 + i * 52, 124, 160, 166); }
  s += rect(100, 168, 120, 34, B, .15) + `<text x="160" y="190" text-anchor="middle" font-size="12.5" font-weight="700">average / vote</text>`;
  s += `<text x="30" y="232" font-size="12.5">Trees learn independently.</text><text x="30" y="252" font-size="12.5">Mainly reduces <tspan font-weight="700">variance</tspan>.</text><text x="30" y="272" font-size="12.5">Hard to overfit, little tuning.</text>`;
  s += rect(330, 14, 295, 300, A, .05) + `<text x="345" y="40" font-size="15" font-weight="700" style="fill:${A}">Gradient boosting</text><text x="345" y="60" font-size="12" class="muted">small trees, one after another</text>`;
  for (let i = 0; i < 5; i++) { s += tree(370 + i * 52, 90, A, 1); if (i < 4) s += arrow(386 + i * 52, 106, 406 + i * 52, 106, A); }
  s += `<text x="478" y="140" text-anchor="middle" font-size="11.5" class="muted">each fixes the one before</text>`;
  s += rect(418, 168, 120, 34, A, .15) + `<text x="478" y="190" text-anchor="middle" font-size="12.5" font-weight="700">add them up</text>`;
  s += `<text x="345" y="232" font-size="12.5">Trees learn from earlier mistakes.</text><text x="345" y="252" font-size="12.5">Mainly reduces <tspan font-weight="700">bias</tspan>.</text><text x="345" y="272" font-size="12.5">Often more accurate, needs tuning,</text><text x="345" y="290" font-size="12.5">can overfit without early stopping.</text>`;
  return s + `</svg>`;
}

function drawWhen() {
  let s = svg(320);
  s += lbl(20, 22, "A STARTING POINT FOR CHOOSING A MODEL");
  const rows = [["Tables: user records, transactions, usage", "Gradient boosting (XGBoost, LightGBM, CatBoost)", A], ["Tables, need a quick strong default", "Random forest", B], ["Must explain every decision, or tiny data", "Logistic regression or one small tree", P], ["Raw text, images, audio", "Neural networks or a pretrained model", G]];
  rows.forEach(([d, m, c], i) => {
    const y = 34 + i * 62;
    s += rect(20, y, 270, 50) + `<text x="34" y="${y + 30}" font-size="12.5">${d}</text>`;
    s += arrow(296, y + 25, 326, y + 25);
    s += rect(332, y, 290, 50, c, .12) + `<text x="346" y="${y + 30}" font-size="12.5" font-weight="700" style="fill:${c}">${m}</text>`;
  });
  s += `<text x="20" y="300" font-size="12" class="muted">Coach example: predicting who finishes the course from usage records → gradient boosting.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Fix mistakes", title: "1 · Learning from mistakes", q: "How can small trees add up to a great model?",
    points: ["Start with one guess for everyone: the average, 5.", "The gap to the real score is the <b>residual</b>, what's still wrong.", "Each new tree learns to predict those gaps, and its correction is added.", "Pick how many trees above and watch the gaps shrink."],
    pm: "Boosting is like a team of editors: each one only fixes what the last one missed. That's why it gets so accurate on table data.",
    say: "Step one, learning from mistakes. We start with one simple guess for every answer, the average score of five. The dashed red lines show how far off we are. Those gaps are the residuals. Tree one learns to predict the gaps, and we add its correction. Now pick two trees, then three, then ten. Each new tree fixes what is still wrong, and the predictions close in on the real scores.",
    draw: drawSteps },
  { stage: "Small steps", title: "2 · Small steps and early stopping", q: "Why not fix each mistake all at once?",
    points: ["Big corrections chase noise and overfit quickly.", "A <b>learning rate</b>, like 0.1, scales each tree's correction down.", "Many small steps reach a lower error.", "<b>Early stopping</b>: stop adding trees when validation error stops improving."],
    pm: "More trees isn't always better. Ask whether the team used early stopping on a validation set, so the model stops before it starts memorising.",
    say: "Step two, small steps. If every tree corrected the whole mistake at once, the model would chase noise and overfit fast. That's the red line. Instead, we scale each correction down with a learning rate, like zero point one. The green line takes longer, but it reaches a lower error. And we stop adding trees right at its lowest point. That's called early stopping.",
    draw: drawRate },
  { stage: "vs forests", title: "3 · Boosting versus random forests", q: "Both use many trees. What's the difference?",
    points: ["<b>Forest</b>: deep, independent trees in parallel, averaged. Reduces variance.", "<b>Boosting</b>: small trees in sequence, each fixing the last. Reduces bias.", "Boosting is often more accurate, but needs more tuning.", "Unlike a forest, boosting can overfit if you add too many trees."],
    pm: "A forest is the safe, low-effort choice. Boosting usually squeezes out more accuracy, at the cost of more tuning time.",
    say: "Step three, boosting versus random forests. Both use many trees, but in opposite ways. A random forest grows deep trees side by side, independently, and averages them. That mainly reduces variance. Boosting grows small trees one after another, each fixing the last. That mainly reduces bias. Boosting is often more accurate, but it needs more tuning, and it can overfit if you're not careful.",
    draw: drawCompare },
  { stage: "When to use", title: "4 · When it wins", q: "When should a team reach for boosting?",
    points: ["Table data: boosting is usually the model to beat.", "XGBoost, LightGBM and CatBoost are fast and handle missing values.", "For text, images and audio, neural networks win.", "When every decision needs a reason, simpler models may be better."],
    pm: "For table data, ask “did we try gradient boosting?” before anyone proposes deep learning. It's often cheaper and more accurate.",
    say: "Step four, when boosting wins. If your data lives in tables, like user records, transactions or usage logs, gradient boosting is usually the model to beat. Tools like XG Boost, Light GBM and Cat Boost are fast, and they handle missing values well. For raw text, images or audio, neural networks win instead. And if every decision must be explained, a simpler model may be the better choice.",
    draw: drawWhen },
];
return { STEPS, picker: { label: "Trees added:", step: 0, items: () => STAGES.map(k => ({ label: String(k), color: "var(--accent)" })), get: () => si, set: i => { si = i; } } };
})();
VMETA[9] = {"title": "Fixing Mistakes, One Tree at a Time", "sub": "Predict the coach's scores with a chain of small trees, each fixing what the last one missed. Then see why small steps win and when boosting beats other models."};
