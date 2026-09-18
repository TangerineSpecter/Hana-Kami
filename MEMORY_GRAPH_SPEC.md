# 记忆图可视化——规格（阶段 1）

Hana-Kami 工作台路线图中的**功能 #8** · 作者：Jim · 分支 `feature/memory-graph`
**状态：**等待 GOD 签字确认。目前尚未编写组件代码——本文档是阶段 2 的契约。

---

## 1. 目标

让 Michael（GOD）一眼回答：*谁在和谁沟通，蜂巢整体知道什么？*

图表是指挥中心（`CommandCenterPanel.tsx`）中的新 **`graph` 标签页**，将蜂巢绘制成网络：Agent 是节点，Agent 之间的消息是边，每个 Agent 记忆文件涵盖的主题（可选）作为第二层。它是一个读取和导航界面：点击节点可跳转到该 Agent 的记忆；悬停可在不离开图表的情况下预览。

它**不是**实时动画游戏世界（那是办公区）。它是一个平静的、触碰前保持静态的数据视图，像活动标签页一样通过轮询刷新。

---

## 2. 数据来源

所有内容都来自现有 preload bridge——**不新增 IPC handler，也不新增主进程代码。**这样功能可以留在一个 Renderer 文件中，并避免与其他 Agent 编辑 `src/main/index.ts` / `src/preload/index.ts` 时冲突。

| 来源 | 签名（已存在于 `src/preload/index.ts`） | 用途 |
|---|---|---|
| Agent 列表 | `useStore((s) => s.agents)` → `Agent[]` | Agent 节点（id、name、accent、character、status、isGod） |
| 注册表 | `window.cth.hiveRegistry()` → `HiveRegistry` | 如果 store 信息不足，则提供备用 Agent 列表、`godId` 和 lastSeen |
| 消息日志 | `window.cth.hiveLog(200)` → `LogEntry[]` | 消息边（`kind:'message'`、`from`、`to`、`act`、`subject`） |
| 每 Agent 记忆 | `window.cth.hiveMemory(id)` → `string`（原始 Markdown） | 主题节点 + Agent↔主题边 |

### 2.1 依赖的数据形状

```ts
// Agent (store) — the primary node payload
{ id: string; name: string; accent: AccentColorName; character: OfficeCharacterName;
  status: StatusKind; isGod?: boolean }

// LogEntry (hiveLog) — loosely typed; we read the 'message' kind only
{ ts?: number; kind?: string; from?: string; to?: string; act?: MessageAct; subject?: string }

// hiveMemory(id) → the literal contents of agents/<id>/memory.md (markdown text)
```

`hiveLog` 已经驱动活动标签页的 `from → to: subject` feed，因此消息边数据已证明确实以此精确形状存在。

### 2.2 将 `from` / `to` 解析为节点

日志条目使用 Agent **id**（以及字面字符串 `"broadcast"` 和 `"human"`）。映射规则：

- Agent 列表中存在 id → 使用该 Agent 节点。
- `"broadcast"` → 将边从发送者展开到**所有**其他 Agent（细、虚线）；如果过于拥挤，则合并为一条指向合成 `broadcast` 伪节点的边。**决策：合并为 `broadcast` 伪节点**（方形、ink-300，标签为“broadcast”），保持边数线性增长。
- `"human"` / `"god→human"` 升级 → 使用一个合成 `human` 节点（独特形状：双边框方形、lemon 强调色）。
- 未知 id → 跳过该边（防御性处理；只向控制台记录一次）。

---

## 3. 节点模型

```ts
type GraphNode =
  | { kind: 'agent';  id: string; label: string; accent: AccentColorName;
      status: StatusKind; isGod: boolean; degree: number }
  | { kind: 'topic';  id: string; label: string; weight: number /* # agents mentioning */ }
  | { kind: 'pseudo'; id: 'broadcast' | 'human'; label: string };
```

- **Agent 节点（主要节点，始终显示）。**方形图块，填充 Agent 的 `--cth-<accent>` 颜色，带硬朗的 2px ink-900 偏移阴影（DESIGN.md 新粗野主义风格）。GOD 更大（1.4×）并带双边框。节点大小根据**度数**（消息数量）轻微变化，让最繁忙的 Agent 呈现为枢纽。
- **主题节点（次要节点，可切换，默认关闭）。**小型 cream-200 方形，带 ink-700 细线边框和 VT323 标签。只有打开“主题”开关时才显示，避免默认视图过于拥挤。
- **伪节点**（`broadcast`、`human`）：使用 ink-300 / lemon，视觉上弱化，不能导航。

