VISUALS[7] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.3"/>`;

/* x = specific details (0-10), y = coach score (0-10); illustrative */
const PTS = [[1, 2.4], [2, 4.1], [2, 3.2], [3, 4.6], [4, 5.5], [4, 4.6], [5, 6.4], [6, 6.5], [6, 7.4], [7, 7.3], [8, 8.9], [9, 9.1]];
const X = v => 50 + v * 30, Y = v => 290 - v * 25;
function axes(xl, yl) {
  let s = "";
  for (let v = 0; v <= 10; v += 2) {
    s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(10)}" style="stroke:var(--line)"/><line x1="${X(0)}" y1="${Y(v)}" x2="${X(10)}" y2="${Y(v)}" style="stroke:var(--line)"/>`;
    s += `<text x="${X(v)}" y="${Y(0) + 15}" text-anchor="middle" class="mono muted" font-size="10">${v}</text><text x="${X(0) - 7}" y="${Y(v) + 4}" text-anchor="end" class="mono muted" font-size="10">${v}</text>`;
  }
  return s + `<text x="${X(5)}" y="${Y(0) + 32}" text-anchor="middle" font-size="12" class="muted">${xl}</text><text x="16" y="${Y(5)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 16 ${Y(5)})">${yl}</text>`;
}
const LINES = [
  { label: "First guess", c: "var(--t3)", b: 5, w: 0.1 },
  { label: "Better", c: "var(--warm)", b: 3, w: 0.5 },
  { label: "Best fit", c: "var(--accent)", b: 2, w: 0.8 },
];
const sse = l => PTS.reduce((a, [x, y]) => a + (y - (l.b + l.w * x)) ** 2, 0);

function drawLine() {
  const l = LINES[2];
  let s = svg(340) + axes("Specific details in the answer →", "Coach score →");
  s += `<line x1="${X(0)}" y1="${Y(l.b)}" x2="${X(10)}" y2="${Y(l.b + l.w * 10)}" style="stroke:${A}" stroke-width="2.5"/>`;
  PTS.forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" style="fill:var(--ink)" fill-opacity=".75"/>`; });
  const nx = 5, ny = l.b + l.w * nx;
  s += `<line x1="${X(nx)}" y1="${Y(0)}" x2="${X(nx)}" y2="${Y(ny)}" style="stroke:${B}" stroke-dasharray="4 3"/><line x1="${X(0)}" y1="${Y(ny)}" x2="${X(nx)}" y2="${Y(ny)}" style="stroke:${B}" stroke-dasharray="4 3"/><circle cx="${X(nx)}" cy="${Y(ny)}" r="7" style="fill:none;stroke:${B}" stroke-width="2.5"/>`;
  const bx = 390;
  s += lbl(bx, 40, "THE LEARNED FORMULA");
  s += rect(bx, 50, 235, 60, A, .1) + `<text x="${bx + 117}" y="86" text-anchor="middle" class="mono" font-size="15" font-weight="600">score = 2 + 0.8 × details</text>`;
  s += `<text x="${bx}" y="136" font-size="12.5"><tspan font-weight="700" style="fill:${A}">0.8</tspan> = weight: each detail adds 0.8</text>`;
  s += `<text x="${bx}" y="158" font-size="12.5"><tspan font-weight="700" style="fill:${A}">2</tspan> = bias: the starting point</text>`;
  s += rect(bx, 182, 235, 56, B, .08) + `<text x="${bx + 14}" y="204" font-size="12.5">New answer with 5 details:</text><text x="${bx + 14}" y="226" class="mono" font-size="13" font-weight="700" style="fill:${B}">2 + 0.8 × 5 = 6.0</text>`;
  s += `<text x="${bx}" y="268" font-size="12" class="muted">Many features? Same idea:</text><text x="${bx}" y="286" class="mono" font-size="11.5">b + w₁x₁ + w₂x₂ + w₃x₃ …</text>`;
  s += `<text x="${bx}" y="318" font-size="11" class="muted">Data and weights are illustrative.</text>`;
  return s + `</svg>`;
}

