VISUALS[10] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const X = v => 50 + v * 30, Y = v => 300 - v * 27;
function axes(xl, yl) {
  let s = "";
  for (let v = 0; v <= 10; v += 2) s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(10)}" style="stroke:var(--line)"/><line x1="${X(0)}" y1="${Y(v)}" x2="${X(10)}" y2="${Y(v)}" style="stroke:var(--line)"/>`;
  return s + `<text x="${X(5)}" y="${Y(0) + 20}" text-anchor="middle" font-size="12" class="muted">${xl}</text><text x="20" y="${Y(5)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 20 ${Y(5)})">${yl}</text>`;
}
const dot = (x, y, strong, extra = "") => strong ? `<circle cx="${X(x)}" cy="${Y(y)}" r="6" style="fill:${A}" fill-opacity=".85" ${extra}/>` : `<rect x="${X(x) - 5}" y="${Y(y) - 5}" width="10" height="10" style="fill:${W}" fill-opacity=".85" ${extra}/>`;

/* training answers: [specific, structured, strong?] illustrative */
const PTS = [[5.6, 5.4, 0], [4.3, 6.2, 1], [6.4, 4.4, 1], [3.6, 4.2, 1], [6.2, 6.8, 1], [7.5, 6.2, 1], [8.2, 8.0, 1], [7.0, 8.4, 1], [2.0, 3.0, 0], [3.0, 1.8, 0], [1.2, 5.6, 0], [4.6, 2.4, 0], [2.4, 7.4, 0], [8.4, 2.8, 1], [1.4, 1.2, 0]];
const NEW = [5, 5];
const KS = [1, 3, 7];
let ki = 0;
function drawKNN() {
  const k = KS[ki];
  const d = PTS.map((p, i) => ({ i, d: Math.hypot(p[0] - NEW[0], p[1] - NEW[1]) })).sort((a, b) => a.d - b.d);
  const near = d.slice(0, k), r = near[k - 1].d;
  const sv = near.filter(n => PTS[n.i][2]).length, wv = k - sv, out = sv > wv;
  let s = svg(340) + axes("How specific →", "How structured →");
  s += `<circle cx="${X(NEW[0])}" cy="${Y(NEW[1])}" r="${r * 30 + 8}" style="fill:${out ? A : W};stroke:${out ? A : W}" fill-opacity=".07" stroke-dasharray="5 4" stroke-width="1.5"/>`;
  near.forEach(n => { const p = PTS[n.i]; s += `<line x1="${X(NEW[0])}" y1="${Y(NEW[1])}" x2="${X(p[0])}" y2="${Y(p[1])}" style="stroke:var(--muted)" stroke-width="1.2"/>`; });
  PTS.forEach(p => { s += dot(p[0], p[1], p[2]); });
  s += `<circle cx="${X(NEW[0])}" cy="${Y(NEW[1])}" r="9" style="fill:var(--surface);stroke:var(--ink)" stroke-width="2.5"/><text x="${X(NEW[0])}" y="${Y(NEW[1]) + 4}" text-anchor="middle" font-size="11" font-weight="700">?</text>`;
  const bx = 400;
  s += lbl(bx, 40, `K = ${k} NEAREST NEIGHBOURS`);
  s += `<text x="${bx}" y="72" font-size="13"><tspan style="fill:${A}" font-weight="700">● strong: ${sv}</tspan>    <tspan style="fill:${W}" font-weight="700">■ weak: ${wv}</tspan></text>`;
  s += rect(bx, 88, 225, 56, out ? A : W, .14) + `<text x="${bx + 14}" y="113" font-size="14" font-weight="700" style="fill:${out ? A : W}">Prediction: ${out ? "strong" : "weak"}</text><text x="${bx + 14}" y="133" font-size="12">${k === 1 ? "one odd neighbour decides" : `majority of ${k} neighbours`}</text>`;
  s += `<text x="${bx}" y="176" font-size="12.5">No training: it just remembers</text><text x="${bx}" y="194" font-size="12.5">every rated answer.</text>`;
  s += `<text x="${bx}" y="224" font-size="12.5">Small k: sensitive to odd examples.</text><text x="${bx}" y="242" font-size="12.5">Large k: smoother, but blurrier.</text>`;
  s += `<text x="${bx}" y="280" font-size="11" class="muted">Pick k above. Data is illustrative.</text>`;
  return s + `</svg>`;
}

