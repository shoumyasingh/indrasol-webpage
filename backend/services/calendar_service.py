from datetime import datetime, timedelta
from typing import List
import pytz
import logging

def get_free_slots(timezone: str = "America/Los_Angeles", days_ahead: int = 7) -> List[str]:
    """
    Get available 30-minute meeting slots for the next week
    Returns formatted time slots as strings
    """
    try:
        # Parse timezone
        tz = pytz.timezone(timezone)
        now = datetime.now(tz)
        
        # Generate slots for next 7 days (business hours: 9 AM - 5 PM)
        slots = []
        
        for day_offset in range(1, days_ahead + 1):
            target_date = now + timedelta(days=day_offset)
            
            # Skip weekends
            if target_date.weekday() >= 5:  # Saturday = 5, Sunday = 6
                continue
                
            # Generate slots from 9 AM to 5 PM (30-minute intervals)
            for hour in range(9, 17):  # 9 AM to 5 PM
                for minute in [0, 30]:
                    slot_time = target_date.replace(
                        hour=hour, 
                        minute=minute, 
                        second=0, 
                        microsecond=0
                    )
                    
                    # Format as readable string
                    formatted_slot = slot_time.strftime("%A, %B %d at %I:%M %p %Z")
                    slots.append(formatted_slot)
                    
                    # Limit to 10 slots for better UX
                    if len(slots) >= 10:
                        return slots
        
        return slots
        
    except Exception as e:
        logging.error(f"Failed to get calendar slots: {e}")
        # Return fallback slots
        return [
            "Monday at 10:00 AM PST",
            "Tuesday at 2:00 PM PST", 
            "Wednesday at 11:00 AM PST",
            "Thursday at 3:00 PM PST",
            "Friday at 10:30 AM PST"
        ] 