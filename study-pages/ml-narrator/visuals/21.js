VISUALS[21] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const chips = (x, y, words, colorOf) => { let s = "", cx = x; words.forEach((w, i) => { const wd = w.length * 8.2 + 18, c = colorOf(i, w); s += `<rect x="${cx}" y="${y}" width="${wd}" height="30" rx="6" style="fill:${c};stroke:${c}" fill-opacity=".14"/><text x="${cx + wd / 2}" y="${y + 20}" text-anchor="middle" class="mono" font-size="12.5">${w}</text>`; cx += wd + 6; }); return s; };

function drawOrder() {
  let s = svg(320);
  const a = ["Not", "great", "at", "first,", "but", "I", "learned", "fast."], b = ["I", "learned", "fast", "at", "first,", "but", "not", "great."];
  const col = (i, w) => /great|fast/i.test(w) ? A : /not/i.test(w) ? W : "var(--muted)";
  s += lbl(20, 22, "SAME WORDS, DIFFERENT ORDER");
  s += chips(20, 34, a, col) + `<text x="620" y="54" text-anchor="end" font-size="13" font-weight="700" style="fill:${A}">positive ↑</text>`;
  s += chips(20, 82, b, col) + `<text x="620" y="102" text-anchor="end" font-size="13" font-weight="700" style="fill:${W}">negative ↓</text>`;
  s += rect(20, 128, 600, 50, G, .08) + `<text x="34" y="150" font-size="12.5">A word counter like naive Bayes sees <tspan font-weight="700">identical</tspan> word counts,</text><text x="34" y="168" font-size="12.5">so it can't tell these two answers apart.</text>`;
  s += lbl(20, 206, "SAME READINGS, DIFFERENT ORDER");
  const slow = [2, 2.4, 2.9, 3.3, 3.8, 4.2, 4.7, 5.1], spike = [2, 2, 2.1, 2, 2.1, 2, 8, 2.2];
  const line = (vals, x0, c) => `<path d="M${vals.map((v, i) => `${x0 + i * 34} ${300 - v * 10}`).join(" L")}" fill="none" style="stroke:${c}" stroke-width="2.5"/>`;
  s += line(slow, 30, B) + `<text x="30" y="226" font-size="12" font-weight="700" style="fill:${B}">slow rise: wear over a week</text>`;
  s += line(spike, 350, W) + `<text x="350" y="226" font-size="12" font-weight="700" style="fill:${W}">sudden spike: something broke</text>`;
  return s + `</svg>`;
}

function drawRNN() {
  let s = svg(320);
  const words = ["I", "learned", "fast", "at", "first"];
  s += lbl(20, 22, "AN RNN READS ONE WORD AT A TIME");
  words.forEach((w, i) => {
    const x = 40 + i * 118;
    s += rect(x, 210, 90, 34, B, .12) + `<text x="${x + 45}" y="232" text-anchor="middle" class="mono" font-size="13">${w}</text>`;
    s += arrow(x + 45, 208, x + 45, 152, B);
    s += rect(x, 90, 90, 60, A, .14, 2) + `<text x="${x + 45}" y="114" text-anchor="middle" font-size="12" font-weight="700">memory</text><text x="${x + 45}" y="134" text-anchor="middle" class="mono" font-size="11">step ${i + 1}</text>`;
    if (i < 4) s += arrow(x + 92, 120, x + 116, 120, A, 2.5);
    s += `<text x="${x + 45}" y="268" text-anchor="middle" font-size="11" class="muted">same weights</text>`;
  });
  s += `<text x="40" y="70" font-size="12.5">At each step: new word + old memory → updated memory.</text>`;
  s += `<text x="20" y="300" font-size="12.5">At the end, the memory summarises the whole answer and feeds the prediction.</text>`;
  return s + `</svg>`;
}

const MODELS = [{ label: "Plain RNN", c: "var(--t3)", keep: .72 }, { label: "LSTM", c: "var(--accent)", keep: .97 }];
let mi = 0;
function drawFade() {
  const M = MODELS[mi], steps = 14;
  let s = svg(320);
  s += lbl(20, 22, `HOW MUCH OF WORD 1 IS STILL REMEMBERED · ${M.label.toUpperCase()}`);
  const words = ["Not", "great", "at", "first,", "but", "after", "a", "few", "weeks", "of", "practice", "I", "got", "faster"];
  for (let i = 0; i < steps; i++) {
    const v = Math.pow(M.keep, i), x = 24 + i * 43, h = v * 150;
    s += `<rect x="${x}" y="${200 - h}" width="34" height="${h}" rx="3" style="fill:${M.c}" fill-opacity="${.25 + v * .6}"/>`;
    s += `<text x="${x + 17}" y="${194 - h}" text-anchor="middle" class="mono" font-size="9.5">${Math.round(v * 100)}</text>`;
    s += `<text x="${x + 17}" y="218" text-anchor="middle" font-size="10.5" class="mono" transform="rotate(-35 ${x + 17} 218)">${words[i]}</text>`;
  }
  s += `<line x1="20" y1="200" x2="620" y2="200" style="stroke:var(--ink)"/>`;
  const end = Math.round(Math.pow(M.keep, steps - 1) * 100);
  s += rect(20, 252, 600, 58, M.c, .1) + `<text x="34" y="276" font-size="13" font-weight="700" style="fill:${M.c}">${M.label}: ${end}% of “Not” left by the last word</text><text x="34" y="296" font-size="12.5">${mi ? "Gates learn what to keep, so the important “Not” survives." : "The memory fades every step, so the model forgets the answer began with “Not”."}</text>`;
  return s + `</svg>`;
}

