VISUALS[11] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const X = v => 50 + v * 30, Y = v => 300 - v * 27;

/* three blobs of unrated answers: x = length (0-10), y = specific details (0-10) */
const r1 = rng(5), PTS = [];
[[2.2, 2.4], [7.6, 3.0], [4.6, 7.6]].forEach(([cx, cy]) => { for (let i = 0; i < 16; i++) PTS.push([cx + (r1() - .5) * 3.2, cy + (r1() - .5) * 3.0]); });
const COLS = [B, P, G], BLOBS = [[2.2, 2.4, "Too short"], [7.6, 3.0, "Rambling, no result"], [4.6, 7.6, "Specific, on point"]];
const nameFor = q => BLOBS.reduce((b, z) => ((q[0] - z[0]) ** 2 + (q[1] - z[1]) ** 2 < (q[0] - b[0]) ** 2 + (q[1] - b[1]) ** 2 ? z : b))[2];
/* precompute k-means iterations from fixed starting centres */
const ITERS = [];
(() => {
  let c = [[1.2, 8.6], [9.2, 5.6], [4.4, 3.6]];
  for (let it = 0; it < 6; it++) {
    const asg = PTS.map(p => { let b = 0, bd = 1e9; c.forEach((q, k) => { const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (d < bd) { bd = d; b = k; } }); return b; });
    ITERS.push({ c: c.map(q => q.slice()), asg });
    c = c.map((q, k) => { const m = PTS.filter((_, i) => asg[i] === k); return m.length ? [m.reduce((a, p) => a + p[0], 0) / m.length, m.reduce((a, p) => a + p[1], 0) / m.length] : q; });
  }
})();
const VIEW = [{ label: "Start", it: -1 }, { label: "Round 1", it: 0 }, { label: "Round 2", it: 1 }, { label: "Done", it: 5 }];
let vi = 0;
function axes(xl, yl) {
  let s = "";
  for (let v = 0; v <= 10; v += 2) s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(10)}" style="stroke:var(--line)"/><line x1="${X(0)}" y1="${Y(v)}" x2="${X(10)}" y2="${Y(v)}" style="stroke:var(--line)"/>`;
  return s + `<text x="${X(5)}" y="${Y(0) + 20}" text-anchor="middle" font-size="12" class="muted">${xl}</text><text x="20" y="${Y(5)}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 20 ${Y(5)})">${yl}</text>`;
}
function drawKMeans() {
  const v = VIEW[vi], st = v.it < 0 ? { c: ITERS[0].c, asg: null } : ITERS[v.it];
  let s = svg(340) + axes("Answer length →", "Specific details →");
  PTS.forEach((p, i) => { const c = st.asg ? COLS[st.asg[i]] : "var(--muted)"; s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" style="fill:${c}" fill-opacity=".8"/>`; });
  st.c.forEach((q, k) => { s += `<path d="M${X(q[0]) - 9} ${Y(q[1]) - 9} L${X(q[0]) + 9} ${Y(q[1]) + 9} M${X(q[0]) + 9} ${Y(q[1]) - 9} L${X(q[0]) - 9} ${Y(q[1]) + 9}" style="stroke:${COLS[k]}" stroke-width="4"/><circle cx="${X(q[0])}" cy="${Y(q[1])}" r="13" style="fill:none;stroke:var(--ink)" stroke-width="1.3"/>`; });
  if (v.label === "Done") st.c.forEach((q, k) => { s += `<text x="${X(q[0])}" y="${Y(q[1]) + 30}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${COLS[k]}">${nameFor(q)}</text>`; });
  const bx = 400;
  s += lbl(bx, 40, `K-MEANS · K = 3 · ${v.label.toUpperCase()}`);
  const msg = { "Start": ["Drop 3 centres (✕) at random.", "No answer belongs to a group yet."], "Round 1": ["Each answer joins its nearest centre.", "Then each centre moves to the middle", "of its answers."], "Round 2": ["Repeat: re-assign, then move.", "The groups settle down."], "Done": ["Nothing changes any more.", "A person names each group."] }[v.label];
  msg.forEach((t, i) => { s += `<text x="${bx}" y="${70 + i * 20}" font-size="12.5">${t}</text>`; });
  s += rect(bx, 150, 225, 70, A, .07) + `<text x="${bx + 12}" y="172" font-size="12.5" font-weight="700" style="fill:${A}">No labels used</text><text x="${bx + 12}" y="192" font-size="12">48 unrated answers, grouped only</text><text x="${bx + 12}" y="208" font-size="12">by how similar they are.</text>`;
  s += `<text x="${bx}" y="256" font-size="11" class="muted">Step through the rounds above.</text><text x="${bx}" y="272" font-size="11" class="muted">Data is illustrative.</text>`;
  return s + `</svg>`;
}

function drawElbow() {
  let s = svg(320);
  const vals = [100, 58, 22, 18, 15, 13], X0 = 80, Y0 = 250, sx = 80, sy = 2;
  s += `<line x1="${X0 - 20}" y1="${Y0}" x2="${X0 + 5 * sx + 30}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0 - 20}" y1="${Y0}" x2="${X0 - 20}" y2="${Y0 - 210}" style="stroke:var(--ink)"/>`;
  s += `<path d="${vals.map((v, i) => `${i ? "L" : "M"}${X0 + i * sx} ${Y0 - v * sy}`).join(" ")}" fill="none" style="stroke:${B}" stroke-width="2.5"/>`;
  vals.forEach((v, i) => { const on = i === 2; s += `<circle cx="${X0 + i * sx}" cy="${Y0 - v * sy}" r="${on ? 9 : 5}" style="fill:${on ? A : B}"/><text x="${X0 + i * sx}" y="${Y0 + 20}" text-anchor="middle" class="mono" font-size="12">k=${i + 1}</text>`; });
  s += `<text x="${X0 + 2 * sx + 14}" y="${Y0 - 22 * sy - 14}" font-size="13" font-weight="700" style="fill:${A}">the elbow: k = 3</text>`;
  s += `<text x="${X0 + 3.4 * sx}" y="${Y0 - 130}" font-size="12" class="muted">after this, extra groups</text><text x="${X0 + 3.4 * sx}" y="${Y0 - 114}" font-size="12" class="muted">barely help</text>`;
  s += `<text x="30" y="${Y0 - 105}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 30 ${Y0 - 105})">Spread inside groups →</text>`;
  s += `<text x="20" y="300" font-size="12" class="muted">Then a person looks inside each group and names it. Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

/* anomaly: sessions per day vs answers per minute */
const r2 = rng(17), NORMAL = Array.from({ length: 40 }, () => [3 + (r2() - .5) * 3.6 + 1, 3.2 + (r2() - .5) * 3.0]);
const ODD = [[8.8, 8.6, "script: 40 answers a minute"], [9.2, 1.2, "47 sessions in one day"], [1.0, 8.4, "same answer pasted 30 times"]];
function drawAnomaly() {
  let s = svg(340) + axes("Sessions per day →", "Answers per minute →");
  s += `<ellipse cx="${X(4)}" cy="${Y(3.2)}" rx="${2.6 * 30}" ry="${2.2 * 27}" style="fill:${A};stroke:${A}" fill-opacity=".08" stroke-dasharray="5 4" stroke-width="1.5"/>`;
  s += `<text x="${X(4)}" y="${Y(6.0)}" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">normal</text>`;
  NORMAL.forEach(p => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" style="fill:var(--muted)" fill-opacity=".7"/>`; });
  ODD.forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="7" style="fill:${W}"/><circle cx="${X(x)}" cy="${Y(y)}" r="13" style="fill:none;stroke:${W}" stroke-width="1.6"/>`; });
  const bx = 400;
  s += lbl(bx, 40, "FLAGGED: FAR FROM NORMAL");
  ODD.forEach(([, , t], i) => { s += rect(bx, 52 + i * 46, 225, 38, W, .1) + `<text x="${bx + 12}" y="${76 + i * 46}" font-size="12">${t}</text>`; });
  s += rect(bx, 200, 225, 76, P, .07) + `<text x="${bx + 12}" y="222" font-size="12.5" font-weight="700" style="fill:${P}">Isolation forest</text><text x="${bx + 12}" y="242" font-size="12">Odd points need only a few</text><text x="${bx + 12}" y="258" font-size="12">random splits to be cut off alone.</text>`;
  s += `<text x="${bx}" y="298" font-size="11" class="muted">Data is illustrative.</text>`;
  return s + `</svg>`;
}

function drawThreshold() {
  let s = svg(330);
  const bins = [2, 9, 20, 28, 22, 14, 8, 5, 3, 2, 1, 1], X0 = 60, bw = 44, Y0 = 220;
  s += lbl(20, 22, "ANOMALY SCORE FOR 115 SESSIONS (HIGHER = ODDER)");
  bins.forEach((n, i) => { s += `<rect x="${X0 + i * bw}" y="${Y0 - n * 5.5}" width="${bw - 4}" height="${n * 5.5}" rx="3" style="fill:${i >= 9 ? W : "var(--muted)"}" fill-opacity="${i >= 9 ? .8 : .45}"/>`; });
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + 12 * bw}" y2="${Y0}" style="stroke:var(--ink)"/>`;
  const th = (i, t, c, y, end) => `<line x1="${X0 + i * bw - 2}" y1="40" x2="${X0 + i * bw - 2}" y2="${Y0 + 8}" style="stroke:${c}" stroke-width="2" stroke-dasharray="6 4"/><text x="${X0 + i * bw + (end ? -8 : 4)}" y="${y}" ${end ? 'text-anchor="end"' : ""} font-size="12" font-weight="700" style="fill:${c}">${t}</text>`;
  s += th(6, "too low: 20 alerts a day", G, 52) + th(9, "balanced: 4 alerts", A, 72) + th(11, "too high:", P, 92) + `<text x="${X0 + 11 * bw + 4}" y="108" font-size="12" font-weight="700" style="fill:${P}">1 alert</text>`;
  s += rect(20, 244, 290, 72, G, .08) + `<text x="34" y="266" font-size="12.5" font-weight="700" style="fill:${G}">Too many alerts</text><text x="34" y="286" font-size="12">People stop reading them,</text><text x="34" y="302" font-size="12">and real problems get missed.</text>`;
  s += rect(330, 244, 295, 72, P, .08) + `<text x="344" y="266" font-size="12.5" font-weight="700" style="fill:${P}">Unusual is not always bad</text><text x="344" y="286" font-size="12">A burst of odd sessions may be a</text><text x="344" y="302" font-size="12">new kind of user. Review, then decide.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "K-means", title: "1 · K-means clustering", q: "How does a model find groups with no labels?",
    points: ["Choose k, the number of groups. Here k = 3.", "Drop k centres at random.", "Each answer joins its <b>nearest centre</b>, then each centre moves to the <b>middle</b> of its answers.", "Repeat until nothing changes. Step through the rounds above."],
    pm: "Clustering turns a pile of unlabelled behaviour into candidate segments in minutes. It's a great first step before you write personas or label data.",
    say: "Step one, k means clustering. We have forty eight unrated answers, and we ask for three groups. The algorithm drops three centres at random. Now step to round one. Each answer joins its nearest centre, and then each centre moves to the middle of its answers. Round two, repeat. The groups settle. When nothing changes, we're done, and a person names each group, like too short, or rambling with no result.",
    draw: drawKMeans },
  { stage: "Choose k", title: "2 · Choosing k and reading clusters", q: "How many groups should we ask for?",
    points: ["Try several values of k and measure how tight the groups are.", "Each extra group helps, until the gains suddenly flatten: the <b>elbow</b>.", "The algorithm only finds groups. People name them and check they make sense.", "Results can change between runs, so teams run it several times."],
    pm: "Treat clusters as a hypothesis, not a fact. Read real examples from each group before building a feature around it.",
    say: "Step two, choosing k. There's no single right number of groups. So we try several, and measure how tight the groups are. Going from one group to two helps a lot. Two to three helps a lot too. But after three, the line flattens. That bend is called the elbow, and it's a good choice. Then a person looks inside each group and decides what it means.",
    draw: drawElbow },
  { stage: "Anomalies", title: "3 · Anomaly detection", q: "How do we spot the odd ones out?",
    points: ["Learn what <b>normal</b> looks like, then flag what sits far from it.", "Here: a script answering 40 times a minute, 47 sessions in a day, one answer pasted 30 times.", "Banks use this for fraud; factories for machines about to fail.", "An <b>isolation forest</b> finds odd points because they're easy to cut off alone."],
    pm: "Anomaly detection needs no labelled examples of fraud or failure, which is perfect when bad events are rare and you don't know what they'll look like.",
    say: "Step three, anomaly detection. The model learns what normal sessions look like, the cloud in the middle. Then it flags anything far away. A script answering forty questions a minute. Forty seven sessions in one day. The same answer pasted thirty times. Banks use the same idea for fraud, and factories use it to spot a machine that's about to fail.",
    draw: drawAnomaly },
  { stage: "Thresholds", title: "4 · Thresholds and alerts", q: "When should an oddity raise an alert?",
    points: ["Every session gets an <b>anomaly score</b>. You choose the threshold.", "Too low: a flood of false alarms that people learn to ignore.", "Too high: real problems slip through.", "Unusual isn't always bad. Review alerts before acting."],
    pm: "Pick the threshold with the people who handle the alerts. A daily number they can actually review beats a perfect score nobody reads.",
    say: "Step four, thresholds and alerts. Each session gets an anomaly score, and you decide where to draw the line. Too low, and you get twenty alerts a day. People stop reading them. Too high, and you catch only one, and real problems slip through. And remember, unusual isn't always bad. A burst of odd sessions might be a brand new kind of user.",
    draw: drawThreshold },
];
return { STEPS, picker: { label: "Show:", step: 0, items: () => VIEW.map(v => ({ label: v.label, color: "var(--t2)" })), get: () => vi, set: i => { vi = i; } } };
})();
VMETA[11] = {"title": "Finding Groups and Oddballs", "sub": "Watch k-means sort unrated interview answers into groups, pick how many groups to ask for, then spot the sessions that don't fit and decide when to raise an alert."};
