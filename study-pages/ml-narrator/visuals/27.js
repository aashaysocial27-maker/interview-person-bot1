VISUALS[27] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawSources() {
  let s = svg(330);
  const st = [["Past decisions", "Historical bias", "labels copy past unfair ratings", W], ["Data collection", "Coverage bias", "few non-native speakers in data", G], ["Labelling", "Labelling bias", "raters mark down unfamiliar accents", P], ["Features", "Proxy features", "university name stands in for background", B]];
  st.forEach(([stage, t, d, c], i) => {
    const x = 20 + i * 155;
    s += rect(x, 30, 140, 40, "var(--line)") + `<text x="${x + 70}" y="55" text-anchor="middle" font-size="12" font-weight="700">${stage}</text>`;
    if (i < 3) s += arrow(x + 142, 50, x + 153, 50);
    s += `<line x1="${x + 70}" y1="72" x2="${x + 70}" y2="96" style="stroke:${c}" stroke-width="2" stroke-dasharray="3 3"/>`;
    s += rect(x, 98, 140, 110, c, .1) + `<text x="${x + 12}" y="122" font-size="12.5" font-weight="700" style="fill:${c}">${t}</text>`;
    const words = d.split(" "); let line = "", ly = 146;
    words.forEach(w => { if ((line + " " + w).length > 19) { s += `<text x="${x + 12}" y="${ly}" font-size="11.5">${line}</text>`; ly += 17; line = w; } else line = line ? line + " " + w : w; });
    s += `<text x="${x + 12}" y="${ly}" font-size="11.5">${line}</text>`;
  });
  s += rect(20, 228, 605, 80, W, .06) + `<text x="34" y="252" font-size="13" font-weight="700" style="fill:${W}">Bias can enter at every step</text><text x="34" y="274" font-size="12.5">You can harm a group without using a sensitive attribute: other features stand in for it.</text><text x="34" y="294" font-size="12.5">In hiring, unfair treatment can also be illegal.</text>`;
  return s + `</svg>`;
}

