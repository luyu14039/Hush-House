
export const ASPECT_INFO: Record<string, { name: string; color: string; icon?: string }> = {
  // Principles (CS & BoH)
  lantern: { name: '灯', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', icon: 'SunIcon' },
  forge: { name: '铸', color: 'text-orange-500 border-orange-500/30 bg-orange-500/10', icon: 'FireIcon' },
  edge: { name: '刃', color: 'text-lime-500 border-lime-500/30 bg-lime-500/10', icon: 'ScissorsIcon' },
  winter: { name: '冬', color: 'text-cyan-100 border-cyan-100/30 bg-cyan-100/10', icon: 'SnowflakeIcon' },
  heart: { name: '心', color: 'text-rose-400 border-rose-400/30 bg-rose-400/10', icon: 'HeartIcon' },
  grail: { name: '杯', color: 'text-red-600 border-red-600/30 bg-red-600/10', icon: 'BeakerIcon' },
  moth: { name: '蛾', color: 'text-amber-200 border-amber-200/30 bg-amber-200/10', icon: 'MoonIcon' },
  knock: { name: '启', color: 'text-purple-500 border-purple-500/30 bg-purple-500/10', icon: 'KeyIcon' },
  secret_histories: { name: '秘史', color: 'text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10', icon: 'BookOpenIcon' },

  // BoH Specific
  sky: { name: '穹', color: 'text-sky-400 border-sky-400/30 bg-sky-400/10', icon: 'CloudIcon' },
  moon: { name: '月', color: 'text-indigo-300 border-indigo-300/30 bg-indigo-300/10', icon: 'MoonIcon' },
  nectar: { name: '蜜', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: 'SparklesIcon' },
  scale: { name: '鳞', color: 'text-yellow-700 border-yellow-700/30 bg-yellow-700/10', icon: 'ScaleIcon' },
  rose: { name: '玫瑰', color: 'text-pink-400 border-pink-400/30 bg-pink-400/10', icon: 'RoseIcon' },

  // Item Types / Other
  text: { name: '文献', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  tool: { name: '工具', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'WrenchIcon' },
  ingredient: { name: '原料', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BeakerIcon' },
  memory: { name: '回忆', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'SparklesIcon' },
  soul: { name: '灵魂', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  skill: { name: '技能', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'AcademicCapIcon' },
  
  // CS Specific
  auctionable: { name: '可拍卖', color: 'text-stone-500 border-stone-500/20 bg-stone-500/5', icon: 'CurrencyDollarIcon' },
  unique: { name: '独一无二', color: 'text-gold border-gold/30 bg-gold/10', icon: 'StarIcon' },
  
  // CS Stats
  erudition: { name: '博闻', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: 'SparklesIcon' },
  glimmering: { name: '灵感', color: 'text-yellow-300 border-yellow-300/30 bg-yellow-300/10', icon: 'SunIcon' },
  vitality: { name: '活力', color: 'text-red-500 border-red-500/30 bg-red-500/10', icon: 'HeartIcon' },
  dread: { name: '恐惧', color: 'text-purple-900 border-purple-900/30 bg-purple-900/10', icon: 'MoonIcon' },
  fascination: { name: '入迷', color: 'text-rose-300 border-rose-300/30 bg-rose-300/10', icon: 'SunIcon' },
  funds: { name: '资金', color: 'text-yellow-600 border-yellow-600/30 bg-yellow-600/10', icon: 'CurrencyDollarIcon' },
  contentment: { name: '安逸', color: 'text-amber-100 border-amber-100/30 bg-amber-100/10', icon: 'SunIcon' },
  restlessness: { name: '躁动', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'SparklesIcon' },
  
  // CS Items (Common)
  health: { name: '健康', color: 'text-red-500 border-red-500/30 bg-red-500/10', icon: 'HeartIcon' },
  reason: { name: '理性', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  passion: { name: '激情', color: 'text-rose-500 border-rose-500/30 bg-rose-500/10', icon: 'HeartIcon' },
  
  // CS Books (Selected)
  bookofmasks: { name: '面具之书', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  geminiad: { name: '双生巫女', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  stumm: { name: '施图姆', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  sunsetpassages: { name: '日落的仪式', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  travellingatnight: { name: '夜行', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  introductiontohistories: { name: '历史导论', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  onwhatiscontainedbysilver: { name: '银中之物', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  sixlettersonnecessity: { name: '关于必然性的六封信', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  theskythesoul: { name: '天空与灵魂', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  waroftheroadscensored: { name: '道路之战（删减版）', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  worlddoesnotweep: { name: '世界不曾哭泣', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },

  // BoH Extra
  'period.dawn': { name: '时期：黎明', color: 'text-orange-300 border-orange-300/30 bg-orange-300/10', icon: 'SunIcon' },
  'period.solar': { name: '时期：骄阳', color: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10', icon: 'SunIcon' },
  'period.noon': { name: '时期：正午', color: 'text-yellow-600 border-yellow-600/30 bg-yellow-600/10', icon: 'SunIcon' },
  'period.dusk': { name: '时期：黄昏', color: 'text-orange-700 border-orange-700/30 bg-orange-700/10', icon: 'MoonIcon' },
  'period.night': { name: '时期：夜晚', color: 'text-indigo-900 border-indigo-900/30 bg-indigo-900/10', icon: 'MoonIcon' },
  'period.curia': { name: '时期：教廷', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10', icon: 'ScaleIcon' },
  'period.nocturnal': { name: '时期：夜行', color: 'text-indigo-800 border-indigo-800/30 bg-indigo-800/10', icon: 'MoonIcon' },
  'period.baronial': { name: '时期：男爵', color: 'text-red-800 border-red-800/30 bg-red-800/10', icon: 'UserIcon' },
  
  'cost.tally': { name: '计数', color: 'text-stone-500 border-stone-500/20 bg-stone-500/5' },
  'soph': { name: '复杂', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10' },
  'tablet': { name: '石板', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10' },
  'scroll': { name: '卷轴', color: 'text-stone-300 border-stone-300/30 bg-stone-300/10' },
  'codex': { name: '典籍', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10' },
  'thing': { name: '物品', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10' },

  // Item Attributes
  'readable': { name: '可阅读', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  'infinitereadable': { name: '可无限阅读', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'BookOpenIcon' },
  'journal': { name: '日记', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'correspondence': { name: '通信', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'invitation': { name: '邀请函', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'film': { name: '胶卷', color: 'text-stone-500 border-stone-500/30 bg-stone-500/10', icon: 'DocumentTextIcon' },
  'record.phonograph': { name: '唱片', color: 'text-stone-500 border-stone-500/30 bg-stone-500/10', icon: 'SparklesIcon' },
  'blank': { name: '空白', color: 'text-stone-300 border-stone-300/30 bg-stone-300/10' },
  'soaked': { name: '浸湿', color: 'text-blue-300 border-blue-300/30 bg-blue-300/10' },
  'considerable': { name: '重要', color: 'text-gold border-gold/30 bg-gold/10', icon: 'StarIcon' },
  
  // Memories
  'memories.archaeologist': { name: '回忆：考古学家', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.artist': { name: '回忆：艺术家', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.cartographer': { name: '回忆：制图师', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.executioner': { name: '回忆：处刑人', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.magnate': { name: '回忆：大亨', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.prodigal': { name: '回忆：浪子', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.revolutionary': { name: '回忆：革命家', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.symurgist': { name: '回忆：共振师', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },
  'memories.twiceborn': { name: '回忆：重获新生者', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'UserIcon' },

  // Languages
  'textlatin': { name: '拉丁语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textgreek': { name: '希腊语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textsanskrit': { name: '梵语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textaramaic': { name: '阿拉米语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textphrygian': { name: '弗里吉亚语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textvak': { name: '瓦克语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textmandaic': { name: '曼达安语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },
  'textfucine': { name: '富奇诺语', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'DocumentTextIcon' },

  // Wisdoms (w.*)
  'w.latin': { name: '智慧：拉丁语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.greek': { name: '智慧：希腊语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.sanskrit': { name: '智慧：梵语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.aramaic': { name: '智慧：阿拉米语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.phrygian': { name: '智慧：弗里吉亚语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.vak': { name: '智慧：瓦克语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.mandaic': { name: '智慧：曼达安语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.fucine': { name: '智慧：富奇诺语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.henavek': { name: '智慧：赫纳维克语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.hyksos': { name: '智慧：希克索斯语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.killasimi': { name: '智慧：基拉西米语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.ramsund': { name: '智慧：拉姆松德语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.sabazine': { name: '智慧：萨巴兹语', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  'w.ericapaean': { name: '智慧：埃里卡赞歌', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },

  // Lessons (r.*)
  'r.watchmansparadoxes': { name: '教诲：守夜人的悖论', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.glaziery.lightsmithing': { name: '教诲：玻璃吹制与光之锻造', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.lockworks.clockworks': { name: '教诲：锁具与钟表', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.weaving.knotworking': { name: '教诲：编织与结艺', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sights.sensations': { name: '教诲：景象与感受', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.spices.savours': { name: '教诲：香料与滋味', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.surgeries.exsanguinations': { name: '教诲：手术与放血', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.stitching.binding': { name: '教诲：缝合与装订', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.solutions.separations': { name: '教诲：溶解与分离', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.resurgences.emergences': { name: '教诲：复苏与涌现', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.quenchings.quellings': { name: '教诲：淬火与镇压', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.purifications.exaltations': { name: '教诲：净化与升华', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.putrefactions.calcinations': { name: '教诲：腐败与煅烧', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.pentiments.precursors': { name: '教诲：悔罪与先驱', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.orchids.narcotics': { name: '教诲：兰花与麻醉剂', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.meniscatereflections': { name: '教诲：月轮的倒影', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.maggephenemysteries': { name: '教诲：麦格芬之谜', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.leaves.thorns': { name: '教诲：叶与刺', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.insects.nectars': { name: '教诲：昆虫与花蜜', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.inks.power': { name: '教诲：墨水（权能）', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.inks.containment': { name: '教诲：墨水（收容）', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.inks.revelation': { name: '教诲：墨水（启示）', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.horns.ivories': { name: '教诲：角与象牙', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.herbs.infusions': { name: '教诲：草药与浸剂', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.furs.feathers': { name: '教诲：毛皮与羽毛', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.drums.dances': { name: '教诲：鼓与舞', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.door.wall': { name: '教诲：门与墙', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.disciplines.thescar': { name: '教诲：戒律（伤疤）', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.disciplines.thehammer': { name: '教诲：戒律（锤）', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.desires.dissolutions': { name: '教诲：欲望与消解', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.coil.chasm': { name: '教诲：盘绕与深渊', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.bells.brazieries': { name: '教诲：钟与火盆', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.auroralcontemplations': { name: '教诲：极光冥想', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.applebrighteuphonies': { name: '教诲：苹果光悦音', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.anbary.lapidary': { name: '教诲：琥珀与宝石', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sandstories': { name: '教诲：沙之故事', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.seastories': { name: '教诲：海之故事', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.skystories': { name: '教诲：天之故事', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.snowstories': { name: '教诲：雪之故事', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.stonestories': { name: '教诲：石之故事', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.wolfstories': { name: '教诲：狼之故事', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.serpents.venoms': { name: '教诲：蛇与毒', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sickle.eclipse': { name: '教诲：镰刀与日蚀', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sharps': { name: '教诲：利器', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sacrasolisinvicti': { name: '教诲：无敌骄阳圣礼', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sacralimiae': { name: '教诲：阈限圣礼', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.sabazine': { name: '教诲：萨巴兹', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.rites.theroots': { name: '教诲：根之仪式', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.rhyme.remembrance': { name: '教诲：韵律与记忆', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.raggedcrossroads': { name: '教诲：衣衫褴褛的十字路口', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.pyroglyphics': { name: '教诲：火之象形', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.preliminalmeter': { name: '教诲：阈前格律', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.pearl.tide': { name: '教诲：珍珠与潮汐', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.path.pilgrim': { name: '教诲：道路与朝圣者', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.ouranoscopy': { name: '教诲：观天术', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.tridesmahiera': { name: '教诲：特里德斯马希拉', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.transformations.liberations': { name: '教诲：转化与解放', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.thegreatsignsandthegreatscars': { name: '教诲：大征兆与大伤疤', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },
  'r.strings.songs': { name: '教诲：弦与歌', color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', icon: 'SparklesIcon' },

  // BoH Wisdoms & Lessons (Specific)
  'w.cracktrack': { name: '智慧：裂纹', color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', icon: 'AcademicCapIcon' },
  
  // Skills (s.* or direct)
  'edictsinviolable': { name: '技能：不可侵犯之敕令', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'AcademicCapIcon' },
  'glassblowing': { name: '技能：玻璃吹制与器皿工艺', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'AcademicCapIcon' },
  's.edictsinviolable': { name: '技能：不可侵犯之敕令', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'AcademicCapIcon' },
  's.glassblowing': { name: '技能：玻璃吹制与器皿工艺', color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', icon: 'AcademicCapIcon' },
};

export const getAspectInfo = (id: string) => {
  const lowerId = id.toLowerCase();
  
  // 1. Direct match
  if (ASPECT_INFO[lowerId]) {
    return ASPECT_INFO[lowerId];
  }

  // 2. CS Specific Prefixes
  if (lowerId.startsWith('fragment')) {
    // Extract aspect name (e.g., fragmentmoth -> moth, fragmentmothb -> moth)
    // Remove 'fragment' prefix
    let aspectName = lowerId.replace('fragment', '');
    
    // Check if it's a direct match first (e.g. fragmentmoth)
    if (ASPECT_INFO[aspectName]) {
       return {
        name: `${ASPECT_INFO[aspectName].name}之密传`,
        color: ASPECT_INFO[aspectName].color,
        icon: 'BookOpenIcon'
      };
    }

    // Remove trailing single letter if it exists (b, c, d...) and check again
    if (aspectName.length > 1) {
       const potentialAspect = aspectName.slice(0, -1);
       if (ASPECT_INFO[potentialAspect]) {
         return {
            name: `${ASPECT_INFO[potentialAspect].name}之密传`,
            color: ASPECT_INFO[potentialAspect].color,
            icon: 'BookOpenIcon'
          };
       }
    }
    
    // Fallback for unknown fragments
    return {
        name: '密传',
        color: 'text-purple-300 border-purple-300/30 bg-purple-300/10',
        icon: 'BookOpenIcon'
    };
  }

  if (lowerId.startsWith('scholar')) {
      const lang = lowerId.replace('scholar', '');
      // Try to find language name in ASPECT_INFO (e.g. textlatin -> 拉丁语)
      const textKey = 'text' + lang;
      if (ASPECT_INFO[textKey]) {
          return {
              name: `学者：${ASPECT_INFO[textKey].name}`,
              color: ASPECT_INFO[textKey].color,
              icon: 'AcademicCapIcon'
          };
      }
      return {
          name: `学者：${lang}`,
          color: 'text-stone-400 border-stone-400/30 bg-stone-400/10',
          icon: 'AcademicCapIcon'
      };
  }

  if (lowerId.startsWith('rite')) {
      return {
          name: '仪式',
          color: 'text-red-400 border-red-400/30 bg-red-400/10',
          icon: 'SparklesIcon'
      };
  }

  // 3. Prefix stripping (e.g., mystery.lantern -> lantern)
  if (lowerId.includes('.')) {
    const parts = lowerId.split('.');
    const suffix = parts[parts.length - 1];
    
    // Handle specific prefixes if needed, or just try suffix
    if (ASPECT_INFO[suffix]) {
      return ASPECT_INFO[suffix];
    }
    
    // Special handling for 'mystery' prefix which maps directly to principles
    if (parts[0] === 'mystery' && ASPECT_INFO[parts[1]]) {
      return ASPECT_INFO[parts[1]];
    }

    // Generic prefix handling for BoH
    if (parts[0] === 'w') {
       return { 
         name: `智慧：${parts[1]}`, 
         color: 'text-purple-300 border-purple-300/30 bg-purple-300/10', 
         icon: 'AcademicCapIcon' 
       };
    }
    if (parts[0] === 'r') {
       return { 
         name: `教诲：${parts[1]}`, 
         color: 'text-amber-300 border-amber-300/30 bg-amber-300/10', 
         icon: 'SparklesIcon' 
       };
    }
    if (parts[0] === 's') {
       return { 
         name: `技能：${parts[1]}`, 
         color: 'text-stone-400 border-stone-400/30 bg-stone-400/10', 
         icon: 'AcademicCapIcon' 
       };
    }
  }

  // 4. Fallback
  return { 
    name: id, 
    color: 'text-parchment/60 border-parchment/20 bg-parchment/5' 
  };
};
