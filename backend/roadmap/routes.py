from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
import cohere
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

co = cohere.Client(os.getenv("COHERE_API_KEY"))

@router.post("/")
async def generate_roadmap(topic: str, current_user: dict = Depends(get_current_user)):
    try:
        prompt = f"Create a step-by-step learning roadmap to master: {topic}"
        response = co.generate(
            model='command',
            prompt=prompt,
            max_tokens=500,
            temperature=0.7
        )
        return {
            "username": current_user["username"],
            "topic": topic,
            "roadmap": response.generations[0].text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