/* SVM: separable sets */
const SV = [[2, 6.5, 0], [1.5, 4, 0], [3, 3, 0], [2.6, 1.6, 0], [1, 7.6, 0], [4.2, 1.2, 0], [6.6, 8.6, 1], [6.2, 6.2, 1], [8.6, 7.4, 1], [6.8, 4.2, 1], [8.8, 4.4, 1], [9, 2.6, 1]];
function drawSVM() {
  let s = svg(340) + axes("How specific →", "How structured →");
  /* boundary: x + 0.3y = 6.31 ; margin edges at 4.56 (weak SV) and 8.06 (strong SVs) */
  const line = (c, col, w, dash) => `<line x1="${X(c - 0.3 * 0)}" y1="${Y(0)}" x2="${X(c - 0.3 * 10)}" y2="${Y(10)}" style="stroke:${col}" stroke-width="${w}" ${dash ? 'stroke-dasharray="6 4"' : ""}/>`;
  s += `<path d="M${X(4.56)} ${Y(0)} L${X(8.06)} ${Y(0)} L${X(5.06)} ${Y(10)} L${X(1.56)} ${Y(10)} Z" style="fill:${A}" fill-opacity=".09"/>`;
  s += line(4.56, "var(--muted)", 1.3, 1) + line(8.06, "var(--muted)", 1.3, 1) + line(6.31, "var(--ink)", 2.5, 0);
  s += `<line x1="${X(5.2)}" y1="${Y(0)}" x2="${X(6.4)}" y2="${Y(10)}" style="stroke:${G}" stroke-width="1.8" stroke-dasharray="2 4"/>`;
  SV.forEach(p => { s += dot(p[0], p[1], p[2]); });
  [[4.2, 1.2], [6.8, 4.2], [6.2, 6.2]].forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="11" style="fill:none;stroke:var(--ink)" stroke-width="1.6"/>`; });
  const bx = 400;
  s += lbl(bx, 40, "WIDEST ROAD BETWEEN THE GROUPS");
  s += `<text x="${bx}" y="70" font-size="12.5"><tspan font-weight="700">━</tspan> SVM boundary</text><text x="${bx}" y="92" font-size="12.5"><tspan style="fill:${A}" font-weight="700">▒</tspan> the margin, as wide as possible</text>`;
  s += `<text x="${bx}" y="114" font-size="12.5"><tspan font-weight="700">◯</tspan> support vectors: the edge cases</text><text x="${bx}" y="132" font-size="12.5">that alone set the boundary</text>`;
  s += `<text x="${bx}" y="160" font-size="12.5"><tspan style="fill:${G}" font-weight="700">┈</tspan> also separates, but hugs</text><text x="${bx}" y="178" font-size="12.5">the points: fragile on new data</text>`;
  s += rect(bx, 200, 225, 64, P, .08) + `<text x="${bx + 12}" y="222" font-size="12.5" font-weight="700" style="fill:${P}">Kernel trick</text><text x="${bx + 12}" y="242" font-size="12">lets the boundary curve when a</text><text x="${bx + 12}" y="258" font-size="12">straight road won't fit.</text>`;
  return s + `</svg>`;
}

function drawNB() {
  let s = svg(340);
  s += lbl(20, 22, "HOW OFTEN EACH WORD APPEARS (PER 100 ANSWERS)");
  const words = [["“result”", 62, 9], ["“launched”", 38, 6], ["“hard worker”", 7, 41], ["“um”", 22, 48]];
  s += `<text x="190" y="46" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">in strong</text><text x="330" y="46" text-anchor="middle" font-size="12" font-weight="700" style="fill:${W}">in weak</text><text x="470" y="46" text-anchor="middle" font-size="12" class="muted">points to</text>`;
  words.forEach(([w, a, b], i) => {
    const y = 58 + i * 38, toS = a > b;
    s += `<text x="20" y="${y + 20}" class="mono" font-size="13">${w}</text>`;
    s += `<rect x="140" y="${y + 6}" width="${a * 1.6}" height="18" rx="3" style="fill:${A}" fill-opacity=".6"/><text x="${146 + a * 1.6}" y="${y + 20}" class="mono" font-size="11">${a}</text>`;
    s += `<rect x="280" y="${y + 6}" width="${b * 1.6}" height="18" rx="3" style="fill:${W}" fill-opacity=".6"/><text x="${286 + b * 1.6}" y="${y + 20}" class="mono" font-size="11">${b}</text>`;
    s += `<text x="470" y="${y + 20}" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:${toS ? A : W}">${toS ? "strong" : "weak"} ×${(toS ? a / b : b / a).toFixed(1)}</text>`;
  });
  s += lbl(20, 228, "NEW ANSWER");
  s += rect(20, 238, 600, 34) + `<text x="34" y="260" font-size="13">“Um, I <tspan font-weight="700" style="fill:${A}">launched</tspan> the new flow and the <tspan font-weight="700" style="fill:${A}">result</tspan> was 20% fewer drop-offs.”</text>`;
  s += rect(20, 282, 600, 44, A, .12) + `<text x="34" y="309" font-size="13">Combine the evidence: two strong words outweigh one “um” → <tspan font-weight="700" style="fill:${A}">strong, about 95%</tspan></text>`;
  return s + `</svg>`;
}