---

## 4. 边模型

```ts
type GraphEdge =
  | { kind: 'message'; source: string; target: string; weight: number; lastAct: MessageAct }
  | { kind: 'topic';   source: string /* agentId */; target: string /* topicId */ };
```

### 4.1 消息边
- 每个**有序（from、to）对**一条边，`weight` 等于交换的消息数量（从 200 条日志聚合）。线越粗表示流量越大（限制在 1–4px）。
- 使用指向 `target` 的小箭头显示方向（SVG `marker`）。互为方向的对（A→B 和 B→A）绘制为一条两端都有箭头的线。
- 根据该对中**最近一次**的 `act` 着色，使用 `MessageEnvelope.tsx` 已有的消息信封调色板（request/inform/propose/query/agree/refuse/done），让图表与办公区飞行信封使用相同视觉语言。

### 4.2 主题边（二部图，Agent ↔ 主题）
- 当某个 Agent 的 `memory.md` 提到主题时，就在该 Agent 与主题节点之间连接一条边。
- 我们有意**不**绘制主题↔主题边。共享结构（两个 Agent 连接到同一主题）已经通过布局揭示共现；增加主题之间的边会变成一团线。（这满足“主题共现”要求，只是用二部图而不是共现团表示——信息相同，边少得多。）

---

## 5. 主题提取

记忆文件是结构化 Markdown（已对照实际的 `agents/*/memory.md` 验证）：带日期的 `## <date> — <title>` 小节标题、`**bold**` 关键词和列表。我们在客户端低成本提取主题，**不引入任何 NLP 依赖**：

1. 从每个 Agent 的记忆文本中收集候选短语：
   - `## ` / `### ` 标题尾部（去掉开头的 `YYYY-MM-DD —`）。
   - `**bold**` spans.
2. 规范化：转小写、去除空白、丢弃纯日期/数字、丢弃停用短语、限制长度（≤ 40 个字符）。
3. 统计每个候选词被多少个**不同 Agent**提到。保留至少被 **2 个 Agent**提到的候选词（共享知识才是有趣信号；单个 Agent 的笔记不算“蜂巢主题”）。这样自然限制主题节点数量。
4. 按 Agent 数量保留**前 N = 24** 个主题，让图表保持可读；在 UI 中显示限制（“显示 M 个主题中的 24 个”），绝不静默截断。

这是启发式方案，不是语义方案。**注意：**MemPalace（`window.cth.searchMemory`）才是*语义*记忆；v1 有意不使用它生成主题节点，因为它返回查询的排序片段，而不是可枚举的主题集合。v2 可以从 MemPalace 推导主题聚类，见第 11 节。

---

## 6. 布局——**力导向**（已选择）

弹簧/电荷模拟：边会把相连节点拉近，所有节点彼此排斥，轻微的居中力保证整体位于屏幕内，GOD 额外受到指向中心的轻微引力，使其看起来像编排枢纽。

**为什么选择力导向而不是其他方案：**

| 布局 | 结论 |
|---|---|
| **力导向** ✅ | 关系是任意网状结构（任意 Agent 都可以给任意其他 Agent 发消息；主题可以连接多个 Agent）。只有力导向能让*集群*清晰可读——紧密协作的 Agent 会聚在一起，孤立 Agent 会漂开。一个模型同时处理 Agent-Agent 网格和 Agent-主题二部层。动态数据（每次轮询出现的新 Agent/消息）也能平滑稳定。 |
| 时间线 | 拒绝。我们有时间戳，但此标签页回答的是*结构性*问题（谁↔谁、谁知道什么），而不是*时间性*问题。活动标签页已经提供时间顺序视图，时间线也无法表达主题二部层。 |
| 径向 | 很诱人（GOD 天然适合居中），但它硬编码单一枢纽，并会压平不经过 GOD 的 Agent-Agent 边。力导向通过 GOD 引力和高连接度*自然地*呈现“GOD 在中间”，同时保留点对点结构。 |

**实现：**一个手写的小型模拟（约 50 行：库仑排斥 + 胡克弹簧 + 中心引力 + 速度阻尼），数据变化时运行固定次数，然后冻结。**不新增依赖**——`d3-force` 不在 `node_modules` 中（只有 git 专用的 `commit-graph`），而且项目有意保持依赖列表精简。少于 100 个节点时，固定迭代积分器已经足够，无需增加需要 GOD 批准的依赖。节点也可以**拖拽**（拖拽会固定节点，模拟会在它周围调整其余节点）。布局种子是确定性的（根据节点索引而不是 `Math.random`），因此刷新时图表不会跳动。

