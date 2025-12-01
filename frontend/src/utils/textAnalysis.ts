import { LORE_ENTITIES } from '../data/lore_entities';
import type { EntityDefinition } from '../data/lore_entities';

export const extractEntities = (text: string): string[] => {
  if (!text) return [];
  
  const foundIds = new Set<string>();
  const lowerText = text.toLowerCase();

  LORE_ENTITIES.forEach(entity => {
    for (const alias of entity.aliases) {
      const isAscii = /^[\x00-\x7F]+$/.test(alias);
      
      if (isAscii) {
        // For English, use word boundaries to avoid partial matches (e.g. "Moth" in "Mother")
        // Escape special regex characters in alias just in case
        const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedAlias}\\b`, 'i');
        if (regex.test(text)) {
          foundIds.add(entity.id);
          break; 
        }
      } else {
        // For Chinese/Mixed, use simple inclusion
        if (lowerText.includes(alias.toLowerCase())) {
          foundIds.add(entity.id);
          break;
        }
      }
    }
  });

  return Array.from(foundIds);
};

export const getEntityDef = (id: string): EntityDefinition | undefined => {
  return LORE_ENTITIES.find(e => e.id === id);
};
