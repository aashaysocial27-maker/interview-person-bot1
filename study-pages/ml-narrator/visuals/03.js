VISUALS[3] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const txt = (x, y, t, o = "") => `<text x="${x}" y="${y}" font-size="13" ${o}>${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.3" ${extra}/>`;

function drawTable() {
  let s = svg(320);
  const cols = [[20, 110, "ANSWER"], [130, 100, "ROLE"], [230, 90, "LENGTH"], [320, 100, "SPECIFIC"], [420, 110, "LABEL"]];
  const rows = [["#001", "Engineer", "95 s", "8", "strong"], ["#002", "Sales", "40 s", "2", "weak"], ["#003", "PM", "150 s", "7", "strong"], ["#004", "Engineer", "70 s", "3", "weak"]];
  s += rect(20, 40, 510, 30, "var(--line)") ;
  s += `<rect x="420" y="40" width="110" height="${30 + rows.length * 34 + 4}" rx="6" style="fill:${A};stroke:${A}" fill-opacity=".08" stroke-width="1.5"/>`;
  cols.forEach(([x, w, t]) => { s += lbl(x + 12, 60, t); });
  rows.forEach((r, i) => {
    const y = 74 + i * 34;
    s += `<line x1="20" y1="${y + 30}" x2="530" y2="${y + 30}" style="stroke:var(--line)"/>`;
    r.forEach((v, k) => { const isL = k === 4; s += `<text x="${cols[k][0] + 12}" y="${y + 21}" class="mono" font-size="13" ${isL ? `font-weight="600" style="fill:${v === "strong" ? A : W}"` : ""}>${v}</text>`; });
  });
  s += `<path d="M20 22 H 420" style="stroke:${B}" stroke-width="1.5"/>` + `<text x="20" y="16" font-size="12" style="fill:${B}">features: what describes each answer</text>`;
  s += `<text x="420" y="16" font-size="12" font-weight="600" style="fill:${A}">label: the right answer</text>`;
  s += `<path d="M540 74 v 136" style="stroke:var(--muted)" stroke-width="1.3"/><text x="550" y="140" font-size="12" class="muted">one row =</text><text x="550" y="156" font-size="12" class="muted">one example</text>`;
  s += `<text x="20" y="250" font-size="13">The coach's first dataset: about <tspan font-weight="700">1,000 rows</tspan>, one per rated answer.</text>`;
  s += `<text x="20" y="274" font-size="12" class="muted">Values here are illustrative.</text>`;
  return s + `</svg>`;
}

function drawSources() {
  let s = svg(330);
  const src = [["Human raters", "coaches rate each answer", "direct", A], ["User actions", "candidate saved it as a favourite", "proxy", G], ["Existing records", "candidate got the job", "proxy", G]];
  s += lbl(20, 22, "WHERE LABELS COME FROM");
  src.forEach(([t, ex, kind, c], i) => {
    const y = 34 + i * 70;
    s += rect(20, y, 360, 58) + `<text x="36" y="${y + 24}" font-size="14" font-weight="600">${t}</text><text x="36" y="${y + 44}" font-size="12" class="muted">e.g. ${ex}</text>`;
    s += arrow(384, y + 29, 424, y + 29);
    s += rect(428, y + 9, 110, 40, c, .14) + `<text x="483" y="${y + 34}" text-anchor="middle" class="mono" font-size="13" font-weight="600" style="fill:${c}">${kind}</text>`;
  });
  s += rect(20, 252, 600, 66, "var(--line)");
  s += `<text x="36" y="276" font-size="13"><tspan font-weight="700" style="fill:${A}">Direct label:</tspan> measures exactly what you want to predict.</text>`;
  s += `<text x="36" y="300" font-size="13"><tspan font-weight="700" style="fill:${G}">Proxy label:</tspan> only comes close. Hiring depends on much more than one answer.</text>`;
  return s + `</svg>`;
}

