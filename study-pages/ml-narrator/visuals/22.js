VISUALS[22] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawPretrained() {
  let s = svg(320);
  s += rect(20, 40, 170, 120, G, .1) + `<text x="105" y="70" text-anchor="middle" font-size="13" font-weight="700" style="fill:${G}">Huge general data</text><text x="105" y="94" text-anchor="middle" font-size="12">millions of images,</text><text x="105" y="112" text-anchor="middle" font-size="12">much of the web's text</text><text x="105" y="140" text-anchor="middle" class="mono muted" font-size="11">weeks of GPUs</text>`;
  s += arrow(194, 100, 236, 100);
  const layers = ["grammar · edges", "phrases · shapes", "meaning · objects", "task head"];
  layers.forEach((t, i) => { const y = 40 + i * 30; s += rect(240, y, 170, 26, i === 3 ? "var(--muted)" : B, i === 3 ? .05 : .15) + `<text x="325" y="${y + 18}" text-anchor="middle" font-size="11.5">${t}</text>`; });
  s += `<text x="325" y="178" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:${B}">Pretrained model</text>`;
  s += arrow(414, 100, 456, 100);
  s += rect(460, 40, 160, 120, A, .1) + `<text x="540" y="70" text-anchor="middle" font-size="13" font-weight="700" style="fill:${A}">Your task</text><text x="540" y="94" text-anchor="middle" font-size="12">judge interview</text><text x="540" y="112" text-anchor="middle" font-size="12">answers</text><text x="540" y="140" text-anchor="middle" class="mono" font-size="11">a few hundred examples</text>`;
  s += rect(20, 204, 600, 92, "var(--line)") + `<text x="34" y="228" font-size="13" font-weight="700">The general skills transfer</text><text x="34" y="250" font-size="12.5">A model that learned to read general text already understands “I cut onboarding time by 30%”</text><text x="34" y="270" font-size="12.5">before it sees a single rated interview answer. You only teach it the last step.</text>`;
  return s + `</svg>`;
}

const WAYS = [
  { label: "Use as-is", c: "var(--t2)", frozen: 4, data: "50–200 examples", cost: "Lowest", note: "Take its embeddings, train a small model on top." },
  { label: "Freeze + new head", c: "var(--accent)", frozen: 3, data: "200–2,000 examples", cost: "Low", note: "Retrain only the last layer(s) on your data." },
  { label: "Fine-tune all", c: "var(--t4)", frozen: 0, data: "thousands+", cost: "Highest", note: "Retrain every layer. Best fit, most data and compute." },
];
let wi = 1;
function drawWays() {
  const Wy = WAYS[wi];
  let s = svg(320);
  const layers = ["layer 1", "layer 2", "layer 3", "last layer"];
  s += lbl(20, 22, "PRETRAINED LAYERS");
  layers.forEach((t, i) => {
    const y = 34 + (3 - i) * 46, frozen = i < Wy.frozen;
    s += rect(20, y, 220, 38, frozen ? "var(--muted)" : Wy.c, frozen ? .08 : .2, frozen ? 1.2 : 2) + `<text x="36" y="${y + 24}" font-size="12.5">${t}</text><text x="226" y="${y + 24}" text-anchor="end" font-size="12" font-weight="700" ${frozen ? 'class="muted"' : `style="fill:${Wy.c}"`}>${frozen ? "🔒 frozen" : "✎ retrained"}</text>`;
  });
  const hy = 34 + 4 * 46;
  s += rect(20, hy, 220, 38, A, .25, 2) + `<text x="36" y="${hy + 24}" font-size="12.5" font-weight="700">new: strong / weak</text><text x="226" y="${hy + 24}" text-anchor="end" font-size="12" font-weight="700" style="fill:${A}">✎ trained</text>`;
  const bx = 280;
  s += rect(bx, 34, 340, 74, Wy.c, .12) + `<text x="${bx + 14}" y="60" font-size="15" font-weight="700" style="fill:${Wy.c}">${Wy.label}</text><text x="${bx + 14}" y="84" font-size="12.5">${Wy.note}</text>`;
  [["Rated answers needed", Wy.data], ["Compute cost", Wy.cost]].forEach(([k, v], i) => { s += `<text x="${bx}" y="${142 + i * 26}" font-size="12.5">${k}</text><text x="${bx + 340}" y="${142 + i * 26}" text-anchor="end" class="mono" font-size="12.5" font-weight="700">${v}</text>`; });
  s += `<text x="${bx}" y="210" font-size="12.5">Start with the cheapest option that</text><text x="${bx}" y="228" font-size="12.5">meets the quality bar, then move right.</text>`;
  s += `<text x="${bx}" y="268" font-size="11" class="muted">Pick a way above. Example counts are</text><text x="${bx}" y="284" font-size="11" class="muted">rough guides, not rules.</text>`;
  return s + `</svg>`;
}

