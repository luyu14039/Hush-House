import json
import os
import sys

def load_json_file(filepath):
    encodings = ['utf-8-sig', 'utf-16', 'utf-8', 'latin-1']
    for enc in encodings:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                return json.load(f, strict=False)
        except UnicodeDecodeError:
            continue
        except json.JSONDecodeError as e:
            print(f"JSON Error in {filepath} with {enc}: {e}")
            # Try to clean up JSON?
            continue
        except Exception as e:
            print(f"Error loading {filepath} with {enc}: {e}")
            return None
    
    print(f"Failed to load {filepath} with any encoding.")
    return None

def get_id(item):
    """Returns the value of 'id' or 'ID' from the item."""
    if 'id' in item:
        return item['id']
    if 'ID' in item:
        return item['ID']
    return None

def merge_data(core_data, loc_data):
    """
    Merges localization data into core data.
    Matches items by 'id' or 'ID'.
    """
    # Normalize to list of items
    core_items = []
    if isinstance(core_data, dict):
        for k, v in core_data.items():
            if isinstance(v, list):
                core_items.extend(v)
    elif isinstance(core_data, list):
        core_items = core_data

    loc_map = {}
    if loc_data:
        loc_items = []
        if isinstance(loc_data, dict):
            for k, v in loc_data.items():
                if isinstance(v, list):
                    loc_items.extend(v)
        elif isinstance(loc_data, list):
            loc_items = loc_data
        
        for item in loc_items:
            uid = get_id(item)
            if uid:
                loc_map[uid] = item

    # Merge
    merged = []
    for item in core_items:
        uid = get_id(item)
        if uid and uid in loc_map:
            # Update with localized fields
            loc_item = loc_map[uid]
            for k, v in loc_item.items():
                # Update text fields and xexts (for BoH)
                if k in ['label', 'Label', 'description', 'Description', 'Desc', 'startdescription', 'slots', 'xexts']: 
                    item[k] = v
        merged.append(item)
    
    return merged

def save_json(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved to {filepath}")