let li = 0;
function drawFit() {
  const l = LINES[li];
  let s = svg(340) + axes("Specific details →", "Coach score →");
  PTS.forEach(([x, y]) => { const py = l.b + l.w * x; s += `<line x1="${X(x)}" y1="${Y(y)}" x2="${X(x)}" y2="${Y(py)}" style="stroke:${l.c}" stroke-width="1.6" stroke-dasharray="3 2"/>`; });
  s += `<line x1="${X(0)}" y1="${Y(l.b)}" x2="${X(10)}" y2="${Y(l.b + l.w * 10)}" style="stroke:${l.c}" stroke-width="2.5"/>`;
  PTS.forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" style="fill:var(--ink)" fill-opacity=".75"/>`; });
  const bx = 390, worst = sse(LINES[0]);
  s += lbl(bx, 40, "TOTAL SQUARED ERROR (LOSS)");
  LINES.forEach((x, i) => {
    const y = 56 + i * 52, v = sse(x), on = i === li;
    s += `<text x="${bx}" y="${y + 12}" font-size="12.5" ${on ? `font-weight="700" style="fill:${x.c}"` : 'class="muted"'}>${x.label}</text><text x="${bx + 235}" y="${y + 12}" text-anchor="end" class="mono" font-size="12.5" ${on ? 'font-weight="700"' : ""}>${v.toFixed(1)}</text>`;
    s += `<rect x="${bx}" y="${y + 18}" width="${v / worst * 235}" height="16" rx="3" style="fill:${x.c}" fill-opacity="${on ? .75 : .3}"/>`;
  });
  s += `<text x="${bx}" y="232" font-size="12.5">Dashed lines = errors.</text><text x="${bx}" y="252" font-size="12.5">Square them, add them up.</text><text x="${bx}" y="272" font-size="12.5">Training adjusts the line until</text><text x="${bx}" y="292" font-size="12.5">this total is as small as possible.</text>`;
  return s + `</svg>`;
}

function drawSigmoid() {
  let s = svg(330);
  const X0 = 60, Y0 = 250, Wd = 340, Ht = 200, zx = z => X0 + (z + 6) / 12 * Wd, py = p => Y0 - p * Ht, sig = z => 1 / (1 + Math.exp(-z));
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + Wd}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - Ht}" style="stroke:var(--ink)"/>`;
  [0, .5, 1].forEach(p => { s += `<text x="${X0 - 8}" y="${py(p) + 4}" text-anchor="end" class="mono muted" font-size="10">${p}</text>`; });
  s += `<line x1="${X0}" y1="${py(.5)}" x2="${X0 + Wd}" y2="${py(.5)}" style="stroke:${G}" stroke-dasharray="5 4" stroke-width="1.5"/><text x="${X0 + Wd + 6}" y="${py(.5) + 4}" font-size="11.5" font-weight="600" style="fill:${G}">threshold 0.5</text>`;
  s += `<path d="${Array.from({ length: 61 }, (_, i) => { const z = -6 + i / 5; return `${i ? "L" : "M"}${zx(z)} ${py(sig(z))}`; }).join(" ")}" fill="none" style="stroke:${A}" stroke-width="2.5"/>`;
  s += `<text x="${X0 + Wd / 2}" y="${Y0 + 22}" text-anchor="middle" font-size="12" class="muted">weighted sum of the features →</text>`;
  s += `<text x="22" y="${Y0 - Ht / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 22 ${Y0 - Ht / 2})">P(strong)</text>`;
  const ex = [["Y", -3.1, W], ["Z", -0.2, G], ["X", 2.6, A]];
  ex.forEach(([n, z, c]) => { s += `<circle cx="${zx(z)}" cy="${py(sig(z))}" r="7" style="fill:${c}" fill-opacity=".85"/><text x="${zx(z) + 10}" y="${py(sig(z)) - 8}" font-size="12" font-weight="700" style="fill:${c}">${n}</text>`; });
  const bx = 500;
  s += lbl(bx, 40, "FROM CONCEPT 1");
  ex.forEach(([n, z, c], i) => {
    const p = sig(z), y = 54 + i * 62;
    s += rect(bx, y, 125, 52, c, .1) + `<text x="${bx + 12}" y="${y + 21}" font-size="13" font-weight="700" style="fill:${c}">Answer ${n}</text><text x="${bx + 12}" y="${y + 40}" class="mono" font-size="12">${p.toFixed(2)} → ${p >= .5 ? "strong" : "weak"}</text>`;
  });
  s += `<text x="20" y="306" font-size="12.5">The S-curve (sigmoid) squeezes any sum into a probability between 0 and 1.</text>`;
  return s + `</svg>`;
}

