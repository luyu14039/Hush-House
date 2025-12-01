export const HOUR_PRINCIPLES: Record<string, string[]> = {
  'hour.sun_in_rags': ['lantern', 'winter'],
  'hour.colonel': ['edge'],
  'hour.lionsmith': ['edge', 'forge'],
  'hour.red_grail': ['grail'],
  'hour.moth': ['moth'],
  'hour.watchman': ['lantern'],
  'hour.wolf_divided': ['edge'],
  'hour.elegiast': ['winter'],
  'hour.forge_of_days': ['forge'],
  'hour.madrugad': ['lantern', 'winter'],
  'hour.meniscate': ['moon', 'knock'],
  'hour.velvet': ['moth', 'knock'],
  'hour.malachite': ['nectar'],
  'hour.thunderskin': ['heart'],
  'hour.mother_of_ants': ['knock', 'winter'],
  'hour.witch_and_sister': ['grail'],
  'hour.flowermaker': ['grail', 'moth'],
  'hour.horned_axe': ['edge', 'winter'],
  'hour.beach_crow': ['knock'],
  'hour.vagabond': ['rose', 'sky'],
};

export interface EntityConnection {
  source: string;
  target: string;
  type: 'cause' | 'related';
}

// Causal or Thematic connections between entities (Events, Hours, People)
export const ENTITY_CONNECTIONS: EntityConnection[] = [
  // --- The Lithomachia (Dawn Age) ---
  // The overthrow of the Gods-from-Stone
  { source: 'hour.moth', target: 'hour.wheel', type: 'cause' }, // Moth skinned Wheel
  { source: 'hour.red_grail', target: 'hour.tide', type: 'cause' }, // Grail drank Tide
  { source: 'hour.forge_of_days', target: 'hour.flint', type: 'cause' }, // Forge shattered Flint
  { source: 'hour.colonel', target: 'hour.seven_coils', type: 'cause' }, // Colonel slew Seven-Coils
  { source: 'event.lithomachia', target: 'hour.egg_unhatching', type: 'related' }, // Egg fled
  { source: 'event.lithomachia', target: 'hour.sun_in_splendour', type: 'cause' }, // Rise of the Sun

  // --- The Noon Age ---
  { source: 'event.lithomachia', target: 'event.truce', type: 'cause' }, // Peace after war
  { source: 'hour.horned_axe', target: 'event.truce', type: 'related' }, // Key player in Truce
  { source: 'hour.red_grail', target: 'event.truce', type: 'related' }, // Key player in Truce
  
  // --- The Intercalate (End of Noon) ---
  { source: 'hour.sun_in_splendour', target: 'event.intercalate', type: 'cause' },
  { source: 'event.intercalate', target: 'hour.sun_in_rags', type: 'cause' },
  { source: 'event.intercalate', target: 'hour.wolf_divided', type: 'cause' },
  { source: 'event.intercalate', target: 'hour.meniscate', type: 'cause' },
  { source: 'event.intercalate', target: 'hour.madrugad', type: 'cause' },
  
  // --- The Twilight Age? ---
  { source: 'event.intercalate', target: 'event.worm_wars', type: 'cause' }, // Weakness led to Worms
  { source: 'event.worm_wars', target: 'org.suppression_bureau', type: 'related' }, // Bureau fights threats
  
  // --- Modern Era ---
  { source: 'event.solar_war', target: 'event.second_dawn', type: 'related' }, // The goal
  { source: 'hour.colonel', target: 'event.war_of_roads', type: 'related' },
  { source: 'hour.lionsmith', target: 'event.war_of_roads', type: 'related' },

  // --- Relationships ---
  { source: 'hour.colonel', target: 'hour.lionsmith', type: 'related' },
  { source: 'org.st_hydra', target: 'person.illopoly', type: 'related' },
  { source: 'person.teresa', target: 'person.illopoly', type: 'related' },
  { source: 'person.teresa', target: 'loc.mansus', type: 'related' },
  { source: 'person.morland', target: 'org.st_hydra', type: 'related' },
];

