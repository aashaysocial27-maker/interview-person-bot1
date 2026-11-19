VISUALS[19] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker><marker id="ahr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--t3)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const sig = z => 1 / (1 + Math.exp(-z));

const WTS = [2.0, 1.5, -1.2], BIAS = -1.8, FN = ["specific details", "states a result", "filler words"];
const ANS = [{ label: "Answer X", c: "var(--t2)", v: [0.8, 1, 0.1] }, { label: "Answer Y", c: "var(--t4)", v: [0.1, 0, 0.6] }, { label: "Answer Z", c: "var(--warm)", v: [0.3, 1, 0.3] }];
let ai = 0;
function drawNeuron() {
  const a = ANS[ai], z = a.v.reduce((s, v, i) => s + v * WTS[i], BIAS), p = sig(z);
  let s = svg(330);
  const nx = 380, ny = 150;
  a.v.forEach((v, i) => {
    const y = 60 + i * 90;
    s += rect(20, y - 24, 150, 48, a.c, .1) + `<text x="34" y="${y - 3}" font-size="12">${FN[i]}</text><text x="34" y="${y + 16}" class="mono" font-size="14" font-weight="700" style="fill:${a.c}">${v}</text>`;
    s += arrow(172, y, nx - 46, ny + (i - 1) * 18, WTS[i] > 0 ? A : W, 1.5 + Math.abs(WTS[i]));
    s += `<text x="${(172 + nx - 46) / 2}" y="${(y + ny + (i - 1) * 18) / 2 - 8}" text-anchor="middle" class="mono" font-size="12" font-weight="700" style="fill:${WTS[i] > 0 ? A : W}">× ${WTS[i]}</text>`;
  });
  s += `<circle cx="${nx}" cy="${ny}" r="44" style="fill:${A};stroke:${A}" fill-opacity=".12" stroke-width="2"/><text x="${nx}" y="${ny - 6}" text-anchor="middle" font-size="22" font-weight="700">Σ</text><text x="${nx}" y="${ny + 16}" text-anchor="middle" class="mono" font-size="11">bias ${BIAS}</text>`;
  s += `<text x="${nx}" y="${ny + 66}" text-anchor="middle" class="mono" font-size="12">sum = ${z.toFixed(2)}</text>`;
  s += arrow(nx + 46, ny, nx + 96, ny);
  s += rect(nx + 100, ny - 34, 140, 68, a.c, .14, 2) + `<text x="${nx + 170}" y="${ny - 10}" text-anchor="middle" font-size="12">activation →</text><text x="${nx + 170}" y="${ny + 18}" text-anchor="middle" class="mono" font-size="17" font-weight="700" style="fill:${p >= .5 ? A : W}">${Math.round(p * 100)}% strong</text>`;
  s += `<text x="20" y="306" font-size="12.5">Multiply each input by its weight, add the bias, then the activation squeezes it into an output.</text>`;
  s += `<text x="20" y="324" font-size="11" class="muted">That's logistic regression again. Pick an answer above. Weights are illustrative.</text>`;
  return s + `</svg>`;
}

