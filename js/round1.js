// ===== QUESTIONS =====
const QUESTIONS = [
  { q: "Q1. In the Confusion Matrix, what does the value 50 represent?", a: "Spam → Spam", b: "Ham → Spam", c: "Spam → Ham", d: "Ham → Ham", ans: "B" },
  { q: "Q2. Why is the TF-IDF score of 'the' so low?", a: "It is very rare", b: "It appears in almost every document", c: "It is a spam keyword", d: "It is punctuation", ans: "B" },
  { q: "Q3. In Bag of Words frequency, which word is most frequent?", a: "Free", b: "Offer", c: "Click", d: "Win", ans: "D" },
  { q: "Q4. Why do bigrams like 'win prize' help?", a: "They reduce dataset size", b: "They capture context", c: "They remove stop words", d: "They improve speed", ans: "B" },
  { q: "Q5. Ensemble Voting: if two models predict Spam and one predicts Ham, what will the ensemble predict?", a: "Ham", b: "Spam", c: "Random", d: "None", ans: "B" },
  { q: "Q6. What issue does the pie chart showing 4825 Ham vs 747 Spam indicate?", a: "Overfitting", b: "Class imbalance", c: "Underfitting", d: "Noise", ans: "B" },
  { q: "Q7. Model Accuracy: LR=0.96, NB=0.94, RF=0.95. Which model is best?", a: "LR", b: "NB", c: "RF", d: "All equal", ans: "A" },
  { q: "Q8. Why is precision important in spam detection?", a: "To avoid false positives", b: "To reduce training time", c: "To balance dataset", d: "To improve accuracy", ans: "A" },
  { q: "Q9. What does the ROC curve show?", a: "Dataset size", b: "Trade-off between TPR & FPR", c: "Accuracy", d: "Feature importance", ans: "B" },
  { q: "Q10. What problem is shown when training accuracy increases but validation accuracy drops?", a: "Overfitting", b: "Underfitting", c: "Class imbalance", d: "Noise", ans: "A" },
  { q: "Q11. Random Forest Feature Importance shows highest importance for which word?", a: "Offer", b: "Free", c: "Win", d: "Click", ans: "B" },
  { q: "Q12. Why use cross-validation?", a: "Faster training", b: "Reliable performance estimate", c: "Remove stop words", d: "Reduce noise", ans: "B" },
  { q: "Q13. Hyperparameter Tuning: Which C value gives best accuracy (0.01,0.1,1,10)?", a: "0.01", b: "0.1", c: "1", d: "10", ans: "C" },
  { q: "Q14. In the ML Pipeline, which step converts text into numeric features?", a: "Text", b: "TF-IDF", c: "Model", d: "Prediction", ans: "B" },
  { q: "Q15. In deep learning loss curves, what does decreasing validation loss mean?", a: "Overfitting", b: "Learning is improving", c: "Noise", d: "Imbalance", ans: "B" },
  { q: "Q16. Why do 'free' and 'prize' connect in transformer attention?", a: "Stop words", b: "Context relevance", c: "Random edges", d: "Same length", ans: "B" },
  { q: "Q17. In BERT tokenization, what does '##' mean?", a: "Start of sentence", b: "Subword continuation", c: "End of word", d: "Stop word", ans: "B" },
  { q: "Q18. Why is GPU faster than CPU for training?", a: "More RAM", b: "Parallel matrix computation", c: "Smaller model", d: "Less data", ans: "B" },
  { q: "Q19. What is the trade-off between ML and Deep Learning?", a: "ML is slower but better", b: "DL is simpler", c: "ML is faster, DL more powerful", d: "Both same", ans: "C" },
  { q: "Q20. In deployment pipeline, which step involves stop word removal?", a: "User Input", b: "Preprocessing", c: "Model", d: "Output", ans: "B" }
];

const TOTAL = QUESTIONS.length;
const state = {
  current: 0,
  answers: Array(TOTAL).fill(null),
  timer: 15 * 60,
  timerId: null
};

// ===== TIMER =====
function startTimer() {
  const timerEl = document.getElementById("timer");
  state.timerId = setInterval(() => {
    if (state.timer <= 0) {
      clearInterval(state.timerId);
      alert("Time's up!");
      calculateScore();
      return;
    }
    state.timer--;
    const m = String(Math.floor(state.timer / 60)).padStart(2, "0");
    const s = String(state.timer % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
  }, 1000);
}

// ===== RENDER =====
function renderQuestion() {
  const qObj = QUESTIONS[state.current];
  document.getElementById("questionBox").textContent = qObj.q;
  document.getElementById("optA").textContent = qObj.a;
  document.getElementById("optB").textContent = qObj.b;
  document.getElementById("optC").textContent = qObj.c;
  document.getElementById("optD").textContent = qObj.d;

  document.querySelectorAll("input[name='option']").forEach(r => {
    r.checked = (state.answers[state.current] === r.value);
  });

  document.getElementById("counter").textContent = `Q ${state.current+1}/${TOTAL}`;
  renderGrid();
  checkSubmitReady();
}

function renderGrid() {
  const grid = document.getElementById("questionGrid");
  grid.innerHTML = "";
  for (let i = 0; i < TOTAL; i++) {
    const div = document.createElement("div");
    div.textContent = i + 1;
    div.className = "grid-item " + (state.answers[i] ? "answered" : "unanswered");
    div.addEventListener("click", () => {
      state.current = i;
      renderQuestion();
    });
    grid.appendChild(div);
  }
}

// ====== ACTIONS ======
function saveAnswer() {
  const selected = document.querySelector("input[name='option']:checked");
  if (selected) {
    state.answers[state.current] = selected.value;
  }
}

function checkSubmitReady() {
  const btn = document.getElementById("submitBtn");
  if (state.answers.includes(null)) {
    btn.style.display = "none";
  } else {
    btn.style.display = "inline-block";
  }
}

// ====== SCORING ======
function calculateScore() {
  let score = 0;
  for (let i = 0; i < TOTAL; i++) {
    if (state.answers[i] === QUESTIONS[i].ans) {
      score++;
    }
  }
  alert(`You have completed Round One!\nYour Score: ${score} / ${TOTAL}`);
}

// ====== BUTTONS ======
document.getElementById("nextBtn").addEventListener("click", () => {
  saveAnswer();
  if (state.current < TOTAL - 1) {
    state.current++;
    renderQuestion();
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  saveAnswer();
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
});

document.getElementById("submitBtn").addEventListener("click", () => {
  saveAnswer();
  calculateScore();
});

// ===== INIT =====
startTimer();
renderQuestion();
