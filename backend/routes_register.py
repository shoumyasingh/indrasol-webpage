from fastapi import APIRouter


from routes.bot import bot_router


router = APIRouter()


router.include_router(bot_router, tags=["bot"])



