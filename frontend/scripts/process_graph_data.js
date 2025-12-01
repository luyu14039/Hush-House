import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data_processing');
// Saving directly to src/data so the frontend can import it
const OUTPUT_FILE = path.join(__dirname, '../src/data/lore_graph.json');

// Load raw data
console.log("Loading data...");
const rawAnalysis = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'analysis_results_full.json'), 'utf-8'));
const entities = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'entities.json'), 'utf-8'));
const corpus = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'corpus.json'), 'utf-8'));

// Create a map of corpus ID to Name for quick lookup
const corpusMap = new Map();
corpus.forEach(item => {
    corpusMap.set(item.id, item.name);
});

console.log(`Loaded ${rawAnalysis.relationships.length} raw relationships.`);
console.log(`Loaded ${rawAnalysis.new_entities ? rawAnalysis.new_entities.length : 0} new entities.`);
console.log(`Loaded ${entities.length} known entities.`);

// Faction Translations
const FACTION_TRANSLATIONS = {
    'Solar': '太阳',
    'Moon': '月亮',
    'Knot': '绳结',
    'Eternity': '永恒',
    'Wood': '林地',
    'Flesh': '血肉',
    'Chalice': '圣杯',
    'Moth': '飞蛾',
    'Lantern': '灯',
    'Forge': '铸',
    'Edge': '刃',
    'Winter': '冬',
    'Heart': '心',
    'Knock': '启',
    'Secret Histories': '秘史',
    'Nectar': '蜜',
    'Rose': '玫瑰',
    'Sky': '穹',
    'Scale': '鳞',
    'Grail': '杯',
    'Ivory': '象牙',
    'Blood': '血',
    'Stone': '石'
};

// 1. Build Nodes Map
const nodesMap = new Map();

// Initialize nodes from known entities
entities.forEach(e => {
    nodesMap.set(e.id, {
        id: e.id,
        label: e.name,
        type: e.type,
        color: e.color || '#999',
        val: 1, // Base size for visualization
        data: {
            aliases: e.aliases,
            origin: e.origin,
            factions: e.factions,
            description: e.description,
            mentions: new Set() // Track source IDs
        }
    });
});

// Process New Entities from Analysis
if (rawAnalysis.new_entities) {
    rawAnalysis.new_entities.forEach(e => {
        if (!nodesMap.has(e.id)) {
            nodesMap.set(e.id, {
                id: e.id,
                label: e.name || e.id, // Use the name provided by LLM
                type: e.type || 'unknown',
                color: '#666',
                val: 1,
                data: {
                    mentions: new Set()
                }
            });
        }
    });
}

// 2. Process Edges (Relationships)
const edgesMap = new Map();

// Helper to add edge
const addEdge = (sourceId, targetId, type, description = null, confidence = 1.0) => {
    const edgeKey = `${sourceId}->${targetId}`;
    if (!edgesMap.has(edgeKey)) {
        edgesMap.set(edgeKey, {
            source: sourceId,
            target: targetId,
            types: new Set(),
            descriptions: [],
            weight: 0,
            confidenceSum: 0
        });
    }
    const edge = edgesMap.get(edgeKey);
    edge.types.add(type);
    if (description && !edge.descriptions.includes(description)) {
        edge.descriptions.push(description);
    }
    edge.weight += 1;
    edge.confidenceSum += confidence;
    
    // Increase node importance
    if (nodesMap.has(sourceId)) nodesMap.get(sourceId).val += 0.5;
    if (nodesMap.has(targetId)) nodesMap.get(targetId).val += 0.5;
};

// 2.1 Create Faction Nodes and Links
nodesMap.forEach(node => {
    if (node.data && node.data.factions) {
        node.data.factions.forEach(faction => {
            const factionId = `faction.${faction.toLowerCase().replace(/\s+/g, '_')}`;
            const factionLabel = FACTION_TRANSLATIONS[faction] || faction;
            
            // Create Faction Node if not exists
            if (!nodesMap.has(factionId)) {
                nodesMap.set(factionId, {
                    id: factionId,
                    label: `${factionLabel} (阵营)`,
                    type: 'faction',
                    color: '#E6C229', // Gold for factions
                    val: 5, // Factions are important
                    data: { mentions: new Set() }
                });
            }
            
            // Link Entity -> Faction
            addEdge(node.id, factionId, 'belongs_to', `${node.label} 属于 ${factionLabel} 阵营`);
        });
    }
});

rawAnalysis.relationships.forEach(rel => {
    const sourceId = rel.source;
    const targetId = rel.target;

    // Skip self-loops or invalid data
    if (!sourceId || !targetId || sourceId === targetId) return;

    // Handle Nodes not in map (fallback)
    if (!nodesMap.has(sourceId)) {
        const type = sourceId.split('.')[0] || 'unknown';
        nodesMap.set(sourceId, { 
            id: sourceId, 
            label: sourceId, 
            type: type, 
            color: '#666', 
            val: 1,
            data: { mentions: new Set() }
        });
    }
    if (!nodesMap.has(targetId)) {
        const type = targetId.split('.')[0] || 'unknown';
        nodesMap.set(targetId, { 
            id: targetId, 
            label: targetId, 
            type: type, 
            color: '#666', 
            val: 1,
            data: { mentions: new Set() }
        });
    }

    // Add mentions
    if (rel.source_item_id) {
        nodesMap.get(sourceId).data.mentions.add(rel.source_item_id);
        nodesMap.get(targetId).data.mentions.add(rel.source_item_id);
    }

    addEdge(sourceId, targetId, rel.type, rel.description, rel.confidence);
});

// 3. Format Output
const nodes = Array.from(nodesMap.values()).map(node => {
    // Convert mentions Set to Array of objects { id, name }
    const mentionsArray = Array.from(node.data.mentions).map(id => ({
        id: id,
        name: corpusMap.get(id) || id
    }));
    
    return {
        ...node,
        data: {
            ...node.data,
            mentions: mentionsArray
        }
    };
});

const links = Array.from(edgesMap.values()).map(edge => ({
    source: edge.source,
    target: edge.target,
    // Join types: "opposed_to, killed"
    label: Array.from(edge.types).join(', '), 
    weight: edge.weight,
    // Average confidence
    confidence: parseFloat((edge.confidenceSum / edge.weight).toFixed(2)),
    // Keep top 5 descriptions to keep file size manageable
    descriptions: edge.descriptions.slice(0, 5) 
}));

const graphData = {
    nodes,
    links
};

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graphData, null, 2));
console.log(`Graph data processed successfully!`);
console.log(`Total Nodes: ${nodes.length}`);
console.log(`Total Links: ${links.length}`);
console.log(`Saved to: ${OUTPUT_FILE}`);
