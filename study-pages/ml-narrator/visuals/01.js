VISUALS[1] = (() => {
const STRONG = "var(--accent)", WEAK = "var(--t3)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svgOpen = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", dash = false) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" ${dash ? 'stroke-dasharray="5 4"' : ""} marker-end="url(#ah)"/>`;
const lbl = (x, y, t, anchor = "start") => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const box = (x, y, w, h, t, sub, col = "var(--line)", fo = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? col : "var(--surface)"};stroke:${col}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.5"/>`
  + `<text x="${x + w / 2}" y="${y + (sub ? h / 2 - 3 : h / 2 + 5)}" text-anchor="middle" font-size="13" font-weight="600">${t}</text>`
  + (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-size="11" class="muted">${sub}</text>` : "");
const mark = (x, y, ok) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="15" font-weight="700" style="fill:${ok ? STRONG : WEAK}">${ok ? "✓" : "✗"}</text>`;

/* rated examples (illustrative): specific and structured are 0–10 scores */
const TRAIN = [
  { k: "A", s: 8, t: 9, y: 1 }, { k: "B", s: 2, t: 3, y: 0 }, { k: "C", s: 7, t: 4, y: 1 }, { k: "D", s: 3, t: 8, y: 0 }, { k: "E", s: 9, t: 6, y: 1 },
  { k: "", s: 6, t: 8, y: 1 }, { k: "", s: 8, t: 3, y: 1 }, { k: "", s: 4, t: 2, y: 0 }, { k: "", s: 1, t: 6, y: 0 }, { k: "", s: 5, t: 4, y: 0 },
];
const W_S = 0.6, W_T = 0.4, CUT = 5.5;
const score = (s, t) => W_S * s + W_T * t;
const pStrong = (s, t) => 1 / (1 + Math.exp(-1.5 * (score(s, t) - CUT)));
const NEW = [
  { label: "Answer X", s: 8, t: 7, c: "var(--t2)", text: "“I cut onboarding time 30% by rewriting the checklist with new hires.”" },
  { label: "Answer Y", s: 3, t: 4, c: "var(--t4)", text: "“I'm a hard worker and I always give 110%.”" },
  { label: "Answer Z", s: 5, t: 6, c: "var(--warm)", text: "“I led a redesign. It went well and the team liked it.”" },
];
let pick = 0;

function drawRules() {
  let s = svgOpen(330);
  s += box(20, 20, 210, 58, "IF answer has a number", "→ call it strong", "var(--t1)", .12);
  s += lbl(20, 14, "RULE A PERSON WROTE");
  s += arrow(232, 49, 288, 49);
  s += box(290, 26, 110, 46, "Program", "");
  s += arrow(402, 49, 458, 49);
  s += box(460, 26, 160, 46, "strong / weak", "");
  const rows = [
    ["“I cut onboarding time 30%…”", "strong", "strong", true],
    ["“I noticed new hires were lost, so I…”", "weak", "strong", false],
    ["“I worked on 3 projects in 2022.”", "strong", "weak", false],
  ];
  s += lbl(20, 118, "TEST IT ON REAL ANSWERS");
  s += lbl(390, 118, "RULE SAYS", "middle") + lbl(480, 118, "COACH SAYS", "middle") + lbl(570, 118, "RIGHT?", "middle");
  rows.forEach((r, i) => {
    const y = 130 + i * 52;
    s += `<rect x="20" y="${y}" width="600" height="44" rx="6" style="fill:var(--surface);stroke:var(--line)"/>`;
    s += `<text x="34" y="${y + 27}" font-size="13">${r[0]}</text>`;
    s += `<text x="390" y="${y + 27}" text-anchor="middle" class="mono" font-size="13" style="fill:${r[1] === "strong" ? STRONG : WEAK}">${r[1]}</text>`;
    s += `<text x="480" y="${y + 27}" text-anchor="middle" class="mono" font-size="13" style="fill:${r[2] === "strong" ? STRONG : WEAK}">${r[2]}</text>`;
    s += mark(570, y + 28, r[3]);
  });
  s += `<text x="20" y="312" font-size="12" class="muted">Each new rule fixes one case and breaks another. Real answers are too varied for hand-written rules.</text>`;
  return s + `</svg>`;
}

function drawExamples() {
  let s = svgOpen(330);
  s += lbl(20, 22, "RATED EXAMPLES · WHAT THE MODEL LEARNS FROM");
  const cols = [[34, "ANSWER", "start"], [150, "SPECIFIC", "middle"], [240, "STRUCTURED", "middle"], [335, "COACH SAID", "middle"]];
  s += `<rect x="20" y="34" width="370" height="30" rx="6" style="fill:var(--bg);stroke:var(--line)"/>`;
  cols.forEach(([x, t, a]) => { s += `<text x="${x}" y="54" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`; });
  TRAIN.slice(0, 5).forEach((r, i) => {
    const y = 66 + i * 36;
    s += `<rect x="20" y="${y}" width="370" height="32" rx="6" style="fill:var(--surface);stroke:var(--line)"/>`;
    s += `<text x="34" y="${y + 21}" class="mono" font-size="13">Answer ${r.k}</text>`;
    s += `<text x="150" y="${y + 21}" text-anchor="middle" class="mono" font-size="13">${r.s}</text>`;
    s += `<text x="240" y="${y + 21}" text-anchor="middle" class="mono" font-size="13">${r.t}</text>`;
    s += `<text x="335" y="${y + 21}" text-anchor="middle" class="mono" font-size="13" font-weight="600" style="fill:${r.y ? STRONG : WEAK}">${r.y ? "strong" : "weak"}</text>`;
  });
  s += `<text x="205" y="268" text-anchor="middle" font-size="12" class="muted">… about 1,000 answers rated by real coaches</text>`;
  s += `<text x="150" y="292" text-anchor="middle" font-size="11" style="fill:var(--t2)">features (inputs)</text>`;
  s += `<path d="M110 280 H 285" style="stroke:var(--t2)" stroke-width="1.5" fill="none"/>`;
  s += `<text x="335" y="292" text-anchor="middle" font-size="11" style="fill:var(--accent)">label (right answer)</text>`;
  s += arrow(398, 160, 452, 160);
  s += `<text x="425" y="150" text-anchor="middle" class="mono muted" font-size="11">train</text>`;
  s += box(456, 116, 164, 88, "Model", "finds the pattern", STRONG, .12);
  s += `<text x="538" y="232" text-anchor="middle" font-size="12" class="muted">No rules written by hand.</text>`;
  s += `<text x="538" y="250" text-anchor="middle" font-size="12" class="muted">The examples are the spec.</text>`;
  return s + `</svg>`;
}

function drawModel() {
  const X = v => 60 + v * 26, Y = v => 300 - v * 26;
  let s = svgOpen(372);
  // axes + grid
  for (let v = 0; v <= 10; v += 2) {
    s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(10)}" style="stroke:var(--line)" stroke-width="1"/>`;
    s += `<line x1="${X(0)}" y1="${Y(v)}" x2="${X(10)}" y2="${Y(v)}" style="stroke:var(--line)" stroke-width="1"/>`;
    s += `<text x="${X(v)}" y="${Y(0) + 16}" text-anchor="middle" class="mono muted" font-size="10">${v}</text>`;
    s += `<text x="${X(0) - 8}" y="${Y(v) + 4}" text-anchor="end" class="mono muted" font-size="10">${v}</text>`;
  }
  s += `<text x="${X(5)}" y="${Y(0) + 34}" text-anchor="middle" font-size="12" class="muted">How specific →</text>`;
  s += `<text x="18" y="${Y(5)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 18 ${Y(5)})">How structured →</text>`;
  // learned boundary: 0.6·s + 0.4·t = 5.5  → from (2.5,10) to (9.17,0)
  s += `<line x1="${X(2.5)}" y1="${Y(10)}" x2="${X(CUT / W_S)}" y2="${Y(0)}" style="stroke:var(--ink)" stroke-width="1.5" stroke-dasharray="6 4"/>`;
  s += `<text x="${X(7.6)}" y="${Y(9.3)}" font-size="11" font-weight="600" style="fill:${STRONG}">strong side</text>`;
  s += `<text x="${X(0.4)}" y="${Y(0.6)}" font-size="11" font-weight="600" style="fill:${WEAK}">weak side</text>`;
  TRAIN.forEach(p => {
    s += p.y ? `<circle cx="${X(p.s)}" cy="${Y(p.t)}" r="6" style="fill:${STRONG}" fill-opacity=".85"/>`
             : `<rect x="${X(p.s) - 5}" y="${Y(p.t) - 5}" width="10" height="10" style="fill:${WEAK}" fill-opacity=".85"/>`;
  });
  const n = NEW[pick], p = pStrong(n.s, n.t), isStrong = p >= .5, conf = Math.round((isStrong ? p : 1 - p) * 100);
  s += `<circle cx="${X(n.s)}" cy="${Y(n.t)}" r="11" style="fill:none;stroke:${n.c}" stroke-width="2.5"/>`;
  s += `<text x="${X(n.s) + 14}" y="${Y(n.t) - 10}" font-size="12" font-weight="700" style="fill:${n.c}">${n.label}</text>`;
  s += `<text x="20" y="364" font-size="12"><tspan font-weight="700" style="fill:${n.c}">${n.label}:</tspan> ${n.text}</text>`;
  // the function, on the right
  const fx = 370;
  s += lbl(fx, 30, "THE MODEL IS A FUNCTION");
  s += box(fx, 42, 250, 54, `specific ${n.s} · structured ${n.t}`, "features go in", n.c, .1);
  s += arrow(fx + 125, 98, fx + 125, 118);
  s += `<rect x="${fx}" y="120" width="250" height="70" rx="8" style="fill:var(--surface);stroke:var(--ink)" stroke-width="1.5"/>`;
  s += `<text x="${fx + 125}" y="146" text-anchor="middle" class="mono" font-size="12">0.6 × specific</text>`;
  s += `<text x="${fx + 125}" y="164" text-anchor="middle" class="mono" font-size="12">+ 0.4 × structured</text>`;
  s += `<text x="${fx + 125}" y="182" text-anchor="middle" font-size="11" class="muted">0.6 and 0.4 are learned parameters</text>`;
  s += arrow(fx + 125, 192, fx + 125, 212);
  s += box(fx, 214, 250, 54, `${isStrong ? "Strong" : "Weak"} · ${conf}% sure`, conf < 65 ? "a close call, so show it with care" : "prediction comes out", isStrong ? STRONG : WEAK, .14);
  s += `<text x="${fx}" y="300" font-size="11" class="muted">● strong   ■ weak  (training examples)</text>`;
  s += `<text x="${fx}" y="318" font-size="11" class="muted">Dashed line: the boundary training found.</text>`;
  s += `<text x="${fx}" y="336" font-size="11" class="muted">Scores and weights are illustrative.</text>`;
  return s + `</svg>`;
}

function drawPhases() {
  let s = svgOpen(340);
  s += `<rect x="10" y="10" width="620" height="140" rx="10" style="fill:var(--t1)" fill-opacity=".07"/>`;
  s += lbl(24, 32, "TRAINING · SLOW · ONCE IN A WHILE");
  s += box(24, 50, 150, 64, "1,000 rated", "answers", "var(--t1)");
  s += arrow(176, 82, 226, 82);
  s += box(230, 50, 190, 64, "guess → check → adjust", "repeat thousands of times", "var(--t1)");
  s += `<path d="M300 116 q 25 26 50 0" fill="none" style="stroke:var(--muted)" stroke-width="1.3" marker-end="url(#ah)"/>`;
  s += arrow(422, 82, 472, 82);
  s += box(476, 50, 140, 64, "Trained model", "parameters fixed", STRONG, .14);
  s += `<rect x="10" y="180" width="620" height="140" rx="10" style="fill:var(--accent)" fill-opacity=".07"/>`;
  s += lbl(24, 202, "INFERENCE · FAST · EVERY TIME A USER ASKS");
  s += box(24, 222, 190, 64, "New answer", "never seen before", "var(--t2)");
  s += arrow(216, 254, 266, 254);
  s += box(270, 222, 150, 64, "Trained model", "same one", STRONG, .14);
  s += arrow(422, 254, 472, 254);
  s += box(476, 222, 140, 64, "Strong · 92%", "in milliseconds", STRONG);
  s += arrow(546, 116, 346, 218, "var(--accent)", true);
  s += `<text x="470" y="168" font-size="11" style="fill:var(--accent)">ship it</text>`;
  s += `<text x="24" y="310" font-size="11" class="muted">When users or the world change, go back to training with fresh examples (retraining).</text>`;
  return s + `</svg>`;
}

function drawWhen() {
  let s = svgOpen(330);
  const col = (x, head, c, items, ok) => {
    let o = `<rect x="${x}" y="16" width="295" height="214" rx="10" style="fill:${c};stroke:${c}" fill-opacity=".07" stroke-width="1.5"/>`;
    o += `<text x="${x + 16}" y="44" font-size="15" font-weight="700" style="fill:${c}">${head}</text>`;
    items.forEach((t, i) => { o += `<text x="${x + 18}" y="${78 + i * 36}" font-size="15" font-weight="700" style="fill:${c}">${ok ? "✓" : "→"}</text><text x="${x + 40}" y="${78 + i * 36}" font-size="13">${t}</text>`; });
    return o;
  };
  s += col(15, "Use machine learning when…", STRONG, ["the pattern is too messy for rules", "you have lots of good examples", "some mistakes are acceptable", "the pattern keeps changing"], true);
  s += col(330, "Use a simple rule when…", "var(--t1)", ["a clear rule already works", "you have little or no data", "every mistake is unacceptable", "you must explain every decision"], false);
  s += lbl(15, 258, "INTERVIEW COACH");
  s += `<rect x="15" y="268" width="610" height="50" rx="8" style="fill:var(--surface);stroke:var(--line)"/>`;
  s += `<text x="30" y="290" font-size="13"><tspan font-weight="600" style="fill:${STRONG}">ML:</tspan> judging if an answer is strong.</text>`;
  s += `<text x="30" y="309" font-size="13"><tspan font-weight="600" style="fill:var(--t1)">Rule:</tspan> warning when an answer runs over 2 minutes.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  {
    stage: "Rules", title: "1 · Rules break", q: "Why not just write the rules by hand?",
    points: [
      "Normal software follows <b>rules a person writes</b>.",
      "Try one for the interview coach: <b>if the answer has a number, it's strong</b>.",
      "It gets the first answer right, but a strong answer with no numbers fails, and a vague one with numbers passes.",
      "Every fix adds another rule, and the rules start to fight each other.",
    ],
    pm: "When a team keeps adding special-case rules and quality still won't improve, that's a sign the problem may be a good fit for machine learning.",
    say: "Step one. Why not just write the rules? Normal software follows rules that a person writes. Let's try one for our interview coach. If the answer has a number, call it strong. It works for the first answer. But a strong answer with no numbers gets marked weak. And a vague answer with numbers gets marked strong. Every new rule fixes one case and breaks another. For a PM, a pile of special-case rules that still doesn't work is a sign that machine learning might fit.",
    draw: drawRules,
  },
  {
    stage: "Examples", title: "2 · Learn from examples", q: "What does the computer learn from instead?",
    points: [
      "Collect answers that real coaches have already rated <b>strong</b> or <b>weak</b>.",
      "Describe each answer with a few <b>features</b>, such as how specific and how structured it is.",
      "The rating is the <b>label</b>, the right answer the model should learn to give.",
      "Training finds the pattern that links features to labels. Nobody writes the rules.",
    ],
    pm: "The examples are the real product spec. If coaches rated answers inconsistently, the model learns that inconsistency. Spend time on the examples, not just the model.",
    say: "Step two. Learning from examples. Instead of writing rules, we collect answers that real coaches have already rated, strong or weak. Each answer is described by a few features, like how specific it is and how well structured it is. The coach's rating is the label, the right answer. Training looks at all these examples and finds the pattern by itself. For a PM, remember this. The examples are the real product spec. If the ratings are messy, the model will be messy too.",
    draw: drawExamples,
  },
  {
    stage: "Model", title: "3 · The model is a function", q: "What exactly did the computer learn?",
    points: [
      "Each training answer is a dot. Strong answers sit top right, weak ones bottom left.",
      "Training found a <b>boundary line</b> that separates them as well as possible.",
      "Inside the model are <b>parameters</b>, here 0.6 and 0.4, saying how much each feature counts.",
      "Pick a new answer above the diagram. The model places it and gives a prediction with a confidence.",
    ],
    pm: "Every prediction comes with a confidence. Decide what the product does with low-confidence cases: show them softly, ask a human, or say nothing.",
    say: "Step three. The model is a function. Each training answer is a dot on this chart. Strong answers sit toward the top right, and weak ones toward the bottom left. Training found the dashed line that best separates them. The model's parameters, here zero point six and zero point four, say how much each feature counts. Now pick a new answer. The model places it on the chart and predicts strong or weak, with a confidence. For a PM, decide early what the product should do when the model is unsure.",
    draw: drawModel,
  },
  {
    stage: "Train vs use", title: "4 · Training and inference", q: "When does the learning happen?",
    points: [
      "<b>Training</b>: the model guesses, checks against the labels and adjusts, thousands of times. Slow, done once in a while.",
      "<b>Inference</b>: the trained model predicts on a brand-new answer. Fast and cheap, done on every request.",
      "The model does not learn while users use it. It only changes when you retrain it.",
    ],
    pm: "Training is a project cost; inference is a running cost per user. And since the model only knows the past, plan when and how you'll retrain it.",
    say: "Step four. Training and inference. A model's life has two phases. In training, the model guesses, checks its guess against the label, and adjusts, thousands of times. That is slow, and you do it once in a while. In inference, the trained model makes a prediction on a new answer it has never seen. That is fast and cheap, and it happens every time a user asks. Here's the key point. The model does not learn while people use it. It only improves when you retrain it.",
    draw: drawPhases,
  },
  {
    stage: "When to use", title: "5 · When to use ML", q: "Is machine learning the right tool for this problem?",
    points: [
      "Use ML when the pattern is messy, you have good examples, some errors are fine, and the pattern changes.",
      "Use a rule when a simple rule works, data is thin, or every decision must be exact and explainable.",
      "Many products use both: ML for judgment calls, rules for hard limits.",
    ],
    pm: "Google's first rule of ML: don't be afraid to launch without it. Start with a simple rule, collect data, then bring in ML when the rule hits its limits.",
    say: "Step five. When should you use machine learning? Use it when the pattern is too messy for rules, when you have plenty of good examples, when some mistakes are acceptable, and when the pattern keeps changing. Use a simple rule when it already works, when you have little data, or when every decision must be exact. Most products mix both. Our coach uses machine learning to judge answer quality, and a simple rule to warn when an answer runs too long. Remember, it's fine to launch with a rule first, and add machine learning later.",
    draw: drawWhen,
  },
];

return { STEPS, picker: { label: "Pick a new answer:", step: 2, items: () => NEW.map(n => ({ label: n.label, color: n.c })), get: () => pick, set: i => { pick = i; } } };
})();
VMETA[1] = {"title": "From Rules to Learning", "sub": "Follow the interview coach as it stops relying on hand-written rules and learns from rated answers instead, in five steps."};