function drawWhich() {
  let s = svg(320);
  const cols = [["KNN", B, ["Copies similar past examples", "No training, slow on big data", "Lives on in vector search and", "“users like you” features"]], ["SVM", P, ["Widest gap between groups", "Strong on small, clean data", "with many features", "Less common today"]], ["Naive Bayes", G, ["Counts words per class", "Very fast, needs little data", "Great first baseline for text,", "like tagging user feedback"]]];
  cols.forEach(([t, c, lines], i) => {
    const x = 15 + i * 207;
    s += rect(x, 14, 197, 210, c, .07) + `<text x="${x + 14}" y="44" font-size="16" font-weight="700" style="fill:${c}">${t}</text>`;
    lines.forEach((l, k) => { s += `<text x="${x + 14}" y="${76 + k * 24}" font-size="12.5">${l}</text>`; });
  });
  s += rect(15, 240, 610, 64, "var(--line)") + `<text x="30" y="266" font-size="13">Today, <tspan font-weight="700">gradient boosting</tspan> usually wins on tables and <tspan font-weight="700">neural networks</tspan> on text and images.</text><text x="30" y="288" font-size="13">These three stay useful as fast baselines, and their ideas power modern features.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "KNN", title: "1 · K-nearest neighbours", q: "Can a model just copy similar examples?",
    points: ["KNN remembers every rated answer. There's almost no training.", "For a new answer, find the <b>k</b> most similar ones and take a vote.", "With k = 1, one odd neighbour decides. With k = 3 or 7, the majority wins.", "Pick k above the diagram to see the prediction change."],
    pm: "“Users like you also liked…” is nearest-neighbour thinking. So is the vector search behind retrieval-augmented generation.",
    say: "Step one, k nearest neighbours. This model has almost no training. It remembers every rated answer. When a new answer arrives, shown as the question mark, it finds the most similar past answers and takes a vote. With k equal to one, the single closest neighbour happens to be weak, so it predicts weak. Now pick three. Two of the three are strong, so the prediction flips to strong. The choice of k really matters.",
    draw: drawKNN },
  { stage: "SVM", title: "2 · Support vector machines", q: "Which boundary is the best one?",
    points: ["Many lines can separate strong from weak answers.", "An SVM picks the one with the <b>widest margin</b>, like the widest road.", "The answers on the edge of the road are the <b>support vectors</b>. They alone set the boundary.", "A <b>kernel</b> lets the boundary curve when needed."],
    pm: "SVMs were the go-to text classifier before deep learning. You'll still meet them in older systems and on small, clean datasets.",
    say: "Step two, support vector machines. Many lines could separate the strong answers from the weak ones. The dotted orange line works, but it hugs the points, so it's fragile on new data. An SVM picks the boundary with the widest margin, like the widest possible road between two neighbourhoods. The circled answers sit right on the edge. They are the support vectors, and they alone decide where the road goes.",
    draw: drawSVM },
  { stage: "Naive Bayes", title: "3 · Naive Bayes", q: "How can counting words classify answers?",
    points: ["Count how often each word appears in strong answers and in weak answers.", "“result” and “launched” point to strong. “hard worker” and “um” point to weak.", "For a new answer, combine every word's evidence into a probability.", "“Naive” because it treats words as independent. It still works well."],
    pm: "Need a quick text classifier with little data, like tagging feedback as bug, feature request or praise? Naive Bayes is a fast, cheap first try.",
    say: "Step three, naive Bayes. This model counts words. Result appears in sixty two of every hundred strong answers, but only nine weak ones, so it points to strong. Hard worker points to weak. For a new answer, the model combines the evidence from every word. Here, launched and result outweigh one um, so it predicts strong. It's called naive because it treats each word as independent, which isn't really true, but it works surprisingly well.",
    draw: drawNB },
  { stage: "Which one?", title: "4 · When to use which", q: "Are these models still useful today?",
    points: ["<b>KNN</b>: similarity. Its idea powers vector search and recommendations.", "<b>SVM</b>: small, clean datasets with many features.", "<b>Naive Bayes</b>: fast first baseline for text.", "For most new work: boosting on tables, neural networks on text and images."],
    pm: "When someone mentions embeddings and vector search, think “KNN at huge scale”. The old idea is at the heart of modern AI features.",
    say: "Step four, when to use which. K nearest neighbours is all about similarity, and its idea powers vector search and recommendations today. Support vector machines shine on small, clean datasets with many features. Naive Bayes is a fast first baseline for text. For most new work, gradient boosting wins on tables and neural networks win on text and images. But these three ideas are still everywhere.",
    draw: drawWhich },
];
return { STEPS, picker: { label: "Number of neighbours (k):", step: 0, items: () => KS.map(k => ({ label: "k = " + k, color: "var(--t2)" })), get: () => ki, set: i => { ki = i; } } };
})();
VMETA[10] = {"title": "Three Simple Ideas", "sub": "Three classic models applied to the interview coach: ask the nearest neighbours, draw the widest road between strong and weak answers, and count the words."};
