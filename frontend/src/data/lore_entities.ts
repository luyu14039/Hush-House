export type EntityType = 'hour' | 'location' | 'person' | 'event' | 'organization';

export interface EntityDefinition {
  id: string;
  name: string;
  type: EntityType;
  aliases: string[];
  color: string;
  description?: string;
  origin?: string;
  factions?: string[];
}

export const LORE_ENTITIES: EntityDefinition[] = [
  // --- 石源诸神 (Gods-from-Stone) ---
  {
    id: 'hour.horned_axe',
    name: '双角斧',
    type: 'hour',
    aliases: ['双角斧', 'The Horned Axe'],
    color: '#8B4513',
    origin: 'Stone',
    factions: ['Knot']
  },
  {
    id: 'hour.seven_coils',
    name: '七蟠',
    type: 'hour',
    aliases: ['七蟠', 'The Seven-Coils'],
    color: '#2F4F4F',
    origin: 'Stone'
  },
  {
    id: 'hour.wheel',
    name: '转轮',
    type: 'hour',
    aliases: ['转轮', 'The Wheel'],
    color: '#A0522D',
    origin: 'Stone'
  },
  {
    id: 'hour.flint',
    name: '燧石',
    type: 'hour',
    aliases: ['燧石', 'The Flint'],
    color: '#708090',
    origin: 'Stone'
  },
  {
    id: 'hour.egg_unhatching',
    name: '逆孵之卵',
    type: 'hour',
    aliases: ['逆孵之卵', 'The Egg Unhatching'],
    color: '#F0E68C',
    origin: 'Stone'
  },
  {
    id: 'hour.tide',
    name: '浪潮',
    type: 'hour',
    aliases: ['浪潮', 'The Tide'],
    color: '#4682B4',
    origin: 'Stone'
  },

  // --- 血源诸神 (Gods-from-Blood) ---
  {
    id: 'hour.moth',
    name: '飞蛾',
    type: 'hour',
    aliases: ['飞蛾', '斑驳的驼背人', 'The Moth', 'The Mottled Hunchback'],
    color: '#F0E68C',
    origin: 'Blood',
    factions: ['Wood']
  },
  {
    id: 'hour.red_grail',
    name: '赤杯',
    type: 'hour',
    aliases: ['赤杯', '渴慕之母', '山峦之母', '大母神', 'The Red Grail', 'Mother of Mountains'],
    color: '#C92A2A',
    origin: 'Blood',
    factions: ['Knot']
  },
  {
    id: 'hour.velvet',
    name: '丝毧',
    type: 'hour',
    aliases: ['丝毧', '丝绒', '黑丝绒', 'The Velvet', 'The Black Velvet'],
    color: '#4B0082',
    origin: 'Blood',
    factions: ['Wood']
  },
  {
    id: 'hour.thunderskin',
    name: '轰雷之皮',
    type: 'hour',
    aliases: ['轰雷之皮', 'The Thunderskin'],
    color: '#FF6347',
    origin: 'Blood',
    factions: ['Knot', 'Flesh']
  },

  // --- 光源诸神 (Gods-from-Light) ---
  {
    id: 'hour.forge_of_days',
    name: '白日铸炉',
    type: 'hour',
    aliases: ['白日铸炉', '塑造者', 'The Forge of Days', 'The Shaper'],
    color: '#FF4500',
    origin: 'Light',
    factions: ['Solar']
  },
  {
    id: 'hour.meniscate',
    name: '弧月',
    type: 'hour',
    aliases: ['弧月', '新月', '守夜人的姐妹', 'The Meniscate'],
    color: '#E6E6FA',
    origin: 'Light',
    factions: ['Solar']
  },
  {
    id: 'hour.sun_in_rags',
    name: '残阳',
    type: 'hour',
    aliases: ['残阳', '衣衫褴褛的骄阳', '寒日', '破碎的太阳', 'Sun-in-Rags', 'The Cold Sun'],
    color: '#E6C229',
    origin: 'Light',
    factions: ['Solar']
  },
  {
    id: 'hour.madrugad',
    name: '昕旦',
    type: 'hour',
    aliases: ['昕旦', '拂晓', '黎明之神', 'The Madrugad'],
    color: '#FF69B4',
    origin: 'Light',
    factions: ['Solar']
  },
  {
    id: 'hour.flowermaker',
    name: '制花人',
    type: 'hour',
    aliases: ['制花人', 'The Flowermaker'],
    color: '#FF1493',
    origin: 'Light'
  },
  {
    id: 'hour.sun_in_splendour',
    name: '骄阳',
    type: 'hour',
    aliases: ['骄阳', 'The Sun-in-Splendour'],
    color: '#FFD700',
    origin: 'Light',
    factions: ['Solar']
  },

  // --- 肉源诸神 (Gods-from-Flesh) ---
  {
    id: 'hour.watchman',
    name: '守夜人',
    type: 'hour',
    aliases: ['守夜人', '门扉之钥', '无情者', 'The Watchman', 'The Merciless'],
    color: '#FFD700',
    origin: 'Flesh',
    factions: ['Solar']
  },
  {
    id: 'hour.malachite',
    name: '石绿',
    type: 'hour',
    aliases: ['石绿', 'The Malachite'],
    color: '#00FA9A',
    origin: 'Flesh'
  },
  {
    id: 'hour.mother_of_ants',
    name: '蚁母',
    type: 'hour',
    aliases: ['蚁母', 'The Mother of Ants'],
    color: '#8B008B',
    origin: 'Flesh'
  },
  {
    id: 'hour.colonel',
    name: '上校',
    type: 'hour',
    aliases: ['上校', '伤疤上尉', '疤痕上尉', '盲眼的统帅', 'The Colonel', 'The Scarred Captain'],
    color: '#5D5C61',
    origin: 'Flesh'
  },
  {
    id: 'hour.lionsmith',
    name: '狮子匠',
    type: 'hour',
    aliases: ['狮子匠', '怪物杀手', '叛逆的铸造者', 'The Lionsmith', 'The Monster-Slayer'],
    color: '#D9534F',
    origin: 'Flesh'
  },
  {
    id: 'hour.elegiast',
    name: '悼歌诗人',
    type: 'hour',
    aliases: ['悼歌诗人', '挽歌儿', '悼亡者', '象牙白鸽', 'The Elegiast', 'The Ivory Dove'],
    color: '#708090',
    origin: 'Flesh'
  },

  // --- 虚源诸神 (Gods-from-Nowhere) ---
  {
    id: 'hour.white',
    name: '白雪',
    type: 'hour',
    aliases: ['白雪', 'The White'],
    color: '#F5F5F5',
    origin: 'Nowhere'
  },
  {
    id: 'hour.vagabond',
    name: '扶摇蜘蛛',
    type: 'hour',
    aliases: ['扶摇蜘蛛', 'The Vagabond'],
    color: '#D2B48C',
    origin: 'Nowhere'
  },
  {
    id: 'hour.crowned_growth',
    name: '戴冠之孳',
    type: 'hour',
    aliases: ['戴冠之孳', 'The Crowned Growth'],
    color: '#006400',
    origin: 'Nowhere'
  },
  {
    id: 'hour.applebright',
    name: '光明果',
    type: 'hour',
    aliases: ['光明果', 'The Applebright'],
    color: '#FF69B4',
    origin: 'Nowhere'
  },
  {
    id: 'hour.wolf_divided',
    name: '裂分之狼',
    type: 'hour',
    aliases: ['裂分之狼', '分列之狼', '憎恨之狼', '噬身之狼', 'The Wolf Divided'],
    color: '#8B0000',
    origin: 'Nowhere'
  },

  // --- 栖木司辰 (Hours of the Roost) ---
  {
    id: 'hour.beachcomber',
    name: '拾滩鸦',
    type: 'hour',
    aliases: ['拾滩鸦', 'The Beachcomber'],
    color: '#483D8B',
    factions: ['Roost']
  },
  {
    id: 'hour.bone_dove',
    name: '骨白鸽',
    type: 'hour',
    aliases: ['骨白鸽', 'The Bone Dove'],
    color: '#F0FFF0',
    factions: ['Roost']
  },
  {
    id: 'hour.vagabond_roost',
    name: '浪游旅人',
    type: 'hour',
    aliases: ['浪游旅人', 'The Vagabond (Roost)'],
    color: '#D2B48C',
    factions: ['Roost']
  },
  {
    id: 'hour.witch_and_sister',
    name: '双生女巫',
    type: 'hour',
    aliases: ['双生女巫', '双生姝丽', 'The Witch-and-Sister', 'The Twins'],
    color: '#FFC0CB',
    factions: ['Roost', 'Wood']
  },
  {
    id: 'hour.ring_yew',
    name: '环杉',
    type: 'hour',
    aliases: ['环杉', 'The Ring-Yew'],
    color: '#228B22',
    factions: ['Knot', 'Wood']
  }
];
