import os
import json
from common import load_json_file, merge_data, save_json

# Paths
CS_ROOT = r"d:\projects\historys\Cultist Simulator\cultistsimulator_Data\StreamingAssets\content"
CORE_ELEMENTS = os.path.join(CS_ROOT, "core", "elements")
LOC_ELEMENTS = os.path.join(CS_ROOT, "loc_zh-hans", "elements")
CORE_RECIPES = os.path.join(CS_ROOT, "core", "recipes")
LOC_RECIPES = os.path.join(CS_ROOT, "loc_zh-hans", "recipes")

OUTPUT_DIR = r"d:\projects\historys\extractor\output"

# Configuration: Which files to process for items
ITEM_FILES = [
    "books_lore.json",
    "books_language.json",
    "books_other.json",
    "books_untranslated.json",
    # Add other item files here easily, e.g., "tools.json", "ingredients.json"
]

def run():
    print("Starting Cultist Simulator Extraction (Enhanced)...")

    # 1. Load Items
    all_items = []
    for filename in ITEM_FILES:
        print(f"Processing {filename}...")
        core_path = os.path.join(CORE_ELEMENTS, filename)
        loc_path = os.path.join(LOC_ELEMENTS, filename)
        
        if not os.path.exists(core_path):
            print(f"Warning: {core_path} not found.")
            continue
            
        core_data = load_json_file(core_path)
        loc_data = load_json_file(loc_path) if os.path.exists(loc_path) else None
        
        merged = merge_data(core_data, loc_data)
        all_items.extend(merged)
        
    print(f"Total items loaded: {len(all_items)}")

    # 2. Load Recipes (Reading Content)
    # We focus on study_1_books.json but could expand if needed
    print("Loading Recipes...")
    recipes_core = load_json_file(os.path.join(CORE_RECIPES, "study_1_books.json"))
    recipes_loc = load_json_file(os.path.join(LOC_RECIPES, "study_1_books.json"))
    
    all_recipes = merge_data(recipes_core, recipes_loc)
    print(f"Loaded {len(all_recipes)} recipes.")

    # 3. Map Recipes to Items
    item_recipe_map = {}
    for recipe in all_recipes:
        reqs = recipe.get('requirements', {})
        for req_id, req_val in reqs.items():
            item_recipe_map[req_id] = recipe

    # 4. Build Final Data
    extracted_items = []
    
    for item in all_items:
        item_id = item.get('id')
        if not item_id:
            continue
            
        # Determine type based on file origin or properties could be better, 
        # but for now we assume everything from these files is a "book" or readable.
        
        item_data = {
            "id": item_id,
            "name": item.get('label', 'Unknown'),
            "description": item.get('description', ''),
            "aspects": item.get('aspects', {}),
            "type": "book", # Default type
            "icon": item.get('icon', item_id)
        }

        # Find reading content
        if item_id in item_recipe_map:
            recipe = item_recipe_map[item_id]
            item_data['reading'] = {
                "intro": recipe.get('startdescription', ''),
                "content": recipe.get('description', ''),
                "effects": recipe.get('effects', {})
            }
        
        extracted_items.append(item_data)

    # 5. Save
    output_file = os.path.join(OUTPUT_DIR, "cs_data.json")
    save_json({"game": "Cultist Simulator", "items": extracted_items}, output_file)
    print("Done.")

if __name__ == "__main__":
    run()
