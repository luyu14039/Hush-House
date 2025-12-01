import json

def get_cs_effects():
    keys = set()
    try:
        with open('src/data/cs_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data.get('items', []):
                reading = item.get('reading', {})
                if reading and 'effects' in reading:
                    keys.update(reading['effects'].keys())
    except Exception as e:
        print(f"Error: {e}")
    
    return sorted(list(keys))

if __name__ == "__main__":
    keys = get_cs_effects()
    print("CS Effect Keys:")
    for k in keys:
        print(k)
