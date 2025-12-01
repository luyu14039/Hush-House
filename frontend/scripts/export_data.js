import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_DIR = path.join(__dirname, '../data_processing');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// 1. Load Lore Entities
const loreEntitiesPath = path.join(DATA_DIR, 'lore_entities.ts');
const loreEntitiesContent = fs.readFileSync(loreEntitiesPath, 'utf-8');

// Extract the array content using regex
// Matches "export const LORE_ENTITIES: EntityDefinition[] = [" ... "];"
const match = loreEntitiesContent.match(/export const LORE_ENTITIES: EntityDefinition\[\] = (\[[\s\S]*?\]);/);

let entities = [];
if (match && match[1]) {
    // We need to make the content JSON-compliant or eval-able
    // The content is valid JS object literal syntax (keys might not be quoted)
    // We can use eval() to parse it.
    try {
        // Remove comments
        const cleanContent = match[1].replace(/\/\/.*$/gm, '');
        entities = eval(cleanContent);
        console.log(`Loaded ${entities.length} entities.`);
    } catch (e) {
        console.error("Error parsing lore_entities.ts:", e);
    }
} else {
    console.error("Could not find LORE_ENTITIES array in file.");
}

// Save entities to JSON
fs.writeFileSync(path.join(OUTPUT_DIR, 'entities.json'), JSON.stringify(entities, null, 2));


// 2. Load Game Data
const csDataPath = path.join(DATA_DIR, 'cs_data.json');
const bohDataPath = path.join(DATA_DIR, 'boh_data.json');

const csData = JSON.parse(fs.readFileSync(csDataPath, 'utf-8'));
const bohData = JSON.parse(fs.readFileSync(bohDataPath, 'utf-8'));

// 3. Process Corpus
// We want a list of items with ID, Name, and Description (and maybe readings)
const corpus = [];

// Process CS Data
if (csData.items) {
    csData.items.forEach(item => {
        let text = item.description || '';
        // Add reading content if available
        if (item.reading) {
            const readings = Array.isArray(item.reading) ? item.reading : [item.reading];
            readings.forEach(r => {
                if (r.intro) text += ' ' + r.intro;
                if (r.content) text += ' ' + r.content;
            });
        }
        
        if (text.trim()) {
            corpus.push({
                id: item.id,
                name: item.name || item.label, // CS uses label sometimes
                game: 'Cultist Simulator',
                text: text.trim()
            });
        }
    });
}

// Process BoH Data
if (bohData.items) {
    bohData.items.forEach(item => {
        // Filter out internal items
        if (item.name === 'Unknown' || (item.id && item.id.startsWith('_'))) return;

        let text = item.description || '';
        // BoH readings
        if (item.readings) {
            item.readings.forEach(r => {
                if (r.intro) text += ' ' + r.intro;
                if (r.content) text += ' ' + r.content;
            });
        }

        if (text.trim()) {
            corpus.push({
                id: item.id,
                name: item.name,
                game: 'Book of Hours',
                text: text.trim()
            });
        }
    });
}

console.log(`Loaded ${corpus.length} corpus items.`);

// Save corpus to JSON
fs.writeFileSync(path.join(OUTPUT_DIR, 'corpus.json'), JSON.stringify(corpus, null, 2));

console.log("Data export complete. Files saved to 'data_processing/' directory.");
