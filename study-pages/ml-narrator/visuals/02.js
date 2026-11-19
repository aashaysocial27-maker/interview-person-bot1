VISUALS[2] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const txt = (x, y, t, o = "") => `<text x="${x}" y="${y}" font-size="13" ${o}>${t}</text>`;
const box = (x, y, w, h, t, sub, col = "var(--line)", fo = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? col : "var(--surface)"};stroke:${col}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="1.5"/>`
  + `<text x="${x + w / 2}" y="${y + (sub ? h / 2 - 3 : h / 2 + 5)}" text-anchor="middle" font-size="13" font-weight="600">${t}</text>`
  + (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-size="11" class="muted">${sub}</text>` : "");

function drawSupervised() {
  let s = svg(310);
  s += lbl(20, 22, "EXAMPLES WITH ANSWERS (LABELS)");
  [["“I cut onboarding time 30%…”", "strong", A], ["“I'm a hard worker.”", "weak", W], ["“I led the launch and…”", "strong", A]].forEach(([q, l, c], i) => {
    const y = 34 + i * 40;
    s += `<rect x="20" y="${y}" width="250" height="32" rx="6" style="fill:var(--surface);stroke:var(--line)"/>` + txt(32, y + 21, q);
    s += `<rect x="278" y="${y}" width="70" height="32" rx="6" style="fill:${c};stroke:${c}" fill-opacity=".12"/><text x="313" y="${y + 21}" text-anchor="middle" class="mono" font-size="12" style="fill:${c}">${l}</text>`;
  });
  s += arrow(356, 90, 400, 90) + box(404, 62, 100, 56, "Model", "learns the link", A, .12);
  s += lbl(20, 182, "TWO KINDS OF OUTPUT");
  s += box(20, 194, 290, 92, "", "", B, .07) + `<text x="36" y="220" font-size="14" font-weight="700" style="fill:${B}">Classification</text>` + txt(36, 244, "Picks a category.") + txt(36, 266, "Strong or weak? Spam or not?", 'class="muted"');
  s += box(330, 194, 290, 92, "", "", P, .07) + `<text x="346" y="220" font-size="14" font-weight="700" style="fill:${P}">Regression</text>` + txt(346, 244, "Predicts a number.") + txt(346, 266, "Score 7.5 / 10? Hours to hire?", 'class="muted"');
  s += arrow(454, 120, 165, 190) + arrow(454, 120, 475, 190);
  return s + `</svg>`;
}

function drawUnsupervised() {
  let s = svg(320);
  const pts = [[0, [60, 80], 12], [1, [210, 210], 12], [2, [120, 230], 10]];
  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(7);
  const C = [B, P, G], NAMES = ["Rambling", "No result", "Too short"];
  s += lbl(20, 22, "10,000 UNRATED ANSWERS · NO LABELS");
  s += lbl(350, 22, "WHAT CLUSTERING FINDS");
  const centers = [[90, 100], [230, 140], [120, 240]];
  centers.forEach(([cx, cy], g) => {
    for (let k = 0; k < 14; k++) { const x = cx + (rnd() - .5) * 90, y = cy + (rnd() - .5) * 70; s += `<circle cx="${x}" cy="${y}" r="4" style="fill:var(--muted)" fill-opacity=".6"/>`; }
  });
  s += `<rect x="20" y="36" width="300" height="270" rx="8" style="fill:none;stroke:var(--line)"/>`;
  s += arrow(326, 170, 346, 170);
  centers.forEach(([cx, cy], g) => {
    const ox = 350 + cx * .8, oy = 40 + (cy - 40) * .85;
    s += `<ellipse cx="${ox}" cy="${oy}" rx="44" ry="34" style="fill:${C[g]};stroke:${C[g]}" fill-opacity=".12" stroke-width="1.5"/>`;
    s += `<text x="${ox}" y="${oy + 4}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${C[g]}">${NAMES[g]}</text>`;
  });
  s += `<text x="350" y="296" font-size="12" class="muted">Groups nobody named in advance.</text>`;
  return s + `</svg>`;
}