function drawExplain() {
  let s = svg(330);
  s += lbl(20, 22, "READING THE WEIGHTS OF A LOGISTIC REGRESSION COACH");
  const wts = [["each specific detail", 1.2, A], ["states a clear result", 0.9, A], ["clear structure", 0.6, A], ["each filler word", -0.4, W], ["over 3 minutes long", -0.7, W]];
  const zx = 330;
  wts.forEach(([t, v, c], i) => {
    const y = 38 + i * 34, w = Math.abs(v) * 120;
    s += `<text x="${zx - 160}" y="${y + 18}" text-anchor="end" font-size="12.5">${t}</text>`;
    s += `<rect x="${v > 0 ? zx : zx - w}" y="${y + 4}" width="${w}" height="20" rx="3" style="fill:${c}" fill-opacity=".6"/>`;
    s += `<text x="${v > 0 ? zx + w + 6 : zx - w - 6}" y="${y + 18}" text-anchor="${v > 0 ? "start" : "end"}" class="mono" font-size="12" font-weight="600">${v > 0 ? "+" : ""}${v}</text>`;
  });
  s += `<line x1="${zx}" y1="36" x2="${zx}" y2="210" style="stroke:var(--ink)"/>`;
  s += rect(20, 226, 295, 92, A, .07) + `<text x="34" y="250" font-size="13" font-weight="700" style="fill:${A}">Strengths</text><text x="34" y="272" font-size="12.5">Fast, cheap, rarely overfits.</text><text x="34" y="292" font-size="12.5">Easy to explain to users and regulators.</text><text x="34" y="310" font-size="12.5">The baseline every model must beat.</text>`;
  s += rect(330, 226, 295, 92, W, .07) + `<text x="344" y="250" font-size="13" font-weight="700" style="fill:${W}">Limits</text><text x="344" y="272" font-size="12.5">Assumes straight-line effects.</text><text x="344" y="292" font-size="12.5">Misses interactions, like length helping</text><text x="344" y="310" font-size="12.5">only when an answer is also specific.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "The line", title: "1 · Linear regression", q: "How do we predict a number?",
    points: ["Draw the best straight line through the training answers.", "The model learns: <b>score = 2 + 0.8 × details</b>.", "<b>0.8</b> is a <b>weight</b>: how much each detail adds. <b>2</b> is the <b>bias</b>: the starting point.", "With many features, it's a weighted sum of all of them."],
    pm: "A weight is something you can say out loud: “each specific detail adds 0.8 points.” That makes these models easy to explain in a product.",
    say: "Step one, linear regression. We want to predict a coach's score out of ten from the number of specific details in an answer. The model draws the best straight line through the training answers. It learns a formula. Score equals two, plus zero point eight times the number of details. Zero point eight is the weight, how much each detail adds. Two is the bias, the starting point. So an answer with five details gets a predicted score of six.",
    draw: drawLine },
  { stage: "Best fit", title: "2 · Finding the best line", q: "How does the model know which line is best?",
    points: ["Each dashed line is an <b>error</b>: the gap between the line and a real score.", "Square each error so big misses count extra, then add them up. That's the <b>loss</b>.", "Training adjusts the weight and bias until the loss is as small as possible.", "Pick a line above to compare."],
    pm: "“Training” sounds mysterious, but here it is just a search for the line with the smallest total error. Every model in this course does a version of this.",
    say: "Step two, finding the best line. Start with the first guess. The dashed lines show the errors, the gaps between the line and the real scores. We square each error, so big misses count extra, and add them up. That total is the loss. Now try better, and then best fit. The loss shrinks each time. Training is simply the search for the line with the smallest loss.",
    draw: drawFit },
  { stage: "Probability", title: "3 · Logistic regression", q: "How do we answer yes or no questions?",
    points: ["Same weighted sum, then squeezed through an S-curve, the <b>sigmoid</b>.", "The output is a <b>probability</b> between 0 and 1.", "A <b>threshold</b> turns it into a decision: 0.5 or above means strong.", "Answers X, Y and Z are the same ones from concept 1."],
    pm: "The threshold is a product decision. Raise it to 0.8 and fewer answers are called strong, but you can trust each “strong” more.",
    say: "Step three, logistic regression. For a yes or no question, like is this answer strong, we take the same weighted sum, and pass it through an S shaped curve called the sigmoid. Any number goes in, and a probability between zero and one comes out. Then a threshold, here zero point five, turns it into a decision. Answer X lands high, at about zero point nine three, so it's strong. Answer Y lands low, so it's weak. And answer Z sits just under the line.",
    draw: drawSigmoid },
  { stage: "Explain", title: "4 · Strengths and limits", q: "When should we use these models?",
    points: ["Each weight shows which way a feature pushes, and how hard.", "Fast, cheap, rarely overfits, and easy to explain.", "The perfect <b>baseline</b>: the first model to beat.", "Limit: assumes straight-line effects and misses interactions."],
    pm: "Always ask for a simple baseline first. If a complex model wins by only one point, the extra cost and lost explainability may not be worth it.",
    say: "Step four, strengths and limits. Here are the weights of a logistic regression coach. Each specific detail pushes the answer towards strong. Each filler word pushes it towards weak. You can read the whole model in one glance. That's why these models make perfect baselines. They are fast, cheap, and easy to explain. Their limit is that they assume simple straight line effects, so they miss interactions. That's where decision trees come in next.",
    draw: drawExplain },
];
return { STEPS, picker: { label: "Try a line:", step: 1, items: () => LINES.map(l => ({ label: l.label, color: l.c })), get: () => li, set: i => { li = i; } } };
})();
VMETA[7] = {"title": "The Best Straight Line", "sub": "Fit a straight line to the interview coach's data, see how training shrinks the error, squeeze the result into a probability, and read what each weight means."};
