VISUALS[8] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const edge = (x1, y1, x2, y2, on, t) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${on ? "var(--ink)" : "var(--line)"}" stroke-width="${on ? 3 : 1.5}"/><text x="${(x1 + x2) / 2 + (x2 > x1 ? 6 : -6)}" y="${(y1 + y2) / 2}" text-anchor="${x2 > x1 ? "start" : "end"}" font-size="11.5" font-weight="600" ${on ? "" : 'class="muted"'}>${t}</text>`;

/* answers from earlier concepts; result? details? structured? */
const ANS = [
  { label: "Answer X", c: "var(--t2)", text: "“I cut onboarding time 30% by rewriting the checklist with new hires.”", r: 1, d: 3, s: 1 },
  { label: "Answer Y", c: "var(--t4)", text: "“I'm a hard worker and I always give 110%.”", r: 0, d: 1, s: 0 },
  { label: "Answer Z", c: "var(--warm)", text: "“I led a redesign. It went well and the team liked it.”", r: 1, d: 1, s: 0 },
];
let ai = 0;
function drawTree() {
  const a = ANS[ai];
  const p1 = a.r ? "yes" : "no", p2 = a.r ? (a.d >= 3 ? "yes" : "no") : null, p3 = p2 === "no" ? (a.s ? "yes" : "no") : null;
  let s = svg(360);
  const node = (x, y, t, on) => rect(x - 105, y, 210, 40, on ? "var(--ink)" : "var(--line)", 0, on ? 2 : 1.3) + `<text x="${x}" y="${y + 25}" text-anchor="middle" font-size="12.5" font-weight="600">${t}</text>`;
  const leaf = (x, y, t, on) => { const c = t === "strong" ? A : W; return rect(x - 45, y, 90, 34, c, on ? .35 : .1, on ? 2.2 : 1.3) + `<text x="${x}" y="${y + 22}" text-anchor="middle" class="mono" font-size="13" font-weight="700" style="fill:${c}">${t}</text>`; };
  s += edge(320, 60, 150, 110, p1 === "no", "no") + edge(320, 60, 440, 110, p1 === "yes", "yes");
  s += edge(440, 150, 330, 195, p2 === "no", "no") + edge(440, 150, 560, 195, p2 === "yes", "yes");
  s += edge(330, 235, 250, 280, p3 === "no", "no") + edge(330, 235, 410, 280, p3 === "yes", "yes");
  s += node(320, 20, "States a clear result?", true);
  s += leaf(150, 110, "weak", p1 === "no");
  s += node(440, 110, "3 or more specific details?", p1 === "yes");
  s += leaf(560, 195, "strong", p2 === "yes");
  s += node(330, 195, "Clear structure?", p2 === "no");
  s += leaf(250, 280, "weak", p3 === "no");
  s += leaf(410, 280, "strong", p3 === "yes");
  s += `<text x="20" y="346" font-size="12.5"><tspan font-weight="700" style="fill:${a.c}">${a.label}:</tspan> ${a.text}</text>`;
  s += lbl(20, 300, "LEAVES HOLD");
  s += lbl(20, 314, "THE ANSWER");
  return s + `</svg>`;
}

function drawSplit() {
  let s = svg(320);
  s += lbl(20, 22, "WHICH FIRST QUESTION SEPARATES 20 ANSWERS BEST?");
  const opt = (x, q, l, r, good) => {
    let o = rect(x, 34, 290, 268, good ? A : "var(--line)", good ? .06 : 0) + `<text x="${x + 145}" y="62" text-anchor="middle" font-size="13" font-weight="700">${q}</text>`;
    [[l, "yes", x + 20], [r, "no", x + 155]].forEach(([[sN, wN], t, gx]) => {
      o += `<text x="${gx + 57}" y="92" text-anchor="middle" font-size="12" class="muted">${t}</text>`;
      for (let i = 0; i < sN + wN; i++) { const isS = i < sN; o += `<circle cx="${gx + 14 + (i % 5) * 22}" cy="${112 + Math.floor(i / 5) * 22}" r="8" style="fill:${isS ? A : W}" fill-opacity=".8"/>`; }
      const pure = Math.round(Math.max(sN, wN) / (sN + wN) * 100);
      o += `<text x="${gx + 57}" y="232" text-anchor="middle" class="mono" font-size="13" font-weight="700">${pure}% pure</text>`;
    });
    o += `<text x="${x + 145}" y="276" text-anchor="middle" font-size="13" font-weight="700" style="fill:${good ? A : W}">${good ? "✓ Better split" : "✗ Groups still mixed"}</text>`;
    return o;
  };
  s += opt(20, "Longer than 60 seconds?", [6, 5], [4, 5], 0);
  s += opt(330, "States a clear result?", [9, 1], [1, 9], 1);
  s += `<text x="20" y="316" font-size="11" class="muted">● strong  ● weak. Counts are illustrative. Training tries many questions and keeps the purest split.</text>`;
  return s + `</svg>`;
}

