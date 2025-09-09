from fastapi import FastAPI

app = FastAPI(title="EcoTracker ML Service")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/v1/recommendations")
async def recommendations(user_id: str | None = None):
    # Stubbed deterministic recommendations for now
    recs = [
        {"category": "transport", "tip": "Try biking for short trips twice a week."},
        {"category": "energy", "tip": "Switch to LED bulbs to save ~75% energy."},
        {"category": "food", "tip": "Choose plant-based meals 2x/week."},
    ]
    return {"user_id": user_id, "recommendations": recs}

