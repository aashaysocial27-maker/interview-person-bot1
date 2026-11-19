VISUALS[4] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.3"/>`;

function drawRaw() {
  let s = svg(340);
  s += lbl(20, 22, "RAW ANSWER");
  s += rect(20, 32, 600, 64);
  s += `<text x="34" y="56" font-size="13">“Um, so new hires kept getting lost. I rewrote the onboarding checklist with</text>`;
  s += `<text x="34" y="78" font-size="13">them, and onboarding time dropped by 30% in two months.”</text>`;
  s += arrow(320, 100, 320, 126);
  s += lbl(20, 142, "FEATURES WE MEASURE");
  const f = [["length", "48 s", B], ["specific details", "3", A], ["states a result", "yes → 1", A], ["clear structure", "yes → 1", P], ["filler words", "1", G]];
  f.forEach(([k, v, c], i) => {
    const x = 20 + i * 121;
    s += rect(x, 152, 113, 64, c, .1) + `<text x="${x + 56}" y="176" text-anchor="middle" font-size="11.5" class="muted">${k}</text><text x="${x + 56}" y="202" text-anchor="middle" class="mono" font-size="15" font-weight="600" style="fill:${c}">${v}</text>`;
  });
  s += arrow(320, 222, 320, 248);
  s += lbl(20, 264, "FEATURE VECTOR · WHAT THE MODEL SEES");
  s += rect(20, 274, 600, 44, "var(--ink)");
  s += `<text x="320" y="302" text-anchor="middle" class="mono" font-size="16" font-weight="600">[ 48, 3, 1, 1, 1 ]</text>`;
  return s + `</svg>`;
}

function drawNumbers() {
  let s = svg(330);
  s += lbl(20, 22, "BEFORE SCALING · VERY DIFFERENT RANGES");
  const raw = [["length (s)", 48, 300, B], ["specific details", 3, 10, A], ["states a result", 1, 1, P]];
  raw.forEach(([k, v, max], i) => {
    const y = 34 + i * 30, w = v / 300 * 420;
    s += `<text x="20" y="${y + 16}" font-size="12">${k}</text><rect x="150" y="${y + 3}" width="${Math.max(w, 2)}" height="18" rx="3" style="fill:${raw[i][3]}" fill-opacity=".6"/><text x="${156 + Math.max(w, 2)}" y="${y + 16}" class="mono" font-size="11">${v}</text>`;
  });
  s += `<text x="20" y="140" font-size="12" class="muted">Length dominates just because its numbers are bigger.</text>`;
  s += lbl(20, 172, "AFTER SCALING TO 0–1");
  const sc = [["length", 48 / 300], ["specific details", 3 / 10], ["states a result", 1]];
  sc.forEach(([k, v], i) => {
    const y = 182 + i * 30, w = v * 300;
    s += `<text x="20" y="${y + 16}" font-size="12">${k}</text><rect x="150" y="${y + 3}" width="${w}" height="18" rx="3" style="fill:${raw[i][3]}" fill-opacity=".6"/><text x="${156 + w}" y="${y + 16}" class="mono" font-size="11">${v.toFixed(2)}</text>`;
  });
  s += lbl(500, 172, "OR BIN IT");
  [["short", "< 45 s", 0], ["medium", "45–120 s", 1], ["long", "> 120 s", 0]].forEach(([b, r, on], i) => {
    const y = 182 + i * 30;
    s += rect(500, y, 120, 24, on ? A : "var(--line)", on ? .15 : 0) + `<text x="510" y="${y + 16}" font-size="12" ${on ? `font-weight="700" style="fill:${A}"` : ""}>${b}</text><text x="612" y="${y + 16}" text-anchor="end" class="mono" font-size="10.5">${r}</text>`;
  });
  s += `<text x="20" y="300" font-size="11" class="muted">Ranges and cut-offs are illustrative.</text>`;
  return s + `</svg>`;
}

