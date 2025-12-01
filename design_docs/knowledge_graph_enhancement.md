# 织机 (The Loom) 语义增强方案：基于关键词的知识图谱构建

## 1. 目标 (Objective)
目前的“织机”视图主要基于**性相 (Aspects)**（如灯、铸、刃等）建立物品间的联系。为了更深入地展示《密教模拟器》(CS) 和《司辰之书》(BoH) 庞大而隐晦的世界观，我们需要引入**语义关联**。

本方案旨在通过文本分析，提取物品描述和阅读内容中的关键实体（司辰、地点、人物、事件），将它们作为新的节点或连接方式加入图谱，从而展现“万物皆有联系”的深层叙事结构。

## 2. 核心概念 (Core Concepts)

我们将引入一种新的节点类型：**概念节点 (Concept Node)**。
原有的物品节点（Item Node）将通过“提及 (Mentions)”关系连接到概念节点。

### 2.1 实体类别 (Entity Categories)
我们需要识别以下几类实体：

1.  **司辰 (The Hours)**: 掌管世界的众神。
    *   *示例*: 赤杯 (The Red Grail), 上校 (The Colonel), 蚁母 (The Mother of Ants).
    *   *别称处理*: 必须处理尊称和隐喻（如“骄阳” vs “衣衫褴褛的骄阳”）。
2.  **具名者与长生者 (Names & Long)**: 司辰的仆从或强大的存在。
    *   *示例*: 特蕾莎 (Teresa), 克里斯托弗·伊洛波利 (Christopher Illopoly), 这里的“图书管理员”前辈们。
3.  **地理与漫宿 (Locations & The Mansus)**: 现实地点与梦境领域。
    *   *示例*: 漫宿 (The Mansus), 林地 (The Wood), 纯白之门 (The White Door), 维也纳 (Vienna).
4.  **历史与事件 (Histories & Events)**: 关键的历史节点。
    *   *示例*: 诸史之战 (War of the Roads), 也就是“道路之战”, 第一次拂晓 (First Dawn).
5.  **组织与团体 (Societies & Groups)**:
    *   *示例*: 抑制局 (Suppression Bureau), 圣海德拉会 (St Hydra).

## 3. 关键词映射字典 (The Thesaurus Strategy)

为了准确匹配，我们将建立一个 `KeywordDictionary`。核心在于处理**多对一**的映射关系（Aliases -> Canonical ID）。

### 数据结构设计
```typescript
interface EntityDefinition {
  id: string;          // 唯一标识符，如 'hour.redgrail'
  name: string;        // 显示名称，如 '赤杯'
  type: EntityType;    // 类型：'hour' | 'location' | 'person' | 'event'
  aliases: string[];   // 别名列表，用于文本匹配
  color?: string;      // 节点颜色
  description?: string;// 简短描述（可选）
}
```

### 拟定收录范围 (Sample)

#### 司辰 (Hours)
| ID | 标准名 | 别名/关键词 (Aliases) |
| :--- | :--- | :--- |
| `hour.sun_in_rags` | 衣衫褴褛的骄阳 | 衣衫褴褛的骄阳, 寒日, 破碎的太阳, The Sun-in-Rags |
| `hour.colonel` | 上校 | 上校, 疤痕上尉, 盲眼的统帅, The Colonel |
| `hour.lionsmith` | 狮子匠 | 狮子匠, 叛逆的铸造者, The Lionsmith |
| `hour.red_grail` | 赤杯 | 赤杯, 渴慕之母, The Red Grail |
| `hour.moth` | 飞蛾 | 飞蛾, 林地之神(需区分), The Moth |
| `hour.watchman` | 守夜人 | 守夜人, 门扉之钥, The Watchman |
| `hour.wolf_divided` | 分列之狼 | 分列之狼, 憎恨之狼, The Wolf Divided |
| `hour.elegiast` | 挽歌儿 | 挽歌儿, 悼亡者, The Elegiast |

#### 地点 (Locations)
| ID | 标准名 | 别名/关键词 |
| :--- | :--- | :--- |
| `loc.mansus` | 漫宿 | 漫宿, 梦之屋, The Mansus |
| `loc.wood` | 林地 | 林地, 漫宿外围, The Wood |
| `loc.white_door` | 纯白之门 | 纯白之门, 白门 |
| `loc.stag_door` | 牡鹿之门 | 牡鹿之门 |
| `loc.spider_door` | 蜘蛛之门 | 蜘蛛之门 |
| `loc.peacock_door` | 孔雀之门 | 孔雀之门 |

#### 人物 (People)
| ID | 标准名 | 别名/关键词 |
| :--- | :--- | :--- |
| `person.illopoly` | 克里斯托弗·伊洛波利 | 伊洛波利, 《日落的仪式》作者 |
| `person.teresa` | 特蕾莎 | 特蕾莎, 鲍尔弗, 漫宿的向导 |
| `person.ibn_adim` | 伊本·阿迪姆 | 伊本·阿迪姆, 历史学家 |

## 4. 实现步骤 (Implementation Plan)

### 第一阶段：数据准备 (Data Preparation)
1.  **构建字典文件** (`src/data/lore_entities.ts`):
    *   手动录入上述实体及其别名。
    *   优先覆盖高频出现的司辰和地点。
2.  **文本提取器** (`src/utils/textAnalysis.ts`):
    *   编写函数，输入一段文本，输出匹配到的 `EntityID` 列表。
    *   使用简单的字符串包含匹配（String Inclusion）或正则匹配。
    *   *注意*: 长词优先匹配（例如匹配“衣衫褴褛的骄阳”后，不再单独匹配“骄阳”）。

### 第二阶段：图谱生成 (Graph Generation)
1.  **扩展节点类型**:
    *   在 `Loom` 组件中，除了 `ItemNode`，增加 `EntityNode`。
2.  **生成连接**:
    *   遍历所有物品的 `description`, `reading.intro`, `reading.content`。
    *   如果物品 A 包含关键词 K (对应实体 E)，则创建连线 `A -> E`。
3.  **力导向图优化**:
    *   实体节点应该比普通物品节点稍大，或者颜色不同，作为“枢纽”存在。
    *   司辰节点可以使用特殊的颜色（如金色或红色）。

### 第三阶段：交互优化 (Interaction)
1.  **筛选器**:
    *   允许用户开启/关闭“显示语义关联”。
    *   允许只看“司辰”或只看“地点”。
2.  **高亮**:
    *   点击“赤杯”节点，高亮所有提及赤杯的书籍和物品。

## 5. 待确认问题 (Questions)
*   **性能**: 全文扫描可能会在前端造成轻微卡顿，建议在 `dataService` 加载时预处理，将提取出的实体 ID 缓存到 Item 对象中。
*   **准确性**: 某些词汇可能产生歧义（例如“灯”既是性相也是可能的实体指代，需谨慎处理）。建议仅匹配专有名词。

## 6. 进度控制 (Progress Tracking)
- [ ] **Step 1**: 创建 `lore_entities.ts` 并录入基础数据（司辰、地点）。
- [ ] **Step 2**: 在 `dataService.ts` 中实现预处理逻辑，为每个 Item 增加 `mentions: string[]` 字段。
- [ ] **Step 3**: 修改 `Loom.tsx`，将 `mentions` 转换为图中的节点和连线。
- [ ] **Step 4**: 调整样式，区分实体节点与物品节点。
