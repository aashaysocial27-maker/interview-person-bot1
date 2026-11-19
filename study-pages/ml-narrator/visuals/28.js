VISUALS[28] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const person = (x, y, c) => `<circle cx="${x}" cy="${y}" r="5" style="fill:${c}"/><path d="M${x - 7} ${y + 16} q 7 -12 14 0" style="fill:${c}"/>`;

function drawSplit() {
  let s = svg(320);
  s += lbl(20, 22, "RANDOMLY SPLIT USERS");
  for (let i = 0; i < 20; i++) s += person(40 + (i % 10) * 22, 44 + Math.floor(i / 10) * 30, "var(--muted)");
  s += arrow(262, 60, 330, 40) + arrow(262, 70, 330, 140);
  s += rect(340, 14, 285, 80, B, .1) + `<text x="354" y="38" font-size="13" font-weight="700" style="fill:${B}">A · Control (50%)</text><text x="354" y="58" font-size="12">current coach</text>`;
  for (let i = 0; i < 10; i++) s += person(360 + i * 24, 68, B);
  s += rect(340, 110, 285, 80, A, .1) + `<text x="354" y="134" font-size="13" font-weight="700" style="fill:${A}">B · Treatment (50%)</text><text x="354" y="154" font-size="12">new model</text>`;
  for (let i = 0; i < 10; i++) s += person(360 + i * 24, 164, A);
  s += rect(20, 210, 605, 96, "var(--line)") + `<text x="34" y="234" font-size="12.5"><tspan font-weight="700">Random</tspan> means the groups are alike in every other way,</text><text x="34" y="254" font-size="12.5">so any difference in outcomes is caused by the model.</text><text x="34" y="282" font-size="12.5">Split by <tspan font-weight="700">user</tspan>, not by session, so each person gets one consistent coach.</text>`;
  return s + `</svg>`;
}

function drawMetrics() {
  let s = svg(330);
  s += rect(20, 16, 605, 86, A, .1, 2) + `<text x="34" y="40" font-size="13" font-weight="700" style="fill:${A}">Primary metric: chosen before the test</text><text x="34" y="64" font-size="12.5">Share of candidates whose answer scores improve within 2 weeks</text><text x="34" y="86" class="mono" font-size="12.5">A: 41%   B: 46%   → +5 points</text>`;
  s += lbl(20, 128, "GUARDRAILS: MUST NOT GET WORSE");
  [["Sessions finished", "92% → 91%", "ok", A], ["Complaints per 1,000", "3.1 → 3.0", "ok", A], ["Response time", "0.8 s → 1.9 s", "worse", W]].forEach(([t, v, st, c], i) => {
    const x = 20 + i * 205;
    s += rect(x, 138, 195, 80, c, .08) + `<text x="${x + 12}" y="162" font-size="12.5" font-weight="700">${t}</text><text x="${x + 12}" y="186" class="mono" font-size="12.5">${v}</text><text x="${x + 12}" y="206" font-size="12" font-weight="700" style="fill:${c}">${st === "ok" ? "✓ fine" : "✗ too slow"}</text>`;
  });
  s += rect(20, 234, 605, 76, W, .07) + `<text x="34" y="258" font-size="13" font-weight="700" style="fill:${W}">Not ready yet</text><text x="34" y="280" font-size="12.5">The new model helps, but it doubles response time. Fix speed, then test again.</text><text x="34" y="298" font-size="11" class="muted">Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

const TIMES = [{ label: "After 2 days", c: "var(--t3)", n: 120, a: [38, 9], b: [52, 9] }, { label: "After 2 weeks", c: "var(--accent)", n: 4000, a: [41, 1.5], b: [46, 1.5] }];
let ti = 0;
function drawSig() {
  const T = TIMES[ti], X = v => 60 + (v - 10) * 9.5;
  let s = svg(330);
  s += lbl(20, 22, `LIKELY RANGE OF THE IMPROVEMENT RATE · ${T.n.toLocaleString("en-US")} USERS PER GROUP`);
  [10, 20, 30, 40, 50, 60, 70].forEach(v => { s += `<line x1="${X(v)}" y1="40" x2="${X(v)}" y2="190" style="stroke:var(--line)"/><text x="${X(v)}" y="206" text-anchor="middle" class="mono muted" font-size="10">${v}%</text>`; });
  [["A · control", T.a, B, 70], ["B · new model", T.b, A, 140]].forEach(([t, [m, e], c, y]) => {
    s += `<text x="20" y="${y - 12}" font-size="12.5" font-weight="700" style="fill:${c}">${t}</text>`;
    s += `<rect x="${X(m - e)}" y="${y}" width="${X(m + e) - X(m - e)}" height="22" rx="4" style="fill:${c}" fill-opacity=".2"/><line x1="${X(m)}" y1="${y - 4}" x2="${X(m)}" y2="${y + 26}" style="stroke:${c}" stroke-width="3"/><text x="${X(m)}" y="${y + 40}" text-anchor="middle" class="mono" font-size="12" font-weight="700">${m}%</text>`;
  });
  const overlap = T.a[0] + T.a[1] > T.b[0] - T.b[1];
  s += rect(20, 226, 605, 90, T.c, .1) + `<text x="34" y="250" font-size="13" font-weight="700" style="fill:${T.c}">${overlap ? "The ranges overlap: could easily be luck" : "The ranges don't overlap: a real improvement"}</text>`;
  s += ti === 0 ? `<text x="34" y="272" font-size="12.5">B looks 14 points better, but with only 120 users each, the ranges are wide.</text><text x="34" y="292" font-size="12.5">Stopping now (peeking) would launch on a lucky streak.</text>`
               : `<text x="34" y="272" font-size="12.5">With 4,000 users each, the ranges are narrow. B is about 5 points better, and that's real.</text><text x="34" y="292" font-size="12.5">Smaller than the early number, but trustworthy. Decide sample size before you start.</text>`;
  return s + `</svg>`;
}