function drawCategories() {
  let s = svg(320);
  s += lbl(20, 22, "THE TRAP: CODING CATEGORIES AS NUMBERS");
  [["Engineer", "1"], ["Sales", "2"], ["Product manager", "3"]].forEach(([r, n], i) => {
    s += `<text x="20" y="${56 + i * 26}" font-size="13">${r}</text><text x="170" y="${56 + i * 26}" class="mono" font-size="13" style="fill:${W}">→ ${n}</text>`;
  });
  s += rect(230, 36, 390, 72, W, .08) + `<text x="246" y="64" font-size="13" style="fill:${W}" font-weight="600">✗ Implies Sales sits “between” the other two,</text><text x="246" y="86" font-size="13" style="fill:${W}" font-weight="600">and PM is “three times” an engineer.</text>`;
  s += lbl(20, 148, "THE FIX: ONE-HOT ENCODING");
  const heads = ["is_engineer", "is_sales", "is_pm"];
  heads.forEach((h, k) => { s += `<text x="${250 + k * 120}" y="176" text-anchor="middle" class="mono" font-size="11.5" style="fill:${B}">${h}</text>`; });
  [["Engineer", [1, 0, 0]], ["Sales", [0, 1, 0]], ["Product manager", [0, 0, 1]]].forEach(([r, v], i) => {
    const y = 186 + i * 36;
    s += `<text x="20" y="${y + 21}" font-size="13">${r}</text>`;
    v.forEach((b, k) => { s += rect(220 + k * 120, y, 60, 28, b ? A : "var(--line)", b ? .15 : 0) + `<text x="${250 + k * 120}" y="${y + 19}" text-anchor="middle" class="mono" font-size="13" ${b ? `font-weight="700" style="fill:${A}"` : ""}>${b}</text>`; });
  });
  s += `<text x="220" y="310" font-size="13" font-weight="600" style="fill:${A}">✓ Exactly one 1 per row, so no false order.</text>`;
  return s + `</svg>`;
}

