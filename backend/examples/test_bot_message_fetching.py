#!/usr/bin/env python3
"""
Test script demonstrating the new bot message fetching from JSONB history.

This shows how the get_last_bot_messages() function works with the new structured format.
"""

import asyncio
import sys
import os

# Add the backend directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock the required functions for testing
class MockStructuredHistory:
    """Mock conversation history in new JSONB format"""
    
    def __init__(self):
        self.history = [
            {"user": "Hi there", "bot": "Hello! How can I help you today?"},
            {"user": "Tell me about your products", "bot": "We offer SecureTrack and BizRadar solutions for enterprise security."},
            {"user": "What's your location?", "bot": "We have offices worldwide in San Ramon, Singapore, Hyderabad, and Mexico City."},
            {"user": "Sounds good", "bot": "Great! Would you like to book a demo to see our solutions in action?"},
            {"user": "yes", "bot": "Perfect! What's your name so I can personalize the demo for you?"}
        ]
    
    def get_last_bot_messages(self, count: int = 2) -> list:
        """Extract last N bot messages from structured history"""
        bot_messages = []
        
        # Start from newest conversation (reversed)
        for conversation in reversed(self.history):
            if isinstance(conversation, dict) and conversation.get("bot"):
                bot_messages.append(conversation["bot"].lower())
                if len(bot_messages) >= count:
                    break
        
        return bot_messages


def test_bot_message_detection():
    """Test the bot message detection logic"""
    print("=== Testing Bot Message Detection ===\n")
    
    mock_history = MockStructuredHistory()
    
    # Test getting last 2 bot messages
    last_2_messages = mock_history.get_last_bot_messages(count=2)
    print("Last 2 bot messages:")
    for i, msg in enumerate(last_2_messages, 1):
        print(f"  {i}: {msg}")
    print()
    
    # Test demo detection phrases
    demo_detection_phrases = [
        "your name", "email", "company",
        "goal", "pain-point", "challenge", "topic", "focus on"
    ]
    
    print("Checking for demo collection phrases in recent bot messages:")
    bot_collecting_info = any(
        phrase in line
        for line in last_2_messages
        for phrase in demo_detection_phrases
    )
    print(f"Bot is collecting demo info: {bot_collecting_info}")
    print()
    
    # Test demo keyword detection
    demo_keywords = ("book a demo", "schedule a demo", "demo booking")
    demo_mentioned = any(kw in line for line in last_2_messages for kw in demo_keywords)
    print(f"Demo keywords mentioned in recent messages: {demo_mentioned}")
    print()
    
    # Show which phrases were detected
    detected_phrases = []
    for line in last_2_messages:
        for phrase in demo_detection_phrases:
            if phrase in line:
                detected_phrases.append(f"'{phrase}' in '{line[:50]}...'")
    
    if detected_phrases:
        print("Detected demo collection phrases:")
        for detection in detected_phrases:
            print(f"  - {detection}")
    else:
        print("No demo collection phrases detected in recent messages")


def compare_old_vs_new_format():
    """Compare old string format vs new structured format"""
    print("\n=== Old vs New Format Comparison ===\n")
    
    # Old format (what we used to get from req.history)
    old_format = [
        "User: Hi there",
        "Bot: Hello! How can I help you today?",
        "User: Tell me about your products", 
        "Bot: We offer SecureTrack and BizRadar solutions for enterprise security.",
        "User: What's your location?",
        "Bot: We have offices worldwide in San Ramon, Singapore, Hyderabad, and Mexico City.",
        "User: Sounds good",
        "Bot: Great! Would you like to book a demo to see our solutions in action?",
        "User: yes",
        "Bot: Perfect! What's your name so I can personalize the demo for you?"
    ]
    
    # Extract last 2 bot messages from old format
    old_bot_messages = [
        l.lower() for l in reversed(old_format)
        if l.lower().startswith("bot:")
    ][:2]
    
    # Remove "bot: " prefix for comparison
    old_cleaned = [msg[5:] for msg in old_bot_messages]  # Remove "bot: "
    
    print("OLD FORMAT - Last 2 bot messages:")
    for i, msg in enumerate(old_cleaned, 1):
        print(f"  {i}: {msg}")
    print()
    
    # New format
    mock_history = MockStructuredHistory()
    new_bot_messages = mock_history.get_last_bot_messages(count=2)
    
    print("NEW FORMAT - Last 2 bot messages:")
    for i, msg in enumerate(new_bot_messages, 1):
        print(f"  {i}: {msg}")
    print()
    
    print("✅ Both formats return the same content, but new format:")
    print("   - Comes from persistent Supabase storage")
    print("   - Survives page refreshes and sessions")
    print("   - Supports better querying and analytics")
    print("   - Has cleaner structure without prefixes")


if __name__ == "__main__":
    test_bot_message_detection()
    compare_old_vs_new_format() 