from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
from cohere import Client as CohereClient
from youtube.routes import get_youtube_videos
from articles.articles import get_articles
import os
from dotenv import load_dotenv
from typing import Dict

load_dotenv()

router = APIRouter(prefix="/build-course", tags=["Build Course"])

# Initialize Cohere client
cohere = CohereClient(os.getenv("COHERE_API_KEY"))

@router.post("/")
async def build_course(topic: str, current_user: Dict = Depends(get_current_user)):
    try:
        # 1. AI-generated roadmap
        prompt = f"Create a step-by-step learning roadmap to master: {topic}"
        response = cohere.generate(
            model='command-r-plus',
            prompt=prompt,
            max_tokens=500,
            temperature=0.7
        )
        roadmap = response.generations[0].text.strip()

        # 2. YouTube videos
        youtube_data = await get_youtube_videos(topic, current_user)

        # 3. Articles
        articles_data = await get_articles(topic, current_user)
        articles = articles_data["articles"]

        # 4. Final response
        return {
            "username": current_user["username"],
            "topic": topic,
            "roadmap": roadmap,
            "videos": youtube_data["videos"],
            "articles": articles
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
