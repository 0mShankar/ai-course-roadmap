# articles/articles.py

from fastapi import APIRouter, Depends, HTTPException, Query
from auth.dependencies import get_current_user
from config import SERPAPI_API_KEY
import requests

router = APIRouter(prefix="/articles", tags=["Articles"])

@router.get("/")
async def get_articles(
    topic: str = Query(..., description="Topic to search articles for"),
    current_user: dict = Depends(get_current_user)
):
    try:
        url = "https://serpapi.com/search"
        params = {
            "q": topic,
            "api_key": SERPAPI_API_KEY,
            "engine": "google",
            "hl": "en",
            "num": 5
        }
        response = requests.get(url, params=params)
        data = response.json()

        if "organic_results" not in data:
            raise HTTPException(status_code=500, detail="No articles found")

        articles = [
            {
                "title": result.get("title"),
                "link": result.get("link"),
                "snippet": result.get("snippet")
            }
            for result in data["organic_results"]
        ]

        return {
            "username": current_user["username"],
            "topic": topic,
            "articles": articles
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
