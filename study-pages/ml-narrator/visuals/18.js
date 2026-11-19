VISUALS[18] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

/* 200 test answers: 100 strong, 100 weak (illustrative) */
const TH = [{ label: "Threshold 0.3", t: .3, tp: 95, fn: 5, fp: 40, tn: 60 }, { label: "Threshold 0.5", t: .5, tp: 80, fn: 20, fp: 15, tn: 85 }, { label: "Threshold 0.8", t: .8, tp: 55, fn: 45, fp: 3, tn: 97 }];
const pct = v => Math.round(v * 100) + "%";
function matrix(x, y, m, hi) {
  const cw = 130, ch = 70;
  let s = `<text x="${x + cw}" y="${y - 30}" text-anchor="middle" font-size="12" class="muted">Coach predicted</text>`;
  s += `<text x="${x + cw / 2}" y="${y - 10}" text-anchor="middle" font-size="12" font-weight="700">strong</text><text x="${x + cw * 1.5}" y="${y - 10}" text-anchor="middle" font-size="12" font-weight="700">weak</text>`;
  s += `<text x="${x - 14}" y="${y + ch / 2 + 4}" text-anchor="end" font-size="12" font-weight="700">strong</text><text x="${x - 14}" y="${y + ch * 1.5 + 4}" text-anchor="end" font-size="12" font-weight="700">weak</text>`;
  s += `<text x="${x - 74}" y="${y + ch}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 ${x - 74} ${y + ch})">Really was</text>`;
  const cells = [["TP", "true positive", m.tp, A, 0, 0], ["FN", "false negative", m.fn, W, 1, 0], ["FP", "false positive", m.fp, W, 0, 1], ["TN", "true negative", m.tn, A, 1, 1]];
  cells.forEach(([k, name, v, c, cx, cy]) => {
    const on = !hi || hi.includes(k);
    s += `<rect x="${x + cx * cw + 2}" y="${y + cy * ch + 2}" width="${cw - 4}" height="${ch - 4}" rx="6" style="fill:${c};stroke:${on && hi ? "var(--ink)" : c}" fill-opacity="${on ? .2 : .05}" stroke-width="${on && hi ? 2 : 1}"/>`;
    s += `<text x="${x + cx * cw + cw / 2}" y="${y + cy * ch + 30}" text-anchor="middle" class="mono" font-size="20" font-weight="700" ${on ? "" : 'opacity=".35"'}>${v}</text><text x="${x + cx * cw + cw / 2}" y="${y + cy * ch + 50}" text-anchor="middle" font-size="11" class="muted">${name}</text>`;
  });
  return s;
}
function drawMatrix() {
  const m = TH[1];
  let s = svg(320) + matrix(130, 60, m);
  const bx = 420;
  s += lbl(bx, 40, "200 TEST ANSWERS");
  s += `<text x="${bx}" y="64" font-size="12.5">100 really strong, 100 really weak.</text>`;
  s += rect(bx, 80, 205, 74, A, .1) + `<text x="${bx + 12}" y="102" font-size="12.5"><tspan font-weight="700" style="fill:${A}">True</tspan> boxes: coach was right</text><text x="${bx + 12}" y="126" class="mono" font-size="12.5">Accuracy = (80+85)/200</text><text x="${bx + 12}" y="144" class="mono" font-size="13" font-weight="700">= 82.5%</text>`;
  s += rect(bx, 166, 205, 70, W, .08) + `<text x="${bx + 12}" y="188" font-size="12.5"><tspan font-weight="700" style="fill:${W}">False</tspan> boxes: two different</text><text x="${bx + 12}" y="206" font-size="12.5">mistakes, with different</text><text x="${bx + 12}" y="224" font-size="12.5">costs for the candidate.</text>`;
  s += `<text x="20" y="300" font-size="11" class="muted">Counts are illustrative, at a threshold of 0.5.</text>`;
  return s + `</svg>`;
}
function drawPR() {
  const m = TH[1];
  let s = svg(330);
  s += matrix(130, 60, m, ["TP", "FP"]).replace(/<text x="[^"]*" y="[^"]*" text-anchor="middle" font-size="12" class="muted" transform[^<]*<\/text>/, "");
  const bx = 420;
  s += rect(bx, 30, 205, 92, A, .1) + `<text x="${bx + 12}" y="54" font-size="13" font-weight="700" style="fill:${A}">Precision</text><text x="${bx + 12}" y="74" font-size="12">When it says strong, is it right?</text><text x="${bx + 12}" y="98" class="mono" font-size="12.5">TP/(TP+FP) = 80/95</text><text x="${bx + 12}" y="114" class="mono" font-size="13" font-weight="700">= ${pct(80 / 95)}</text>`;
  s += rect(bx, 132, 205, 92, B, .1) + `<text x="${bx + 12}" y="156" font-size="13" font-weight="700" style="fill:${B}">Recall</text><text x="${bx + 12}" y="176" font-size="12">How many strong ones were found?</text><text x="${bx + 12}" y="200" class="mono" font-size="12.5">TP/(TP+FN) = 80/100</text><text x="${bx + 12}" y="216" class="mono" font-size="13" font-weight="700">= 80%</text>`;
  const p = 80 / 95, r = .8, f1 = 2 * p * r / (p + r);
  s += rect(bx, 234, 205, 62, P, .1) + `<text x="${bx + 12}" y="258" font-size="13" font-weight="700" style="fill:${P}">F1 = ${pct(f1)}</text><text x="${bx + 12}" y="280" font-size="12">High only when both are high.</text>`;
  s += `<text x="20" y="250" font-size="12.5">Precision uses the</text><text x="20" y="268" font-size="12.5"><tspan font-weight="700">strong column</tspan> (outlined).</text><text x="20" y="292" font-size="12.5">Recall uses the</text><text x="20" y="310" font-size="12.5"><tspan font-weight="700">strong row</tspan>: TP and FN.</text>`;
  return s + `</svg>`;
}
let ti = 1;
function drawTrade() {
  const m = TH[ti], p = m.tp / (m.tp + m.fp), r = m.tp / (m.tp + m.fn);
  let s = svg(320) + matrix(130, 60, m);
  const bx = 420;
  s += lbl(bx, 40, m.label.toUpperCase());
  [["Precision", p, A], ["Recall", r, B]].forEach(([t, v, c], i) => {
    const y = 60 + i * 56;
    s += `<text x="${bx}" y="${y}" font-size="13" font-weight="700" style="fill:${c}">${t}</text><text x="${bx + 205}" y="${y}" text-anchor="end" class="mono" font-size="13" font-weight="700">${pct(v)}</text><rect x="${bx}" y="${y + 8}" width="205" height="18" rx="4" style="fill:var(--line)"/><rect x="${bx}" y="${y + 8}" width="${v * 205}" height="18" rx="4" style="fill:${c}" fill-opacity=".7"/>`;
  });
  const msg = ti === 0 ? ["Says strong easily.", "Finds almost every strong answer,", "but praises 40 weak ones."] : ti === 1 ? ["A middle balance."] : ["Says strong only when very sure.", "Rarely wrong when it praises,", "but misses 45 strong answers."];
  msg.forEach((t, i) => { s += `<text x="${bx}" y="${190 + i * 20}" font-size="12.5">${t}</text>`; });
  s += `<text x="${bx}" y="270" font-size="11" class="muted">Pick a threshold above.</text>`;
  return s + `</svg>`;
}
function drawROC() {
  let s = svg(330);
  const X0 = 70, Y0 = 280, S = 240, px = v => X0 + v * S, py = v => Y0 - v * S;
  const pts = [[0, 0], [.03, .55], [.15, .8], [.4, .95], [1, 1]];
  s += `<path d="M${px(0)} ${py(0)} L${pts.map(([x, y]) => `${px(x)} ${py(y)}`).join(" L")} L${px(1)} ${py(0)} Z" style="fill:${A}" fill-opacity=".12"/>`;
  s += `<rect x="${X0}" y="${Y0 - S}" width="${S}" height="${S}" style="fill:none;stroke:var(--ink)"/>`;
  s += `<line x1="${px(0)}" y1="${py(0)}" x2="${px(1)}" y2="${py(1)}" style="stroke:var(--muted)" stroke-dasharray="5 4"/><text x="${px(.62)}" y="${py(.5)}" font-size="11.5" class="muted" transform="rotate(-45 ${px(.62)} ${py(.5)})">coin flip (AUC 0.5)</text>`;
  s += `<path d="M${pts.map(([x, y]) => `${px(x)} ${py(y)}`).join(" L")}" fill="none" style="stroke:${A}" stroke-width="2.5"/>`;
  TH.forEach((m, i) => { const x = m.fp / 100, y = m.tp / 100; s += `<circle cx="${px(x)}" cy="${py(y)}" r="6" style="fill:${[W, A, B][i]}"/><text x="${px(x) + 9}" y="${py(y) + 15}" font-size="11" class="mono">${m.t}</text>`; });
  s += `<text x="${X0 + S / 2}" y="${Y0 + 22}" text-anchor="middle" font-size="12" class="muted">weak answers wrongly praised →</text><text x="${X0 - 20}" y="${Y0 - S / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 ${X0 - 20} ${Y0 - S / 2})">strong answers caught →</text>`;
  s += `<text x="${px(.35)}" y="${py(.35)}" text-anchor="middle" font-size="16" font-weight="700" style="fill:${A}">AUC ≈ 0.89</text>`;
  const bx = 370;
  s += rect(bx, 40, 255, 104, A, .08) + `<text x="${bx + 12}" y="64" font-size="13" font-weight="700" style="fill:${A}">One curve, every threshold</text><text x="${bx + 12}" y="86" font-size="12">Dots are the 3 thresholds you tried.</text><text x="${bx + 12}" y="104" font-size="12">Top-left corner is perfect.</text><text x="${bx + 12}" y="122" font-size="12">The diagonal is guessing.</text>`;
  s += rect(bx, 156, 255, 84, P, .08) + `<text x="${bx + 12}" y="180" font-size="13" font-weight="700" style="fill:${P}">AUC 0.89 means…</text><text x="${bx + 12}" y="200" font-size="12">an 89% chance a random strong answer</text><text x="${bx + 12}" y="218" font-size="12">scores higher than a random weak one.</text>`;
  s += `<text x="${bx}" y="268" font-size="12" class="muted">For very rare positives, use a</text><text x="${bx}" y="284" font-size="12" class="muted">precision-recall curve instead.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Matrix", title: "1 · The confusion matrix", q: "What kinds of mistakes does the coach make?",
    points: ["200 test answers: 100 really strong, 100 really weak.", "Each prediction lands in one of four boxes.", "<b>True positive / negative</b>: the coach was right.", "<b>False positive / negative</b>: two different mistakes."],
    pm: "Ask for the confusion matrix, not just accuracy. The two kinds of mistakes usually have very different costs for users.",
    say: "Step one, the confusion matrix. We test the coach on two hundred answers, a hundred strong and a hundred weak. Every prediction lands in one of four boxes. Eighty strong answers were correctly called strong. Twenty strong answers were wrongly called weak. Fifteen weak answers were wrongly praised. And eighty five weak answers were correctly called weak. Accuracy is the two true boxes, eighty two and a half percent.",
    draw: drawMatrix },
  { stage: "P & R", title: "2 · Precision and recall", q: "How do we measure each kind of mistake?",
    points: ["<b>Precision</b>: when it says strong, how often is it right? 80 of 95, about 84%.", "<b>Recall</b>: of all truly strong answers, how many did it find? 80 of 100.", "<b>F1</b> combines both, and is only high when both are.", "Outlined boxes: the strong column, used for precision."],
    pm: "Precision protects users from false praise. Recall protects them from being overlooked. Decide which matters more for your product before you build.",
    say: "Step two, precision and recall. Precision asks, when the coach says strong, how often is it right? It said strong ninety five times, and eighty were right. That's about eighty four percent. Recall asks, of all the truly strong answers, how many did it find? Eighty of a hundred, so eighty percent. The F one score combines them, and it's only high when both are high.",
    draw: drawPR },
  { stage: "Trade-off", title: "3 · The threshold trade-off", q: "Can we have high precision and high recall?",
    points: ["Low threshold (0.3): recall 95%, but precision drops to 70%.", "High threshold (0.8): precision 95%, but recall drops to 55%.", "Raising one usually lowers the other.", "Pick a threshold above to see the matrix change."],
    pm: "The threshold is a product dial, not a technical detail. Choose it with the team based on which mistake hurts users more.",
    say: "Step three, the threshold trade off. At zero point five, precision is eighty four and recall is eighty. Now pick zero point three. The coach says strong more easily. It finds ninety five of the hundred strong answers, but it praises forty weak ones, so precision drops to seventy. Now pick zero point eight. Precision rises to ninety five, but the coach misses forty five strong answers. You can't max out both.",
    draw: drawTrade },
  { stage: "ROC & AUC", title: "4 · ROC curves and AUC", q: "How do we compare models across all thresholds?",
    points: ["An <b>ROC curve</b> plots strong answers caught against weak answers wrongly praised.", "Each threshold is one point. The three dots are the ones you tried.", "<b>AUC</b> is the shaded area: 0.5 is guessing, 1.0 is perfect.", "Here AUC ≈ 0.89."],
    pm: "AUC is handy for comparing two models fairly, before anyone has chosen a threshold. For rare events, ask for a precision-recall curve too.",
    say: "Step four, ROC curves and AUC. The ROC curve shows every threshold at once. Across the bottom, how many weak answers are wrongly praised. Up the side, how many strong answers are caught. The three dots are the thresholds we just tried. A perfect model hugs the top left corner, and a coin flip follows the diagonal. The shaded area is the AUC, here about zero point eight nine.",
    draw: drawROC },
];
return { STEPS, picker: { label: "Threshold:", step: 2, items: () => TH.map(m => ({ label: String(m.t), color: "var(--t2)" })), get: () => ti, set: i => { ti = i; } } };
})();
VMETA[18] = {"title": "Which Mistakes Matter?", "sub": "Test the interview coach on 200 answers: fill in the confusion matrix, work out precision and recall, move the threshold, and read the ROC curve."};
