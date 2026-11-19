VISUALS[13] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="1.5" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

const ROWS = [["Answer 1", 8, 7], ["Answer 2", 3, 4], ["Answer 3", 6, 6], ["Answer 4", 9, 5]];
function drawWhat() {
  let s = svg(320);
  s += lbl(20, 22, "PREDICTED VS REAL COACH SCORE");
  const cx = [30, 170, 290, 400, 520];
  ["ANSWER", "REAL", "PREDICTED", "MISS", "MISS²"].forEach((h, i) => { s += `<text x="${cx[i]}" y="50" class="mono muted" font-size="11">${h}</text>`; });
  let tot = 0;
  ROWS.forEach(([n, r, p], i) => {
    const y = 60 + i * 38, m = p - r; tot += m * m;
    s += rect(20, y, 600, 30) + `<text x="${cx[0]}" y="${y + 20}" font-size="13">${n}</text><text x="${cx[1]}" y="${y + 20}" class="mono" font-size="13">${r}</text><text x="${cx[2]}" y="${y + 20}" class="mono" font-size="13">${p}</text>`;
    s += `<text x="${cx[3]}" y="${y + 20}" class="mono" font-size="13" style="fill:${m ? W : A}">${m > 0 ? "+" : ""}${m}</text><text x="${cx[4]}" y="${y + 20}" class="mono" font-size="13" font-weight="700" style="fill:${m * m > 4 ? W : "var(--ink)"}">${m * m}</text>`;
  });
  s += arrow(540, 214, 540, 238);
  s += rect(330, 242, 290, 56, A, .12, 2) + `<text x="344" y="266" font-size="13">Average = (1+1+0+16) ÷ 4</text><text x="344" y="288" font-size="15" font-weight="700" style="fill:${A}">Loss = ${(tot / 4).toFixed(1)}</text>`;
  s += `<text x="20" y="266" font-size="12.5">One number for the whole batch.</text><text x="20" y="286" font-size="12.5">Training tries to make it smaller.</text>`;
  return s + `</svg>`;
}

function drawNumbers() {
  let s = svg(330);
  const X0 = 70, Y0 = 250, sx = 50, sy = 12;
  s += `<line x1="${X0 - 10}" y1="${Y0}" x2="${X0 + 5 * sx + 10}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - 17 * sy}" style="stroke:var(--ink)"/>`;
  for (let m = 0; m <= 5; m++) s += `<text x="${X0 + m * sx}" y="${Y0 + 16}" text-anchor="middle" class="mono muted" font-size="10">${m}</text>`;
  [0, 4, 8, 12, 16].forEach(v => { s += `<text x="${X0 - 8}" y="${Y0 - v * sy + 4}" text-anchor="end" class="mono muted" font-size="10">${v}</text>`; });
  s += `<text x="${X0 + 2.5 * sx}" y="${Y0 + 34}" text-anchor="middle" font-size="12" class="muted">Size of the miss (points)</text><text x="30" y="${Y0 - 8 * sy}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 30 ${Y0 - 8 * sy})">Penalty →</text>`;
  const pts = f => Array.from({ length: 41 }, (_, i) => { const m = i / 10; return `${i ? "L" : "M"}${X0 + m * sx} ${Y0 - Math.min(f(m), 17) * sy}`; }).join(" ");
  s += `<path d="${pts(m => m * m)}" fill="none" style="stroke:${W}" stroke-width="2.5"/><path d="${pts(m => m)}" fill="none" style="stroke:${B}" stroke-width="2.5"/>`;
  s += `<text x="${X0 + 4.1 * sx}" y="${Y0 - 16.5 * sy}" font-size="12.5" font-weight="700" style="fill:${W}">squared: 4 → 16</text><text x="${X0 + 4.1 * sx}" y="${Y0 - 4 * sy - 10}" font-size="12.5" font-weight="700" style="fill:${B}">absolute: 4 → 4</text>`;
  const bx = 380;
  s += lbl(bx, 40, "ONE WILD OUTLIER");
  s += `<text x="${bx}" y="64" font-size="12.5">Misses: 1, 1, 0 and one of 4</text>`;
  s += rect(bx, 78, 245, 58, W, .1) + `<text x="${bx + 12}" y="100" font-size="12.5" font-weight="700" style="fill:${W}">Squared error: 4.5</text><text x="${bx + 12}" y="120" font-size="12">the one big miss is 89% of it</text>`;
  s += rect(bx, 146, 245, 58, B, .1) + `<text x="${bx + 12}" y="168" font-size="12.5" font-weight="700" style="fill:${B}">Absolute error: 1.5</text><text x="${bx + 12}" y="188" font-size="12">every miss counts evenly</text>`;
  s += `<text x="${bx}" y="234" font-size="12.5">Squared: big misses are worst.</text><text x="${bx}" y="254" font-size="12.5">Absolute: calmer about outliers.</text>`;
  return s + `</svg>`;
}

