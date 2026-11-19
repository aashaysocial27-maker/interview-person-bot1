VISUALS[26] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawGlobalLocal() {
  let s = svg(330);
  s += rect(15, 14, 295, 300, B, .05) + `<text x="30" y="40" font-size="14" font-weight="700" style="fill:${B}">Global: the model overall</text><text x="30" y="60" font-size="12" class="muted">which features matter across all answers</text>`;
  [["specific details", 34], ["states a result", 27], ["clear structure", 18], ["filler words", 13], ["length", 8]].forEach(([t, v], i) => { const y = 82 + i * 40; s += `<text x="30" y="${y + 14}" font-size="12">${t}</text><rect x="150" y="${y + 2}" width="${v * 3.8}" height="18" rx="3" style="fill:${B}" fill-opacity=".6"/><text x="${156 + v * 3.8}" y="${y + 16}" class="mono" font-size="11">${v}%</text>`; });
  s += rect(330, 14, 295, 300, A, .05) + `<text x="345" y="40" font-size="14" font-weight="700" style="fill:${A}">Local: one prediction</text><text x="345" y="60" font-size="12" class="muted">why this answer got this score</text>`;
  s += rect(345, 78, 265, 54, "var(--line)") + `<text x="357" y="100" font-size="12">“I led a redesign. It went well</text><text x="357" y="118" font-size="12">and the team liked it.”</text>`;
  s += arrow(477, 136, 477, 158);
  s += rect(345, 162, 265, 46, W, .12) + `<text x="477" y="190" text-anchor="middle" font-size="13" font-weight="700" style="fill:${W}">Weak, 49%</text>`;
  s += `<text x="357" y="234" font-size="12.5">Mainly because:</text><text x="357" y="256" font-size="12.5">• no measurable result</text><text x="357" y="276" font-size="12.5">• only one specific detail</text>`;
  s += `<text x="30" y="300" font-size="11" class="muted">Importance shares are illustrative.</text>`;
  return s + `</svg>`;
}

const ANS = [
  { label: "Answer X", c: "var(--t2)", text: "“I cut onboarding time 30% by rewriting the checklist with new hires.”", parts: [["specific details", 16], ["states a result", 12], ["clear structure", 3], ["filler words", -5]] },
  { label: "Answer Y", c: "var(--t4)", text: "“I'm a hard worker and I always give 110%.”", parts: [["specific details", -18], ["states a result", -14], ["clear structure", 0], ["filler words", -9]] },
  { label: "Answer Z", c: "var(--warm)", text: "“I led a redesign. It went well and the team liked it.”", parts: [["specific details", -10], ["states a result", 13], ["clear structure", -2], ["filler words", -2]] },
];
let ai = 0;
function drawShap() {
  const a = ANS[ai], X = v => 70 + v * 5.2;
  let s = svg(350);
  s += lbl(20, 22, "SHAP: HOW EACH FEATURE PUSHED THE SCORE");
  [0, 25, 50, 75, 100].forEach(v => { s += `<line x1="${X(v)}" y1="34" x2="${X(v)}" y2="262" style="stroke:var(--line)"/><text x="${X(v)}" y="278" text-anchor="middle" class="mono muted" font-size="10">${v}%</text>`; });
  let cur = 50, y = 40;
  s += `<rect x="${X(0)}" y="${y}" width="${X(50) - X(0)}" height="26" rx="3" style="fill:var(--muted)" fill-opacity=".25"/><text x="${X(50) + 8}" y="${y + 18}" font-size="12">average answer: 50%</text>`;
  a.parts.forEach(([t, v], i) => {
    y = 76 + i * 38;
    const from = cur, to = cur + v, c = v >= 0 ? A : W;
    s += `<rect x="${X(Math.min(from, to))}" y="${y}" width="${Math.max(Math.abs(X(to) - X(from)), 2)}" height="26" rx="3" style="fill:${c}" fill-opacity=".7"/>`;
    const lx = X(Math.max(from, to)) + 8;
    s += `<text x="${lx}" y="${y + 18}" font-size="12">${t} <tspan class="mono" font-weight="700" style="fill:${c}">${v > 0 ? "+" : ""}${v}</tspan></text>`;
    s += `<line x1="${X(to)}" y1="${y + 26}" x2="${X(to)}" y2="${y + 38}" style="stroke:var(--muted)" stroke-dasharray="2 2"/>`;
    cur = to;
  });
  y = 76 + 4 * 38;
  const strong = cur >= 50;
  s += `<rect x="${X(0)}" y="${y}" width="${X(cur) - X(0)}" height="28" rx="3" style="fill:${strong ? A : W}" fill-opacity=".9"/><text x="${X(cur) + 8}" y="${y + 19}" font-size="13" font-weight="700" style="fill:${strong ? A : W}">final: ${cur}% · ${strong ? "strong" : "weak"}</text>`;
  s += `<text x="20" y="306" font-size="12.5"><tspan font-weight="700" style="fill:${a.c}">${a.label}:</tspan> ${a.text}</text>`;
  s += `<text x="20" y="328" font-size="11.5" class="muted">The pushes always add up exactly to the final score. Pick an answer above. Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

function drawUsers() {
  let s = svg(330);
  s += rect(20, 16, 290, 120, W, .08) + `<text x="34" y="40" font-size="13" font-weight="700" style="fill:${W}">✗ What the model outputs</text><text x="34" y="66" class="mono" font-size="12">specific_details: −10</text><text x="34" y="86" class="mono" font-size="12">states_result: +13</text><text x="34" y="106" class="mono" font-size="12">score: 0.49</text>`;
  s += arrow(316, 76, 340, 76);
  s += rect(345, 16, 280, 120, A, .1) + `<text x="359" y="40" font-size="13" font-weight="700" style="fill:${A}">✓ What the candidate sees</text><text x="359" y="66" font-size="12.5">Close to strong. You mention a</text><text x="359" y="84" font-size="12.5">result, but give only one detail.</text><text x="359" y="112" font-size="12.5" font-weight="700">Add a number, like “cut 2 weeks”.</text>`;
  s += rect(20, 152, 605, 62, P, .08) + `<text x="34" y="176" font-size="13" font-weight="700" style="fill:${P}">Counterfactual explanation</text><text x="34" y="198" font-size="12.5">“If you add one concrete number, this answer would likely be rated strong.” It says what to change.</text>`;
  s += rect(20, 228, 605, 86, "var(--line)") + `<text x="34" y="252" font-size="13" font-weight="700">Model card: the explanation for teams and buyers</text><text x="34" y="274" font-size="12.5">What it's for · how it was tested · results by group · where it should not be used · known limits</text><text x="34" y="296" font-size="12" class="muted">A one-page document that ships with the model.</text>`;
  return s + `</svg>`;
}