---

## 7. 渲染——**SVG（React）**（已选择）⚠️ 需要签字确认的关键决策

在面板内使用 inline SVG 绘制图表：使用带 `<marker>` 箭头的 `<line>` / `<polyline>` 边，使用 `<rect>` 节点（方形符合风格），使用 VT323/Pixelify 的 `<text>` 标签。悬停提示由一层薄的 HTML 覆盖层处理。

**为什么这个界面选择 SVG 而不是 Pixi.js：**

| | SVG（已选择） | Pixi.js |
|---|---|---|
| 规模适配 | 非常适合少于 100 个节点 / 200 条边（实际规模） | 面向数千个精灵——在这里属于过度设计 |
| 交互 | 每个节点使用**原生 DOM** `onClick`/`onMouseEnter` → 无需命中测试代码 | 需要为每个对象手动接入 `eventMode`/hit-area |
| 文本标签 | 清晰、免费、可重新排版的 `<text>` | `Text`/`BitmapText` 对象，需要手动布局，摄像机缩放时会模糊 |
| 主题化 | 直接使用 `--cth-cream/ink` CSS 变量 | 必须将令牌转换为 `0x` 数值（`hexToNumber`），无法实时使用 CSS 主题 |
| 生命周期 | 无——React 管理 DOM | 需要处理 `Application` 创建、`Ticker`、`safeDestroy` 清理（见 `OfficeFloor.tsx` 中 700 多行的生命周期处理） |
| Tooltip | 普通 HTML 覆盖层 | 无论如何都需要 HTML 覆盖层 |
| 美学 | 方形节点 + 硬偏移阴影 + 像素字体 → 完全符合品牌 | 也能实现相同外观，但代码更多 |

办公区使用 Pixi，是因为它是一个持续动画的 tilemap 游戏世界，有移动摄像机和几十个行走精灵——在那里 Pixi 是正确工具。记忆图是一个小型、基本静态、交互和文本密集的数据视图——这里 SVG 才是正确工具。SVG **不会**牺牲像素美学：方形 `<rect>` 节点、阶梯式（非贝塞尔）边、硬朗的 `filter` / 重复 rect 偏移阴影，以及 VT323/Pixelify 字体，都能让它在视觉精神上与应用其他部分保持一致。

> **这是我最希望 GOD 确认的一项决策。**如果全蜂巢的一致性（“所有视觉内容都使用 Pixi”）比工程简洁性更重要，我会切换到 Pixi——本文档中的数据模型、布局和交互与渲染器无关，无论选择哪种方案都不变。我的建议是 SVG。

---

## 8. 交互

| 手势 | 行为 |
|---|---|
| **点击 Agent 节点** | 跳转到该 Agent 的记忆：提升 `tab` 和 `selectedMemoryAgent` 状态，让 `CommandCenterPanel` 切换到 `memory` 标签页，并在 `MemoryTab` 中预选该 Agent。（小型重构：`MemoryTab` 增加可选的受控 `who` / `onWho`；默认行为不变。） |
| **悬停节点** | 光标附近显示 HTML 提示：Agent → 名称、状态徽章、度数，以及其记忆的**前约 200 个字符**（通过 `hiveMemory` 按 id 延迟获取并缓存）；主题 → 标签以及提到它的 Agent。 |
| **悬停边** | 提示：`from → to`、消息数量、最近一次 act + 最近主题。 |
| **拖拽节点** | 重新定位并固定节点；模拟会在其周围调整其他节点。 |
| **切换：主题** | 显示/隐藏主题层（默认关闭）。 |
| **切换：按 act 筛选** | 可选标签，只显示例如 `query` / `refuse` 边（帮助发现阻塞项）。v1 属于锦上添花，与同一行开关绑定。 |
| **刷新** | 每 5 秒自动轮询（与活动标签页节奏一致）+ 手动刷新按钮。重新执行提取并运行几次模拟；已固定/拖拽的节点保持位置。 |
| **空状态** | 日志没有 `message` 条目时显示“还没有消息——蜂巢很安静”。 |

Tooltip 和跳转到记忆的 Hook 是任务派发中特别指出的两个要求；上文都已覆盖。

