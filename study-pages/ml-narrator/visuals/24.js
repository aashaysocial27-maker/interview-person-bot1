VISUALS[24] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawContent() {
  let s = svg(330);
  s += lbl(20, 22, "CANDIDATE STRUGGLED WITH");
  s += rect(20, 32, 270, 70, W, .1, 2) + `<text x="34" y="56" font-size="12.5" font-weight="700">“Tell me about a conflict with a teammate.”</text><text x="34" y="82" class="mono" font-size="11">topic: conflict · level: medium</text>`;
  s += lbl(320, 22, "QUESTION BANK, MATCHED BY FEATURES");
  const qs = [["“A time you disagreed with your manager.”", "conflict · medium", 1], ["“How did you handle a difficult stakeholder?”", "conflict · hard", 1], ["“Describe your biggest launch.”", "results · medium", 0], ["“Why do you want this role?”", "motivation · easy", 0]];
  qs.forEach(([q, t, m], i) => { const y = 32 + i * 52; s += rect(320, y, 300, 44, m ? A : "var(--line)", m ? .12 : 0, m ? 2 : 1) + `<text x="332" y="${y + 19}" font-size="11.5" ${m ? 'font-weight="700"' : ""}>${q}</text><text x="332" y="${y + 36}" class="mono" font-size="10.5" ${m ? `style="fill:${A}"` : 'class="muted"'}>${t}${m ? "  ✓ recommend" : ""}</text>`; });
  s += arrow(292, 66, 316, 56, A) + arrow(292, 72, 316, 108, A);
  s += rect(20, 252, 295, 66, A, .07) + `<text x="34" y="274" font-size="12.5" font-weight="700" style="fill:${A}">Works for brand-new questions</text><text x="34" y="294" font-size="12">as long as we know their features.</text>`;
  s += rect(330, 252, 290, 66, W, .07) + `<text x="344" y="274" font-size="12.5" font-weight="700" style="fill:${W}">Rarely surprises</text><text x="344" y="294" font-size="12">It only finds more of the same.</text>`;
  return s + `</svg>`;
}

/* rows: candidates, cols: questions. 1 = found it helpful, 0 = not, null = not tried */
const Q = ["Conflict", "Launch", "Failure", "Leadership", "Pricing"];
const U = { Priya: [1, 0, 1, null, 1], Tom: [1, 0, 1, 1, null], Ana: [0, 1, 0, 0, 1], Raj: [0, 1, null, 0, 1], You: [1, 0, 1, null, null] };
const TARGETS = [{ label: "You → Leadership", u: "You", q: 3, sim: "Tom", c: "var(--accent)" }, { label: "You → Pricing", u: "You", q: 4, sim: "Priya", c: "var(--t4)" }, { label: "Raj → Failure", u: "Raj", q: 2, sim: "Ana", c: "var(--t2)" }];
let ti = 0;
function drawCollab() {
  const T = TARGETS[ti], names = Object.keys(U), X0 = 120, Y0 = 50, cw = 74, ch = 40;
  let s = svg(340);
  s += lbl(20, 22, "WHO FOUND WHICH PRACTICE QUESTION HELPFUL");
  Q.forEach((q, j) => { s += `<text x="${X0 + j * cw + cw / 2}" y="${Y0 - 8}" text-anchor="middle" font-size="11.5" font-weight="700" ${j === T.q ? `style="fill:${T.c}"` : ""}>${q}</text>`; });
  names.forEach((n, i) => {
    const y = Y0 + i * ch, isU = n === T.u, isS = n === T.sim;
    s += `<text x="${X0 - 12}" y="${y + 25}" text-anchor="end" font-size="12.5" font-weight="${isU || isS ? 700 : 400}" ${isU ? `style="fill:${T.c}"` : isS ? `style="fill:${G}"` : ""}>${n}${isS ? " (similar)" : ""}</text>`;
    U[n].forEach((v, j) => {
      const target = isU && j === T.q, x = X0 + j * cw;
      const fill = target ? T.c : v === 1 ? A : v === 0 ? W : "var(--bg)";
      s += `<rect x="${x + 3}" y="${y + 3}" width="${cw - 6}" height="${ch - 6}" rx="5" style="fill:${fill};stroke:${target ? "var(--ink)" : isS ? G : "var(--line)"}" fill-opacity="${target ? .3 : v === null ? 1 : .2}" stroke-width="${target ? 2.2 : isS ? 1.6 : 1}"/>`;
      s += `<text x="${x + cw / 2}" y="${y + 25}" text-anchor="middle" font-size="13" font-weight="700" ${target ? `style="fill:${T.c}"` : ""}>${target ? "?" : v === 1 ? "✓" : v === 0 ? "✗" : "·"}</text>`;
    });
  });
  const pred = U[T.sim][T.q];
  const bx = 510;
  s += `<text x="${bx}" y="${Y0 + 20}" font-size="12">${T.u}'s past</text><text x="${bx}" y="${Y0 + 36}" font-size="12">matches</text><text x="${bx}" y="${Y0 + 52}" font-size="12" font-weight="700" style="fill:${G}">${T.sim}</text>`;
  s += rect(bx - 6, Y0 + 70, 124, 70, T.c, .14, 2) + `<text x="${bx + 56}" y="${Y0 + 96}" text-anchor="middle" font-size="12">Predict:</text><text x="${bx + 56}" y="${Y0 + 120}" text-anchor="middle" font-size="14" font-weight="700" style="fill:${T.c}">${pred ? "helpful ✓" : "not helpful"}</text>`;
  s += `<text x="20" y="${Y0 + 5 * ch + 26}" font-size="12.5">No question features needed: just who liked what. Real systems learn an embedding for each</text><text x="20" y="${Y0 + 5 * ch + 44}" font-size="12.5">person and question (matrix factorization) instead of matching one neighbour. Pick a blank above.</text>`;
  return s + `</svg>`;
}

