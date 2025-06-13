"""
Supabase helper – async CRUD for
1. conversation_memory
2. qualified_leads
"""
from uuid import uuid4
from datetime import datetime

from db.supabase import safe_supabase_operation, get_supabase_client


async def upsert_conversation_memory(user_id: str, memory: dict):
    """
    Insert a new row or update an existing one in `conversation_memory`.
    
    Args:
        user_id (str): Visitor/session UUID.
        memory (dict): Fields {intent, product, qualified, last_agent}.
    """
    supabase = get_supabase_client()
    # ----- 1 / Check if row exists -----
    check = lambda: (supabase
            .from_("conversation_memory")
            .select("user_id")
            .eq("user_id", user_id)
            .execute()
    )
    existing = await safe_supabase_operation(check, "Failed to check conversation_memory")

    # Add/update timestamp
    # memory["updated_at"] = datetime.utcnow().isoformat()

    # ----- 2 / Insert or update -----
    if existing.data:                          
        update_op = lambda: (
            supabase
                .from_("conversation_memory")
                .update(memory)
                .eq("user_id", user_id)
                .execute()
        )
        return await safe_supabase_operation(update_op, "Failed to update conversation_memory")

    else:                                               
        insert_payload = {**memory, "user_id": user_id}
        insert_op = lambda: (
            supabase
                .from_("conversation_memory")
                .insert(insert_payload)
                .execute()
        )
        return await safe_supabase_operation(insert_op, "Failed to insert conversation_memory")
    

async def get_conversation_memory(user_id: str):
    """
    Fetch the memory row for a given user_id. Returns None if not found.
    """
    supabase = get_supabase_client()
    fetch = lambda: (
        supabase
            .from_("conversation_memory")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
    )
    resp = await safe_supabase_operation(fetch, "Failed fetching conversation_memory")
    return resp.data[0] if resp.data else None

async def sync_qualified_lead(lead: dict):
    """
    Adds a row into qualified_leads.
    Expects fields:
      user_id, email (str|None), intent, product, qualified (bool), last_message
    """
    supabase = get_supabase_client()
    payload = {
        "id": str(uuid4()),
        "user_id": lead["user_id"],
        "email": lead.get("email"),
        "intent": lead["intent"],
        "product": lead["product"],
        "service": lead["service"],
        "qualified": True,
        "last_message": lead.get("last_message", ""),
        "submitted_at": datetime.utcnow().isoformat()
    }

    insert_op = lambda: (
        supabase
            .from_("qualified_leads")
            .insert(payload)
            .execute()
    )
    return await safe_supabase_operation(insert_op, "Failed to insert qualified_lead")