function drawDeep() {
  let s = svg(320);
  s += lbl(20, 22, "A TREE LEFT TO GROW UNTIL EVERY LEAF IS PURE");
  const lv = [[320], [170, 470], [95, 245, 395, 545], [55, 135, 205, 285, 355, 435, 505, 585]];
  lv.forEach((row, d) => row.forEach((x, i) => {
    if (d < 3) { const kids = lv[d + 1]; s += `<line x1="${x}" y1="${44 + d * 62 + 14}" x2="${kids[i * 2]}" y2="${44 + (d + 1) * 62}" style="stroke:var(--line)" stroke-width="1.4"/><line x1="${x}" y1="${44 + d * 62 + 14}" x2="${kids[i * 2 + 1]}" y2="${44 + (d + 1) * 62}" style="stroke:var(--line)" stroke-width="1.4"/>`; }
  }));
  lv.forEach((row, d) => row.forEach((x, i) => {
    const y = 44 + d * 62;
    if (d < 3) s += `<circle cx="${x}" cy="${y + 7}" r="9" style="fill:var(--surface);stroke:var(--ink)" stroke-width="1.3"/>`;
    else { const c = i % 3 ? W : A; s += `<rect x="${x - 26}" y="${y}" width="52" height="26" rx="5" style="fill:${c};stroke:${c}" fill-opacity=".15"/><text x="${x}" y="${y + 17}" text-anchor="middle" font-size="10.5" class="mono">${i === 5 ? "2 ans." : "1 ans."}</text>`; }
  }));
  s += `<path d="M435 228 q 10 30 -40 44" fill="none" style="stroke:${W}" stroke-width="1.5" marker-end="url(#ah)"/>`;
  s += rect(150, 268, 330, 40, W, .1) + `<text x="315" y="293" text-anchor="middle" font-size="12.5" style="fill:${W}" font-weight="600">“mentions Kubernetes → strong” from 2 answers</text>`;
  return s + `</svg>`;
}

