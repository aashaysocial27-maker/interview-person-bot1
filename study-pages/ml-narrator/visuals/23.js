VISUALS[23] = (() => {
const A = "var(--accent)", W = "var(--t3)", B = "var(--t2)", P = "var(--t4)", G = "var(--warm)";
const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>`;
const svg = h => `<svg viewBox="0 0 640 ${h}" role="img">${DEFS}`;
const arrow = (x1, y1, x2, y2, col = "var(--muted)", w = 1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${col}" stroke-width="${w}" marker-end="url(#ah)"/>`;
const lbl = (x, y, t, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" class="mono muted" font-size="11" letter-spacing="1">${t}</text>`;
const rect = (x, y, w, h, c = "var(--line)", fo = 0, sw = 1.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:${fo ? c : "var(--surface)"};stroke:${c}" ${fo ? `fill-opacity="${fo}"` : ""} stroke-width="${sw}"/>`;

function drawLoop() {
  let s = svg(340);
  s += rect(30, 100, 170, 84, A, .12, 2) + `<text x="115" y="134" text-anchor="middle" font-size="15" font-weight="700" style="fill:${A}">Agent</text><text x="115" y="156" text-anchor="middle" font-size="12">the coach</text>`;
  s += rect(440, 100, 170, 84, B, .12, 2) + `<text x="525" y="134" text-anchor="middle" font-size="15" font-weight="700" style="fill:${B}">Environment</text><text x="525" y="156" text-anchor="middle" font-size="12">the candidate</text>`;
  s += `<path d="M200 112 C 290 40, 350 40, 440 112" fill="none" style="stroke:var(--ink)" stroke-width="1.8" marker-end="url(#ah)"/>`;
  s += `<text x="320" y="44" text-anchor="middle" font-size="13" font-weight="700">Action</text><text x="320" y="62" text-anchor="middle" font-size="11.5" class="muted">ask a hard “conflict” question</text>`;
  s += `<path d="M440 174 C 350 246, 290 246, 200 174" fill="none" style="stroke:${A}" stroke-width="1.8" marker-end="url(#ah)"/>`;
  s += `<text x="320" y="258" text-anchor="middle" font-size="13" font-weight="700" style="fill:${A}">Reward +1 and new state</text><text x="320" y="276" text-anchor="middle" font-size="11.5" class="muted">next answer improved; candidate now at “medium” level</text>`;
  s += rect(30, 290, 580, 40, "var(--line)") + `<text x="320" y="315" text-anchor="middle" font-size="12.5">Over thousands of rounds the agent learns a <tspan font-weight="700">policy</tspan>: the best action for each situation.</text>`;
  return s + `</svg>`;
}

/* bandit: 3 question types with hidden success rates; 100 rounds (illustrative, precomputed) */
const ARMS = [{ n: "Easy", rate: .3, c: "var(--t2)" }, { n: "Medium", rate: .5, c: "var(--t4)" }, { n: "Hard + feedback", rate: .7, c: "var(--accent)" }];
const STRATS = [
  { label: "Always exploit", c: "var(--t3)", picks: [94, 3, 3], reward: 31, note: "Easy worked first, so it never looked further." },
  { label: "Explore 10%", c: "var(--accent)", picks: [8, 9, 83], reward: 64, note: "Tried each sometimes, found the best, then mostly used it." },
  { label: "Always explore", c: "var(--t2)", picks: [33, 34, 33], reward: 50, note: "Kept trying everything, never committed to the best." },
];
let si = 1;
function drawBandit() {
  const S = STRATS[si];
  let s = svg(340);
  s += lbl(20, 22, "3 KINDS OF PRACTICE QUESTION · 100 ROUNDS");
  ARMS.forEach((a, i) => {
    const x = 30 + i * 128;
    s += rect(x, 36, 112, 54, a.c, .1) + `<text x="${x + 56}" y="58" text-anchor="middle" font-size="12" font-weight="700" style="fill:${a.c}">${a.n}</text><text x="${x + 56}" y="78" text-anchor="middle" class="mono" font-size="10.5">helps ${Math.round(a.rate * 100)}% · hidden</text>`;
    const h = S.picks[i] * 1.6;
    s += `<rect x="${x + 26}" y="${260 - h}" width="60" height="${Math.max(h, 2)}" rx="4" style="fill:${a.c}" fill-opacity=".65"/><text x="${x + 56}" y="${254 - h}" text-anchor="middle" class="mono" font-size="12" font-weight="700">${S.picks[i]}</text>`;
  });
  s += `<line x1="20" y1="260" x2="400" y2="260" style="stroke:var(--ink)"/><text x="210" y="280" text-anchor="middle" font-size="12" class="muted">times each type was picked</text>`;
  const bx = 420;
  s += rect(bx, 36, 205, 120, S.c, .12) + `<text x="${bx + 12}" y="60" font-size="14" font-weight="700" style="fill:${S.c}">${S.label}</text><text x="${bx + 12}" y="88" font-size="12.5">Total reward</text><text x="${bx + 12}" y="118" class="mono" font-size="24" font-weight="700" style="fill:${S.c}">${S.reward}</text><text x="${bx + 70}" y="118" font-size="12" class="muted">of 100 rounds</text>`;
  s += `<text x="${bx}" y="184" font-size="12">${S.note.split(", ").map((t, i, arr) => `<tspan x="${bx}" dy="${i ? 17 : 0}">${t}${i < arr.length - 1 ? "," : ""}</tspan>`).join("")}</text>`;
  s += `<text x="20" y="310" font-size="12.5">The agent doesn't know which type helps most. It must explore to find out, then exploit what it learned.</text>`;
  s += `<text x="20" y="330" font-size="11" class="muted">Pick a strategy above. Numbers are illustrative.</text>`;
  return s + `</svg>`;
}

function drawDelayed() {
  let s = svg(320);
  const steps = [["Session 1", .45], ["Session 2", .55], ["Session 3", .68], ["Mock interview", .82], ["Job offer", 1]];
  s += lbl(20, 22, "VALUE FLOWS BACK FROM A LATE REWARD");
  steps.forEach(([t, v], i) => {
    const x = 20 + i * 124, last = i === 4;
    s += rect(x, 60, 108, 64, last ? A : B, last ? .2 : .08 + v * .12, last ? 2 : 1.3) + `<text x="${x + 54}" y="86" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${x + 54}" y="108" text-anchor="middle" class="mono" font-size="12">${last ? "reward +1" : "value " + v.toFixed(2)}</text>`;
    if (i < 4) s += arrow(x + 110, 92, x + 122, 92);
    if (i > 0) s += `<path d="M${x + 30} 132 Q ${x - 8} 160 ${x - 40} 132" fill="none" style="stroke:${A}" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#ah)"/>`;
  });
  s += `<text x="20" y="184" font-size="12.5">The offer comes weeks later. Which session deserves the credit?</text>`;
  s += `<text x="20" y="204" font-size="12.5">The agent learns a <tspan font-weight="700">value</tspan> for each situation: how much future reward it tends to lead to.</text>`;
  s += rect(20, 226, 600, 64, G, .08) + `<text x="34" y="250" font-size="13" font-weight="700" style="fill:${G}">The credit assignment problem</text><text x="34" y="272" font-size="12.5">Linking a late reward to the right early actions is what makes reinforcement learning hard.</text>`;
  s += `<text x="20" y="310" font-size="11" class="muted">Values are illustrative.</text>`;
  return s + `</svg>`;
}

function drawHack() {
  let s = svg(330);
  s += rect(20, 16, 295, 150, W, .08) + `<text x="34" y="40" font-size="13" font-weight="700" style="fill:${W}">Reward = minutes in the app</text><text x="34" y="66" font-size="12.5">The coach learns to ask endless,</text><text x="34" y="84" font-size="12.5">frustrating questions.</text><text x="34" y="112" class="mono" font-size="12">time in app ↑   skill ✗</text><text x="34" y="140" font-size="12" font-weight="700" style="fill:${W}">Reward hacking</text>`;
  s += rect(330, 16, 295, 150, A, .08) + `<text x="344" y="40" font-size="13" font-weight="700" style="fill:${A}">Reward = answers getting better</text><text x="344" y="66" font-size="12.5">The coach learns to pick questions</text><text x="344" y="84" font-size="12.5">that actually build skill.</text><text x="344" y="112" class="mono" font-size="12">skill ↑   + limits on session length</text><text x="344" y="140" font-size="12" font-weight="700" style="fill:${A}">Reward matches user value</text>`;
  s += lbl(20, 194, "WHERE YOU'LL MEET IT");
  [["Games and Go", B], ["Robotics", P], ["Bandits for ads and tips", G], ["RLHF for LLMs", A]].forEach(([t, c], i) => { const x = 20 + i * 152; s += rect(x, 206, 144, 40, c, .1) + `<text x="${x + 72}" y="231" text-anchor="middle" font-size="12" font-weight="700" style="fill:${c}">${t}</text>`; });
  s += `<text x="20" y="276" font-size="12.5">RL needs huge numbers of tries, so teams often train in simulation first.</text><text x="20" y="296" font-size="12.5">Bandits are the simplest, most practical form for live products.</text>`;
  return s + `</svg>`;
}

const STEPS = [
  { stage: "The loop", title: "1 · Agent, actions and rewards", q: "How does learning by reward work?",
    points: ["The <b>agent</b> (the coach) takes an <b>action</b>: picks a question.", "The <b>environment</b> (the candidate) responds.", "The agent gets a <b>reward</b> and sees the new situation.", "Over many rounds it learns a <b>policy</b>: what to do when."],
    pm: "Reinforcement learning fits when your product makes a series of decisions and you can measure the outcome of each one.",
    say: "Step one, agent, actions and rewards. The agent is our coach. It takes an action, asking a hard conflict question. The environment, the candidate, responds. If the next answer improves, the coach gets a reward of plus one, and sees the new situation. Over thousands of rounds, it learns a policy, the best action for each situation.",
    draw: drawLoop },
  { stage: "Explore", title: "2 · Explore or exploit?", q: "Stick with what works, or try something new?",
    points: ["Three question types help candidates 30%, 50% and 70% of the time, but the coach doesn't know that.", "<b>Always exploit</b>: gets stuck on the first thing that worked.", "<b>Explore 10%</b>: finds the best type, then mostly uses it.", "Pick a strategy above to compare 100 rounds."],
    pm: "A bandit that explores a little is a practical way to let a live product keep learning which option works best, without a big A/B test for every change.",
    say: "Step two, explore or exploit. The coach has three kinds of question. Secretly, they help thirty, fifty and seventy percent of the time. With explore ten percent, the coach tries each type now and then, discovers that hard with feedback works best, and uses it most. Total reward, sixty four. Now pick always exploit. Easy happened to work first, so it never looked further. Only thirty one. Always explore never commits, and gets fifty.",
    draw: drawBandit },
  { stage: "Delayed", title: "3 · Delayed rewards", q: "What if the reward comes weeks later?",
    points: ["The job offer arrives after many sessions.", "Which session deserves the credit?", "The agent learns a <b>value</b> for each situation: how much future reward it leads to.", "This is the <b>credit assignment problem</b>."],
    pm: "When outcomes are slow, like hiring results, the learning loop is slow too. Consider faster signals that genuinely predict the slow one.",
    say: "Step three, delayed rewards. The real reward, a job offer, arrives weeks after many practice sessions. So which session deserves the credit? The agent learns a value for each situation, how much future reward it tends to lead to. Value flows backwards from the offer, to the mock interview, to the earlier sessions. Linking a late reward to the right early actions is what makes reinforcement learning hard.",
    draw: drawDelayed },
  { stage: "Reward hacking", title: "4 · Reward hacking and real uses", q: "What goes wrong, and where is RL used?",
    points: ["The agent optimises the reward <b>exactly</b>.", "Reward minutes in the app, and the coach asks endless questions.", "Reward real improvement, with limits, and it builds skill.", "Used in games, robotics, bandits, and RLHF for LLMs."],
    pm: "The reward is your product spec. Choose one that matches true user value, and add guardrails for behaviour you'd never want.",
    say: "Step four, reward hacking. An agent chases its reward exactly. If the reward is minutes spent in the app, the coach learns to ask endless, frustrating questions. Time goes up, but skill doesn't. If the reward is answers getting better, with limits on session length, the coach learns to build real skill. You'll meet reinforcement learning in games, robotics, bandits for ads and tips, and RLHF for language models.",
    draw: drawHack },
];
return { STEPS, picker: { label: "Strategy:", step: 1, items: () => STRATS.map(x => ({ label: x.label, color: x.c })), get: () => si, set: i => { si = i; } } };
})();
VMETA[23] = {"title": "Learning by Trial and Reward", "sub": "Let the interview coach learn which practice questions help, balance exploring with exploiting, credit a late reward, and avoid a reward that backfires."};
