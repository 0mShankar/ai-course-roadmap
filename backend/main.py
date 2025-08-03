from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from roadmap.routes import router as roadmap_router
from youtube.routes import router as youtube_router
from articles.articles import router as articles_router
from course.routes import router as course_router

app = FastAPI()

origins = [
    "http://localhost:3000",  # frontend dev server
    # You can add more domains here if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for public APIs
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods: POST, GET, OPTIONS, etc.
    allow_headers=["*"],   # allow all headers including Authorization
)

app.include_router(auth_router)
app.include_router(roadmap_router)
app.include_router(youtube_router)
app.include_router(articles_router) 
app.include_router(course_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=10000)