function drawRL() {
  let s = svg(310);
  s += box(40, 110, 160, 70, "Agent", "the coach", A, .12);
  s += box(440, 110, 160, 70, "Environment", "the candidate", B, .1);
  s += `<path d="M200 128 C 300 60, 340 60, 440 128" fill="none" style="stroke:var(--muted)" stroke-width="1.5" marker-end="url(#ah)"/>`;
  s += `<text x="320" y="70" text-anchor="middle" font-size="13" font-weight="600">Action</text><text x="320" y="88" text-anchor="middle" font-size="11" class="muted">ask a harder “tell me about a failure” question</text>`;
  s += `<path d="M440 165 C 340 235, 300 235, 200 165" fill="none" style="stroke:var(--accent)" stroke-width="1.5" marker-end="url(#ah)"/>`;
  s += `<text x="320" y="214" text-anchor="middle" font-size="13" font-weight="600" style="fill:${A}">Reward  +1</text><text x="320" y="232" text-anchor="middle" font-size="11" class="muted">the candidate's next answer got better</text>`;
  s += `<rect x="40" y="258" width="560" height="38" rx="8" style="fill:var(--surface);stroke:var(--line)"/>`;
  s += `<text x="320" y="282" text-anchor="middle" font-size="12">Repeat thousands of times → a <tspan font-weight="700">policy</tspan>: which action to take in each situation</text>`;
  return s + `</svg>`;
}

function drawSelf() {
  let s = svg(300);
  s += lbl(20, 22, "RAW TEXT · NO HUMAN LABELS NEEDED");
  const words = ["I", "cut", "onboarding", "time", "by", "30%"];
  let x = 20;
  words.forEach((w, i) => {
    const wd = w.length * 9 + 22, hide = i === 2;
    s += `<rect x="${x}" y="36" width="${wd}" height="34" rx="6" style="fill:${hide ? "var(--warm)" : "var(--surface)"};stroke:${hide ? "var(--warm)" : "var(--line)"}" fill-opacity="${hide ? .15 : 1}" ${hide ? 'stroke-dasharray="4 3"' : ""}/>`;
    s += `<text x="${x + wd / 2}" y="58" text-anchor="middle" class="mono" font-size="13" style="fill:${hide ? "var(--warm)" : "var(--ink)"}">${hide ? "?" : w}</text>`;
    x += wd + 8;
  });
  s += `<text x="20" y="96" font-size="12" class="muted">Hide one word. The hidden word becomes the answer to predict.</text>`;
  s += arrow(200, 108, 200, 140) + box(110, 144, 180, 52, "Model guesses", "“onboarding” ✓", A, .12);
  s += box(370, 144, 250, 52, "Free labels, endless data", "the whole internet becomes practice", B, .08);
  s += lbl(20, 232, "THIS IS HOW LLMS START");
  s += `<rect x="20" y="242" width="600" height="44" rx="8" style="fill:var(--surface);stroke:var(--line)"/>`;
  s += `<text x="320" y="269" text-anchor="middle" font-size="12">Self-supervised pretraining  →  supervised fine-tuning  →  reinforcement learning</text>`;
  return s + `</svg>`;
}

