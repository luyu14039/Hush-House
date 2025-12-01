import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const API_KEY = process.env.DEEPSEEK_API_KEY || 'YOUR_API_KEY_HERE';
const API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL_NAME = 'deepseek-chat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data_processing');

// Load Data
const entities = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'entities.json'), 'utf-8'));
const corpus = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'corpus.json'), 'utf-8'));

// Helper: Construct System Prompt
const getSystemPrompt = () => {
    const entityList = entities.map(e => {
        let info = `${e.name} (ID: ${e.id})`;
        if (e.aliases && e.aliases.length) info += `, Aliases: [${e.aliases.join(', ')}]`;
        if (e.origin) info += `, Origin: ${e.origin}`;
        if (e.factions && e.factions.length) info += `, Factions: [${e.factions.join(', ')}]`;
        return info;
    }).join('\n');

    return `You are an expert Lore Keeper for the Secret Histories universe (Cultist Simulator, Book of Hours).
Your goal is to build a "Lore Network" by analyzing text fragments and identifying relationships between entities.

### Known Entities Database:
${entityList}

### Instructions:
1. **Analyze** the provided text fragments deeply. Look for direct mentions, symbolic references, and implied connections.
2. **Identify Relationships** between the text's subject (or entities within it) and the Known Entities.
3. **Relationship Types**:
   - 'allied_with': Working together, same faction, or friendly.
   - 'opposed_to': Enemies, fighting, or conflicting principles.
   - 'created': One entity created the other (e.g., The Forge created the Sun).
   - 'killed': One entity killed the other (e.g., The Colonel killed the Seven-Coils).
   - 'parent_of' / 'child_of': Genealogical or creator/creation relationship.
   - 'aspect_of': One is a facet or sub-identity of another.
   - 'served_by': One is a servant/name of the other.
   - 'located_in': Spatial relationship.
   - 'associated_with': General thematic link if no specific type fits.
   - 'belongs_to': Entity belongs to a faction/organization (e.g., 'faction.solar').

4. **Entity ID Rules (CRITICAL)**:
   - **Check Known Entities First**: Before creating a new ID, you MUST check the "Known Entities Database". If the entity exists there (even under a different alias or language), use the EXISTING ID.
   - **Deduplication**: Do not create separate IDs for the same entity in different languages.
     - Example: "Hooded Princes" and "兜颈贵胄" are the same. Use ONE ID (prefer English if available, e.g., 'group.hooded_princes').
   - **New IDs**: If you must create a new ID:
     - Use snake_case English if possible (e.g., 'person.christopher_illopoly').
     - Use Pinyin ONLY if no English name is known.
     - Format: type.name (e.g., 'location.mansus', 'event.war_of_roads').

5. **Freedom**: You are encouraged to infer connections based on your knowledge of the lore, even if the text is cryptic. Use the "confidence" score to indicate certainty.

### Output Format (JSON):
Return a JSON object with two arrays: "relationships" and "new_entities".

1. "relationships":
{
  "source": "entity_id",
  "target": "entity_id",
  "type": "relationship_type",
  "description": "Brief explanation.",
  "confidence": 0.9,
  "source_item_id": "The ID of the fragment where this was found (e.g., 'book.locksmiths_dream_1')"
}

2. "new_entities" (for any entity ID used above that is NOT in the Known Entities Database):
{
  "id": "entity_id",
  "name": "The correct Chinese name if available, otherwise English name",
  "type": "person/location/event/etc"
}
`;
};

// Helper: Call API
async function analyzeBatch(items) {
    const userPrompt = items.map(item => `
---
Fragment ID: ${item.id}
Fragment Name: ${item.name}
Fragment Text: ${item.text}
---
`).join('\n');

    const payload = {
        model: MODEL_NAME,
        messages: [
            { role: "system", content: getSystemPrompt() },
            { role: "user", content: `Analyze the following lore fragments and extract relationships:\n${userPrompt}` }
        ],
        temperature: 1.0, // High temperature for creative extraction as recommended
        response_format: { type: "json_object" }
    };

    try {
        console.log(`Sending batch of ${items.length} items to DeepSeek...`);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errText}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error("Error calling DeepSeek:", error);
        return null;
    }
}

// Main Execution
async function main() {
    const CHUNK_SIZE = 10; // Process 10 items at a time to respect token limits
    const allRelationships = [];
    const allNewEntities = [];
    const totalBatches = Math.ceil(corpus.length / CHUNK_SIZE);

    console.log(`Starting full analysis of ${corpus.length} items in ${totalBatches} batches...`);

    for (let i = 0; i < corpus.length; i += CHUNK_SIZE) {
        const batchNum = Math.floor(i / CHUNK_SIZE) + 1;
        const batch = corpus.slice(i, i + CHUNK_SIZE);
        
        console.log(`Processing Batch ${batchNum}/${totalBatches} (Items ${i + 1}-${Math.min(i + CHUNK_SIZE, corpus.length)})...`);
        
        try {
            const result = await analyzeBatch(batch);
            if (result) {
                if (result.relationships) {
                    allRelationships.push(...result.relationships);
                    console.log(`  Found ${result.relationships.length} relationships.`);
                }
                if (result.new_entities) {
                    allNewEntities.push(...result.new_entities);
                    console.log(`  Found ${result.new_entities.length} new entities.`);
                }
            }
        } catch (err) {
            console.error(`  Error processing batch ${batchNum}:`, err.message);
        }

        // Save intermediate progress every 5 batches
        if (batchNum % 5 === 0) {
             const intermediatePath = path.join(DATA_DIR, 'analysis_results_partial.json');
             fs.writeFileSync(intermediatePath, JSON.stringify({ 
                 relationships: allRelationships,
                 new_entities: allNewEntities
             }, null, 2));
             console.log(`  Saved partial results to ${intermediatePath}`);
        }
    }

    console.log(`Analysis Complete. Total relationships: ${allRelationships.length}, New Entities: ${allNewEntities.length}`);
    const outputPath = path.join(DATA_DIR, 'analysis_results_full.json');
    fs.writeFileSync(outputPath, JSON.stringify({ 
        relationships: allRelationships,
        new_entities: allNewEntities
    }, null, 2));
    console.log(`Saved full results to ${outputPath}`);
}

main();