/* agreement demo: 3 coaches rate 5 answers; illustrative */
const RATINGS = {
  noGuide: [["S", "S", "W"], ["W", "S", "W"], ["S", "S", "S"], ["W", "W", "S"], ["S", "W", "W"]],
  guide:   [["S", "S", "S"], ["W", "W", "W"], ["S", "S", "S"], ["W", "W", "S"], ["W", "W", "W"]],
};
const MODES = [{ key: "noGuide", label: "No labeling guide", c: "var(--t3)" }, { key: "guide", label: "With a labeling guide", c: "var(--accent)" }];
let mode = 0;
function drawAgree() {
  const m = MODES[mode], R = RATINGS[m.key];
  let s = svg(320);
  s += lbl(20, 22, "3 COACHES RATE THE SAME 5 ANSWERS");
  ["Coach 1", "Coach 2", "Coach 3"].forEach((c, k) => { s += `<text x="${170 + k * 90}" y="50" text-anchor="middle" font-size="12" class="muted">${c}</text>`; });
  s += `<text x="470" y="50" text-anchor="middle" font-size="12" class="muted">All agree?</text>`;
  let agree = 0;
  R.forEach((r, i) => {
    const y = 60 + i * 40, all = r.every(v => v === r[0]); if (all) agree++;
    s += `<text x="20" y="${y + 22}" class="mono" font-size="13">Answer ${i + 1}</text>`;
    r.forEach((v, k) => { const c = v === "S" ? A : W; s += rect(140 + k * 90, y + 2, 60, 28, c, .14) + `<text x="${170 + k * 90}" y="${y + 21}" text-anchor="middle" class="mono" font-size="12" style="fill:${c}">${v === "S" ? "strong" : "weak"}</text>`; });
    s += `<text x="470" y="${y + 23}" text-anchor="middle" font-size="16" font-weight="700" style="fill:${all ? A : W}">${all ? "✓" : "✗"}</text>`;
  });
  const pct = Math.round(agree / R.length * 100);
  s += `<rect x="530" y="70" width="90" height="180" rx="8" style="fill:${m.c};stroke:${m.c}" fill-opacity=".1" stroke-width="1.5"/>`;
  s += `<text x="575" y="150" text-anchor="middle" font-size="28" font-weight="700" style="fill:${m.c}">${pct}%</text><text x="575" y="172" text-anchor="middle" font-size="11" class="muted">full agreement</text>`;
  s += `<text x="20" y="290" font-size="13">${mode ? "Clear definitions and example answers: the coaches now mostly agree." : "Each coach uses their own idea of “strong”. The model learns the confusion."}</text>`;
  s += `<text x="20" y="310" font-size="11" class="muted">Ratings are illustrative.</text>`;
  return s + `</svg>`;
}

