VISUALS[12] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function drawMany() {
  let s = svg(330);
  s += lbl(20, 22, "EACH ANSWER DESCRIBED BY 300 FEATURES");
  const heads = ["length", "details", "numbers", "“result”", "“team”", "“um”", "structure", "…", "f300"];
  heads.forEach((h, i) => { s += `<text x="${30 + i * 66}" y="50" font-size="11" class="mono muted">${h}</text>`; });
  const r = rng(3);
  for (let row = 0; row < 4; row++) heads.forEach((h, i) => { s += `<text x="${30 + i * 66}" y="${76 + row * 22}" class="mono" font-size="12">${h === "…" ? "…" : (r() * 9).toFixed(1)}</text>`; });
  s += arrow(320, 168, 320, 196);
  const items = [["Spread thin", "data scattered across a huge space"], ["Slow and hungry", "needs far more examples to learn"], ["Overfits easily", "finds patterns in noise"], ["Impossible to picture", "nobody can see 300 dimensions"]];
  items.forEach(([t, d], i) => { const x = 20 + (i % 2) * 305, y = 204 + Math.floor(i / 2) * 58; s += rect(x, y, 295, 50, W, .07) + `<text x="${x + 14}" y="${y + 21}" font-size="13" font-weight="700" style="fill:${W}">${t}</text><text x="${x + 14}" y="${y + 39}" font-size="12">${d}</text>`; });
  return s + `</svg>`;
}

/* correlated features: specific details vs numbers mentioned */
const r2 = rng(9), PTS = Array.from({ length: 34 }, () => { const t = (r2() - .5) * 8.4, n = (r2() - .5) * 1.6; return [5 + t * .8 - n * .6, 5 + t * .6 + n * .8]; });
const MODES = [{ label: "Original 2 features", c: "var(--t2)" }, { label: "Squeeze onto 1 axis", c: "var(--accent)" }];
let mi = 0;
function drawPCA() {
  const X = v => 50 + v * 30, Y = v => 300 - v * 27, ux = .8, uy = .6;
  let s = svg(340);
  for (let v = 0; v <= 10; v += 2) s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(10)}" style="stroke:var(--line)"/><line x1="${X(0)}" y1="${Y(v)}" x2="${X(10)}" y2="${Y(v)}" style="stroke:var(--line)"/>`;
  s += `<text x="${X(5)}" y="${Y(0) + 20}" text-anchor="middle" font-size="12" class="muted">Specific details →</text><text x="20" y="${Y(5)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 20 ${Y(5)})">Numbers mentioned →</text>`;
  s += `<line x1="${X(5 - 5 * ux)}" y1="${Y(5 - 5 * uy)}" x2="${X(5 + 5 * ux)}" y2="${Y(5 + 5 * uy)}" style="stroke:${A}" stroke-width="${mi ? 3 : 1.5}" ${mi ? "" : 'stroke-dasharray="6 4"'}/>`;
  s += arrow(X(5), Y(5), X(5 - 1.2 * uy), Y(5 + 1.2 * ux), P, 2);
  s += `<text x="${X(5 + 4.6 * ux)}" y="${Y(5 + 4.6 * uy) - 10}" text-anchor="end" font-size="12" font-weight="700" style="fill:${A}">component 1: “concreteness”</text>`;
  s += `<text x="${X(5 - 1.2 * uy) - 6}" y="${Y(5 + 1.2 * ux) - 4}" text-anchor="end" font-size="11.5" font-weight="600" style="fill:${P}">component 2</text>`;
  PTS.forEach(([x, y]) => {
    const t = (x - 5) * ux + (y - 5) * uy, px = 5 + t * ux, py = 5 + t * uy;
    if (mi) s += `<line x1="${X(x)}" y1="${Y(y)}" x2="${X(px)}" y2="${Y(py)}" style="stroke:var(--muted)" stroke-width="1" stroke-dasharray="2 2"/><circle cx="${X(px)}" cy="${Y(py)}" r="4.5" style="fill:${A}"/>`;
    s += `<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" style="fill:${B}" fill-opacity="${mi ? .25 : .8}"/>`;
  });
  const bx = 400;
  s += lbl(bx, 40, "HOW MUCH INFORMATION EACH KEEPS");
  [["Component 1", 88, A], ["Component 2", 12, P]].forEach(([t, v, c], i) => {
    const y = 56 + i * 48;
    s += `<text x="${bx}" y="${y}" font-size="12.5">${t}</text><text x="${bx + 225}" y="${y}" text-anchor="end" class="mono" font-size="12.5" font-weight="700">${v}%</text><rect x="${bx}" y="${y + 8}" width="225" height="16" rx="3" style="fill:var(--line)"/><rect x="${bx}" y="${y + 8}" width="${v * 2.25}" height="16" rx="3" style="fill:${c}" fill-opacity=".7"/>`;
  });
  s += `<text x="${bx}" y="172" font-size="12.5">${mi ? "Each answer is now one number:" : "The two features move together,"}</text><text x="${bx}" y="190" font-size="12.5">${mi ? "its position along component 1." : "so one direction explains most of it."}</text>`;
  s += `<text x="${bx}" y="218" font-size="12.5">${mi ? "2 features became 1, keeping 88%." : "Pick “Squeeze onto 1 axis” above."}</text>`;
  s += `<text x="${bx}" y="250" font-size="12" class="muted">With 300 features, a few dozen</text><text x="${bx}" y="266" font-size="12" class="muted">components often keep most of it.</text>`;
  s += `<text x="${bx}" y="298" font-size="11" class="muted">Data and percentages are illustrative.</text>`;
  return s + `</svg>`;
}

