VISUALS[25] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/* 8 weeks of daily practice sessions: trend + weekly pattern (Sunday spike) + noise; illustrative */
const DAYS = 56, WEEK = [0.85, 0.9, 0.95, 0.9, 0.75, 0.7, 1.95];
const r = rng(19), TREND = Array.from({ length: DAYS }, (_, d) => 120 + d * 1.6), SEAS = Array.from({ length: DAYS }, (_, d) => (WEEK[d % 7] - 1) * (120 + d * 1.6)), NOISE = Array.from({ length: DAYS }, () => (r() - .5) * 28);
const ACT = TREND.map((t, d) => t + SEAS[d] + NOISE[d]);
const PARTS = [{ label: "Actual", c: "var(--ink)", v: ACT }, { label: "Trend", c: "var(--t2)", v: TREND }, { label: "Weekly pattern", c: "var(--t4)", v: SEAS }, { label: "Noise", c: "var(--warm)", v: NOISE }];
let pi = 0;
function chart(x0, y0, w, h, series, min, max) {
  const X = d => x0 + d / (DAYS - 1) * w, Y = v => y0 + h - (v - min) / (max - min) * h;
  let s = `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" style="stroke:var(--ink)"/>`;
  for (let wk = 0; wk <= 8; wk++) s += `<line x1="${X(wk * 7)}" y1="${y0}" x2="${X(wk * 7)}" y2="${y0 + h}" style="stroke:var(--line)"/>${wk < 8 ? `<text x="${X(wk * 7 + 3.5)}" y="${y0 + h + 16}" text-anchor="middle" font-size="10.5" class="muted">wk ${wk + 1}</text>` : ""}`;
  series.forEach(([vals, c, wd, op]) => { s += `<path d="M${vals.map((v, d) => `${X(d)} ${Y(v)}`).join(" L")}" fill="none" style="stroke:${c}" stroke-width="${wd}" stroke-opacity="${op}"/>`; });
  return { s, X, Y };
}
function drawParts() {
  const p = PARTS[pi];
  let s = svg(330);
  s += lbl(20, 22, `DAILY PRACTICE SESSIONS · ${p.label.toUpperCase()}`);
  const range = pi === 0 || pi === 1 ? [40, 420] : pi === 2 ? [-90, 200] : [-40, 40];
  const series = pi === 0 ? [[ACT, "var(--ink)", 2, 1]] : [[pi === 1 ? ACT : pi === 2 ? ACT.map((v, d) => v - TREND[d]) : ACT.map((v, d) => v - TREND[d] - SEAS[d]), "var(--muted)", 1.2, .35], [p.v, p.c, 2.6, 1]];
  const { s: cs, X, Y } = chart(50, 40, 560, 200, series, range[0], range[1]);
  s += cs;
  if (pi === 2) for (let wk = 0; wk < 8; wk++) { const d = wk * 7 + 6; s += `<circle cx="${X(d)}" cy="${Y(SEAS[d])}" r="4" style="fill:${P}"/>`; }
  const msg = ["Sessions grow over time, with a spike every Sunday evening.", "Trend: the long-term growth as the coach gains users.", "Weekly pattern: a Sunday spike before Monday interviews (dots).", "Noise: the random wobble left after removing trend and pattern."][pi];
  s += rect(20, 268, 600, 50, p.c === "var(--ink)" ? "var(--line)" : p.c, .1) + `<text x="34" y="298" font-size="12.5">${msg}</text>`;
  return s + `</svg>`;
}

function drawBaselines() {
  let s = svg(360);
  s += lbl(20, 22, "FORECASTING WEEK 8 FROM WEEKS 1–7");
  const last = ACT.slice(42, 49), act = ACT.slice(49, 56);
  const naive = Array(7).fill(ACT[48]), snaive = last, avg = Array.from({ length: 7 }, (_, i) => (ACT[42 + i] + ACT[35 + i] + ACT[28 + i]) / 3);
  const X = i => 70 + i * 80, Y = v => 250 - (v - 100) * 0.55;
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((d, i) => { s += `<text x="${X(i)}" y="270" text-anchor="middle" font-size="11" class="muted">${d}</text>`; });
  s += `<line x1="50" y1="256" x2="590" y2="256" style="stroke:var(--ink)"/>`;
  const line = (v, c, wd, dash) => `<path d="M${v.map((x, i) => `${X(i)} ${Y(x)}`).join(" L")}" fill="none" style="stroke:${c}" stroke-width="${wd}" ${dash ? 'stroke-dasharray="6 4"' : ""}/>`;
  const mae = f => (f.reduce((a, x, i) => a + Math.abs(x - act[i]), 0) / 7).toFixed(0);
  s += line(naive, W, 2, 1) + line(avg, B, 2, 1) + line(snaive, P, 2, 1) + line(act, "var(--ink)", 3, 0);
  act.forEach((v, i) => { s += `<circle cx="${X(i)}" cy="${Y(v)}" r="4" style="fill:var(--ink)"/>`; });
  const rows = [["actual week 8", "var(--ink)", ""], ["naive: repeat the last day (a Sunday)", W, mae(naive)], ["moving average of 3 weeks", B, mae(avg)], ["seasonal naive: same day last week", P, mae(snaive)]];
  rows.forEach(([t, c, e], i) => { const x = 20, y = 292 + i * 20; s += `<line x1="${x}" y1="${y - 4}" x2="${x + 24}" y2="${y - 4}" style="stroke:${c}" stroke-width="3" ${i ? 'stroke-dasharray="6 4"' : ""}/><text x="${x + 32}" y="${y}" font-size="12">${t}${e ? `: <tspan class="mono" font-weight="700">avg miss ${e}</tspan>` : ""}</text>`; });
  return s + `</svg>`;
}