const ANS = [
  [50, 90, "“I cut onboarding time by 30%.”", A], [80, 118, "“New hires got up to speed in ⅔ the time.”", A], [45, 146, "“I halved the bug backlog in a quarter.”", A],
  [250, 200, "“I'm a hard worker.”", W], [285, 226, "“I always give 110%.”", W], [262, 252, "“I'm a perfectionist.”", W],
  [370, 84, "“I led the launch with five teams.”", B], [395, 112, "“I coordinated design and sales.”", B],
];
function drawEmbed() {
  let s = svg(340);
  s += rect(20, 34, 600, 236, "var(--line)");
  s += lbl(34, 54, "ANSWERS PLACED BY MEANING (768 NUMBERS EACH, SHOWN IN 2-D)");
  const q = [62, 118];
  s += `<circle cx="${q[0]}" cy="${q[1]}" r="50" style="fill:${A};stroke:${A}" fill-opacity=".06" stroke-dasharray="5 4"/>`;
  ANS.forEach(([x, y, t, c]) => { s += `<circle cx="${x}" cy="${y}" r="7" style="fill:${c}"/><text x="${x + 12}" y="${y + 4}" font-size="11.5">${t}</text>`; });
  s += rect(20, 282, 600, 48, A, .1) + `<text x="34" y="302" font-size="12.5">The two top answers share almost no words, yet their embeddings are neighbours,</text><text x="34" y="320" font-size="12.5">because they <tspan font-weight="700">mean</tspan> the same kind of thing.</text>`;
  return s + `</svg>`;
}

function drawUses() {
  let s = svg(330);
  const uses = [["Search by meaning", "“show me answers like this one”", A], ["Recommendations", "practice questions like ones you struggled with", B], ["Duplicate detection", "copied answers, even when reworded", W], ["Cheap classifier", "small model on embeddings: strong or weak", P]];
  uses.forEach(([t, d, c], i) => { const x = 20 + (i % 2) * 305, y = 16 + Math.floor(i / 2) * 64; s += rect(x, y, 295, 54, c, .08) + `<text x="${x + 14}" y="${y + 23}" font-size="13" font-weight="700" style="fill:${c}">${t}</text><text x="${x + 14}" y="${y + 42}" font-size="11.5">${d}</text>`; });
  s += rect(20, 152, 600, 60, G, .08) + `<text x="34" y="176" font-size="13" font-weight="700" style="fill:${G}">And the heart of RAG</text><text x="34" y="196" font-size="12.5">Embed the question, find the nearest documents, pass them to an LLM.</text>`;
  s += rect(20, 226, 600, 90, W, .06) + `<text x="34" y="250" font-size="13" font-weight="700" style="fill:${W}">Before you build on a pretrained model, check</text><text x="34" y="272" font-size="12.5">• Licence: is commercial use allowed?   • Bias: what did its training data contain?</text><text x="34" y="294" font-size="12.5">• Domain gap: does it know your jargon? If not, plan for some fine-tuning.</text>`;
  return s + `</svg>`;
}

