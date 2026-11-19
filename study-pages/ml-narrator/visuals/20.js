VISUALS[20] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

/* 8x8 image of a "T" seam: horizontal bar rows 1-2, vertical bar cols 3-4, values 0-9 */
const IMG = Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => ((r === 1 || r === 2) && c >= 1 && c <= 6) || (c >= 3 && c <= 4 && r >= 1 && r <= 6) ? 9 : 0));
function grid(x0, y0, M, cell, colorFn, showNums) {
  let s = "";
  M.forEach((row, r) => row.forEach((v, c) => {
    s += `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${cell - 1}" height="${cell - 1}" style="fill:${colorFn(v)}" ${typeof colorFn(v) === "string" && colorFn(v).startsWith("var") ? "" : ""}/>`;
    if (showNums) s += `<text x="${x0 + c * cell + cell / 2}" y="${y0 + r * cell + cell / 2 + 4}" text-anchor="middle" class="mono" font-size="10" style="fill:${v > 4 ? "var(--surface)" : "var(--muted)"}">${v}</text>`;
  }));
  return s;
}
const ink = v => v > 4 ? "var(--ink)" : "var(--bg)";
function drawPixels() {
  let s = svg(320);
  s += lbl(20, 22, "WHAT THE CAMERA SEES");
  s += grid(20, 34, IMG, 32, ink, false) + `<rect x="20" y="34" width="256" height="256" style="fill:none;stroke:var(--line)"/>`;
  s += arrow(292, 162, 330, 162);
  s += lbl(346, 22, "WHAT THE MODEL SEES");
  s += grid(346, 34, IMG, 32, v => v > 4 ? "var(--ink)" : "var(--surface)", true) + `<rect x="346" y="34" width="256" height="256" style="fill:none;stroke:var(--line)"/>`;
  s += `<text x="20" y="312" font-size="12.5">An 8 × 8 close-up of a weld seam: 64 brightness numbers. A real photo has millions.</text>`;
  return s + `</svg>`;
}

const FILTERS = [
  { label: "Vertical edge", c: "var(--t2)", k: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]] },
  { label: "Horizontal edge", c: "var(--t4)", k: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]] },
  { label: "Blur", c: "var(--warm)", k: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
];
let fi = 0;
const conv = k => Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => { let v = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) v += k[i][j] * IMG[r + i][c + j]; return v; }));
function drawConv() {
  const F = FILTERS[fi], out = conv(F.k), mx = Math.max(...out.flat().map(Math.abs)) || 1;
  let s = svg(340);
  s += lbl(20, 22, "IMAGE (8 × 8)");
  s += grid(20, 34, IMG, 26, ink, false) + `<rect x="20" y="34" width="208" height="208" style="fill:none;stroke:var(--line)"/>`;
  s += `<rect x="${20 + 2 * 26}" y="${34 + 2 * 26}" width="78" height="78" style="fill:${F.c};stroke:${F.c}" fill-opacity=".15" stroke-width="2.5"/>`;
  s += lbl(250, 22, "FILTER (3 × 3)");
  F.k.forEach((row, r) => row.forEach((v, c) => { s += `<rect x="${250 + c * 30}" y="${34 + r * 30}" width="28" height="28" rx="3" style="fill:${F.c}" fill-opacity="${v > 0 ? .45 : v < 0 ? .12 : .04}"/><text x="${264 + c * 30}" y="${53 + r * 30}" text-anchor="middle" class="mono" font-size="12" font-weight="700">${v > 0 ? "+" + v : v}</text>`; }));
  s += `<text x="250" y="148" font-size="12">Multiply, add up,</text><text x="250" y="164" font-size="12">slide one step,</text><text x="250" y="180" font-size="12">repeat.</text>`;
  s += arrow(340, 138, 376, 138);
  s += lbl(390, 22, "FEATURE MAP (6 × 6)");
  out.forEach((row, r) => row.forEach((v, c) => { const a = Math.abs(v) / mx; s += `<rect x="${390 + c * 37}" y="${34 + r * 35}" width="35" height="33" rx="3" style="fill:${F.c}" fill-opacity="${.05 + a * .75}"/><text x="${407 + c * 37}" y="${55 + r * 35}" text-anchor="middle" class="mono" font-size="10.5">${v}</text>`; }));
  const msg = fi === 0 ? "Lights up along the left and right sides of the vertical stroke." : fi === 1 ? "Lights up along the top and bottom of the horizontal bar." : "Smooths the image: no edges, just a softer picture.";
  s += rect(20, 262, 600, 66, F.c, .1) + `<text x="34" y="286" font-size="13" font-weight="700" style="fill:${F.c}">${F.label} filter</text><text x="34" y="308" font-size="12.5">${msg} Brighter = stronger match.</text>`;
  return s + `</svg>`;
}