function drawFunnel() {
  let s = svg(330);
  const st = [["Question bank", "10,000", 560, "var(--muted)"], ["Candidate generation", "300", 420, B], ["Ranking", "20", 280, P], ["Re-ranking", "5 shown", 160, A]];
  st.forEach(([t, n, w, c], i) => {
    const y = 20 + i * 66, x = 320 - w / 2;
    s += `<rect x="${x}" y="${y}" width="${w}" height="52" rx="8" style="fill:${c};stroke:${c}" fill-opacity=".14" stroke-width="1.5"/><text x="320" y="${y + 23}" text-anchor="middle" font-size="13" font-weight="700">${t}</text><text x="320" y="${y + 41}" text-anchor="middle" class="mono" font-size="12">${n}</text>`;
  });
  const notes = [["", ""], ["fast and rough", "matching"], ["careful model scores", "each for this user"], ["rules: mix topics,", "add fresh, drop done"]];
  notes.forEach(([a, b], i) => { if (!a) return; const y = 20 + i * 66; s += `<text x="${320 + st[i][2] / 2 + 12}" y="${y + 23}" font-size="11.5" class="muted">${a}</text><text x="${320 + st[i][2] / 2 + 12}" y="${y + 39}" font-size="11.5" class="muted">${b}</text>`; });
  s += `<text x="20" y="300" font-size="12.5">Each stage is slower but smarter, so the expensive model only looks at a few hundred items.</text>`;
  s += `<text x="20" y="320" font-size="11" class="muted">Counts are illustrative.</text>`;
  return s + `</svg>`;
}