const CONF = [{ label: "95% strong", p: .95, c: "var(--accent)" }, { label: "60% strong", p: .6, c: "var(--warm)" }, { label: "10% strong", p: .1, c: "var(--t3)" }];
let ci = 0;
function drawLog() {
  const X0 = 70, Y0 = 260, Wd = 300, Ht = 210, mx = 3.2, px = p => X0 + p * Wd, py = l => Y0 - Math.min(l, mx) / mx * Ht;
  let s = svg(330);
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + Wd}" y2="${Y0}" style="stroke:var(--ink)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - Ht}" style="stroke:var(--ink)"/>`;
  [0, .5, 1].forEach(p => { s += `<text x="${px(p)}" y="${Y0 + 16}" text-anchor="middle" class="mono muted" font-size="10">${p}</text>`; });
  [0, 1, 2, 3].forEach(l => { s += `<text x="${X0 - 8}" y="${py(l) + 4}" text-anchor="end" class="mono muted" font-size="10">${l}</text>`; });
  s += `<text x="${X0 + Wd / 2}" y="${Y0 + 34}" text-anchor="middle" font-size="12" class="muted">Probability the model gave to “strong”</text><text x="32" y="${Y0 - Ht / 2}" text-anchor="middle" font-size="12" class="muted" transform="rotate(-90 32 ${Y0 - Ht / 2})">Loss →</text>`;
  s += `<path d="${Array.from({ length: 96 }, (_, i) => { const p = .04 + i / 100; return `${i ? "L" : "M"}${px(p)} ${py(-Math.log(p))}`; }).join(" ")}" fill="none" style="stroke:var(--ink)" stroke-width="2.2"/>`;
  const c = CONF[ci], l = -Math.log(c.p);
  s += `<line x1="${px(c.p)}" y1="${Y0}" x2="${px(c.p)}" y2="${py(l)}" style="stroke:${c.c}" stroke-dasharray="4 3"/><circle cx="${px(c.p)}" cy="${py(l)}" r="8" style="fill:${c.c}"/>`;
  const bx = 400;
  s += lbl(bx, 40, "THE REAL ANSWER WAS STRONG");
  s += rect(bx, 52, 225, 74, c.c, .12) + `<text x="${bx + 12}" y="76" font-size="13">Model said: <tspan font-weight="700">${c.label}</tspan></text><text x="${bx + 12}" y="104" font-size="18" font-weight="700" style="fill:${c.c}">Loss = ${l.toFixed(2)}</text>`;
  s += `<text x="${bx}" y="152" font-size="12.5">${ci === 0 ? "Confident and right: tiny loss." : ci === 1 ? "Right, but unsure: some loss." : "Confidently wrong: big loss."}</text>`;
  s += `<text x="${bx}" y="182" font-size="12.5">The curve shoots up as confidence</text><text x="${bx}" y="200" font-size="12.5">in the right answer falls.</text>`;
  s += `<text x="${bx}" y="230" font-size="12.5">This teaches the model to be</text><text x="${bx}" y="248" font-size="12.5">honest about uncertainty.</text>`;
  s += `<text x="${bx}" y="282" font-size="11" class="muted">Pick a confidence above.</text>`;
  return s + `</svg>`;
}

