"""
Supabase helper – async CRUD for
1. conversation_memory
2. qualified_leads
"""
from uuid import uuid4
from datetime import datetime

from db.supabase import safe_supabase_operation, get_supabase_client


def convert_history_to_structured(history_strings: list) -> list:
    """
    Convert history strings with User:/Bot: prefixes to structured JSONB format.
    
    Args:
        history_strings: List of strings like ["User: message", "Bot: response"]
    
    Returns:
        List of objects like [{"user": "message", "bot": "response"}]
    """
    structured_history = []
    current_pair = {}
    
    for msg in history_strings:
        if msg.startswith("User: "):
            # Start a new conversation pair
            user_msg = msg[6:]  # Remove "User: " prefix
            current_pair = {"user": user_msg}
        elif msg.startswith("Bot: "):
            # Complete the conversation pair
            bot_msg = msg[5:]  # Remove "Bot: " prefix
            if "user" in current_pair:
                current_pair["bot"] = bot_msg
                structured_history.append(current_pair)
                current_pair = {}
            else:
                # Bot message without preceding user message (shouldn't happen normally)
                structured_history.append({"user": "", "bot": bot_msg})
    
    # Handle case where user message exists but no bot response yet
    if "user" in current_pair and "bot" not in current_pair:
        current_pair["bot"] = ""
        structured_history.append(current_pair)
    
    return structured_history


def convert_structured_to_history_strings(structured_history: list) -> list:
    """
    Convert structured JSONB history back to string format for compatibility.
    
    Args:
        structured_history: List of objects like [{"user": "message", "bot": "response"}]
    
    Returns:
        List of strings like ["User: message", "Bot: response"]
    """
    history_strings = []
    
    for pair in structured_history:
        if isinstance(pair, dict):
            if pair.get("user"):
                history_strings.append(f"User: {pair['user']}")
            if pair.get("bot"):
                history_strings.append(f"Bot: {pair['bot']}")
    
    return history_strings


async def upsert_conversation_memory(user_id: str, memory: dict, history: list = None):
    """
    Insert a new row or update an existing one in `conversation_memory`.
    
    Args:
        user_id (str): Visitor/session UUID.
        memory (dict): Fields {intent, product, qualified, last_agent}.
        history (list): Chat history to store as JSONB.
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

    # Add/update timestamp and history
    memory["updated_at"] = datetime.utcnow().isoformat()
    if history is not None:
        # Convert string history to structured JSONB format
        memory["conv_history"] = convert_history_to_structured(history)

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

async def get_conversation_history(user_id: str, as_strings: bool = True):
    """
    Fetch just the conversation history for a given user_id. Returns empty list if not found.
    
    Args:
        user_id: The user ID to fetch history for
        as_strings: If True, returns ["User: msg", "Bot: response"] format.
                   If False, returns [{"user": "msg", "bot": "response"}] format.
    """
    memory = await get_conversation_memory(user_id)
    if not memory or not memory.get("conv_history"):
        return []
    
    history = memory.get("conv_history", [])
    
    # Check if history is already in structured format
    if history and isinstance(history[0], dict):
        # It's structured format
        if as_strings:
            return convert_structured_to_history_strings(history)
        else:
            return history
    else:
        # It's old string format
        if as_strings:
            return history
        else:
            return convert_history_to_structured(history)

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



# ──────────────────────────────────────────────────────────────────────────
#  NEW LEAD HELPERS
#  ------------------------------------------------------------------------
#  lead_logs           – every attempt coming from any channel
#  qualified_leads     – “hot” leads we want to push into CRM / Slack, etc.
# ──────────────────────────────────────────────────────────────────────────

from datetime import timedelta   # already imported datetime above

# -------------------------------------------------------------------------
# fetch_recent_leads
# -------------------------------------------------------------------------
async def fetch_recent_leads(*, email: str, since: datetime) -> dict | None:
    """
    Return the most-recent lead_log for this email newer than *since*.
    Used by lead_sync skill to avoid duplicate alerts.
    """
    supabase = get_supabase_client()
    query = (
        supabase
        .from_("lead_logs")
        .select("*")
        .eq("email", email)
        .gte("created_at", since.isoformat())          # RFC-3339
        .order("created_at", desc=True)
        .limit(1)
    )

    op = lambda: query.execute()
    resp = await safe_supabase_operation(op, "Failed to fetch recent leads")

    return resp.data[0] if resp.data else None


# -------------------------------------------------------------------------
# insert_lead_log
# -------------------------------------------------------------------------
async def insert_lead_log(row: dict) -> dict:
    """
    Simple INSERT into lead_logs.
      - caller provides {name,email,company,message,channel:list[str]}
      - backend Postgres trigger / default fills UUID + created_at
    Returns the inserted record.
    """
    supabase = get_supabase_client()
    op = lambda: (
        supabase
        .from_("lead_logs")
        .insert(row)
        .execute()
    )
    resp = await safe_supabase_operation(op, "Failed to insert lead_log")
    return resp.data[0]


# -------------------------------------------------------------------------
# insert_qualified_lead  (idempotent UPSERT by e-mail)
# -------------------------------------------------------------------------
async def insert_qualified_lead(row: dict) -> dict:
    """
    Upserts into qualified_leads on the `email` unique index so repeated
    pushes just refresh the record.
    Example row keys expected:
        {email,name,company,intent,product,service,last_message,source}
    """
    supabase = get_supabase_client()
    # Supabase PostgREST recognises Prefer: resolution=merge-duplicates
    merge_hdr = {"Prefer": "resolution=merge-duplicates,return=representation"}

    op = lambda: (
        supabase
        .from_("qualified_leads")
        .insert(row, count="exact", headers=merge_hdr)
        .execute()
    )
    resp = await safe_supabase_operation(op, "Failed upserting qualified_lead")
    return resp.data[0] if resp.data else row   # when merge, PostgREST returns []
