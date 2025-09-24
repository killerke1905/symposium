
const CELLS = [
`
import nltk
nltk.download('stopwords', quiet=True)
from nltk.corpus import stopwords
stop = set(stopwords.words('english'))
def clean_text(s):
    s = str(s).lower()
    s = re.sub(r'http\\S+|www\\S+', ' ', s)
    s = re.sub(r'[^a-z0-9\\s]', ' ', s)
    toks = [t for t in s.split() if t and t not in stop]
    return ' '.join(toks)
df['clean'] = df['message'].apply(clean_text)`,

`
!pip install -q imbalanced-learn transformers datasets sentencepiece
import os, pandas as pd, numpy as np, re
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib`,

`
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))`,

`
!wget -q -O smsspam.zip https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip
!unzip -q smsspam.zip
df = pd.read_csv('SMSSpamCollection', sep='\\t', header=None, names=['label', 'message'])
df['label'] = df['label'].map({'ham':0, 'spam':1})
df.head(6)`,

`
import joblib
joblib.dump(model, 'spam_detector_joblib.pkl')`,

`
tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1,2), max_df=0.9, min_df=3, max_features=5000)
lr = LogisticRegression(max_iter=400, solver='liblinear', class_weight='balanced')
nb = MultinomialNB()
rf = RandomForestClassifier(n_estimators=150, random_state=42, class_weight='balanced')
ensemble = VotingClassifier(estimators=[('lr', lr), ('nb', nb), ('rf', rf)], voting='soft', n_jobs=-1)
model = Pipeline([('tfidf', tfidf), ('clf', ensemble)])
model.fit(X_train, y_train)`,

`
print(df['label'].value_counts())
print(df['message'].str.len().describe())`,

`
def predict_text(text):
    cleaned = clean_text(text)
    pred = model.predict([cleaned])[0]
    prob_spam = model.predict_proba([cleaned])[0][1]
    return {'label': 'spam' if pred==1 else 'ham', 'spam_prob': float(prob_spam)}
print(predict_text("Congratulations! You won a free ticket."))
print(predict_text("Hey, are we still meeting tomorrow?"))`,

`
X = df['clean']
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)`,

`
from sklearn.model_selection import cross_val_score
cv_scores = cross_val_score(model, X, y, cv=5, scoring='f1_macro', n_jobs=-1)
print("F1_macro CV scores:", cv_scores)
print("Mean F1_macro:", np.mean(cv_scores))`
];

// Render instructions
function renderCells(){
    const container = document.getElementById('cellsContainer');
    container.innerHTML = '';
    CELLS.forEach(cell=>{
        const div = document.createElement('div');
        div.className = 'code-cell';
        div.textContent = cell;
        container.appendChild(div);
    });
}
renderCells();

// Timer
let state = { timeLeft:10*60, timerId:null, startedAt:Date.now() };
const timerEl = document.getElementById('timer');

function updateTimer(){
    const m = Math.floor(state.timeLeft/60).toString().padStart(2,'0');
    const s = (state.timeLeft%60).toString().padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
    if(state.timeLeft<=0){
        clearInterval(state.timerId);
        submitCode(true);
    }
}
function autoTick(){ state.timeLeft--; updateTimer(); }
state.timerId = setInterval(autoTick, 1000);

// Skulpt run code
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runPython(){
    const prog = document.getElementById("pythonCode").value;
    const outputEl = document.getElementById("pythonOutput");
    outputEl.textContent = '';
    Sk.configure({ output: (txt)=>{outputEl.textContent+=txt;}, read: builtinRead });
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'pythonOutput';
    const myPromise = Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<stdin>", false, prog, true));
    myPromise.then(()=>{}, (err)=>{outputEl.textContent+=err.toString();});
}

document.getElementById("runCode").addEventListener("click", runPython);

// Submit code
document.getElementById('submitAll').addEventListener('click', ()=>{
    submitCode();
});

function submitCode(auto=false){
    const code = document.getElementById('pythonCode').value;
    const parts = JSON.parse(localStorage.getItem('participants')||'{}');
    const uid = 'DEFAULT_USER';
    if(!parts[uid]) parts[uid] = {};
    if(parts[uid].round2 && !auto){ alert('Code already submitted'); return; }

    parts[uid].round2 = {
        code: code,
        timestamp: new Date().toISOString(),
        duration: Math.round((Date.now()-state.startedAt)/1000)
    };
    localStorage.setItem('participants', JSON.stringify(parts));

    document.getElementById('resultBox').style.display='block';
    document.getElementById('resultBox').textContent='Code submitted successfully!';
    document.getElementById('submitAll').disabled=true;
}
