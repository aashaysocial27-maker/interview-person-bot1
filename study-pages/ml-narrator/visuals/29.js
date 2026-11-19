VISUALS[29] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawDecay() {
  let s = svg(320);
  const acc = [85, 85, 84, 84, 83, 82, 81, 79, 78, 77, 76, 75], X = i => 70 + i * 48, Y = v => 250 - (v - 65) * 9;
  s += lbl(20, 22, "ACCURACY ON NEW, LABELLED ANSWERS · MONTHS AFTER LAUNCH");
  [70, 75, 80, 85].forEach(v => { s += `<line x1="60" y1="${Y(v)}" x2="610" y2="${Y(v)}" style="stroke:var(--line)"/><text x="52" y="${Y(v) + 4}" text-anchor="end" class="mono muted" font-size="10">${v}%</text>`; });
  s += `<path d="M${acc.map((v, i) => `${X(i)} ${Y(v)}`).join(" L")}" fill="none" style="stroke:${W}" stroke-width="2.5"/>`;
  acc.forEach((v, i) => { s += `<circle cx="${X(i)}" cy="${Y(v)}" r="4" style="fill:${W}"/><text x="${X(i)}" y="268" text-anchor="middle" font-size="10.5" class="muted">${i}</text>`; });
  s += `<line x1="60" y1="${Y(80)}" x2="610" y2="${Y(80)}" style="stroke:${G}" stroke-dasharray="6 4" stroke-width="1.5"/><text x="606" y="${Y(80) - 6}" text-anchor="end" font-size="11.5" font-weight="700" style="fill:${G}">alert below 80%</text>`;
  s += `<text x="${X(7)}" y="${Y(79) + 22}" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:${W}">alert fires</text>`;
  s += `<text x="20" y="296" font-size="12.5">No code changed. The world moved. Decay is silent, so you only see it if you measure it.</text>`;
  s += `<text x="20" y="314" font-size="11" class="muted">Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

function drawKinds() {
  let s = svg(330);
  s += rect(15, 14, 295, 300, B, .06) + `<text x="30" y="40" font-size="14" font-weight="700" style="fill:${B}">Data drift: inputs change</text><text x="30" y="60" font-size="12">A new voice feature brings spoken answers.</text>`;
  const bars = (x0, y0, vals, c, op) => vals.map((v, i) => `<rect x="${x0 + i * 22}" y="${y0 - v}" width="18" height="${v}" rx="2" style="fill:${c}" fill-opacity="${op}"/>`).join("");
  s += bars(40, 200, [20, 55, 80, 60, 30, 12, 5, 2, 0, 0, 0], "var(--muted)", .45) + bars(40, 200, [0, 0, 4, 12, 26, 44, 60, 52, 34, 18, 8], B, .55);
  s += `<line x1="36" y1="200" x2="286" y2="200" style="stroke:var(--ink)"/><text x="160" y="218" text-anchor="middle" font-size="11.5" class="muted">answer length (words) →</text>`;
  s += `<text x="30" y="246" font-size="12"><tspan class="muted" font-weight="700">■</tspan> typed, at training   <tspan style="fill:${B}" font-weight="700">■</tspan> spoken, live</text><text x="30" y="270" font-size="12">Longer answers, more filler words:</text><text x="30" y="288" font-size="12">inputs the model never saw.</text>`;
  s += rect(330, 14, 295, 300, P, .06) + `<text x="345" y="40" font-size="14" font-weight="700" style="fill:${P}">Concept drift: “right” changes</text><text x="345" y="60" font-size="12">Same answer, different verdict over time.</text>`;
  s += rect(345, 80, 265, 52, "var(--line)") + `<text x="357" y="102" font-size="12">“I sped up reporting with</text><text x="357" y="120" font-size="12">spreadsheet macros.”</text>`;
  s += rect(345, 146, 126, 54, A, .12) + `<text x="408" y="168" text-anchor="middle" font-size="12" font-weight="700">last year</text><text x="408" y="188" text-anchor="middle" class="mono" font-size="12" style="fill:${A}">strong</text>`;
  s += rect(484, 146, 126, 54, W, .12) + `<text x="547" y="168" text-anchor="middle" font-size="12" font-weight="700">this year</text><text x="547" y="188" text-anchor="middle" class="mono" font-size="12" style="fill:${W}">average</text>`;
  s += `<text x="345" y="234" font-size="12">Employers now expect answers about</text><text x="345" y="252" font-size="12">working with AI tools. The labels the</text><text x="345" y="270" font-size="12">model learned from are out of date.</text>`;
  return s + `</svg>`;
}

const MONTHS = [{ label: "Month 1", shift: 0, score: .04, c: "var(--accent)" }, { label: "Month 4", shift: 1.5, score: .18, c: "var(--warm)" }, { label: "Month 7", shift: 3.2, score: .41, c: "var(--t3)" }];
let mi = 0;
function drawMonitor() {
  const M = MONTHS[mi], X0 = 40, Y0 = 200;
  let s = svg(340);
  s += lbl(20, 22, `ANSWER LENGTH: TRAINING VS LIVE · ${M.label.toUpperCase()}`);
  const dist = (mu, sd) => Array.from({ length: 14 }, (_, i) => 120 * Math.exp(-0.5 * Math.pow((i - mu) / sd, 2)));
  const tr = dist(4, 1.8), lv = dist(4 + M.shift, 1.9 + M.shift * .15);
  tr.forEach((v, i) => { s += `<rect x="${X0 + i * 24}" y="${Y0 - v}" width="20" height="${v}" rx="2" style="fill:var(--muted)" fill-opacity=".35"/>`; });
  lv.forEach((v, i) => { s += `<rect x="${X0 + i * 24 + 4}" y="${Y0 - v}" width="12" height="${v}" rx="2" style="fill:${M.c}" fill-opacity=".75"/>`; });
  s += `<line x1="${X0 - 4}" y1="${Y0}" x2="${X0 + 340}" y2="${Y0}" style="stroke:var(--ink)"/><text x="${X0 + 170}" y="${Y0 + 18}" text-anchor="middle" font-size="11.5" class="muted">answer length →</text>`;
  s += `<text x="${X0}" y="${Y0 + 42}" font-size="12"><tspan class="muted" font-weight="700">■</tspan> training data   <tspan style="fill:${M.c}" font-weight="700">■</tspan> live answers</text>`;
  const bx = 400, alert = M.score > .3;
  s += rect(bx, 34, 225, 94, M.c, .12, 2) + `<text x="${bx + 14}" y="58" font-size="12.5">Drift score</text><text x="${bx + 14}" y="90" class="mono" font-size="24" font-weight="700" style="fill:${M.c}">${M.score.toFixed(2)}</text><text x="${bx + 14}" y="114" font-size="12" font-weight="700" style="fill:${M.c}">${alert ? "⚠ over 0.30: alert" : M.score > .1 ? "rising: watch" : "normal"}</text>`;
  s += lbl(bx, 156, "ALSO WATCH");
  ["share rated strong", "accuracy, when labels arrive", "users disputing ratings", "errors and response time"].forEach((t, i) => { s += `<text x="${bx}" y="${178 + i * 20}" font-size="12">• ${t}</text>`; });
  s += `<text x="20" y="300" font-size="12.5">${alert ? "Live answers have moved far from what the model learned. Time to investigate and retrain." : "Pick later months above to watch live answers drift away from the training data."}</text>`;
  s += `<text x="20" y="320" font-size="11" class="muted">Distributions and scores are illustrative.</text>`;
  return s + `</svg>`;
}

function drawRespond() {
  let s = svg(330);
  const steps = [["Alert fires", "drift score over 0.30", W], ["Investigate", "pipeline bug? real shift? seasonal blip?", G], ["Fresh labels", "rate a sample of new live answers", B], ["Retrain + test", "evaluate on recent data, A/B if big", P], ["Deploy or roll back", "keep the last good version ready", A]];
  steps.forEach(([t, d, c], i) => { const y = 14 + i * 56; s += rect(20, y, 380, 46, c, .1) + `<text x="34" y="${y + 20}" font-size="13" font-weight="700" style="fill:${c}">${i + 1}. ${t}</text><text x="34" y="${y + 37}" font-size="11.5">${d}</text>`; if (i < 4) s += `<line x1="40" y1="${y + 46}" x2="40" y2="${y + 56}" style="stroke:var(--muted)" stroke-width="1.5"/>`; });
  s += rect(420, 14, 205, 270, "var(--line)") + `<text x="434" y="40" font-size="13" font-weight="700">Retrain when…</text>`;
  [["on a schedule", "e.g. monthly"], ["drift crosses", "a threshold"], ["quality drops", "below the bar"], ["the product", "changes, like a", "new voice feature"]].forEach((ls, i) => { ls.forEach((l, k) => { s += `<text x="434" y="${70 + i * 52 + k * 17}" font-size="12" ${k ? "" : 'font-weight="700"'}>${k ? "" : "• "}${l}</text>`; }); });
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Decay", title: "1 · Models decay", q: "Why does a working model get worse?",
    points: ["Accuracy slides from 85% to 75% over a year.", "No code changed. The world moved.", "Decay is silent: no crash, no error message.", "An alert threshold, here 80%, catches it."],
    pm: "Budget for life after launch. A model needs monitoring and retraining the way a machine needs maintenance.",
    say: "Step one, models decay. At launch, the coach was eighty five percent accurate. A year later, it's seventy five, and no code changed at all. The world moved. New users arrived, and expectations shifted. There's no crash and no error message, so this decay is silent. Here, an alert at eighty percent fires in month seven.",
    draw: drawDecay },
  { stage: "Two kinds", title: "2 · Data drift and concept drift", q: "What exactly changes?",
    points: ["<b>Data drift</b>: inputs change. Spoken answers are longer than typed ones.", "<b>Concept drift</b>: the right answer changes.", "Last year's strong answer may only be average now.", "Both make the model's learned patterns out of date."],
    pm: "Product changes cause data drift. Tell the ML team before launching something like a voice feature, so they can prepare.",
    say: "Step two, two kinds of drift. Data drift means the inputs change. A new voice feature brings spoken answers, which are much longer than the typed answers the model trained on. Concept drift means the right answer itself changes. An answer about speeding up reports with spreadsheet macros was strong last year. Now employers expect answers about working with AI tools, so it's only average.",
    draw: drawKinds },
  { stage: "Monitor", title: "3 · What to monitor", q: "How do we catch drift early?",
    points: ["Compare live inputs with the training data.", "A <b>drift score</b> sums up how far they've moved.", "Also watch outputs, accuracy, user disputes, errors and speed.", "Pick a month above to watch the drift grow."],
    pm: "Agree the alert thresholds and who gets paged. A dashboard nobody checks isn't monitoring.",
    say: "Step three, what to monitor. In month one, live answers look just like the training data. The drift score is low. Now pick month four. Live answers are getting longer, and the score is rising. Now pick month seven. Live answers have moved far away, the score crosses the threshold, and an alert fires. Also watch the share rated strong, accuracy when labels arrive, user disputes, and errors.",
    draw: drawMonitor },
  { stage: "Respond", title: "4 · Responding to drift", q: "What do we do when an alert fires?",
    points: ["Investigate first: bug, real shift, or seasonal blip?", "Rate a sample of new live answers for fresh labels.", "Retrain, test on recent data, then deploy or roll back.", "Retrain on a schedule and when drift crosses a threshold."],
    pm: "Give monitoring and retraining a clear owner and budget. Without one, alerts get ignored and quality quietly slides.",
    say: "Step four, responding to drift. When an alert fires, investigate first. Is it a pipeline bug, a real shift in users, or a seasonal blip? For real drift, rate a sample of new live answers, retrain, and test on recent data. Then deploy, or roll back to the last good version. Many teams also retrain on a schedule, and whenever drift crosses a threshold.",
    draw: drawRespond },
];
return { STEPS, picker: { label: "Month after launch:", step: 2, items: () => MONTHS.map(m => ({ label: m.label, color: m.c })), get: () => mi, set: i => { mi = i; } } };
})();
VMETA[29] = {"title": "Keeping Watch After Launch", "sub": "Watch the interview coach slowly decay after launch, tell data drift from concept drift, monitor live answers month by month, and respond when an alert fires."};
