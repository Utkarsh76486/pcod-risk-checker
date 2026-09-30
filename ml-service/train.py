import glob, sys
import pandas as pd, joblib, sklearn
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# ---------- 1. Excel file dhoondo aur padho ----------
files = glob.glob("*.xlsx")
if not files:
    sys.exit("ERROR: ml-service folder me .xlsx file nahi mili. Dataset yahan rakho.")

xl = pd.ExcelFile(files[0])
df = None
for sheet in xl.sheet_names:
    t = xl.parse(sheet)
    t.columns = t.columns.astype(str).str.strip()
    if "PCOS (Y/N)" in t.columns:
        df = t
        break
if df is None:
    sys.exit("ERROR: 'PCOS (Y/N)' column kisi sheet me nahi mila.")

print("Rows:", len(df))
print("PCOS wale:", int(df["PCOS (Y/N)"].sum()))

# ---------- 2. Sirf wo 4 columns jo questionnaire se match karte hain ----------
def num(col):
    return pd.to_numeric(df[col], errors="coerce").fillna(0)

X = pd.DataFrame({
    "irregular_periods": (num("Cycle(R/I)") == 4).astype(int),   # 4 = irregular, 2 = regular
    "acne":              num("Pimples(Y/N)").astype(int),
    "weight_gain":       num("Weight gain(Y/N)").astype(int),
    "hair_growth":       num("hair growth(Y/N)").astype(int),
})
y = num("PCOS (Y/N)").astype(int)

# ---------- 3. Train / test split ----------
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

models = {
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "RandomForest": RandomForestClassifier(n_estimators=300, max_depth=4, random_state=42),
}

# ---------- 4. Dono models compare karo ----------
cv = StratifiedKFold(5, shuffle=True, random_state=42)
scores = {}
for name, m in models.items():
    scores[name] = cross_val_score(m, X_tr, y_tr, cv=cv, scoring="roc_auc").mean()
    print(f"{name}: CV ROC-AUC = {scores[name]:.3f}")

best_name = max(scores, key=scores.get)
best = models[best_name].fit(X_tr, y_tr)

pred = best.predict(X_te)
print("\nBest model:", best_name)
print(classification_report(y_te, pred))
print("Confusion matrix:\n", confusion_matrix(y_te, pred))
print("Test ROC-AUC:", round(roc_auc_score(y_te, best.predict_proba(X_te)[:, 1]), 3))

# ---------- 5. Save ----------
joblib.dump({"model": best, "features": list(X.columns)}, "model.pkl")

with open("requirements.txt", "w") as f:
    f.write(f"fastapi\nuvicorn\nscikit-learn=={sklearn.__version__}\npandas\njoblib\n")

# ---------- 6. Sanity check (thresholds set karne ke kaam aayega) ----------
def p(a, b, c, d):
    row = pd.DataFrame([[a, b, c, d]], columns=X.columns)
    return round(best.predict_proba(row)[0][1] * 100, 1)

print("\n--- Sanity check (risk %) ---")
print("Sab No        :", p(0, 0, 0, 0))
print("Sab Yes       :", p(1, 1, 1, 1))
print("Sirf periods  :", p(1, 0, 0, 0))
print("Aapka example :", p(0, 1, 0, 1))
print("\nmodel.pkl aur requirements.txt ban gayi. Done!")