function drawProblems() {
  let s = svg(330);
  const probs = [["Missing values", "empty “role” field on 12% of rows", B], ["Duplicates", "the same answer pasted 40 times", P], ["Old data", "2019 answers, before remote interviews", G]];
  probs.forEach(([t, ex, c], i) => {
    const y = 16 + i * 54;
    s += rect(20, y, 290, 46, c, .08) + `<text x="34" y="${y + 20}" font-size="13" font-weight="700" style="fill:${c}">${t}</text><text x="34" y="${y + 37}" font-size="11.5" class="muted">${ex}</text>`;
  });
  s += lbl(340, 26, "SKEWED COVERAGE: ANSWERS BY ROLE");
  const bars = [["Engineer", 780], ["PM", 160], ["Sales", 45], ["Design", 15]];
  bars.forEach(([r, v], i) => {
    const y = 40 + i * 34, w = v / 780 * 190;
    s += `<text x="340" y="${y + 18}" font-size="12">${r}</text>`;
    s += `<rect x="410" y="${y + 4}" width="${w}" height="20" rx="3" style="fill:${i ? W : A}" fill-opacity="${i ? .55 : .7}"/>`;
    s += `<text x="${416 + w}" y="${y + 18}" class="mono muted" font-size="11">${v}</text>`;
  });
  s += `<text x="340" y="190" font-size="12" class="muted">The coach barely saw sales or design answers,</text><text x="340" y="206" font-size="12" class="muted">so it will judge those candidates poorly.</text>`;
  s += rect(20, 240, 600, 70, "var(--accent)", .07);
  s += `<text x="36" y="266" font-size="13" font-weight="700" style="fill:${A}">Before training, check:</text>`;
  s += `<text x="36" y="290" font-size="13">missing values · duplicates · how old the data is · who is covered and who is missing</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Dataset", title: "1 · What a dataset looks like", q: "What does the coach actually learn from?",
    points: ["A dataset is a <b>table</b>. Each row is one <b>example</b>: one interview answer.", "Columns describe the example. These are the <b>features</b>.", "One column is the <b>label</b>, the right answer to learn.", "A first coach dataset: about 1,000 rated answers."],
    pm: "When someone says “we have data”, ask to see ten rows. You'll learn more from that than from any slide.",
    say: "Step one, what a dataset looks like. A dataset is just a table. Each row is one example, here one interview answer. The columns describe it, like the role, the length, and how specific it is. Those are the features. One special column holds the label, the right answer the model should learn. For a PM, a simple habit helps. When someone says we have data, ask to see ten rows.",
    draw: drawTable },
  { stage: "Label sources", title: "2 · Where labels come from", q: "Who decides the right answer?",
    points: ["<b>Human raters</b>: coaches rate each answer. Usually a direct label.", "<b>User actions</b>: what users save, click or skip.", "<b>Existing records</b>: outcomes already in a database.", "A <b>proxy</b> label only approximates what you want, like “got the job”."],
    pm: "Proxy labels are cheap and plentiful, but they can teach the wrong lesson. Always ask: does this label measure what we actually want?",
    say: "Step two, where labels come from. Some labels come from human raters, like coaches rating each answer. Others come from user actions, like saving an answer as a favourite. And some come from existing records, like whether the candidate got the job. Be careful here. Getting the job is only a proxy for a strong answer, because hiring depends on many other things. A direct label measures exactly what you want.",
    draw: drawSources },
  { stage: "Agreement", title: "3 · Do the raters agree?", q: "What if the experts disagree with each other?",
    points: ["Three coaches rate the same five answers.", "Without a guide, each uses their own idea of “strong”.", "Switch to <b>With a labeling guide</b> above the diagram and watch agreement rise.", "A guide has clear definitions and real example answers."],
    pm: "The labeling guide is effectively your product spec. Write it, test it on a small batch, measure agreement, then scale up.",
    say: "Step three, do the raters agree? Here, three coaches rate the same five answers. Without a guide, they often disagree, because each has their own idea of a strong answer. The model will learn that confusion. Now switch to the version with a labeling guide. With clear definitions and real example answers, the coaches mostly agree. For a PM, the labeling guide is really your product spec.",
    draw: drawAgree },
  { stage: "Problems", title: "4 · Common data problems", q: "What usually goes wrong with data?",
    points: ["<b>Missing values</b>: empty fields.", "<b>Duplicates</b>: the same example many times.", "<b>Old data</b>: no longer matches today's users.", "<b>Skewed coverage</b>: some groups barely appear, so the model fails for them."],
    pm: "Ask “who is missing from this data?” before launch. A model quietly fails for the users it never saw, and they're often the ones you're trying to grow.",
    say: "Step four, common data problems. Look for missing values, where fields are empty. Duplicates, where the same answer appears many times. Old data, that no longer matches today's users. And skewed coverage. In this example, almost every answer came from engineers, and very few from sales or design. So the coach will judge those candidates badly. Always ask, who is missing from this data?",
    draw: drawProblems },
];
return { STEPS, picker: { label: "Show:", step: 2, items: () => MODES.map(m => ({ label: m.label, color: m.c })), get: () => mode, set: i => { mode = i; } } };
})();
VMETA[3] = {"title": "Garbage In, Garbage Out", "sub": "How the interview coach's dataset is built: rows and labels, where labels come from, why raters disagree, and the data problems to check before training."};