function drawLayers() {
  let s = svg(320);
  const stages = [["Layer 1", "edges, corners", B], ["Layers 2–3", "textures, seams", P], ["Layers 4–5", "parts: bead, crack", G], ["Output", "“cracked weld”", A]];
  stages.forEach(([t, d, c], i) => {
    const x = 20 + i * 155;
    s += rect(x, 40, 140, 170, c, .08);
    s += `<text x="${x + 70}" y="64" text-anchor="middle" font-size="13" font-weight="700" style="fill:${c}">${t}</text><text x="${x + 70}" y="200" text-anchor="middle" font-size="12">${d}</text>`;
    const cx = x + 70, cy = 128;
    if (i === 0) s += `<path d="M${cx - 30} ${cy - 30} v60 M${cx - 10} ${cy - 30} h40 M${cx + 10} ${cy + 10} l20 20" style="stroke:${c}" stroke-width="3" fill="none"/>`;
    if (i === 1) s += `<path d="M${cx - 40} ${cy} q 10 -20 20 0 t 20 0 t 20 0 t 20 0" style="stroke:${c}" stroke-width="3" fill="none"/><path d="M${cx - 40} ${cy + 20} q 10 -20 20 0 t 20 0 t 20 0 t 20 0" style="stroke:${c}" stroke-width="3" fill="none"/>`;
    if (i === 2) s += `<rect x="${cx - 42}" y="${cy - 12}" width="84" height="24" rx="12" style="fill:${c}" fill-opacity=".3"/><path d="M${cx - 6} ${cy - 22} l 8 12 l -6 8 l 8 14" style="stroke:${W}" stroke-width="3" fill="none"/>`;
    if (i === 3) s += `<circle cx="${cx}" cy="${cy}" r="30" style="fill:${A}" fill-opacity=".18"/><text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="22" font-weight="700" style="fill:${W}">!</text>`;
    if (i < 3) s += arrow(x + 142, 125, x + 153, 125);
  });
  s += rect(20, 228, 600, 76, "var(--line)") + `<text x="34" y="252" font-size="12.5"><tspan font-weight="700">Pooling</tspan> between layers shrinks each feature map, keeping the strongest signals,</text><text x="34" y="272" font-size="12.5">so deeper layers see a bigger area. Every filter is <tspan font-weight="700">learned</tspan> with backpropagation.</text><text x="34" y="292" font-size="11.5" class="muted">What each layer detects is a typical example, not a fixed rule.</text>`;
  return s + `</svg>`;
}