function drawPitfalls() {
  let s = svg(330);
  s += rect(20, 16, 295, 170, B, .07) + `<text x="34" y="40" font-size="14" font-weight="700" style="fill:${B}">Cold start</text><text x="34" y="62" font-size="12.5">New user or new question:</text><text x="34" y="80" font-size="12.5">no history to learn from.</text>`;
  ["Ask 3 onboarding questions", "Use content features", "Start with popular picks"].forEach((t, i) => { s += `<text x="34" y="${110 + i * 22}" font-size="12.5">→ ${t}</text>`; });
  s += rect(330, 16, 295, 170, W, .07) + `<text x="344" y="40" font-size="14" font-weight="700" style="fill:${W}">Feedback loop</text>`;
  const cx = 478, cy = 118, r = 46;
  [["shown", -90], ["clicked", 30], ["learned", 150]].forEach(([t, a], i) => { const x = cx + Math.cos(a * Math.PI / 180) * r, y = cy + Math.sin(a * Math.PI / 180) * r; s += `<circle cx="${x}" cy="${y}" r="22" style="fill:${W}" fill-opacity=".15"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11">${t}</text>`; });
  s += `<path d="M${cx + 20} ${cy - 46} A ${r} ${r} 0 0 1 ${cx + 44} ${cy + 4}" fill="none" style="stroke:${W}" marker-end="url(#ah)"/><path d="M${cx + 26} ${cy + 40} A ${r} ${r} 0 0 1 ${cx - 26} ${cy + 40}" fill="none" style="stroke:${W}" marker-end="url(#ah)"/><path d="M${cx - 44} ${cy + 4} A ${r} ${r} 0 0 1 ${cx - 20} ${cy - 46}" fill="none" style="stroke:${W}" marker-end="url(#ah)"/>`;
  s += `<text x="344" y="62" font-size="12">only learns from what it showed</text>`;
  s += rect(20, 200, 605, 112, A, .07) + `<text x="34" y="224" font-size="13" font-weight="700" style="fill:${A}">What should it optimise?</text><text x="34" y="246" font-size="12.5">Clicks or time spent are easy to measure, but can reward the wrong thing.</text><text x="34" y="266" font-size="12.5">For the coach: practice that leads to <tspan font-weight="700">improvement</tspan>. Add diversity and some exploration,</text><text x="34" y="286" font-size="12.5">and show a reason: “because you struggled with conflict questions”.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Content", title: "1 · Content-based filtering", q: "How do we recommend from what an item is?",
    points: ["Each question has features: topic, level, role.", "The candidate struggled with a conflict question.", "Recommend other conflict questions at a similar level.", "Works for new questions, but rarely surprises."],
    pm: "Content-based recommendations are easy to explain (“because it's also about conflict”) and work from day one, which makes them a good starting point.",
    say: "Step one, content based filtering. Every practice question has features, its topic, level and role. Our candidate struggled with a question about conflict with a teammate. So the coach recommends other conflict questions at a similar level, like a time you disagreed with your manager. It works even for brand new questions. But it rarely surprises anyone, because it only finds more of the same.",
    draw: drawContent },
  { stage: "Collaborative", title: "2 · Collaborative filtering", q: "How do we recommend from what similar people liked?",
    points: ["A table of candidates and questions: ✓ helpful, ✗ not, · not tried.", "Find someone whose past matches yours.", "Predict the blank from what they found helpful.", "Pick a blank above to see whose history it borrows."],
    pm: "Collaborative filtering finds surprising, useful suggestions no rule would produce, but it needs plenty of behaviour data to work.",
    say: "Step two, collaborative filtering. This table shows which practice questions each candidate found helpful. You haven't tried leadership yet. Your past matches Tom's almost exactly, and Tom found leadership helpful, so we predict you will too. Now pick Raj and failure. Raj's history matches Ana's, and Ana didn't find it helpful. No question features needed, just who liked what.",
    draw: drawCollab },
  { stage: "Funnel", title: "3 · The ranking funnel", q: "How do big systems stay fast?",
    points: ["<b>Candidate generation</b>: 10,000 questions → 300, fast and rough.", "<b>Ranking</b>: a careful model scores those 300 for this user.", "<b>Re-ranking</b>: rules for variety, freshness and removing done items.", "The user sees 5."],
    pm: "The re-ranking stage is where product rules live. That's where you control diversity, freshness and business priorities without retraining models.",
    say: "Step three, the ranking funnel. Real systems work in stages. Candidate generation quickly narrows ten thousand questions to about three hundred. A more careful ranking model then scores each of those for this candidate. Finally, re ranking applies product rules, mixing topics, adding something fresh, and dropping questions already done. The candidate sees five.",
    draw: drawFunnel },
  { stage: "Pitfalls", title: "4 · Cold start and feedback loops", q: "What goes wrong with recommenders?",
    points: ["<b>Cold start</b>: no history for new users or questions.", "Fix with onboarding questions, content features, popular picks.", "<b>Feedback loop</b>: it only learns from what it showed, creating a bubble.", "Choose the goal carefully: improvement, not just clicks."],
    pm: "What the recommender optimises is a product decision with real consequences. Pick a goal that reflects user value, and plan the new-user experience.",
    say: "Step four, cold start and feedback loops. A new candidate has no history, so collaborative filtering has nothing to go on. Fix it with a few onboarding questions, content features, or popular picks. Then there's the feedback loop. The system only learns from what it showed, so it can keep showing more of the same. And choose the goal carefully. For our coach, that's practice that leads to improvement, not just clicks.",
    draw: drawPitfalls },
];
return { STEPS, picker: { label: "Predict a blank:", step: 1, items: () => TARGETS.map(t => ({ label: t.label, color: t.c })), get: () => ti, set: i => { ti = i; } } };
})();
VMETA[24] = {"title": "What Should We Show Next?", "sub": "Recommend the interview coach's next practice question by content, by similar candidates, and through a ranking funnel, then handle cold starts and feedback loops."};
