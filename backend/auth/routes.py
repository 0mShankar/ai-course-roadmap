from fastapi import APIRouter, HTTPException, Depends,status
from fastapi.responses import JSONResponse
from schemas import UserCreate, UserOut, Token
from models import get_user_by_username, create_user
from auth.utils import hash_password, verify_password, create_access_token
from auth.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    existing = await get_user_by_username(user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_dict = {
        "username": user.username,
        "password": hash_password(user.password)
    }
    created = await create_user(user_dict)
    return {"id": created["_id"], "username": created["username"]}

@router.post("/login", response_model=Token)
async def login(user: UserCreate):
    existing = await get_user_by_username(user.username)
    if not existing or not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": existing["username"]})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"id": str(current_user["_id"]), "username": current_user["username"]}


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user: dict = Depends(get_current_user)):
    return JSONResponse(content={"message": "Logged out successfully."})