function drawChoose() {
  let s = svg(330);
  const q = (x, y, t) => `<rect x="${x}" y="${y}" width="250" height="40" rx="20" style="fill:var(--bg);stroke:var(--ink)" stroke-width="1.2"/><text x="${x + 125}" y="${y + 25}" text-anchor="middle" font-size="13" font-weight="600">${t}</text>`;
  const ans = (x, y, t, sub, c) => box(x, y, 200, 48, t, sub, c, .14);
  s += q(20, 20, "Do you have labeled examples?") + `<text x="280" y="45" font-size="12" font-weight="600" style="fill:${A}">yes →</text>` + ans(330, 16, "Supervised", "predict a label or number", A);
  s += arrow(145, 62, 145, 92) + `<text x="152" y="82" font-size="11" class="muted">no</text>`;
  s += q(20, 94, "Learning from actions and results?") + `<text x="280" y="119" font-size="12" font-weight="600" style="fill:${A}">yes →</text>` + ans(330, 90, "Reinforcement", "trial, error, reward", P);
  s += arrow(145, 136, 145, 166) + `<text x="152" y="156" font-size="11" class="muted">no</text>`;
  s += q(20, 168, "Huge amounts of raw text or images?") + `<text x="280" y="193" font-size="12" font-weight="600" style="fill:${A}">yes →</text>` + ans(330, 164, "Self-supervised", "or reuse a pretrained model", B);
  s += arrow(145, 210, 145, 240) + `<text x="152" y="230" font-size="11" class="muted">no</text>`;
  s += q(20, 242, "Want to explore and find groups?") + `<text x="280" y="267" font-size="12" font-weight="600" style="fill:${A}">yes →</text>` + ans(330, 238, "Unsupervised", "then label what you find", G);
  s += `<text x="20" y="314" font-size="12" class="muted">A simplified guide. Real products often combine several types.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Supervised", title: "1 · Supervised learning", q: "What if every example comes with the right answer?",
    points: ["Each example has a <b>label</b>, the right answer, like an answer key.", "<b>Classification</b> picks a category: strong or weak.", "<b>Regression</b> predicts a number: a score of 7.5 out of 10.", "Most machine learning in real products is supervised."],
    pm: "Supervised learning is usually the fastest path to a working feature, but only if you have labels. No labels means a labeling budget.",
    say: "Step one, supervised learning. Every example comes with the right answer, called a label. It's like studying with an answer key. There are two kinds of output. Classification picks a category, like strong or weak. Regression predicts a number, like a score of seven point five out of ten. Most machine learning in real products works this way.",
    draw: drawSupervised },
  { stage: "Unsupervised", title: "2 · Unsupervised learning", q: "What can a model learn with no answers at all?",
    points: ["No labels. The model looks for <b>structure</b> on its own.", "<b>Clustering</b> groups similar items together.", "From 10,000 unrated answers, it might find rambling answers, answers with no result, and answers that are too short.", "Nobody named those groups in advance."],
    pm: "Use it to explore data you don't understand yet. The groups it finds often become the categories you later label, or new product features, such as targeted tips.",
    say: "Step two, unsupervised learning. Here there are no labels at all. The model looks for structure on its own, usually by grouping similar things. That's called clustering. Give it ten thousand unrated answers, and it might find three groups. Rambling answers, answers with no result, and answers that are far too short. Nobody told it those groups existed. For a PM, it's a great way to explore data before you spend money on labels.",
    draw: drawUnsupervised },
  { stage: "Reinforcement", title: "3 · Reinforcement learning", q: "Can a model learn by trial and error?",
    points: ["An <b>agent</b> takes an <b>action</b> in an <b>environment</b>.", "It gets a <b>reward</b> or a penalty, depending on what happens.", "Over thousands of tries, it learns a <b>policy</b>: the best action in each situation.", "The coach could learn which practice question to ask next."],
    pm: "The reward is the real spec. Reward the wrong thing, like session length, and the model learns to keep people busy instead of helping them improve.",
    say: "Step three, reinforcement learning. This is learning by trial and error. An agent, here our coach, takes an action, like asking a harder question. The environment, the candidate, responds. If the next answer improves, the coach gets a reward. Over thousands of tries, it learns a policy, the best action for each situation. For a PM, be careful what you reward. The model will chase exactly that.",
    draw: drawRL },
  { stage: "Self-supervised", title: "4 · Self-supervised learning", q: "How do models learn from data nobody labeled?",
    points: ["Hide part of the data, and that hidden part becomes the label.", "No human labeling, so it can use huge amounts of text, images or audio.", "This is how large language models are pretrained.", "They are then refined with supervised and reinforcement learning."],
    pm: "You rarely train these yourself. Instead you reuse a pretrained model, which is why small teams can now build features that once needed huge labeled datasets.",
    say: "Step four, self-supervised learning. Here the data labels itself. Hide one word in a sentence, and the hidden word becomes the answer to predict. No human has to label anything, so the model can learn from enormous amounts of text. This is exactly how large language models start. Then they're refined with supervised learning and reinforcement learning, which you met in your AI course.",
    draw: drawSelf },
  { stage: "Which one?", title: "5 · Choosing the type", q: "Which type fits my problem?",
    points: ["Start with the data you have, not the method you like.", "Labels → supervised. Actions and outcomes → reinforcement.", "Huge raw data → self-supervised, or reuse a pretrained model.", "Want to explore → unsupervised, then label what you find."],
    pm: "In a kickoff, ask “what data do we have, and does it have answers?” The answer usually picks the learning type for you.",
    say: "Step five, choosing the type. Start with the data you have, not the method that sounds exciting. If you have labeled examples, use supervised learning. If the product makes decisions and you can measure the results, consider reinforcement learning. If you have huge amounts of raw data, use self-supervised learning, or simply reuse a pretrained model. And if you just want to explore, start with unsupervised learning, then label what you find.",
    draw: drawChoose },
];
return { STEPS };
})();
VMETA[2] = {"title": "Four Ways a Model Learns", "sub": "Supervised, unsupervised, reinforcement and self-supervised learning, each shown with the interview coach. Then a simple guide to pick the right one."};