function drawMap() {
  let s = svg(340);
  const r = rng(21), groups = [[120, 110, B, "Too short", 18, 30], [250, 230, P, "Rambling", 36, 40], [330, 90, A, "Specific, on point", 14, 26], [150, 250, G, "Strong but long", 10, 22]];
  s += rect(20, 20, 380, 300, "var(--line)");
  s += lbl(34, 40, "2-D MAP OF 120 ANSWER EMBEDDINGS");
  groups.forEach(([cx, cy, c, name, n, sp]) => {
    for (let i = 0; i < n; i++) { const a = r() * 6.28, d = r() * sp; s += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="4" style="fill:${c}" fill-opacity=".8"/>`; }
    s += `<text x="${cx}" y="${cy - sp - 8}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${c}">${name}</text>`;
  });
  const bx = 420;
  s += rect(bx, 20, 205, 110, A, .08) + `<text x="${bx + 12}" y="44" font-size="13" font-weight="700" style="fill:${A}">Good for</text><text x="${bx + 12}" y="66" font-size="12">Spotting natural groups</text><text x="${bx + 12}" y="84" font-size="12">Finding odd, mislabelled items</text><text x="${bx + 12}" y="102" font-size="12">Exploring embeddings quickly</text>`;
  s += rect(bx, 142, 205, 130, W, .08) + `<text x="${bx + 12}" y="166" font-size="13" font-weight="700" style="fill:${W}">Read with care</text><text x="${bx + 12}" y="188" font-size="12">Cluster size can mean little.</text><text x="${bx + 12}" y="206" font-size="12">Distance between clusters</text><text x="${bx + 12}" y="222" font-size="12">can mean little.</text><text x="${bx + 12}" y="244" font-size="12">Settings change the picture.</text>`;
  s += `<text x="${bx}" y="300" font-size="11" class="muted">Made with t-SNE or UMAP.</text><text x="${bx}" y="316" font-size="11" class="muted">Illustrative.</text>`;
  return s + `</svg>`;
}

function drawWhen() {
  let s = svg(310);
  const uses = [["Faster training", "fewer features to process", A], ["Less noise", "drop directions that carry little", A], ["Cheaper embeddings", "smaller vectors to store and search", A], ["See the data", "plot thousands of dimensions in 2-D", A]];
  uses.forEach(([t, d, c], i) => { const x = 20 + (i % 2) * 305, y = 16 + Math.floor(i / 2) * 64; s += rect(x, y, 295, 54, c, .08) + `<text x="${x + 14}" y="${y + 23}" font-size="13" font-weight="700" style="fill:${c}">✓ ${t}</text><text x="${x + 14}" y="${y + 42}" font-size="12">${d}</text>`; });
  s += rect(20, 152, 600, 70, W, .07) + `<text x="34" y="176" font-size="13" font-weight="700" style="fill:${W}">The trade-off: explainability</text><text x="34" y="198" font-size="12.5">“Component 1 is high” is harder to explain to a user than “your answer was long”.</text>`;
  s += rect(20, 236, 600, 56, "var(--line)") + `<text x="34" y="259" font-size="12.5"><tspan font-weight="700">PCA</tspan>: straight axes, fast, good for compressing features.</text><text x="34" y="279" font-size="12.5"><tspan font-weight="700">t-SNE / UMAP</tspan>: bendy maps, best for looking at groups.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Too many", title: "1 · Too many features", q: "Why would more features ever be a problem?",
    points: ["Each answer could have 300 features: word counts, timing, structure.", "With so many dimensions, the data is <b>spread thin</b>.", "Models need more examples, run slower and overfit more easily.", "This is the <b>curse of dimensionality</b>."],
    pm: "More features isn't free. Each one adds cost, data needs and overfitting risk. Ask which features actually earn their place.",
    say: "Step one, too many features. Imagine describing each answer with three hundred features. Counts of important words, timing, structure scores, and so on. With that many dimensions, the data gets spread thin, like a few people in a huge stadium. Models need far more examples, run slower, and overfit more easily. And no one can picture three hundred dimensions. That's called the curse of dimensionality.",
    draw: drawMany },
  { stage: "PCA", title: "2 · PCA", q: "How do we keep the information but drop the extra features?",
    points: ["Specific details and numbers mentioned move together.", "PCA finds the direction of most spread: <b>component 1</b>.", "Squeeze each answer onto that axis: two features become one.", "Here component 1 keeps about 88% of the information. Try it above."],
    pm: "PCA is a cheap, well-understood way to shrink inputs. If a model is slow or costly because of huge feature sets, it's one of the first things to try.",
    say: "Step two, PCA. Look at these two features, specific details and numbers mentioned. They move together. PCA finds the direction along which the data spreads the most, the green line. That's component one. We could call it concreteness. Now pick squeeze onto one axis. Each answer drops onto the line, so two features become one number, and we keep about eighty eight percent of the information.",
    draw: drawPCA },
  { stage: "Maps", title: "3 · Maps with t-SNE and UMAP", q: "How do we look at high-dimensional data?",
    points: ["t-SNE and UMAP fold data onto a flat map, keeping neighbours close.", "Great for spotting groups and odd items in embeddings.", "But <b>cluster sizes</b> and <b>distances between clusters</b> can mean little.", "Different settings can produce quite different pictures."],
    pm: "Those beautiful cluster maps in AI demos are for exploring, not measuring. Don't make decisions based on how far apart two blobs look.",
    say: "Step three, maps with t SNE and UMAP. These methods fold high dimensional data onto a flat map, keeping neighbours close together. Here, a hundred and twenty answer embeddings form four groups. That's great for exploring. But read these maps with care. The size of a cluster, and the distance between clusters, can mean very little. And different settings can produce quite different pictures.",
    draw: drawMap },
  { stage: "When", title: "4 · When to use it", q: "When is dimensionality reduction worth it?",
    points: ["Faster training and less noise.", "Smaller, cheaper embeddings to store and search.", "Plotting data you otherwise couldn't see.", "Trade-off: new components are harder to explain."],
    pm: "If embedding storage or vector search costs climb, ask whether smaller vectors would do. It's often a quick win.",
    say: "Step four, when to use it. Dimensionality reduction speeds up training, removes noise, makes embeddings smaller and cheaper to store and search, and lets you see data you otherwise couldn't. The trade off is explainability. Telling a user that component one is high is much harder than saying their answer was too long.",
    draw: drawWhen },
];
return { STEPS, picker: { label: "View:", step: 1, items: () => MODES.map(m => ({ label: m.label, color: m.c })), get: () => mi, set: i => { mi = i; } } };
})();
VMETA[12] = {"title": "Squeezing Many Features into Few", "sub": "See why hundreds of features hurt, flatten two related features of an interview answer into one with PCA, and learn how to read embedding maps without being fooled."};