const MODELS = [
  ["Gemini Embedding / Embedding 2", "Google", "API", "text, images, audio, PDFs together", A],
  ["text-embedding-3 large / small", "OpenAI", "API", "common default; small is cheap", A],
  ["Voyage 4", "Voyage (MongoDB)", "API", "quality per dollar; long input", A],
  ["Embed v4", "Cohere", "API", "enterprise multilingual doc search", A],
  ["Qwen3-Embedding 8B / 4B / 0.6B", "Alibaba", "Open", "top open model; Apache 2.0", B],
  ["QZhou-Embedding", "Kingsoft", "Open", "top of open English table; Apache 2.0", B],
  ["Harrier-OSS v1 27B", "Microsoft", "Open", "top multilingual score; large to run", B],
  ["BGE-M3", "BAAI", "Open", "100+ languages; dense + keyword", B],
  ["NV-Embed-v2", "NVIDIA", "Open", "strong, but non-commercial licence", B],
  ["EmbeddingGemma", "Google", "Open", "small enough for phones and laptops", B],
];
function drawModels() {
  let s = svg(380);
  s += lbl(20, 18, "10 LEADING EMBEDDING MODELS · LATE 2026 · A SHORTLIST, NOT A RANKING");
  const cx = [20, 232, 352, 410];
  ["MODEL", "MAKER", "TYPE", "BEST FOR"].forEach((h, i) => { s += `<text x="${cx[i] + 6}" y="42" class="mono muted" font-size="10.5" letter-spacing="1">${h}</text>`; });
  MODELS.forEach(([m, mk, t, b, c], i) => {
    const y = 50 + i * 26;
    if (i === 4) s += `<line x1="20" y1="${y - 2}" x2="625" y2="${y - 2}" style="stroke:var(--ink)" stroke-width="1"/>`;
    s += `<rect x="20" y="${y}" width="605" height="23" rx="4" style="fill:${i % 2 ? "var(--bg)" : "var(--surface)"}"/>`;
    s += `<text x="${cx[0] + 6}" y="${y + 16}" font-size="11.5" font-weight="700">${m}</text><text x="${cx[1] + 6}" y="${y + 16}" font-size="11">${mk}</text>`;
    s += `<rect x="${cx[2] + 4}" y="${y + 4}" width="44" height="15" rx="7" style="fill:${c}" fill-opacity=".18"/><text x="${cx[2] + 26}" y="${y + 15}" text-anchor="middle" font-size="10" font-weight="700" style="fill:${c}">${t}</text>`;
    s += `<text x="${cx[3] + 6}" y="${y + 16}" font-size="11">${b}</text>`;
  });
  s += rect(20, 318, 605, 54, G, .08) + `<text x="34" y="340" font-size="12.5"><tspan font-weight="700" style="fill:${G}">Test on your own data.</tspan> Scores differ across leaderboards and change every few months.</text><text x="34" y="360" font-size="12.5">Switching later means re-embedding everything you stored, so record the model version.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Pretrained", title: "1 · Pretrained models", q: "Why train from scratch when someone already has?",
    points: ["Big models are trained once on huge, general data.", "They learn general skills: grammar and meaning, or edges and shapes.", "Those skills transfer to new tasks.", "You only teach the last step, with far fewer examples."],
    pm: "Starting from a pretrained model can turn a year-long, data-hungry project into a few weeks with a few hundred examples.",
    say: "Step one, pretrained models. Some organisations train huge models on enormous general datasets, millions of images, or much of the web's text. That takes weeks of computing. Along the way, the model learns general skills, like grammar and meaning. Those skills transfer. A model that learned to read general text already understands an interview answer before it sees a single rated one. We only teach it the last step.",
    draw: drawPretrained },
  { stage: "Reuse", title: "2 · Three ways to reuse", q: "How much of the model should we retrain?",
    points: ["<b>Use as-is</b>: take its outputs and train a small model on top.", "<b>Freeze + new head</b>: lock most layers, retrain the last.", "<b>Fine-tune all</b>: retrain everything. Best fit, most data and compute.", "Pick a way above to compare."],
    pm: "Start with the cheapest option that meets the quality bar. Only pay for full fine-tuning when the cheaper options fall short.",
    say: "Step two, three ways to reuse. With freeze and new head, the early layers are locked, and only the last layer and a new strong or weak output are trained. That needs a few hundred to a couple of thousand rated answers. Now pick use as is. Everything is frozen, and a small model is trained on top. Cheapest of all. Now pick fine tune all. Every layer is retrained. It fits best, but needs the most data and compute.",
    draw: drawWays },
  { stage: "Embeddings", title: "3 · Embeddings", q: "How does a model represent meaning?",
    points: ["An <b>embedding</b> turns an answer into a long list of numbers.", "Similar meaning → nearby, even with different words.", "Here, results-focused answers cluster together; vague ones sit far away.", "Same idea as word embeddings, applied to whole answers."],
    pm: "Embeddings let your product understand meaning, not just keywords. That's why search and matching features feel so much smarter today.",
    say: "Step three, embeddings. An embedding turns each answer into a long list of numbers, here seven hundred and sixty eight. We've squeezed them onto a flat map. Look at the left. I cut onboarding time by thirty percent, and, new hires got up to speed in two thirds of the time. They share almost no words, but they mean similar things, so they're neighbours. The vague answers, like I'm a hard worker, sit far away.",
    draw: drawEmbed },
  { stage: "Uses", title: "4 · What embeddings enable", q: "What can we build with embeddings?",
    points: ["Search by meaning, recommendations, duplicate detection.", "A cheap classifier trained on embeddings.", "The core of retrieval-augmented generation, RAG.", "Check licence, bias and domain gap before building."],
    pm: "Many AI features are “pretrained model + embeddings + a little glue”. Before approving one, check the model's licence and what biases it may carry.",
    say: "Step four, what embeddings enable. Once answers are embeddings, lots of features become simple. Search by meaning. Recommend similar practice questions. Catch copied answers even when they're reworded. Or train a cheap classifier on top. Embeddings are also the heart of RAG, which you met in your AI course. Before you build, check the licence, possible biases, and whether the model knows your domain.",
    draw: drawUses },
  { stage: "Which model?", title: "5 · Choosing an embedding model", q: "Which embedding model should we use?",
    points: ["<b>Paid APIs</b>: Gemini Embedding, OpenAI text-embedding-3, Voyage 4, Cohere Embed v4.", "<b>Open models</b> you can run yourself: Qwen3-Embedding, QZhou, Harrier, BGE-M3, NV-Embed-v2.", "<b>EmbeddingGemma</b> is small enough for phones and laptops.", "Scores differ across leaderboards, so test 2–3 on your own data."],
    pm: "Fastest start: a paid API. Data must stay in-house: Qwen3-Embedding 4B or BGE-M3. Images or PDFs too: Gemini Embedding 2. Whatever you pick, record the version, because switching means re-embedding everything.",
    say: "Step five, choosing an embedding model. The main paid services are Google's Gemini Embedding, OpenAI's text embedding three, Voyage four and Cohere Embed four. The strongest open models you can run yourself include Qwen3 Embedding, QZhou, Microsoft's Harrier, BGE M3 and NVIDIA's NV Embed. EmbeddingGemma is small enough for a phone. Leaderboards disagree and change every few months, so test two or three models on a hundred real coach questions. And remember, switching later means re embedding everything you stored.",
    draw: drawModels },
];
return { STEPS, picker: { label: "Way to reuse:", step: 1, items: () => WAYS.map(w => ({ label: w.label, color: w.c })), get: () => wi, set: i => { wi = i; } } };
})();
VMETA[22] = {"title": "Standing on Giants' Shoulders", "sub": "Reuse a big pretrained model for the interview coach, choose how much of it to retrain, and see how embeddings place answers by meaning."};
