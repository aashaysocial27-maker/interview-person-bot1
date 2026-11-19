# ML Concepts Narrator: source and progress

Live page: https://claude.ai/artifact/4docGdvAR1PPMQfUExxu8U
Sister pages: AI Concepts Narrator (https://claude.ai/artifact/D2vhnvu7LWmwxhNhrxkiSg), AI Engineering Guide (https://claude.ai/artifact/X37xiEqYAFbeYRRU8PRdhx)

## How to build
`python3 build.py` writes `index.html` from `base.html` plus:
- `concepts/NN.js`: one concept object (lesson text). Remove `draft: true` and add `visual: {title, note}` when complete.
- `visuals/NN.js`: `VISUALS[n] = (() => { ... return { STEPS, picker? }; })();` then `VMETA[n] = {title, sub};`
- `resources/NN.json`: Learn-more links `[{kind, title, url}]`. Only links checked to exist.

Publish `index.html` to the live page URL (capabilities: db, dictation, downloads, sample, tts, user; omit on redeploy).

## Style guide (keep every concept consistent)
- Audience: a PM (mechanical engineer turned PM, moving into AI product management). Plain words, short sentences, teacher tone.
- Running example: an interview coach that predicts whether a candidate's answer is strong or weak.
- Lesson sections, in order: "The big idea", 3–4 numbered sub-topics ("1 · Name"), "Why it matters for a PM", "How it connects" (previous and next concept).
- Every sentence ends in . ? or ! (narration splits on these). Spell numbers as words where they are spoken.
- Visuals: 4–5 steps, SVG viewBox 640 wide, colors only via CSS tokens (var(--accent), var(--t1..t4), var(--warm), var(--muted), var(--line), var(--surface)). Each step has stage, title, q, points, pm, say, draw. Label illustrative numbers as illustrative.
- Learn more: 3–5 official or well-known sources (Google ML Crash Course, scikit-learn docs, Coursera/DeepLearning.AI, papers).

## Progress
| Batch | Concepts | Status |
|---|---|---|
| 0 | 1 What Is Machine Learning | Done, approved for rollout |
| 1 | 2 Types of Learning, 3 Data & Labeling, 4 Features & Feature Engineering | Done |
| 2 | 5 Train/Validation/Test Sets, 6 Overfitting & Underfitting, 7 Linear & Logistic Regression | Done |
| 3 | 8 Decision Trees & Random Forests, 9 Gradient Boosting, 10 KNN, SVM & Naive Bayes | Done |
| 4 | 11 Clustering & Anomaly Detection, 12 Dimensionality Reduction, 13 Loss Functions | Done |
| 5 | 14 Gradient Descent & Optimizers, 15 Regularization, 16 Hyperparameter Tuning | Done |
| 6 | 17 Class Imbalance, 18 Evaluation Metrics, 19 Neural Networks & Backpropagation | Done |
| 7 | 20 Convolutional Networks, 21 Sequence Models, 22 Transfer Learning & Embeddings | Done |
| 8 | 23 Reinforcement Learning, 24 Recommender Systems, 25 Time-Series Forecasting | Published, waiting for review |
| 9 | 26–28 | Not started |
| 10 | 29–30 | Not started |