/* feature checker */
const CANDIDATES = [
  { label: "Specific details", c: "var(--accent)", checks: [1, 1, 1, 1], verdict: "Good feature", note: "Linked to answer quality, known right away, measured the same way, and fair." },
  { label: "Got the job", c: "var(--t3)", checks: [1, 0, 1, 1], verdict: "Leakage: don't use", note: "We only learn this weeks later. In testing it looks brilliant; in real use it doesn't exist yet." },
  { label: "Speaking accent", c: "var(--t4)", checks: [0, 1, 0, 0], verdict: "Unfair: don't use", note: "Says nothing about answer quality and would penalise people for who they are." },
  { label: "Answer length", c: "var(--t2)", checks: [1, 1, 1, 1], verdict: "Good, with care", note: "Useful, but only weakly linked. Bin it, so the model doesn't just reward long answers." },
];
const CHECKS = ["Related to what we predict?", "Available at prediction time?", "Reliable, measured the same way?", "Fair to use?"];
let cand = 1;
function drawCheck() {
  const c = CANDIDATES[cand];
  let s = svg(310);
  s += lbl(20, 22, "FOUR CHECKS FOR EVERY FEATURE");
  s += rect(20, 32, 600, 40, c.c, .1) + `<text x="36" y="58" font-size="14" font-weight="700" style="fill:${c.c}">Candidate feature: ${c.label}</text>`;
  CHECKS.forEach((q, i) => {
    const y = 84 + i * 40, ok = c.checks[i];
    s += rect(20, y, 600, 32) + `<text x="36" y="${y + 21}" font-size="13">${q}</text>`;
    s += `<text x="590" y="${y + 22}" text-anchor="end" font-size="16" font-weight="700" style="fill:${ok ? A : W}">${ok ? "✓" : "✗"}</text>`;
  });
  const good = c.checks.every(Boolean);
  s += rect(20, 248, 600, 52, good ? A : W, .12) + `<text x="36" y="270" font-size="13.5" font-weight="700" style="fill:${good ? A : W}">${c.verdict}</text><text x="36" y="290" font-size="12">${c.note}</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Raw → features", title: "1 · From raw data to features", q: "How does an answer become numbers?",
    points: ["A model only sees <b>numbers</b>, never the raw text.", "We measure the answer: length, specific details, a clear result, structure, filler words.", "Those numbers in a row form the <b>feature vector</b>.", "Choosing and building these is <b>feature engineering</b>."],
    pm: "Feature ideas come from domain knowledge. A good coach knows “states a clear result” matters, so a PM who brings that insight can improve the model more than a new algorithm.",
    say: "Step one, from raw data to features. The model can't read this answer the way you do. It only sees numbers. So we measure the answer. Its length. How many specific details it has. Whether it states a clear result. Whether it has a clear structure. And how many filler words it uses. Put those numbers in a row, and you get the feature vector. That list is all the model ever sees.",
    draw: drawRaw },
  { stage: "Numbers", title: "2 · Preparing numbers", q: "Why can't we just use the raw numbers?",
    points: ["Features come in very different ranges, like 30–300 seconds versus 0 or 1.", "Big numbers can drown out small ones.", "<b>Scaling</b> puts every feature into a similar range, like 0 to 1.", "<b>Binning</b> groups a number into buckets: short, medium, long."],
    pm: "You won't do the scaling yourself, but if a model seems to care only about one feature, like length, ask whether the features were scaled.",
    say: "Step two, preparing numbers. Our features come in very different ranges. Length runs up to hundreds of seconds, while states a result is just zero or one. Without care, length drowns out everything else, simply because its numbers are bigger. Scaling fixes this by putting every feature into a similar range, like zero to one. Binning is another option. It groups a number into buckets, like short, medium and long.",
    draw: drawNumbers },
  { stage: "Categories", title: "3 · Preparing categories", q: "How do we feed in things like job roles?",
    points: ["Coding roles as 1, 2, 3 invents a false order.", "<b>One-hot encoding</b> gives each category its own yes or no column.", "Exactly one column is 1 for each example.", "The model can now treat each role on its own."],
    pm: "Watch for ID-like numbers, such as postal codes or role codes, being used as plain numbers. It's a common and quiet source of bad predictions.",
    say: "Step three, preparing categories. Some features are categories, like the candidate's role. It's tempting to code them as one, two and three. But that tells the model sales sits between engineer and product manager, which makes no sense. One hot encoding fixes this. Each role gets its own yes or no column, so no false order sneaks in.",
    draw: drawCategories },
  { stage: "Good or bad?", title: "4 · Good and bad features", q: "How do I know if a feature should be used?",
    points: ["Is it <b>related</b> to what we predict?", "Is it <b>available</b> when we make the prediction? If not, it's <b>leakage</b>.", "Is it <b>reliable</b>, measured the same way every time?", "Is it <b>fair</b> to use? Pick a candidate above the diagram to test it."],
    pm: "Ask two questions about every feature: “Will we have this when the user is waiting?” and “Would we be comfortable telling the user we used it?”",
    say: "Step four, good and bad features. Every feature should pass four checks. Is it related to what we predict? Is it available at the moment of prediction? Is it reliable? And is it fair? Try got the job. It fails the second check. We only learn it weeks later, so using it is leakage. The model looks brilliant in testing and useless in real life. Now try speaking accent. It fails on fairness. It says nothing about answer quality.",
    draw: drawCheck },
];
return { STEPS, picker: { label: "Test a feature:", step: 3, items: () => CANDIDATES.map(c => ({ label: c.label, color: c.c })), get: () => cand, set: i => { cand = i; } } };
})();
VMETA[4] = {"title": "Turning Answers into Numbers", "sub": "Follow one interview answer as it becomes a feature vector, see how numbers and categories are prepared, then test which features are safe to use."};
