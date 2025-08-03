from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from roadmap.routes import router as roadmap_router
from youtube.routes import router as youtube_router
from articles.articles import router as articles_router
from course.routes import router as course_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://ai-course-roadmap.onrender.com",
    "https://ai-course-roadmap-frontend.onrender.com"
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