function drawBacktest() {
  let s = svg(320);
  s += lbl(20, 22, "BACKTESTING: TRAIN ON THE PAST, TEST ON WHAT CAME NEXT");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], X0 = 110, cw = 82;
  months.forEach((m, i) => { s += `<text x="${X0 + i * cw + cw / 2}" y="48" text-anchor="middle" font-size="12" class="muted">${m}</text>`; });
  for (let r0 = 0; r0 < 3; r0++) {
    const y = 60 + r0 * 50, trainEnd = 3 + r0;
    s += `<text x="20" y="${y + 24}" font-size="12">Round ${r0 + 1}</text>`;
    for (let i = 0; i < 6; i++) {
      const isTrain = i < trainEnd, isTest = i === trainEnd, c = isTrain ? B : isTest ? A : "var(--line)";
      s += `<rect x="${X0 + i * cw + 2}" y="${y}" width="${cw - 4}" height="36" rx="5" style="fill:${isTrain || isTest ? c : "var(--bg)"};stroke:${c}" fill-opacity="${isTrain ? .18 : isTest ? .4 : 1}"/>`;
      if (isTest) s += `<text x="${X0 + i * cw + cw / 2}" y="${y + 23}" text-anchor="middle" font-size="11.5" font-weight="700">test</text>`;
      if (isTrain && i === 0) s += `<text x="${X0 + 10}" y="${y + 23}" font-size="11.5" font-weight="700" style="fill:${B}">train →</text>`;
    }
  }
  s += rect(20, 222, 295, 84, W, .08) + `<text x="34" y="246" font-size="13" font-weight="700" style="fill:${W}">✗ Random shuffle</text><text x="34" y="268" font-size="12">Trains on May to predict April.</text><text x="34" y="286" font-size="12">Looks great, fails in real life.</text>`;
  s += rect(330, 222, 295, 84, A, .08) + `<text x="344" y="246" font-size="13" font-weight="700" style="fill:${A}">✓ Rolling backtest</text><text x="344" y="268" font-size="12">Always predicts the future from the past,</text><text x="344" y="286" font-size="12">just like it will in production.</text>`;
  return s + `</svg>`;
}

