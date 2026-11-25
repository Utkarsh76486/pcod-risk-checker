from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

bundle = joblib.load("model.pkl")
model, features = bundle["model"], bundle["features"]

DEFAULT_AGE = 31  # dataset ka median, agar age na aaye


class Req(BaseModel):
    answers: list[Optional[str]]   # 6-7 answers, questionnaire ke order me
    age: Optional[float] = None    # number me age (frontend ageMap se)


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(r: Req):
    a = (r.answers + [None] * 7)[:7]
    if all(x is None for x in a[:6]):
        raise HTTPException(400, "no answers")

    age = r.age if r.age is not None else DEFAULT_AGE
    age = min(max(age, 20), 48)  # training data ki range (20-48)

    row = pd.DataFrame([{
        "irregular_periods": int(a[0] == "Yes"),
        "acne":              int(a[1] in ("Sometimes", "Frequently")),
        "weight_gain":       int(a[2] == "Yes"),
        "hair_growth":       int(a[3] == "Yes"),
        "age":               age,
    }])[features]

    prob = float(model.predict_proba(row)[0][1])
    return {"risk_probability": round(prob * 100, 1)}