---

## 9. 视觉设计（DESIGN.md token）

- 容器：`PixelPanel`（`variant="inset"`），与其他标签页使用相同的 `Section` / `Scroll` 原语。
- 画布背景：`--cth-paper-100`；使用 `--cth-ink-100` 绘制淡淡的 32px 点状网格（呼应图块网格）。
- Agent 节点填充：`--cth-<accent>`；边框 `--cth-ink-900` 2px；偏移阴影 `2px 2px 0 --cth-ink-900`。GOD：1.4× 大小 + 双边框。
- 状态：使用 `status-<kind>` 颜色绘制 1px 环（idle/thinking/working/blocked/success），一眼即可看出活跃状态。
- 主题节点：`--cth-cream-200` 填充，`--cth-ink-700` 细线，VT323 标签使用 `--cth-ink-700`。
- 边：按 act 使用消息调色板（镜像 `MessageEnvelope.tsx`）；主题边为 ink-300 虚线。
- 标签：Agent 名称使用 12–13px Pixelify Sans；主题/路径使用 VT323。绝不加粗（DESIGN.md 规则——用颜色强调）。
- 图例：角落显示紧凑图例（节点类型、act 颜色），可折叠。

---

## 10. 组件架构（阶段 2 计划）

新文件（仅阶段 2——现在不创建）：

```
src/renderer/src/components/MemoryGraphPanel.tsx     // the tab body: data load, toggles, tooltip, SVG
src/renderer/src/components/memoryGraph/
    buildGraph.ts     // (Agent[], LogEntry[], Record<id,memoryText>) → { nodes, edges }
    extractTopics.ts  // memory markdown → topic candidates (§5)
    forceLayout.ts    // tiny deterministic force simulation → positions (§6)
```

接入 `CommandCenterPanel.tsx`（遵循共享文件纪律——只做追加）：
1. 将 `'graph'` 加入 `CCTab` 联合类型。
2. 增加一条 `TABS`：`{ key: 'graph', label: 'graph', icon: 'mcp' }`（复用现有 `IconName`——`mcp` 看起来像网络/节点图标，无需新增图标）。
3. 与其他 `tab === …` 行并列增加 `{tab === 'graph' && <MemoryGraphPanel godId={agent.id} onJumpToMemory={...} />}` 这一**自包含代码块**。不要重排现有标签页，也不要进行无关格式化。

数据加载逻辑仿照 `ActivityTab`（每 5 秒轮询 `hiveLog`）和 `MemoryTab`（每个 Agent 调用 `hiveMemory(id)`），复用已验证的模式。

---

## 11. 边界情况、性能与非目标

- **规模：**设置上限——前 24 个主题、200 条日志窗口——使节点少于约 100 个、边少于约 200 条；SVG 处理它们不会产生可感知成本。任何会丢弃数据的上限都要在 UI 中显示，不能静默处理。
- **自环**（Agent 给自己发消息，或 GOD→GOD）会被丢弃。
- **记忆读取成本：**主题提取需要每个 Agent 的记忆文本。按需获取并按 id 缓存；只有启用主题层时才重新获取，这样默认（仅 Agent）视图除悬停所需内容外不会读取记忆（N=0）。
- **稳定性：**确定性种子 + 固定拖拽节点 → 图表不会每次轮询都重新排列。
- **Worktree 注意事项：**它运行在 Electron Renderer 中，无法从 Worktree 进行完整 GUI 运行。阶段 2 的标准是干净通过 `npm run typecheck` + `npm run build`（按调度要求）。
- **非目标（v1）：**时间拖动/回放；从图表编辑记忆；语义（MemPalace 派生）主题聚类；跨应用重启持久化布局。其余都作为 v2 候选后续工作。

---

## 12. 需要 GOD 决策的问题

1. **Renderer：SVG 还是 Pixi**（第 7 节）——我建议 SVG；请确认，或要求为了全蜂巢视觉一致性改用 Pixi。
2. **主题层默认状态**——我建议默认**关闭**（Agent+消息是更清爽的第一印象）。可以吗？
3. **`broadcast` / `human` 伪节点**（第 2.2 节）——可以接受，还是更喜欢展开连接/完全隐藏？
4. **`MemoryTab` 受控属性重构**（第 8 节）是点击导航所需——请确认对 `MemoryTab` 签名做一个小型追加修改是否可以（它是共享文件）。

签字确认后，我会严格按照第 10 节的范围推进阶段 2。