function drawFan() {
  let s = svg(330);
  const X = d => 40 + d * 6.6, Y = v => 270 - (v - 60) * 0.42;
  const hist = ACT.slice(0, 56), fut = Array.from({ length: 21 }, (_, i) => { const d = 56 + i; return (120 + d * 1.6) * WEEK[d % 7]; });
  s += `<line x1="40" y1="276" x2="610" y2="276" style="stroke:var(--ink)"/>`;
  const up = fut.map((v, i) => v + 12 + i * 5.5), lo = fut.map((v, i) => v - 12 - i * 5.5);
  s += `<path d="M${up.map((v, i) => `${X(56 + i)} ${Y(v)}`).join(" L")} L${lo.map((v, i) => `${X(56 + i)} ${Y(v)}`).reverse().join(" L")} Z" style="fill:${A}" fill-opacity=".15"/>`;
  s += `<path d="M${hist.map((v, d) => `${X(d)} ${Y(v)}`).join(" L")}" fill="none" style="stroke:var(--ink)" stroke-width="1.8"/>`;
  s += `<path d="M${fut.map((v, i) => `${X(56 + i)} ${Y(v)}`).join(" L")}" fill="none" style="stroke:${A}" stroke-width="2" stroke-dasharray="5 3"/>`;
  s += `<line x1="${X(56)}" y1="30" x2="${X(56)}" y2="276" style="stroke:var(--muted)" stroke-dasharray="3 3"/><text x="${X(56) - 6}" y="44" text-anchor="end" font-size="11.5" class="muted">today</text>`;
  s += `<text x="${X(66)}" y="44" text-anchor="middle" font-size="12" font-weight="700" style="fill:${A}">forecast range</text><text x="${X(66)}" y="60" text-anchor="middle" font-size="11" class="muted">wider further out</text>`;
  s += `<line x1="${X(70)}" y1="70" x2="${X(70)}" y2="276" style="stroke:${W}" stroke-width="2"/><text x="${X(70) + 6}" y="86" font-size="11.5" font-weight="700" style="fill:${W}">launch day?</text><text x="${X(70) + 6}" y="102" font-size="11" class="muted">past data can't</text><text x="${X(70) + 6}" y="116" font-size="11" class="muted">see this coming</text>`;
  s += `<text x="20" y="306" font-size="12.5">Plan servers for the top of the range. Tell the model about known events. Retrain regularly.</text>`;
  s += `<text x="20" y="324" font-size="11" class="muted">Illustrative.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "Parts", title: "1 · Trend, seasonality and noise", q: "What is a time series made of?",
    points: ["<b>Trend</b>: the long-term direction, here steady growth.", "<b>Seasonality</b>: a repeating pattern, here a Sunday spike.", "<b>Noise</b>: the random wobble left over.", "Pick a part above to pull it out of the data."],
    pm: "Knowing the parts tells you what to plan for: growth for budgets, weekly peaks for capacity, and noise for how much to trust any single day.",
    say: "Step one, trend, seasonality and noise. This line is eight weeks of daily practice sessions. Pick trend. It's the steady growth as the coach gains users. Now pick weekly pattern. Every Sunday evening there's a spike, as candidates prepare for Monday interviews. Now pick noise. That's the random wobble left over. Most time series are a mix of these three parts.",
    draw: drawParts },
  { stage: "Baselines", title: "2 · Start with a baseline", q: "What should a fancy model have to beat?",
    points: ["<b>Naive</b>: repeat the last value. Here that is a Sunday spike, far too high.", "<b>Seasonal naive</b>: next Sunday equals last Sunday.", "<b>Moving average</b>: the average of recent weeks.", "Here seasonal naive beats plain naive easily. Any model must beat these."],
    pm: "Always ask “how much better than the seasonal-naive baseline?” If the answer is a little, the fancy model may not be worth it.",
    say: "Step two, start with a baseline. We forecast week eight from the weeks before. The naive forecast just repeats the last day, which was a Sunday spike, so it is far too high every weekday. The seasonal naive forecast says each day looks like the same day last week, and it does much better. The moving average is close too. Any fancy model must clearly beat these simple baselines.",
    draw: drawBaselines },
  { stage: "No peeking", title: "3 · Never peek at the future", q: "How do we test a forecast honestly?",
    points: ["Never shuffle time series randomly.", "Train on the past, test on what came next.", "<b>Backtesting</b> rolls forward: train to March, test April; train to April, test May.", "This mirrors how the model will really be used."],
    pm: "If a forecasting model looks too good, ask whether it was tested with a rolling backtest. Random splits leak the future.",
    say: "Step three, never peek at the future. With time series, a random shuffle would let the model learn from May to predict April. That looks great in testing, and fails in real life. Instead, we backtest. Train on January to March, test on April. Then train up to April, test on May. Then up to May, test June. The model always predicts the future from the past, just like in production.",
    draw: drawBacktest },
  { stage: "Ranges", title: "4 · Uncertainty and surprises", q: "How sure is a forecast?",
    points: ["A good forecast is a <b>range</b>, not one number.", "The range widens the further ahead you look.", "Events like a launch can break the pattern.", "Retrain regularly and tell the model about known events."],
    pm: "Plan with the right end of the range: the top for server capacity, the middle for budgets. And share known future events with the team.",
    say: "Step four, uncertainty and surprises. A good forecast is a range, not a single number, and it widens the further ahead you look. Real forecasts also break when the world changes, like a product launch the past data can't see coming. So plan servers for the top of the range, tell the model about known events, and retrain regularly.",
    draw: drawFan },
];
return { STEPS, picker: { label: "Show:", step: 0, items: () => PARTS.map(p => ({ label: p.label, color: p.c })), get: () => pi, set: i => { pi = i; } } };
})();
VMETA[25] = {"title": "Predicting What Comes Next", "sub": "Split eight weeks of the interview coach's practice sessions into trend, weekly pattern and noise, beat simple baselines, and backtest without peeking at the future."};
