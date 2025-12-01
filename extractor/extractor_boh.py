import os
import json
from common import load_json_file, merge_data, save_json

# Paths
BOH_ROOT = r"d:\projects\historys\Book of Hours\bh_Data\StreamingAssets\bhcontent"
CORE_ELEMENTS = os.path.join(BOH_ROOT, "core", "elements")
LOC_ELEMENTS = os.path.join(BOH_ROOT, "loc_zh-hans", "elements")

OUTPUT_DIR = r"d:\projects\historys\extractor\output"

# Configuration: Which files to process for items
ITEM_FILES = [
    "tomes.json",
    "journal.json",
    "DLC_HOL_manuscripts.json",
    "correspondence_elements.json",
]

def load_all_elements_for_lookup():
    """
    Loads ALL elements from the game to build a ID -> Name lookup map.
    This is crucial for resolving IDs in xtriggers (e.g. 'numen.conf' -> 'Numen: Inescapable Confinement')
    """
    print("Building global lookup map...")
    lookup = {}
    
    # Iterate over ALL json files in elements directory
    for filename in os.listdir(CORE_ELEMENTS):
        if not filename.endswith(".json"):
            continue
            
        core_path = os.path.join(CORE_ELEMENTS, filename)
        loc_path = os.path.join(LOC_ELEMENTS, filename)
        
        core_data = load_json_file(core_path)
        loc_data = load_json_file(loc_path) if os.path.exists(loc_path) else None
        
        merged = merge_data(core_data, loc_data)
        
        for item in merged:
            uid = item.get('id') or item.get('ID')
            if uid:
                label = item.get('Label') or item.get('label')
                if label:
                    lookup[uid] = label
                    
    print(f"Lookup map built with {len(lookup)} entries.")
    return lookup

def parse_xexts(xexts):
    """
    Parses the xexts dictionary into a structured reading list.
    """
    if not xexts:
        return None
    
    readings = {}
    
    for key, text in xexts.items():
        parts = key.split('.')
        
        if len(parts) >= 2 and parts[0] == 'reading':
            aspect = parts[1] # e.g., 'lantern'
            if aspect not in readings:
                readings[aspect] = {"aspect": aspect}
            
            if len(parts) == 3 and parts[2] == 'intro':
                readings[aspect]['intro'] = text
            elif len(parts) == 2:
                readings[aspect]['content'] = text
                
    return list(readings.values())

def parse_xtriggers(xtriggers, lookup_map):
    """
    Parses xtriggers to find results of reading/mastering.
    """
    if not xtriggers:
        return None
        
    results = []
    
    # We are interested in 'reading.ASPECT' and 'mastering.ASPECT' keys
    for trigger_key, effects in xtriggers.items():
        # trigger_key example: "reading.knock", "mastering.knock"
        
        action_type = "unknown"
        aspect = "unknown"
        
        parts = trigger_key.split('.')
        if len(parts) >= 2:
            action_type = parts[0] # reading, mastering
            aspect = parts[1]
            
        if action_type not in ['reading', 'mastering']:
            continue
            
        for effect in effects:
            effect_id = effect.get('id')
            if not effect_id:
                continue
                
            result_name = lookup_map.get(effect_id, effect_id)
            
            results.append({
                "action": action_type,
                "aspect": aspect,
                "result_id": effect_id,
                "result_name": result_name,
                "level": effect.get('level', 1),
                "type": "spawn" if effect.get('morpheffect') == 'spawn' else "transform"
            })
            
    return results

def run():
    print("Starting Book of Hours Extraction (Enhanced V2)...")

    # 1. Build Lookup Map
    lookup_map = load_all_elements_for_lookup()

    # 2. Load Target Items
    all_items = []
    for filename in ITEM_FILES:
        print(f"Processing {filename}...")
        core_path = os.path.join(CORE_ELEMENTS, filename)
        loc_path = os.path.join(LOC_ELEMENTS, filename)
        
        core_data = load_json_file(core_path)
        loc_data = load_json_file(loc_path) if os.path.exists(loc_path) else None
        
        merged = merge_data(core_data, loc_data)
        all_items.extend(merged)

    print(f"Total items loaded: {len(all_items)}")

    # 3. Build Final Data
    extracted_items = []
    
    for item in all_items:
        item_id = item.get('ID') or item.get('id')
        if not item_id:
            continue
            
        item_data = {
            "id": item_id,
            "name": item.get('Label', item.get('label', 'Unknown')),
            "description": item.get('Desc', item.get('description', '')),
            "aspects": item.get('aspects', {}),
            "type": "book",
            "icon": item.get('icon', item_id)
        }

        # Extract Reading Content (xexts)
        xexts = item.get('xexts')
        readings = parse_xexts(xexts)
        if readings:
            item_data['readings'] = readings
            
        # Extract Results (xtriggers)
        xtriggers = item.get('xtriggers')
        results = parse_xtriggers(xtriggers, lookup_map)
        if results:
            item_data['results'] = results
        
        extracted_items.append(item_data)

    # 4. Save
    output_file = os.path.join(OUTPUT_DIR, "boh_data.json")
    save_json({"game": "Book of Hours", "items": extracted_items}, output_file)
    print("Done.")

if __name__ == "__main__":
    run()