function drawRollout() {
  let s = svg(330);
  s += lbl(20, 22, "TRAPS TO WATCH");
  [["Novelty effect", "users try it, then lose interest"], ["Too many metrics", "check 20, one wins by luck"], ["Users influence each other", "shared tips blur the groups"]].forEach(([t, d], i) => { const x = 20 + i * 205; s += rect(x, 32, 195, 64, W, .07) + `<text x="${x + 12}" y="56" font-size="12.5" font-weight="700" style="fill:${W}">${t}</text><text x="${x + 12}" y="78" font-size="11.5">${d}</text>`; });
  s += lbl(20, 126, "AFTER A WIN: ROLL OUT GRADUALLY");
  [["5%", 30], ["50%", 120], ["100%", 210]].forEach(([t, w], i) => { const x = 40 + i * 190; s += `<rect x="${x}" y="${196 - w * .4 - 20}" width="120" height="${w * .4 + 20}" rx="6" style="fill:${A}" fill-opacity="${.2 + i * .25}"/><text x="${x + 60}" y="214" text-anchor="middle" class="mono" font-size="14" font-weight="700">${t}</text>`; if (i < 2) s += arrow(x + 126, 170, x + 184, 170, A); });
  s += `<text x="20" y="246" font-size="12.5">Watch guardrails at each step, ready to roll back.</text>`;
  s += rect(20, 262, 605, 52, P, .08) + `<text x="34" y="284" font-size="12.5"><tspan font-weight="700" style="fill:${P}">Holdout:</tspan> keep a small group on the old coach for months,</text><text x="34" y="302" font-size="12.5">to measure the long-term effect after the novelty wears off.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Split", title: "1 · How an A/B test works", q: "How do we know the model, not luck, made the difference?",
    points: ["Randomly split users into two groups.", "<b>A, control</b>: the current coach. <b>B, treatment</b>: the new model.", "Random means the groups are alike in every other way.", "Split by user, so each person has one consistent experience."],
    pm: "Offline scores say the model matches past labels. Only a live test says it improves the product. Plan the A/B test as part of the launch, not after.",
    say: "Step one, how an A B test works. We randomly split users into two groups. Group A, the control, keeps the current coach. Group B, the treatment, gets the new model. Because the split is random, the groups are alike in every other way. So if outcomes differ, the model caused it. And we split by user, so each person gets one consistent coach.",
    draw: drawSplit },
  { stage: "Metrics", title: "2 · Choosing metrics", q: "What should we measure?",
    points: ["One <b>primary metric</b>, chosen before the test.", "Here: candidates improving within 2 weeks, up 5 points.", "<b>Guardrails</b> must not get worse: completion, complaints, speed.", "Response time doubled, so it's not ready yet."],
    pm: "Write the primary metric and guardrails down before the test starts. Deciding afterwards invites cherry-picking.",
    say: "Step two, choosing metrics. Before the test, we pick one primary metric, the share of candidates whose answers improve within two weeks. The new model raises it from forty one to forty six percent. Then we check guardrails, things that must not get worse. Sessions finished, fine. Complaints, fine. But response time doubled. So the model helps, but it isn't ready yet.",
    draw: drawMetrics },
  { stage: "Patience", title: "3 · Patience and significance", q: "When can we trust the result?",
    points: ["Early results bounce around by chance.", "Pick “After 2 days”: B looks 14 points better, but the ranges overlap.", "Pick “After 2 weeks”: the real gain is 5 points, and it's solid.", "Decide sample size first. Don't stop early: that's <b>peeking</b>."],
    pm: "Never let a team stop a test early because the numbers look exciting. Early wins are often luck, and they shrink with more data.",
    say: "Step three, patience. After two days, with only a hundred and twenty users per group, the new model looks fourteen points better. Exciting. But look at the ranges. They're wide and they overlap, so it could easily be luck. Now pick after two weeks. With four thousand users each, the ranges are narrow. The real gain is about five points. Smaller, but real.",
    draw: drawSig },
  { stage: "Rollout", title: "4 · Pitfalls and rollout", q: "What can still go wrong, and how do we launch?",
    points: ["Traps: novelty effects, too many metrics, users influencing each other.", "After a win, roll out gradually: 5%, then 50%, then 100%.", "Watch guardrails at each step and be ready to roll back.", "A small long-term <b>holdout</b> measures lasting impact."],
    pm: "A gradual rollout with a rollback plan turns a risky launch into a series of small, safe steps.",
    say: "Step four, pitfalls and rollout. Watch for novelty effects, where people try something new and then lose interest. Don't check twenty metrics and celebrate the one that wins by luck. And remember users can influence each other. After a real win, roll out gradually, five percent, then fifty, then everyone, ready to roll back. A small holdout on the old coach measures the long term effect.",
    draw: drawRollout },
];
return { STEPS, picker: { label: "Check the test:", step: 2, items: () => TIMES.map(t => ({ label: t.label, color: t.c })), get: () => ti, set: i => { ti = i; } } };
})();
VMETA[28] = {"title": "Proving It Helps Real Users", "sub": "Split candidates between the old and new interview coach, choose a primary metric and guardrails, see why stopping early fools you, and roll out safely."};
