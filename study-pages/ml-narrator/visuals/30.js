VISUALS[30] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawSmall() {
  let s = svg(330);
  const blocks = [[20, 30, 190, 80, "Data collection", B], [220, 30, 190, 80, "Data checks", G], [420, 30, 200, 80, "Feature building", P], [20, 120, 190, 110, "Configuration", "var(--muted)"], [420, 120, 200, 110, "Serving infrastructure", B], [20, 240, 290, 70, "Monitoring", W], [320, 240, 300, 70, "Analysis and debugging tools", G]];
  blocks.forEach(([x, y, w, h, t, c]) => { s += rect(x, y, w, h, c, .1) + `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="12.5" font-weight="600">${t}</text>`; });
  s += rect(280, 156, 70, 38, A, .3, 2.5) + `<text x="315" y="180" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">ML code</text>`;
  s += `<text x="315" y="216" text-anchor="middle" font-size="11" class="muted">the small part</text>`;
  s += lbl(20, 18, "A REAL ML SYSTEM · AFTER “HIDDEN TECHNICAL DEBT IN ML SYSTEMS” (2015)");
  return s + `</svg>`;
}

function drawPipeline() {
  let s = svg(320);
  const st = [["Pull data", B], ["Check data", G], ["Build features", P], ["Train", A], ["Evaluate vs live", A], ["Register", B]];
  st.forEach(([t, c], i) => { const x = 14 + i * 104; s += rect(x, 40, 94, 54, c, .12) + `<text x="${x + 47}" y="72" text-anchor="middle" font-size="11.5" font-weight="700">${t}</text>`; if (i < 5) s += arrow(x + 95, 67, x + 103, 67); });
  s += `<path d="M ${14 + 5 * 104 + 47} 96 C 560 150, 80 150, 61 98" fill="none" style="stroke:var(--muted)" stroke-dasharray="5 4" marker-end="url(#ah)"/><text x="320" y="142" text-anchor="middle" font-size="11.5" class="muted">runs again on a schedule, or when drift is detected</text>`;
  s += lbl(20, 182, "VERSION EVERYTHING");
  [["code", "v42 · git commit a1b2c3"], ["data", "answers up to 2026-10-31"], ["model", "coach-v7 · recall 82%"]].forEach(([k, v], i) => { const x = 20 + i * 205; s += rect(x, 192, 195, 54, "var(--line)") + `<text x="${x + 12}" y="214" font-size="12.5" font-weight="700">${k}</text><text x="${x + 12}" y="234" class="mono" font-size="11">${v}</text>`; });
  s += `<text x="20" y="276" font-size="12.5">So you can always answer: which data and code produced the model that rated this answer?</text><text x="20" y="296" font-size="12.5">And rebuild any past version exactly.</text>`;
  return s + `</svg>`;
}

function drawDeploy() {
  let s = svg(330);
  s += rect(20, 16, 160, 120, P, .08) + `<text x="100" y="40" text-anchor="middle" font-size="13" font-weight="700" style="fill:${P}">Model registry</text>`;
  [["coach-v6", "retired"], ["coach-v7", "live"], ["coach-v8", "candidate"]].forEach(([n, st], i) => { const c = st === "live" ? A : st === "candidate" ? G : "var(--muted)"; s += `<text x="34" y="${66 + i * 22}" class="mono" font-size="12">${n}</text><text x="166" y="${66 + i * 22}" text-anchor="end" font-size="11.5" font-weight="700" style="fill:${c}">${st}</text>`; });
  const stg = [["Shadow", "v8 scores real answers silently; users only see v7", G], ["Canary", "v8 serves 5% of users; monitoring watches closely", B], ["Full rollout", "v8 serves everyone; v7 kept ready", A]];
  stg.forEach(([t, d, c], i) => { const y = 16 + i * 42; s += rect(200, y, 425, 36, c, .1) + `<text x="214" y="${y + 23}" font-size="12.5"><tspan font-weight="700" style="fill:${c}">${i + 1}. ${t}:</tspan> ${d}</text>`; });
  s += rect(20, 156, 605, 76, W, .08) + `<text x="34" y="180" font-size="13" font-weight="700" style="fill:${W}">Automatic rollback</text><text x="34" y="202" font-size="12.5">If a guardrail breaks, like slow responses or a jump in “strong” ratings, traffic switches</text><text x="34" y="220" font-size="12.5">back to v7 in minutes, before most users notice.</text>`;
  s += `<text x="20" y="262" font-size="12.5">Each step limits how many users a bad model can reach.</text>`;
  return s + `</svg>`;
}

