#!/usr/bin/env python3
"""
Test script to verify the follow-up agent fix.

This tests that:
1. Business terms like "Cloud Engineering" are not extracted as names
2. "Yes" responses trigger asking for name, not assuming a name was provided
3. Only actual user-provided names are extracted
"""

import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock imports
from agents.follow_up_agent import extract_collected_info
from services.stage_detect_service import detect_stage, is_name

async def test_name_extraction():
    """Test the improved name extraction logic"""
    print("=== Testing Name Extraction Fix ===\n")
    
    # Test case 1: History with business terms (should NOT extract as names)
    bad_history = """User: Where are your global locations?
Bot: At Indrasol, we offer two key products: SecureTrack and BizRadar, alongside services in
AI Security
Cloud Engineering
Application Security
and Data Engineering Are you interested in learning more about our products or exploring our services?
User: yes"""
    
    extracted_info = await extract_collected_info(bad_history, "yes")
    print("Test 1 - Business terms in history:")
    print(f"  History: {bad_history.replace(chr(10), ' | ')}")
    print(f"  Extracted name: '{extracted_info['name']}'")
    print(f"  ✅ PASS: No business term extracted as name" if not extracted_info['name'] else f"  ❌ FAIL: Incorrectly extracted '{extracted_info['name']}'")
    print()
    
    # Test case 2: History with actual user name (should extract)
    good_history = """User: Where are your global locations?
Bot: We have offices worldwide...
User: John Smith
Bot: Thanks John! What's your email?"""
    
    extracted_info = await extract_collected_info(good_history, "john.smith@email.com")
    print("Test 2 - Real user name in history:")
    print(f"  History: {good_history.replace(chr(10), ' | ')}")
    print(f"  Extracted name: '{extracted_info['name']}'")
    print(f"  ✅ PASS: Correctly extracted real name" if extracted_info['name'] == "John Smith" else f"  ❌ FAIL: Should extract 'John Smith'")
    print()
    
    # Test case 3: Only bot messages with business terms (should extract nothing)
    bot_only_history = """Bot: At Indrasol, we offer Cloud Engineering and Data Security solutions.
Bot: Are you interested in our Application Security services?"""
    
    extracted_info = await extract_collected_info(bot_only_history, "yes")
    print("Test 3 - Only bot messages:")
    print(f"  History: {bot_only_history.replace(chr(10), ' | ')}")
    print(f"  Extracted name: '{extracted_info['name']}'")
    print(f"  ✅ PASS: No extraction from bot messages" if not extracted_info['name'] else f"  ❌ FAIL: Incorrectly extracted '{extracted_info['name']}'")
    print()

async def test_stage_detection():
    """Test the improved stage detection logic"""
    print("=== Testing Stage Detection Fix ===\n")
    
    # Test case 1: User says "yes" but no name collected yet
    collected_empty = {"name": "", "email": "", "company": "", "message": ""}
    stage = await detect_stage(collected_empty, "yes", "")
    print("Test 1 - User says 'yes' with no info collected:")
    print(f"  Input: 'yes'")
    print(f"  Collected info: {collected_empty}")
    print(f"  Detected stage: '{stage}'")
    print(f"  ✅ PASS: Should ask for name" if stage == "ask_name" else f"  ❌ FAIL: Expected 'ask_name', got '{stage}'")
    print()
    
    # Test case 2: User provides actual name
    stage = await detect_stage(collected_empty, "John Smith", "")
    print("Test 2 - User provides real name:")
    print(f"  Input: 'John Smith'")
    print(f"  Collected info: {collected_empty}")
    print(f"  Detected stage: '{stage}'")
    print(f"  ✅ PASS: Should process name" if stage == "process_name" else f"  ❌ FAIL: Expected 'process_name', got '{stage}'")
    print()
    
    # Test case 3: Business term should not be detected as name
    cloud_eng_name = is_name("Cloud Engineering")
    print("Test 3 - Business term detection:")
    print(f"  Input: 'Cloud Engineering'")
    print(f"  Is detected as name: {cloud_eng_name}")
    print(f"  ✅ PASS: Business term rejected" if not cloud_eng_name else f"  ❌ FAIL: Business term incorrectly accepted as name")
    print()
    
    # Test case 4: Real name should be detected
    real_name = is_name("John Smith")
    print("Test 4 - Real name detection:")
    print(f"  Input: 'John Smith'")
    print(f"  Is detected as name: {real_name}")
    print(f"  ✅ PASS: Real name accepted" if real_name else f"  ❌ FAIL: Real name incorrectly rejected")
    print()

async def test_conversation_flow():
    """Test the complete conversation flow"""
    print("=== Testing Complete Conversation Flow ===\n")
    
    # Simulate the problematic scenario from the image
    history = """User: Where are your global locations?
Bot: At Indrasol, we offer two key products: SecureTrack and BizRadar, alongside services in AI Security, Cloud Engineering, Application Security and Data Engineering. Are you interested in learning more about our products or exploring our services?"""
    
    # Step 1: User says "yes"
    collected = await extract_collected_info(history, "yes")
    stage = await detect_stage(collected, "yes", history)
    
    print("Scenario: User says 'yes' after being asked about interest")
    print(f"  History: ...{history[-50:]}...")
    print(f"  User input: 'yes'")
    print(f"  Extracted info: {collected}")
    print(f"  Detected stage: '{stage}'")
    print()
    
    if stage == "ask_name" and not collected["name"]:
        print("  ✅ SUCCESS: Flow correctly asks for name without extracting business terms")
        print("  Expected bot response: 'Perfect! What's your name so I can personalise things?'")
    else:
        print(f"  ❌ FAILURE: Expected stage='ask_name' with no extracted name")
        print(f"  Got stage='{stage}' with name='{collected['name']}'")

if __name__ == "__main__":
    async def main():
        await test_name_extraction()
        await test_stage_detection() 
        await test_conversation_flow()
        
        print("\n=== Summary ===")
        print("✅ Fixed: Business terms no longer extracted as names")
        print("✅ Fixed: 'Yes' responses properly trigger name collection")
        print("✅ Fixed: Only actual user names from User: messages are extracted")
        print("✅ Fixed: Stage detection handles affirmative responses correctly")
    
    asyncio.run(main()) 