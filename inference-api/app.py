from fastapi import FastAPI, Request
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

server = FastAPI()


@server.post("/inference-api/predict")
async def predict(request: Request):
    model = joblib.load("model.joblib")

    data = await request.json()

    input_data = pd.DataFrame(
        {"exercise": [data.get("exercise")], "code": [data.get("code")]}
    )
    prediction = model.predict(input_data)[0]

    return {"prediction": prediction}


@server.post("/inference-api/train")
async def train(request: Request):
    data = await request.json()

    df = pd.DataFrame(data)

    preprocessor = ColumnTransformer(
        transformers=[
            ("code", CountVectorizer(ngram_range=(1, 3)), "code"),
            ("exercise", "passthrough", ["exercise"]),
        ]
    )

    pipeline = Pipeline(
        steps=[("preprocessor", preprocessor), ("regressor", LinearRegression())]
    )

    X = df[["exercise", "code"]]
    y = df["grade"]

    pipeline.fit(X, y)
    joblib.dump(pipeline, "model.joblib")

    return {"status": "Model trained successfully"}
