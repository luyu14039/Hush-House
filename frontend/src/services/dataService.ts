import csDataRaw from '../data/cs_data.json';
import bohDataRaw from '../data/boh_data.json';
import { extractEntities } from '../utils/textAnalysis';
import type { GameData, Item } from '../types';

const csData = csDataRaw as GameData;
const bohData = bohDataRaw as GameData;

// Helper to extract mentions from an item
const analyzeItem = (item: any): string[] => {
  let textToAnalyze = item.description || '';
  
  // Add reading content
  const readings = item.readings || (item.reading ? (Array.isArray(item.reading) ? item.reading : [item.reading]) : []);
  readings.forEach((r: any) => {
    if (r.intro) textToAnalyze += ' ' + r.intro;
    if (r.content) textToAnalyze += ' ' + r.content;
  });

  return extractEntities(textToAnalyze);
};

// Normalize data
export const getAllItems = (): Item[] => {
  const csItems = csData.items.map(item => {
    // Normalize CS effects to results
    const normalizedResults: any[] = [];
    if (item.reading && !Array.isArray(item.reading) && item.reading.effects) {
      Object.entries(item.reading.effects).forEach(([key, val]) => {
        if (val > 0) { // Only show gained items
           normalizedResults.push({
             action: 'reading',
             aspect: 'unknown', // CS doesn't strictly link result to aspect in the same way
             result_id: key,
             // result_name: key, // Removed to allow App.tsx to use localized name from getAspectInfo
             level: val,
             type: 'effect'
           });
        }
      });
    }

    const normalizedReadings = item.reading 
        ? (Array.isArray(item.reading) ? item.reading : [item.reading]) 
        : [];

    // Create a temporary object to pass to analyzeItem
    const tempItem = { ...item, readings: normalizedReadings };

    return {
      ...item,
      game: 'Cultist Simulator',
      // Normalize reading structure
      readings: normalizedReadings,
      results: normalizedResults,
      mentions: analyzeItem(tempItem)
    };
  });

  const bohItems = bohData.items
    .filter(item => item.name !== 'Unknown' && !item.id.startsWith('_'))
    .map(item => ({
    ...item,
    game: 'Book of Hours',
    // BoH already has 'readings' array, but let's ensure it exists
    readings: item.readings || [],
    results: item.results || [],
    mentions: analyzeItem(item)
  }));

  return [...csItems, ...bohItems];
};