const LAYERS = [{ n: 4, x: 110, names: ["details", "result", "structure", "filler"] }, { n: 4, x: 270 }, { n: 3, x: 430 }, { n: 1, x: 580 }];
const posOf = (l, i) => [LAYERS[l].x, 160 + (i - (LAYERS[l].n - 1) / 2) * 62];
function netBase(edgeStyle) {
  let s = "";
  for (let l = 0; l < 3; l++) for (let i = 0; i < LAYERS[l].n; i++) for (let j = 0; j < LAYERS[l + 1].n; j++) { const [x1, y1] = posOf(l, i), [x2, y2] = posOf(l + 1, j); s += edgeStyle(l, i, j, x1, y1, x2, y2); }
  LAYERS.forEach((L, l) => { for (let i = 0; i < L.n; i++) { const [x, y] = posOf(l, i), c = l === 0 ? B : l === 3 ? A : P; s += `<circle cx="${x}" cy="${y}" r="17" style="fill:${c};stroke:${c}" fill-opacity=".2" stroke-width="1.6"/>`; } });
  return s;
}
function drawLayers() {
  let s = svg(340) + netBase((l, i, j, x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--line)" stroke-width="1.1"/>`);
  LAYERS[0].names.forEach((n, i) => { const [x, y] = posOf(0, i); s += `<text x="${x - 24}" y="${y + 4}" text-anchor="end" font-size="11.5">${n}</text>`; });
  [["“specific + result”", 0], ["“long but vague”", 2]].forEach(([t, i]) => { const [x, y] = posOf(1, i); s += `<text x="${x}" y="${y - 24}" text-anchor="middle" font-size="11" font-weight="600" style="fill:${P}">${t}</text>`; });
  const [ox, oy] = posOf(3, 0); s += `<text x="${ox}" y="${oy + 36}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">strong?</text>`;
  [["input layer", 110, B], ["hidden layers", 350, P], ["output", 580, A]].forEach(([t, x, c]) => { s += `<text x="${x}" y="30" text-anchor="middle" class="mono" font-size="11" letter-spacing="1" style="fill:${c}">${t.toUpperCase()}</text>`; });
  s += `<text x="20" y="318" font-size="12.5">Hidden neurons learn their own combinations. Nobody tells them what to look for.</text>`;
  s += `<text x="20" y="334" font-size="11" class="muted">Labels on hidden neurons are examples of what they might learn.</text>`;
  return s + `</svg>`;
}
function drawForward() {
  let s = svg(340) + netBase((l, i, j, x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${A}" stroke-opacity=".45" stroke-width="1.4"/>`);
  [[160, "→"], [335, "→"], [495, "→"]].forEach(([x]) => { s += arrow(x - 20, 300, x + 20, 300, A, 2.5); });
  s += `<text x="335" y="324" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">forward pass: inputs → prediction</text>`;
  const [ox, oy] = posOf(3, 0);
  s += rect(ox - 50, oy - 92, 100, 40, A, .15) + `<text x="${ox}" y="${oy - 66}" text-anchor="middle" class="mono" font-size="13" font-weight="700">60% strong</text>`;
  s += rect(ox - 50, oy + 26, 100, 52, G, .12) + `<text x="${ox}" y="${oy + 46}" text-anchor="middle" font-size="11.5">coach said:</text><text x="${ox}" y="${oy + 66}" text-anchor="middle" class="mono" font-size="12.5" font-weight="700">strong</text>`;
  s += `<text x="${ox}" y="${oy + 96}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${W}">loss = 0.51</text>`;
  return s + `</svg>`;
}
function drawBack() {
  const blame = (l, i, j) => [[.9, .3, .7, .2], [.8, .4, .6, .3], [.9, .5, .4]][l][l === 2 ? i : i] * (l === 2 ? 1 : [.9, .5, .7, .4, .6][j] || .5);
  let s = svg(340) + netBase((l, i, j, x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${W}" stroke-opacity="${.15 + blame(l, i, j) * .6}" stroke-width="${.8 + blame(l, i, j) * 3.2}"/>`);
  [[495], [335], [160]].forEach(([x]) => { s += `<line x1="${x + 20}" y1="300" x2="${x - 20}" y2="300" style="stroke:${W}" stroke-width="2.5" marker-end="url(#ahr)"/>`; });
  s += `<text x="335" y="324" text-anchor="middle" font-size="12" font-weight="700" style="fill:${W}">backpropagation: error flows back, layer by layer</text>`;
  const [ox, oy] = posOf(3, 0);
  s += rect(ox - 52, oy - 92, 104, 44, W, .12) + `<text x="${ox}" y="${oy - 74}" text-anchor="middle" class="mono" font-size="11.5" font-weight="700" style="fill:${W}">wanted 100%</text><text x="${ox}" y="${oy - 58}" text-anchor="middle" class="mono" font-size="11.5" font-weight="700" style="fill:${W}">got 60%</text>`;
  s += `<text x="20" y="30" font-size="12.5">Thicker lines = weights that caused more of the error, so they change more.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Neuron", title: "1 · One neuron", q: "What does a single neuron do?",
    points: ["Multiply each input by a <b>weight</b>, then add them up with a <b>bias</b>.", "Pass the sum through an <b>activation function</b>, which decides how strongly to fire.", "It's a tiny logistic regression.", "Pick an answer above to run it through the neuron."],
    pm: "A neural network is built from these very simple parts. Its power comes from having thousands or billions of them, not from any single clever unit.",
    say: "Step one, one neuron. Answer X comes in as three numbers. Specific details zero point eight, states a result one, filler words zero point one. The neuron multiplies each by its weight, adds the bias, and gets a sum. Then the activation squeezes that into an output, about seventy six percent strong. Now pick answer Y. Few details, no result, lots of filler. The output drops to around nine percent.",
    draw: drawNeuron },
  { stage: "Layers", title: "2 · Layers", q: "What happens when we stack neurons?",
    points: ["The <b>input layer</b> holds the features, or raw words.", "<b>Hidden layers</b> combine them into new signals, like “specific + result”.", "The <b>output layer</b> gives the answer.", "Deep learning means many hidden layers. The network learns its own features."],
    pm: "Because networks learn their own features, they handle raw text, images and audio well. That's why modern AI products are built on them.",
    say: "Step two, layers. Now we stack neurons. The input layer holds the features. Hidden layers combine them into new signals. One hidden neuron might learn to fire for answers that are specific and state a result. Another might learn long but vague. Nobody tells them what to look for. They figure it out during training. The output layer gives the final answer. Deep learning just means many hidden layers.",
    draw: drawLayers },
  { stage: "Forward", title: "3 · The forward pass", q: "How does the network make a prediction?",
    points: ["Data flows forward: inputs, hidden layers, output.", "This is the <b>forward pass</b>, the same at training and prediction time.", "The network says 60% strong. The coach said strong.", "The loss measures the gap."],
    pm: "At prediction time only the forward pass runs. That's inference, and its cost per request is what drives your serving bill.",
    say: "Step three, the forward pass. To make a prediction, the data flows forward. From the inputs, through each hidden layer, to the output. Here the network says sixty percent strong. But the coach rated this answer strong, so we wanted something close to a hundred percent. The loss measures that gap.",
    draw: drawForward },
  { stage: "Backprop", title: "4 · Backpropagation", q: "How does the network learn from its mistake?",
    points: ["Send the error <b>backwards</b>, layer by layer.", "Work out how much each weight contributed. Thicker lines got more blame.", "Gradient descent nudges every weight a little.", "Repeat over millions of examples."],
    pm: "Training means millions of these forward and backward passes, usually on GPUs. That's where the big training costs of deep learning come from.",
    say: "Step four, backpropagation. Now the error flows backwards through the network, layer by layer. For each weight, the network works out how much it contributed to the mistake. The thicker red lines got more of the blame, so they'll change more. Then gradient descent nudges every weight a little. Repeat this over millions of examples, and the network gradually gets good.",
    draw: drawBack },
];
return { STEPS, picker: { label: "Run an answer:", step: 0, items: () => ANS.map(a => ({ label: a.label, color: a.c })), get: () => ai, set: i => { ai = i; } } };
})();
VMETA[19] = {"title": "Layers That Learn", "sub": "Run an interview answer through one neuron, stack neurons into layers, follow the forward pass to a prediction, and send the error back with backpropagation."};
