# --- Existing flawed logic (Conceptual representation of the bug) ---
def calculateTimeScope(activities, breakRanges):
    """Calculates time scope, potentially ignoring custom ranges if they deviate."""
    start = min(activity['start'] for activity in activities) 
    end = max(activity['end'] for activity in activities) 

    # If the range calculation only accounts for default breaks or structured gaps:
    if breakRanges is not empty and not is_standard_break(breakRanges):
        # CRITICAL BUG POINT: The function might fail here, returning None 
        # or incorrectly adjusting start/end based on non-contiguous data.
        pass 

    return {'min_time': start, 'max_time': end}


# --- EMP_Agent Refactored Fix (Robust Aggregation) ---

import itertools
from typing import List, Dict, Union

ScheduleItem = Dict[str, Union[float, str]] # e.g., {'start': 9.0, 'end': 10.0}

def calculate_global_time_scope(activities: List[ScheduleItem], custom_break_ranges: List[ScheduleItem]) -> Dict[str, float]:
    """
    Calculates the absolute minimum start time and maximum end time for the entire timeline view 
    by considering ALL provided segments (activities + breaks).

    Parameters:
        activities: List of scheduled activities.
        custom_break_ranges: List of custom defined break/free times.

    Returns:
        A dictionary containing 'min_time' and 'max_time'.
    """
    all_segments = list(activities) + custom_break_ranges
    
    if not all_segments:
        # Edge case: No schedule data provided at all. Default to system standard (e.g., 0 to 24 hours).
        return {'min_time': 0.0, 'max_time': 24.0}

    # 1. Extract all start and end times from every single segment
    all_starts = [segment['start'] for segment in all_segments]
    all_ends = [segment['end'] for segment in all_segments]
    
    try:
        global_min = min(all_starts)
        global_max = max(all_ends)
    except ValueError:
        # Handle case where the lists might be empty (though guarded above, good practice).
        print("Warning: No time boundaries found.")
        return {'min_time': 0.0, 'max_time': 24.0}

    # 2. Ensure start time is strictly less than end time to prevent collapsed views
    if global_min >= global_max:
         raise ValueError("Schedule data provided resulted in an invalid timeline scope (Start >= End).")


    return {'min_time': global_min, 'max_time': global_max}

# --- Integration Point ---

def render_timeline(activities: List[ScheduleItem], custom_break_ranges: List[ScheduleItem]):
    """
    Main rendering function entry point. Must call the robust scope calculator first.
    """
    try:
        scope = calculate_global_time_scope(activities, custom_break_ranges)
        print(f"[SUCCESS] Timeline Scope Calculated: {scope['min_time']} to {scope['max_time']}")

        # Pass 'scope' to the underlying rendering engine (e.g., canvas drawing context)
        draw_timeline_background(scope['min_time'], scope['max_time']) 
        
    except ValueError as e:
        print(f"[ERROR] Could not render timeline due to invalid schedule data: {e}")
