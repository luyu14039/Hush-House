export interface Aspect {
  [key: string]: number;
}

export interface ReadingResult {
  action: string;
  aspect: string;
  result_id: string;
  result_name?: string;
  level: number;
  type: string;
}

export interface Reading {
  aspect: string;
  intro?: string;
  content?: string;
  effects?: Aspect;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  aspects: Aspect;
  type: string;
  icon: string;
  game?: string;
  reading?: Reading | Reading[]; // CS has single object, BoH has array
  readings?: Reading[]; // BoH uses this
  results?: ReadingResult[];
  mentions?: string[]; // IDs of entities mentioned in description/readings
}

export interface GameData {
  game: string;
  items: Item[];
}