function drawLimits() {
  let s = svg(320);
  const lims = [["Describes the model, not the truth", "If the model learned something wrong, the explanation faithfully describes the wrong thing."], ["Tangled features", "Length and number of details move together, so credit can split in confusing ways."], ["Important ≠ causes", "A feature that matters to the model doesn't prove it causes good answers."], ["Can be gamed", "Reveal exactly how scoring works, and people stuff in numbers without substance."]];
  lims.forEach(([t, d], i) => { const y = 14 + i * 64; s += rect(20, y, 605, 54, i ? G : W, .07) + `<text x="34" y="${y + 22}" font-size="13" font-weight="700" style="fill:${i ? G : W}">${t}</text><text x="34" y="${y + 42}" font-size="12">${d}</text>`; });
  s += `<text x="20" y="282" font-size="12.5">Hiring and lending often need explanations by law, so check what your markets require.</text><text x="20" y="302" font-size="12.5">Explanations are also one of the best ways to catch a model relying on something it shouldn't.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Global & local", title: "1 · Global and local explanations", q: "What kinds of explanation are there?",
    points: ["<b>Global</b>: which features matter most across all answers.", "<b>Local</b>: why this particular answer got this score.", "Users mostly need local explanations.", "Teams and auditors need both."],
    pm: "Ask for both views. Global importance checks the model makes sense overall; local explanations are what users actually see.",
    say: "Step one, global and local explanations. On the left, a global view of the model. Across all answers, specific details matter most, then a stated result, then structure. On the right, a local view of one prediction. This answer was rated weak, at forty nine percent, mainly because it has no measurable result and only one specific detail. Users mostly need the local kind.",
    draw: drawGlobalLocal },
  { stage: "SHAP", title: "2 · SHAP: splitting a prediction", q: "How much did each feature push this answer?",
    points: ["Start from the average answer: 50% strong.", "Each feature pushes the score up (green) or down (red).", "The pushes add up exactly to the final score.", "Pick an answer above. X ends at 76%, Y at 9%, Z at 49%."],
    pm: "SHAP works for almost any model, even gradient boosting and neural networks, which makes it a common way to add explanations to a product.",
    say: "Step two, SHAP. We start from the average answer, fifty percent strong. For answer X, specific details push the score up by sixteen points, and a clear result adds twelve. Filler words take away five. The pushes add up exactly to the final score, seventy six percent. Now pick answer Y. Almost everything pushes down, to nine percent. And answer Z lands just under the line at forty nine.",
    draw: drawShap },
  { stage: "For users", title: "3 · Explaining to users", q: "How do we turn numbers into useful advice?",
    points: ["Raw scores mean little to a candidate.", "Translate into plain, actionable advice.", "A <b>counterfactual</b> says what to change: “add one concrete number”.", "A <b>model card</b> documents the model for teams and buyers."],
    pm: "Design explanations as part of the experience: short, actionable, honest about uncertainty. They're a feature users value, not just a compliance box.",
    say: "Step three, explaining to users. The model outputs numbers like minus ten and plus thirteen. That means nothing to a candidate. Instead, say, close to strong. You mention a result, but give only one detail. Add a number. Even better is a counterfactual. If you add one concrete number, this answer would likely be rated strong. And for teams and buyers, a model card documents what the model is for and where not to use it.",
    draw: drawUsers },
  { stage: "Limits", title: "4 · Limits of explanations", q: "Can we trust explanations completely?",
    points: ["They describe the model, not the truth.", "Tangled features can split credit confusingly.", "Important doesn't mean causes.", "Revealing exact scoring invites gaming."],
    pm: "Use explanations to check the model too. If one leans on something it shouldn't, like accent or school name, you've found a fairness problem early.",
    say: "Step four, the limits. Explanations describe the model, not the truth. If the model learned something wrong, the explanation will describe the wrong thing faithfully. Tangled features can split credit in confusing ways. Important doesn't mean it causes good answers. And if you reveal exactly how scoring works, people may game it.",
    draw: drawLimits },
];
return { STEPS, picker: { label: "Explain:", step: 1, items: () => ANS.map(a => ({ label: a.label, color: a.c })), get: () => ai, set: i => { ai = i; } } };
})();
VMETA[26] = {"title": "Why Did It Say That?", "sub": "Look at the interview coach globally and locally, split one prediction into the push from each feature, turn it into advice a candidate can use, and know the limits."};
