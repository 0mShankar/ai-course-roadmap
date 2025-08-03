from database import user_collection
from bson import ObjectId

async def get_user_by_username(username: str):
    return await user_collection.find_one({"username": username})

async def create_user(user_data: dict):
    result = await user_collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    return user_data
