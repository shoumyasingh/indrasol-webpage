from fastapi import APIRouter


from routes.bot import bot_router
from routes.test import router as  test_router
from routes.router import message_router
from routes.contact import contact_router
# Register all routers here


router = APIRouter()


router.include_router(bot_router, tags=["bot"])
router.include_router(message_router, tags=["message"])
router.include_router(test_router, tags=["test"])
router.include_router(contact_router, tags=["contact"])