const LEVELS = [
  { label: "Level 0: manual", c: "var(--t3)", steps: ["notebook", "hand off file", "manual deploy"], auto: 0, note: "Fine to start. Slow to update, easy to lose track of what's live." },
  { label: "Level 1: automated training", c: "var(--warm)", steps: ["pipeline", "auto retrain", "manual deploy"], auto: 2, note: "Retrains on a schedule or when drift is detected." },
  { label: "Level 2: CI/CD", c: "var(--accent)", steps: ["tested pipeline", "auto retrain", "auto deploy"], auto: 3, note: "Ships improvements quickly and safely, like modern software." },
];
let li = 0;
function drawLevels() {
  const L = LEVELS[li];
  let s = svg(320);
  s += lbl(20, 22, "MLOPS MATURITY (GOOGLE CLOUD'S THREE LEVELS)");
  LEVELS.forEach((x, i) => { const on = i === li; s += `<rect x="${40 + i * 190}" y="${200 - (i + 1) * 40}" width="170" height="${(i + 1) * 40}" rx="6" style="fill:${x.c};stroke:${on ? "var(--ink)" : x.c}" fill-opacity="${on ? .45 : .12}" stroke-width="${on ? 2 : 1}"/><text x="${125 + i * 190}" y="${222}" text-anchor="middle" font-size="12" font-weight="700">Level ${i}</text>`; });
  L.steps.forEach((t, i) => { const x = 40 + i * 200, autoOn = i < L.auto; s += rect(x, 240, 180, 36, autoOn ? A : "var(--muted)", autoOn ? .15 : .08) + `<text x="${x + 12}" y="263" font-size="12">${autoOn ? "⚙ " : "✋ "}${t}</text>`; if (i < 2) s += arrow(x + 182, 258, x + 198, 258); });
  s += `<text x="20" y="302" font-size="12.5"><tspan font-weight="700" style="fill:${L.c}">${L.label}.</tspan> ${L.note}</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Small part", title: "1 · The model is the small part", q: "What does a real ML system look like?",
    points: ["The ML code is a tiny box in the middle.", "Around it: data collection, data checks, features, serving, monitoring, configuration.", "Most of the work, and most of the breakages, live outside the model.", "From Google's “Hidden Technical Debt in ML Systems” paper."],
    pm: "When planning an ML feature, budget for the whole system, not just the model. The surrounding pieces are usually most of the effort.",
    say: "Step one, the model is the small part. A famous Google paper showed that in a real machine learning system, the model code is a tiny box. Around it sit much bigger pieces. Data collection, data checks, feature building, configuration, serving infrastructure, monitoring and debugging tools. Most of the work, and most of the things that break, live in those surrounding pieces.",
    draw: drawSmall },
  { stage: "Pipeline", title: "2 · Pipelines and versioning", q: "How do teams train models reliably?",
    points: ["A <b>pipeline</b>: pull data, check it, build features, train, evaluate, register.", "It runs again on a schedule or when drift is detected.", "<b>Version</b> the code, the data and the model.", "So any past model can be explained and rebuilt."],
    pm: "Ask: “Can we tell which data trained the live model, and rebuild it?” If not, debugging and audits will be painful.",
    say: "Step two, pipelines and versioning. Instead of training by hand, the team builds a pipeline. Pull fresh data, check it, build features, train, evaluate against the live model, and register the result if it's better. It runs again on a schedule, or when drift is detected. And everything is versioned, the code, the data, and the model, so you can always explain and rebuild any past version.",
    draw: drawPipeline },
  { stage: "Deploy", title: "3 · Deploying safely", q: "How do we release a new model without risk?",
    points: ["A <b>model registry</b> tracks every version and which one is live.", "<b>Shadow</b>: the new model scores silently alongside the live one.", "<b>Canary</b>: it serves a small share of users first.", "<b>Automatic rollback</b> if a guardrail breaks."],
    pm: "Ask how fast the team can roll back. Minutes is good. Days means every launch is a big bet.",
    say: "Step three, deploying safely. The model registry tracks every version. Version seven is live, and version eight is the candidate. First, in shadow mode, version eight scores real answers silently, while users still see version seven. Then a canary release sends it to five percent of users. Then everyone, with version seven kept ready. If a guardrail breaks, traffic rolls back automatically in minutes.",
    draw: drawDeploy },
  { stage: "Maturity", title: "4 · Maturity levels", q: "How automated should we be?",
    points: ["<b>Level 0</b>: manual notebooks and hand-offs.", "<b>Level 1</b>: automated training pipeline.", "<b>Level 2</b>: tested, automated pipeline and deployment, CI/CD.", "Pick a level above. Match the level to the stakes."],
    pm: "Not every model needs level 2. A small internal tool can stay manual; the core coach that users rely on deserves automation.",
    say: "Step four, maturity levels. Google describes three levels. At level zero, everything is manual. A data scientist trains in a notebook and hands over a file. Now pick level one. The training pipeline is automated, so the model retrains on a schedule or when drift is detected. Now pick level two. The pipeline is tested and deployed automatically, like modern software. Most teams start at level zero, and that's fine.",
    draw: drawLevels },
];
return { STEPS, picker: { label: "Maturity:", step: 3, items: () => LEVELS.map(l => ({ label: l.label, color: l.c })), get: () => li, set: i => { li = i; } } };
})();
VMETA[30] = {"title": "Keeping ML Running", "sub": "See how small the model is inside a real ML system, automate and version the interview coach's training pipeline, deploy safely with rollback, and climb the maturity levels."};
