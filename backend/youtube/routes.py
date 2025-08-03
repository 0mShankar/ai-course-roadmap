from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
import os
import requests
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/youtube", tags=["YouTube"])

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

@router.get("/")
async def get_youtube_videos(topic: str, current_user: dict = Depends(get_current_user)):
    params = {
        "part": "snippet",
        "q": topic,
        "key": YOUTUBE_API_KEY,
        "maxResults": 5,
        "type": "video"
    }
    
    response = requests.get(YOUTUBE_SEARCH_URL, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch YouTube videos")

    videos = response.json().get("items", [])
    results = [
        {
            "title": video["snippet"]["title"],
            "url": f"https://www.youtube.com/watch?v={video['id']['videoId']}"
        }
        for video in videos
    ]
    return {
        "username": current_user["username"],
        "topic": topic,
        "videos": results
    }