const VOTES = ["strong", "strong", "weak", "strong", "strong"];
function drawForest() {
  let s = svg(330);
  s += lbl(20, 22, "5 TREES · EACH TRAINED ON A RANDOM SAMPLE · ANSWER X");
  VOTES.forEach((v, i) => {
    const x = 70 + i * 125, c = v === "strong" ? A : W;
    s += `<path d="M${x} 40 l -36 60 h 72 z" style="fill:${G};stroke:${G}" fill-opacity=".12" stroke-width="1.3"/>`;
    s += `<path d="M${x} 52 l -18 30 M${x} 52 l 18 30 M${x - 18} 82 l -10 14 M${x - 18} 82 l 10 14 M${x + 18} 82 l 10 14" style="stroke:var(--muted)" stroke-width="1.2" fill="none"/>`;
    s += `<rect x="${x - 6}" y="100" width="12" height="16" style="fill:var(--muted)" fill-opacity=".5"/>`;
    s += `<text x="${x}" y="134" text-anchor="middle" font-size="12" class="muted">Tree ${i + 1}</text>`;
    s += rect(x - 42, 144, 84, 30, c, .15) + `<text x="${x}" y="164" text-anchor="middle" class="mono" font-size="12.5" font-weight="700" style="fill:${c}">${v}</text>`;
    s += `<line x1="${x}" y1="176" x2="320" y2="214" style="stroke:var(--line)" stroke-width="1.3"/>`;
  });
  s += rect(200, 216, 240, 52, A, .18, 2) + `<text x="320" y="240" text-anchor="middle" font-size="14" font-weight="700" style="fill:${A}">Majority vote: strong</text><text x="320" y="258" text-anchor="middle" class="mono" font-size="12">4 of 5 trees · 80%</text>`;
  s += `<text x="20" y="298" font-size="12.5">Each tree makes different mistakes. Tree 3 is wrong, but the vote overrules it.</text>`;
  s += `<text x="20" y="318" font-size="11" class="muted">Real forests use hundreds of trees. Votes are illustrative.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "The tree", title: "1 · How a tree decides", q: "How does a tree judge an answer?",
    points: ["The tree asks yes or no questions, starting at the top.", "Each answer sends the example down one branch.", "The end points, called <b>leaves</b>, hold the final answer.", "Pick an answer above the diagram to trace its path."],
    pm: "A small tree is one of the most explainable models there is. You can show a user exactly why: “no clear result, so weak”.",
    say: "Step one, how a tree decides. The tree starts at the top, with one question. Does the answer state a clear result? Answer X does, so it goes right. Next question. Does it have three or more specific details? Yes, so it lands on strong. Now try answer Z. It states a result, but has only one detail, so the tree asks one more question about structure. Its structure is unclear, so it lands on weak. Each end point is a leaf, holding the final answer.",
    draw: drawTree },
  { stage: "Splits", title: "2 · How a tree is built", q: "Who chooses the questions?",
    points: ["Training tries many possible questions at each step.", "It keeps the one that makes the groups <b>purest</b>: mostly strong on one side, mostly weak on the other.", "“Longer than 60 seconds?” barely helps. “States a clear result?” separates well.", "Then it repeats inside each group."],
    pm: "The first split is usually the single most informative signal in your data. It's a quick way to learn what really drives the outcome.",
    say: "Step two, how a tree is built. Nobody writes these questions. Training tries lots of them and keeps the one that makes the purest groups. Look at the left. Longer than sixty seconds leaves both groups mixed. Now the right. States a clear result puts nine strong answers on one side and nine weak ones on the other. That's a much better split, so the tree uses it, and then repeats inside each group.",
    draw: drawSplit },
  { stage: "Too deep", title: "3 · The trouble with one tree", q: "What happens if the tree keeps growing?",
    points: ["Left alone, a tree splits until each leaf holds one or two answers.", "That's <b>memorising</b>: rules like “mentions Kubernetes → strong” from 2 examples.", "One tree is also unstable: change a few answers and the whole tree changes.", "Limits like maximum depth help, but a forest helps more."],
    pm: "If a tree's rules sound oddly specific when you read them, the tree is overfitting. Ask the team to limit its depth.",
    say: "Step three, the trouble with one tree. If we let a tree keep growing, it splits until every leaf holds just one or two answers. Now it's memorising. It might invent a rule like, mentions Kubernetes means strong, from only two examples. A single tree is also unstable. Change a few training answers, and you can get a completely different tree. That's high variance.",
    draw: drawDeep },
  { stage: "Forest", title: "4 · Random forests", q: "How do many trees beat one?",
    points: ["Train many trees, each on a <b>random sample</b> of answers and features.", "Each tree is a little different and makes different mistakes.", "To predict, the trees <b>vote</b>. The majority wins.", "Mistakes cancel out, so the forest is far more reliable."],
    pm: "Random forests are a great low-effort default for table data. They also rank feature importance, but important doesn't mean it causes the outcome.",
    say: "Step four, random forests. Instead of one tree, we train many. Each tree sees a random sample of the answers, and a random subset of the features, so each one turns out a little different. For answer X, four trees say strong and one says weak. The majority wins, so the forest says strong, with eighty percent of the votes. Each tree makes different mistakes, and the vote cancels them out.",
    draw: drawForest },
];
return { STEPS, picker: { label: "Trace an answer:", step: 0, items: () => ANS.map(a => ({ label: a.label, color: a.c })), get: () => ai, set: i => { ai = i; } } };
})();
VMETA[8] = {"title": "Twenty Questions, Then a Vote", "sub": "Trace interview answers down a decision tree, see how the questions are chosen and why one deep tree memorises, then watch a random forest vote."};
