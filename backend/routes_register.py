from fastapi import APIRouter


from routes.bot import bot_router
from routes.test import router as  test_router
# Register all routers here


router = APIRouter()


router.include_router(bot_router, tags=["bot"])
router.include_router(test_router, tags=["test"])


