import os
import json
import sys

# Add current directory to path to import common
sys.path.append(r"d:\projects\historys\extractor")
from common import load_json_file

BOH_ROOT = r"d:\projects\historys\Book of Hours\bh_Data\StreamingAssets\bhcontent"
CORE_ELEMENTS = os.path.join(BOH_ROOT, "core", "elements")

def scan_xexts():
    all_keys = set()
    files_to_check = ["tomes.json", "journal.json", "DLC_HOL_manuscripts.json", "correspondence_elements.json"]
    
    for filename in os.listdir(CORE_ELEMENTS):
        if not filename.endswith(".json"):
            continue
            
        filepath = os.path.join(CORE_ELEMENTS, filename)
        data = load_json_file(filepath)
        if not data:
            continue
            
        items = []
        if isinstance(data, dict):
            items = data.get('elements', [])
        elif isinstance(data, list):
            items = data
            
        for item in items:
            xexts = item.get('xexts')
            if xexts:
                for k in xexts.keys():
                    all_keys.add(k)

    print("Unique xexts keys found:")
    for k in sorted(list(all_keys)):
        print(k)

if __name__ == "__main__":
    scan_xexts()