function drawUses() {
  let s = svg(330);
  const uses = [["Factory inspection", "cracked welds, scratched parts"], ["Medical scans", "flag areas for a doctor to check"], ["Documents", "read text from scans and photos"], ["Interview coach", "is the face visible and well lit?"]];
  uses.forEach(([t, d], i) => { const x = 20 + (i % 2) * 305, y = 16 + Math.floor(i / 2) * 64; s += rect(x, y, 295, 54, A, .07) + `<text x="${x + 14}" y="${y + 23}" font-size="13" font-weight="700" style="fill:${A}">${t}</text><text x="${x + 14}" y="${y + 42}" font-size="12">${d}</text>`; });
  s += rect(20, 152, 600, 92, W, .07) + `<text x="34" y="176" font-size="13" font-weight="700" style="fill:${W}">Watch out</text><text x="34" y="198" font-size="12.5">Needs thousands of labelled images, unless you start from a pretrained model (concept 22).</text><text x="34" y="218" font-size="12.5">Can fail when real conditions differ: new lighting, a new camera, a different skin tone.</text><text x="34" y="236" font-size="12.5">Collect training photos that look like real use.</text>`;
  s += rect(20, 256, 600, 56, "var(--line)") + `<text x="34" y="280" font-size="12.5"><tspan font-weight="700">Cloud or device?</tspan> On-device is faster and more private; the cloud allows bigger models.</text><text x="34" y="300" font-size="12" class="muted">Vision transformers now rival CNNs on many tasks.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Pixels", title: "1 · Images are numbers", q: "What does a model actually see in a photo?",
    points: ["A photo is a grid of <b>pixels</b>, each a brightness number.", "Colour photos have three grids: red, green and blue.", "A one-megapixel colour photo is 3 million numbers.", "Nearby pixels belong together, and a plain network ignores that."],
    pm: "Image size drives cost. Bigger photos mean more numbers to process, so teams often shrink images before the model sees them.",
    say: "Step one, images are numbers. On the left is a close-up of a weld seam, shaped like a letter T. On the right is what the model actually sees, a grid of brightness numbers. Nine is bright, zero is dark. This tiny image has sixty four numbers. A real colour photo has millions. And neighbouring pixels belong together, which a plain neural network would ignore.",
    draw: drawPixels },
  { stage: "Filters", title: "2 · Filters and convolution", q: "How does a CNN find patterns?",
    points: ["A <b>filter</b> is a tiny 3 × 3 grid of weights.", "Slide it across the image: multiply, add up, move one step.", "The output, a <b>feature map</b>, is bright where the pattern appears.", "Pick a filter above. The numbers are computed live."],
    pm: "The same small filter is reused everywhere, so a CNN can spot a defect wherever it appears in the frame, without extra training for each position.",
    say: "Step two, filters and convolution. A filter is a tiny three by three grid of weights. It slides across the image. At each spot, it multiplies its weights by the pixels under it and adds them up. This vertical edge filter lights up along the sides of the vertical stroke. Now pick horizontal edge. It lights up along the top and bottom of the bar instead. And blur just softens the whole picture.",
    draw: drawConv },
  { stage: "Layers", title: "3 · Layers build up meaning", q: "How do edges become objects?",
    points: ["Early layers find <b>edges and corners</b>.", "Middle layers combine them into <b>textures and seams</b>.", "Deep layers recognise <b>parts and objects</b>, like a crack in a weld.", "<b>Pooling</b> shrinks maps between layers. All filters are learned."],
    pm: "Nobody hand-codes “what a crack looks like”. The network learns it from labelled examples, so the quality of those examples is what you control.",
    say: "Step three, layers build up meaning. The first layer finds simple things, edges and corners. The next layers combine those into textures, like the ripples of a weld seam. Deeper layers recognise parts, like the bead and a crack. And the output says, cracked weld. Between layers, pooling shrinks the maps and keeps the strongest signals. Nobody designs these filters. They're all learned with backpropagation.",
    draw: drawLayers },
  { stage: "Uses", title: "4 · Uses and limits", q: "Where are CNNs used, and where do they fail?",
    points: ["Factory inspection, medical scans, documents, face unlock.", "The coach could check video setup: face visible, good light.", "They need many labelled images, or a pretrained start.", "They can fail when real conditions differ from training."],
    pm: "Make sure training photos match real use: different lighting, devices, angles and people. Gaps there become failures for real users.",
    say: "Step four, uses and limits. CNNs power factory inspection, medical scan reading, document scanning and face unlock. Our coach could use one to check a video interview setup, like whether the face is visible and well lit. But they need lots of labelled images, unless you start from a pretrained model. And they can fail when real conditions differ, like new lighting, a new camera, or people the training photos didn't include.",
    draw: drawUses },
];
return { STEPS, picker: { label: "Filter:", step: 1, items: () => FILTERS.map(f => ({ label: f.label, color: f.c })), get: () => fi, set: i => { fi = i; } } };
})();
VMETA[20] = {"title": "Teaching a Model to See", "sub": "Turn a weld-seam photo into numbers, slide real filters across it to find edges, and see how layers of a convolutional network build up to recognising a defect."};
