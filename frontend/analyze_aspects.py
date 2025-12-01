import json
import os

def get_all_aspect_keys():
    keys = set()
    
    # Load CS Data
    try:
        with open('src/data/cs_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data.get('items', []):
                keys.update(item.get('aspects', {}).keys())
    except Exception as e:
        print(f"Error reading cs_data.json: {e}")

    # Load BoH Data
    try:
        with open('src/data/boh_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data.get('items', []):
                keys.update(item.get('aspects', {}).keys())
    except Exception as e:
        print(f"Error reading boh_data.json: {e}")
        
    return sorted(list(keys))

if __name__ == "__main__":
    all_keys = get_all_aspect_keys()
    print("All unique aspect keys found:")
    for key in all_keys:
        print(key)