const VIEWS = [{ label: "Overall", c: "var(--accent)" }, { label: "By group", c: "var(--t3)" }];
let vi = 0;
function drawGroups() {
  let s = svg(320);
  s += lbl(20, 22, "RECALL: SHARE OF TRULY STRONG ANSWERS THE COACH RECOGNISES");
  const bar = (y, t, v, c, n) => `<text x="20" y="${y + 20}" font-size="13" font-weight="700">${t}</text><text x="20" y="${y + 38}" font-size="11" class="muted">${n}</text><rect x="200" y="${y + 6}" width="380" height="28" rx="4" style="fill:var(--line)"/><rect x="200" y="${y + 6}" width="${v * 3.8}" height="28" rx="4" style="fill:${c}" fill-opacity=".75"/><text x="${206 + v * 3.8}" y="${y + 26}" class="mono" font-size="13" font-weight="700">${v}%</text>`;
  if (vi === 0) {
    s += bar(50, "All candidates", 83, A, "2,000 test answers");
    s += rect(20, 140, 605, 56, A, .08) + `<text x="34" y="164" font-size="13">Looks good. Ship it?</text><text x="34" y="184" font-size="12" class="muted">Pick “By group” above.</text>`;
  } else {
    s += bar(40, "Native speakers", 88, A, "1,600 answers");
    s += bar(96, "Non-native speakers", 64, W, "400 answers");
    s += rect(20, 160, 605, 70, W, .1) + `<text x="34" y="184" font-size="13" font-weight="700" style="fill:${W}">A 24-point gap, hidden by the overall 83%</text><text x="34" y="206" font-size="12.5">More than 1 in 3 strong answers from non-native speakers are told they're weak.</text>`;
  }
  s += `<text x="20" y="262" font-size="12.5">Breaking results down by group is called <tspan font-weight="700">disaggregated evaluation</tspan>.</text><text x="20" y="282" font-size="12.5">It's the first step of every fairness check.</text>`;
  s += `<text x="20" y="306" font-size="11" class="muted">Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

function drawDefs() {
  let s = svg(330);
  const col = (x, title, q, rows, c) => {
    let o = rect(x, 14, 295, 210, c, .06) + `<text x="${x + 14}" y="40" font-size="14" font-weight="700" style="fill:${c}">${title}</text><text x="${x + 14}" y="62" font-size="12">${q}</text>`;
    rows.forEach(([g, v, ok], i) => { const y = 84 + i * 56; o += `<text x="${x + 14}" y="${y + 16}" font-size="12">${g}</text><rect x="${x + 14}" y="${y + 24}" width="200" height="18" rx="3" style="fill:var(--line)"/><rect x="${x + 14}" y="${y + 24}" width="${v * 2}" height="18" rx="3" style="fill:${c}" fill-opacity=".7"/><text x="${x + 222}" y="${y + 38}" class="mono" font-size="12" font-weight="700">${v}%</text>`; });
    return o;
  };
  s += col(15, "Demographic parity", "Same share rated strong in each group?", [["Native: rated strong", 46], ["Non-native: rated strong", 31]], B);
  s += col(330, "Equal opportunity", "Same recall for truly strong answers?", [["Native: strong recognised", 88], ["Non-native: strong recognised", 64]], P);
  s += `<text x="30" y="210" font-size="12" font-weight="700" style="fill:${W}">✗ gap of 15 points</text><text x="345" y="210" font-size="12" font-weight="700" style="fill:${W}">✗ gap of 24 points</text>`;
  s += rect(15, 238, 610, 76, G, .08) + `<text x="30" y="262" font-size="13" font-weight="700" style="fill:${G}">You usually can't satisfy every definition at once</text><text x="30" y="284" font-size="12.5">Choosing one is a values decision. Make it with legal, policy and affected users in the room,</text><text x="30" y="302" font-size="12.5">not left to the model team alone. Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

function drawFix() {
  let s = svg(330);
  const steps = [["Data", "more examples from under-represented groups", A], ["Labels", "retrain raters with a clear guide", A], ["Features", "remove or test proxy features", B], ["Training", "reweight examples by group", B], ["Decisions", "human review and an appeal path", P], ["After launch", "audit and monitor results by group", G]];
  steps.forEach(([t, d, c], i) => { const x = 20 + (i % 2) * 305, y = 14 + Math.floor(i / 2) * 66; s += rect(x, y, 295, 56, c, .08) + `<text x="${x + 14}" y="${y + 23}" font-size="13" font-weight="700" style="fill:${c}">${i + 1}. ${t}</text><text x="${x + 14}" y="${y + 43}" font-size="12">${d}</text>`; });
  s += rect(20, 222, 600, 92, "var(--line)") + `<text x="34" y="246" font-size="13" font-weight="700">For the coach</text><text x="34" y="268" font-size="12.5">Collect 1,000 more rated answers from non-native speakers. Train raters to judge content, not accent.</text><text x="34" y="288" font-size="12.5">Re-check recall by group before launch. Let candidates ask a human coach to review a rating.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Sources", title: "1 · Where bias comes from", q: "How does unfairness get into a model?",
    points: ["<b>Historical bias</b>: past unfair decisions become labels.", "<b>Coverage bias</b>: some groups barely appear in the data.", "<b>Labelling bias</b>: raters judge style, like accent, not content.", "<b>Proxy features</b>: university name or postcode stand in for background."],
    pm: "Not using a sensitive attribute doesn't make a model fair. Ask which features could act as proxies, and check them.",
    say: "Step one, where bias comes from. It can enter at every step. Past decisions may have been unfair, so the labels copy that. Data collection may barely include some groups, like non native speakers. Raters may mark down an unfamiliar accent. And features like university name can stand in for someone's background, even if you never use background directly.",
    draw: drawSources },
  { stage: "By group", title: "2 · Measure by group", q: "Does the coach work equally well for everyone?",
    points: ["Overall, the coach recognises 83% of strong answers.", "Pick “By group” above to split the result.", "Native speakers: 88%. Non-native speakers: 64%.", "This is <b>disaggregated evaluation</b>, the first fairness check."],
    pm: "Make results-by-group a standard part of every evaluation review. An overall number can hide a group the model is failing.",
    say: "Step two, measure by group. Overall, the coach recognises eighty three percent of truly strong answers. That looks good. Now pick by group. For native speakers, it's eighty eight percent. But for non native speakers, only sixty four. More than one in three strong answers from non native speakers are being told they're weak. The overall number hid that completely.",
    draw: drawGroups },
  { stage: "Definitions", title: "3 · What does fair mean?", q: "Which definition of fairness should we use?",
    points: ["<b>Demographic parity</b>: each group rated strong at the same rate.", "<b>Equal opportunity</b>: truly strong answers recognised at the same rate.", "The coach fails both here, by 15 and 24 points.", "You usually can't satisfy every definition at once."],
    pm: "Choosing the fairness definition is a values decision. Bring legal, policy and affected users into it, and write the choice down.",
    say: "Step three, what does fair mean? Demographic parity asks whether each group is rated strong at the same rate. Equal opportunity asks whether truly strong answers are recognised at the same rate in each group. Our coach fails both. Usually, you can't satisfy every definition at once, so choosing one is a values decision, made with legal, policy and affected users in the room.",
    draw: drawDefs },
  { stage: "Fixes", title: "4 · Fixing it", q: "How do we close the gap?",
    points: ["Better data and better rater guidance first.", "Remove or test proxy features; reweight examples.", "Human review and an appeal path for decisions.", "Audit before launch and monitor by group after."],
    pm: "Build an appeal path into the product. A user who's wrongly judged should always be able to reach a human.",
    say: "Step four, fixing it. Start with the data. Collect more answers from under represented groups, and retrain raters to judge content, not accent. Remove or test proxy features, and reweight examples. Add human review and a way to appeal. Then keep checking, with audits before launch and monitoring by group afterwards, because new gaps can appear over time.",
    draw: drawFix },
];
return { STEPS, picker: { label: "View:", step: 1, items: () => VIEWS.map(v => ({ label: v.label, color: v.c })), get: () => vi, set: i => { vi = i; } } };
})();
VMETA[27] = {"title": "Fair for Everyone?", "sub": "Find where bias creeps into the interview coach, split its results by group to uncover a hidden gap, compare two definitions of fair, and plan the fixes."};
