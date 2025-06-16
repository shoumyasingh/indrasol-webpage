from fastapi import APIRouter


from routers.test import router as  test_router
from routers.router import message_router
from routers.contact import contact_router
from routers.mcp_router import router as mcp_router
# Register all routers here


router = APIRouter()

router.include_router(message_router, tags=["message"])
router.include_router(test_router, tags=["test"])
router.include_router(contact_router, tags=["contact"])
router.include_router(mcp_router, tags=["mcp"])
