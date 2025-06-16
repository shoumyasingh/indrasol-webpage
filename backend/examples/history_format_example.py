#!/usr/bin/env python3
"""
Example demonstrating the new JSONB history format.

OLD FORMAT (strings):
["User: Where are your global locations?", "Bot: We have offices worldwide...", "User: yes", "Bot: Great! Would you like to book a demo?"]

NEW FORMAT (structured objects):
[
    {"user": "Where are your global locations?", "bot": "We have offices worldwide..."},
    {"user": "yes", "bot": "Great! Would you like to book a demo?"}
]
"""

# Example old format
old_history = [
    "User: Where are your global locations?",
    "Bot: We have offices in San Ramon (USA), Singapore, Hyderabad (India), and Mexico City (Mexico).",
    "User: yes", 
    "Bot: Awesome! Would you like to book a demo or speak to our expert team directly?"
]

# Example new structured format that will be stored in JSONB
new_structured_history = [
    {
        "user": "Where are your global locations?",
        "bot": "We have offices in San Ramon (USA), Singapore, Hyderabad (India), and Mexico City (Mexico)."
    },
    {
        "user": "yes",
        "bot": "Awesome! Would you like to book a demo or speak to our expert team directly?"
    }
]

print("=== OLD FORMAT (String Array) ===")
for i, msg in enumerate(old_history):
    print(f"{i+1}: {msg}")

print("\n=== NEW FORMAT (JSONB Objects) ===")
for i, conversation in enumerate(new_structured_history):
    print(f"Conversation {i+1}:")
    print(f"  User: {conversation['user']}")
    print(f"  Bot:  {conversation['bot']}")
    print()

print("=== BENEFITS OF NEW FORMAT ===")
print("1. Easier querying: SELECT * FROM conversation_memory WHERE history @> '[{\"user\": \"demo\"}]'")
print("2. Better structure: Clear user/bot pairing")
print("3. JSON Path queries: history->0->>'user' gets first user message")
print("4. Analytics ready: Count user messages, bot responses, conversation length")
print("5. Export friendly: Direct JSON format for data analysis")

# Example Supabase JSONB queries with new format:
example_queries = """
=== EXAMPLE SUPABASE QUERIES ===

-- Find conversations mentioning 'demo'
SELECT user_id, conv_history 
FROM conversation_memory 
WHERE conv_history @> '[{"user": "demo"}]' 
   OR conv_history @> '[{"bot": "demo"}]';

-- Get all user messages from a conversation  
SELECT jsonb_array_elements(conv_history)->>'user' as user_messages
FROM conversation_memory 
WHERE user_id = 'some-user-id';

-- Count conversation turns
SELECT user_id, jsonb_array_length(conv_history) as conversation_length
FROM conversation_memory;

-- Find conversations where user asked about locations
SELECT user_id, conv_history
FROM conversation_memory
WHERE conv_history @@ '$.*.user like_regex "location" flag "i"';
"""

print(example_queries) 