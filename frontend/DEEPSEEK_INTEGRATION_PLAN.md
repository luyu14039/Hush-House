# 利用 DeepSeek 构建司辰传说网络 (Lore Network) 方案

## 1. 项目目标
利用 DeepSeek 大语言模型的强语义理解能力，深入分析《密教模拟器》与《司辰之书》的文本数据（书籍、物品、回忆、事件），自动构建实体之间的高质量关联网络。
目标是超越简单的关键词匹配，识别出隐喻、因果、从属、敌对等深层逻辑关系（例如：识别出《伤疤上尉事迹录》是关于“上校”的记录，而不仅仅是名字匹配）。

## 2. 核心架构

我们将构建一个 **"提取-分析-图谱化" (Extract-Analyze-Graph)** 的流水线。

```mermaid
graph TD
    A[原始数据源 (JSON)] -->|提取文本| B(待分析语料库)
    C[实体定义 (lore_entities.ts)] -->|作为上下文| D{DeepSeek LLM}
    B --> D
    D -->|关系抽取| E[建议连线集合 (JSON)]
    E -->|人工/规则校验| F[最终图谱数据 (Graph Data)]
    F --> G[前端可视化 (D3.js/React)]
```

## 3. 详细实施步骤

### 第一阶段：数据准备 (Data Preparation)
我们需要准备两份核心数据喂给 DeepSeek：

1.  **实体字典 (The Dictionary)**:
    *   来源：`src/data/lore_entities.ts`
    *   格式：精简的 JSON 列表，包含 `id`, `name`, `aliases`。
    *   *作用*：告诉 LLM 我们关注哪些“节点”。

2.  **待分析语料 (The Corpus)**:
    *   来源：`src/services/dataService.ts` (运行时数据) 或原始 `boh_data.json` / `cs_data.json`。
    *   内容：书籍的 `description`、`label`，物品的 `description`，回忆的 `description`。
    *   *作用*：LLM 将从中挖掘关系。

### 第二阶段：Prompt 工程 (Prompt Engineering)
这是最关键的一步。我们需要设计一个高效的 Prompt，让 DeepSeek 返回结构化的 JSON 数据。

**Prompt 构思示例：**
> "你是一个神秘学传说研究专家。我将提供给你一份[已知实体列表]和一段[游戏文本]。
> 请分析文本，判断其中是否提到了实体列表中的任何存在（包括通过别称、隐喻或暗示）。
> 如果存在关联，请输出 JSON 格式的关系：
> - source: 文本的ID
> - target: 实体的ID
> - type: 关系类型 (mentions/about/authored_by/opposes/serves)
> - confidence: 置信度 (0.0-1.0)
> - reason: 简短理由"

### 第三阶段：批量处理 (Batch Processing)
由于数据量较大，不能一次性处理。
*   **策略**：编写一个 Python 或 Node.js 脚本。
*   **分块**：每次发送 10-20 个物品描述给 DeepSeek。
*   **缓存**：保存 API 响应，避免重复消耗 Token。

### 第四阶段：结果整合与校验 (Integration & Verification)
*   **输出产物**：生成一个 `generated_connections.json` 文件。
*   **数据结构**：
    ```json
    [
      {
        "source": "book.deed_of_captain",
        "target": "hour.colonel",
        "relation": "about",
        "reason": "书名和描述中提到了'伤疤上尉'，这是上校的别称。"
      }
    ]
    ```
*   **人工介入**：在前端实现一个简单的“审核列表”，或者直接在 JSON 中手动剔除错误的连线。

## 4. 进度控制 (Progress Checklist)

- [ ] **任务 1：数据导出脚本**
    - [ ] 编写脚本从 `dataService` 导出所有需要分析的文本（ID + Description）。
    - [ ] 导出 `lore_entities` 为精简 JSON 格式。

- [ ] **任务 2：DeepSeek 接入测试**
    - [ ] 申请/配置 DeepSeek API Key。
    - [ ] 编写测试脚本，用 5 个典型条目（如《伤疤上尉事迹录》）测试 Prompt 效果。
    - [ ] 优化 Prompt 直到能准确识别“隐喻”关系。

- [ ] **任务 3：全量运行与生成**
    - [ ] 运行脚本处理所有数据。
    - [ ] 生成 `src/data/ai_generated_edges.json`。

- [ ] **任务 4：前端集成**
    - [ ] 修改 `src/utils/lore.ts`，使其在加载时合并 `ai_generated_edges.json` 的数据。
    - [ ] 在图谱中用不同颜色或虚线标记“AI生成的推测连线”。

## 5. 待讨论问题
*   **关系类型定义**：我们需要定义哪些关系？(例如：`related_to` 这种万金油，还是更细致的 `enemy_of`, `aspect_of`?)
*   **成本控制**：全量跑一次可能需要消耗一定的 Token，是否优先跑“书籍”类目？

---
*文档生成时间：2025-11-30*