function drawWeighted() {
  let s = svg(330);
  s += lbl(20, 22, "TWO KINDS OF MISTAKE, TWO DIFFERENT COSTS");
  s += rect(20, 34, 295, 112, W, .08) + `<text x="34" y="60" font-size="14" font-weight="700" style="fill:${W}">False “strong”</text><text x="34" y="82" font-size="12.5">A weak answer is praised.</text><text x="34" y="100" font-size="12.5">The candidate walks in unprepared.</text><text x="34" y="128" class="mono" font-size="13" font-weight="700" style="fill:${W}">cost × 3</text>`;
  s += rect(330, 34, 295, 112, B, .08) + `<text x="344" y="60" font-size="14" font-weight="700" style="fill:${B}">False “weak”</text><text x="344" y="82" font-size="12.5">A strong answer is criticised.</text><text x="344" y="100" font-size="12.5">Annoying, but they practise more.</text><text x="344" y="128" class="mono" font-size="13" font-weight="700" style="fill:${B}">cost × 1</text>`;
  s += arrow(320, 152, 320, 176);
  s += rect(20, 180, 605, 56, A, .1) + `<text x="34" y="204" font-size="13"><tspan font-weight="700" style="fill:${A}">Weighted loss:</tspan> false “strong” counts 3 times as much during training,</text><text x="34" y="224" font-size="13">so the coach becomes more careful before praising an answer.</text>`;
  s += rect(20, 248, 605, 66, G, .08) + `<text x="34" y="272" font-size="13" font-weight="700" style="fill:${G}">Watch out</text><text x="34" y="294" font-size="12.5">The model optimises exactly what you measure. Reward the wrong thing, get the wrong behaviour.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "What is loss", title: "1 · What a loss is", q: "How does a model know how wrong it is?",
    points: ["Compare each prediction with the real answer.", "Score each miss, here by squaring it.", "Average all the scores into <b>one number</b>: the loss.", "Training has one goal: make that number smaller."],
    pm: "The loss is the model's scorecard during practice. Make sure it points the same way as the metric you'll report to the business.",
    say: "Step one, what a loss is. For each answer, we compare the model's predicted score with the coach's real score. Answer four was predicted at five, but the real score was nine, a miss of four. We square each miss and average them. Here the loss is four point five. That single number is the model's scorecard, and training has one goal, to make it smaller.",
    draw: drawWhat },
  { stage: "For numbers", title: "2 · Losses for numbers", q: "Should a big miss count extra?",
    points: ["<b>Squared error</b>: a miss of 4 costs 16. Big misses dominate.", "<b>Absolute error</b>: a miss of 4 costs 4. Every miss counts evenly.", "With one wild outlier, squared error is 89% that one miss.", "Choose based on whether a few big misses are worse than many small ones."],
    pm: "If one terrible prediction is worse than several slightly-off ones, squared error fits. If outliers in the data are noise, absolute error is calmer.",
    say: "Step two, losses for numbers. With squared error, a miss of one costs one, but a miss of four costs sixteen. So big mistakes dominate. With absolute error, a miss of four just costs four. In our example, one wild miss makes up eighty nine percent of the squared error. So the question is, are a few big misses worse than many small ones? The answer picks the loss.",
    draw: drawNumbers },
  { stage: "For categories", title: "3 · Losses for categories", q: "How do we score a yes or no prediction?",
    points: ["<b>Cross-entropy</b>, or log loss, looks at the probability given to the right answer.", "95% on the right answer: tiny loss.", "10% on the right answer: big loss. Confidently wrong is punished hardest.", "Pick a confidence above to see it."],
    pm: "Because of this loss, well-trained classifiers give useful confidence scores. That's what lets you show “not sure” cases differently in the product.",
    say: "Step three, losses for categories. The real answer was strong. If the model said ninety five percent strong, the loss is tiny, about zero point zero five. Now pick sixty percent. Right, but unsure, so there's some loss. Now pick ten percent. The model was confidently wrong, and the loss jumps to about two point three. Cross entropy punishes confident mistakes hardest, which teaches the model to be honest about uncertainty.",
    draw: drawLog },
  { stage: "Weighted", title: "4 · Matching the loss to the product", q: "What if some mistakes hurt users more than others?",
    points: ["A false “strong” may send a candidate in unprepared.", "A false “weak” is annoying but less harmful.", "A <b>weighted loss</b> makes the worse mistake count more.", "The model optimises exactly what you measure."],
    pm: "Tell the team which mistake is worse, and by roughly how much. “A false strong is about 3 times worse” is the kind of input only a PM can give.",
    say: "Step four, matching the loss to the product. Not all mistakes cost the same. If the coach praises a weak answer, the candidate may walk into a real interview unprepared. If it criticises a strong answer, that's annoying, but they just practise more. So we can weight the loss, making a false strong count three times as much. And remember, the model will optimise exactly what you measure.",
    draw: drawWeighted },
];
return { STEPS, picker: { label: "Model's confidence:", step: 2, items: () => CONF.map(c => ({ label: c.label, color: c.c })), get: () => ci, set: i => { ci = i; } } };
})();
VMETA[13] = {"title": "Scoring Every Mistake", "sub": "Turn the interview coach's mistakes into one number, compare losses for scores and for strong-or-weak predictions, and weight the mistakes that hurt users most."};