function drawAttention() {
  let s = svg(330);
  const ws = ["Not", "great", "at", "first", "but", "faster"];
  s += lbl(20, 22, "RNN: ONE STEP AT A TIME");
  ws.forEach((w, i) => { const x = 30 + i * 52; s += `<circle cx="${x + 16}" cy="70" r="16" style="fill:${W}" fill-opacity=".15"/><text x="${x + 16}" y="74" text-anchor="middle" class="mono" font-size="10">${w}</text>`; if (i < 5) s += arrow(x + 34, 70, x + 48, 70, W); });
  s += `<text x="30" y="116" font-size="12">Slow: each step waits for the last.</text><text x="30" y="134" font-size="12">Distant words are hard to connect.</text>`;
  s += lbl(350, 22, "ATTENTION: EVERY WORD SEES EVERY WORD");
  const pts = ws.map((w, i) => { const a = (i / ws.length) * Math.PI * 2 - Math.PI / 2; return [480 + Math.cos(a) * 62, 96 + Math.sin(a) * 52, w]; });
  pts.forEach(([x1, y1], i) => pts.forEach(([x2, y2], j) => { if (j > i) s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${A}" stroke-opacity="${(i === 0 && j === 5) ? .9 : .25}" stroke-width="${(i === 0 && j === 5) ? 2.5 : 1.2}"/>`; }));
  pts.forEach(([x, y, w]) => { s += `<circle cx="${x}" cy="${y}" r="17" style="fill:var(--surface);stroke:${A}" stroke-width="1.5"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="mono" font-size="10">${w}</text>`; });
  s += `<text x="350" y="178" font-size="12">All at once, in parallel. “Not” links</text><text x="350" y="196" font-size="12">straight to “faster”.</text>`;
  s += rect(20, 222, 600, 92, A, .07) + `<text x="34" y="246" font-size="13" font-weight="700" style="fill:${A}">This is the heart of the transformer</text><text x="34" y="268" font-size="12.5">The engine of the LLMs in your AI course: faster to train, better at long range.</text><text x="34" y="292" font-size="12.5">RNNs and LSTMs remain useful for small, streaming, on-device signals like live sensor data.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Order", title: "1 · Why order matters", q: "Why can't we just count words?",
    points: ["Two answers with the same words can mean opposite things.", "A word counter sees them as identical.", "Sensor data too: a slow rise and a sudden spike mean different problems.", "Sequence models read data in order."],
    pm: "If your data is a conversation, a time series or a click stream, check that the model actually uses the order. Many simple models throw it away.",
    say: "Step one, why order matters. Look at these two answers. Not great at first, but I learned fast. And, I learned fast at first, but not great. Same words, opposite meaning. A model that just counts words can't tell them apart. The same is true for sensor readings. A slow rise over a week means wear. A sudden spike means something broke.",
    draw: drawOrder },
  { stage: "RNN", title: "2 · Recurrent neural networks", q: "How does a model read in order?",
    points: ["An RNN reads <b>one word at a time</b>.", "It keeps a small memory, the <b>hidden state</b>.", "Each step: new word + old memory → updated memory.", "The same weights are reused at every step."],
    pm: "Because it reads step by step, an RNN can run on live, streaming data, like speech as it's spoken or a machine's sensor feed.",
    say: "Step two, recurrent neural networks. An RNN reads one word at a time. It keeps a small memory, called the hidden state. At each step, it combines the new word with its old memory, and updates the memory. Then it moves on to the next word, using the same weights every time. At the end, the memory summarises the whole answer.",
    draw: drawRNN },
  { stage: "Forgetting", title: "3 · The forgetting problem", q: "What goes wrong with long sequences?",
    points: ["In a plain RNN, memory of early words fades a little every step.", "The training signal fades too: the <b>vanishing gradient</b>.", "<b>LSTMs</b> and GRUs add gates that learn what to keep and forget.", "Pick a model above to compare."],
    pm: "When a model “forgets” context from early in a conversation, that's often this problem. Ask how much history the model can actually use.",
    say: "Step three, the forgetting problem. The answer starts with the word not, which matters a lot. In a plain RNN, the memory of not fades at every step. By the last word, only about one percent is left, so the model forgets the answer began with not. Now pick LSTM. Its gates learn what to keep, so most of not survives to the end.",
    draw: drawFade },
  { stage: "Attention", title: "4 · From RNNs to transformers", q: "Why did transformers replace RNNs for language?",
    points: ["RNNs read step by step, so they're slow on huge datasets.", "Far-apart words are still hard to connect.", "<b>Attention</b> lets every word see every word, at once.", "That's the transformer behind today's LLMs."],
    pm: "For text features today, expect transformer-based, pretrained models. Lighter sequence models still make sense for small real-time signals on a device.",
    say: "Step four, from RNNs to transformers. An RNN must read one step at a time, so it's slow to train, and distant words are hard to connect. Attention changed that. Every word can look directly at every other word, all at once. Here, not links straight to faster. That's the heart of the transformer, the engine behind the language models in your AI course.",
    draw: drawAttention },
];
return { STEPS, picker: { label: "Model:", step: 2, items: () => MODELS.map(m => ({ label: m.label, color: m.c })), get: () => mi, set: i => { mi = i; } } };
})();
VMETA[21] = {"title": "Reading in Order", "sub": "See why word order changes an interview answer's meaning, follow an RNN's memory step by step, watch it fade, and see how attention fixed it."};
