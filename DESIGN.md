# Hana-Kami — 设计系统

> 美学方向是 **动物森友会 × Earthbound × SNES 菜单 UI**。像素对齐、厚重、友好。每个 UI 元素都应该像是能出现在 1995–2005 年任天堂游戏中的界面。本文件是规范真源：任何新组件都必须从这些设计令牌派生。

办公室角色造型另见 [像素角色微调准则](docs/design/pixel-characters.md)：以菲伦为比例参考，保留角色辨识度，按部位微调。

---

## 1. 原则

1. **一切像素对齐。**不使用半像素、不使用 CSS 模糊、不使用漂浮感的 `border-radius`。网格必须是真实的。
2. **厚重胜过光滑。**边框要可见，面板要有重量，按钮要有可按下的感觉。如果一个组件像是能出现在 iOS 17 中，那它就是错的。
3. **限制调色板。**每个画面最多使用 8 种颜色，每个精灵最多使用 5 种。克制才能形成整体观感。
4. **用运动传达信息。**头像正在行走*就是*状态。如果行走已经表达了信息，就不要再添加进度条。
5. **友好，但不为可爱而可爱。**文案简短、有人情味。避免幼稚语气。想象 Tom Nook 的标牌，而不是周六早间卡通片。
6. **像 90 年代游戏说明书一样阅读。**大量使用命名面板、带边框的分组和状态窗口。每条信息都应该有自己的*位置*。

### 我们不是什么
- 不是玻璃拟态，不是 Material，不是 iOS，不是“现代 Web”，也不是“给普通应用套复古滤镜”。
- 不是为了像素艺术而像素艺术——每个像素选择都必须服务于 UX 功能。

---

## 2. 参考作品（请研究）

| 参考作品 | 借鉴内容 |
|---|---|
| **Animal Crossing: New Leaf / NH** | 村民角色、柔和调色板、友好文案、对话框 |
| **Earthbound / Mother 3** | 状态窗口、多层面板边框、鲜明的纯色 |
| **Stardew Valley** | 字体选择、地砖、精灵比例 |
| **Pokémon B/W & X/Y** | 清晰的信息面板、摘要界面 |
| **Mario Kart 8（仅 HUD）** | 金币/计时器标签、中性背景上的鲜明强调色 |
| **Undertale** | 用于系统反馈的终端风格字体排版 |
| **Stardew Concerned Ape 精灵** | 行走循环、工作站设计 |
| **SNES Final Fantasy VI 菜单** | 三层面板边框、带转角的标题 |

---

## 3. 色彩系统

所有颜色均以 `#RRGGBB` 指定。令牌名称使用 `--cth-<category>-<weight>` 模式（CSS 变量），并对应 TypeScript 中的 `tokens.colors.<category>.<weight>` 对象。

### 3.1 基础色（面板、地面、表面）

| 令牌 | Hex | 用途 |
|---|---|---|
| `cream-50` | `#FFFDF5` | 最亮的高光、对话框最内层 |
| `cream-100` | `#FFF8E7` | 默认面板填充 |
| `cream-200` | `#F4E9C7` | 内嵌区域 / 交替行 |
| `cream-300` | `#E8D9A0` | 禁用状态填充 |
| `paper-100` | `#FCFAF0` | 终端背景 |
| `paper-200` | `#F0EAD2` | 微妙的面板变体 |

### 3.2 墨色（文字、轮廓）

| 令牌 | Hex | 用途 |
|---|---|---|
| `ink-900` | `#1A1320` | 正文、外层边框。**绝不使用 `#000`。** |
| `ink-700` | `#3D2E4A` | 次要文字、中间边框层 |
| `ink-500` | `#6B5878` | 第三级文字、禁用边框 |
| `ink-300` | `#A899B5` | 占位符、细分隔线 |
| `ink-100` | `#D9CFE0` | 微妙的分隔线 |

### 3.3 Agent 强调色（鲜明的角色颜色）

颜色饱和而温暖。每个头像分配一种颜色——用于底部条徽章、Agent 聊天选中高亮和姓名牌。

| 令牌 | Hex | 联想 |
|---|---|---|
| `coral` | `#FF6B6B` | Mario 红 |
| `coral-light` | `#FFB4B4` | |
| `mint` | `#6BCF7F` | 1UP 绿 |
| `mint-light` | `#B4E5BD` | |
| `sky` | `#4ECDC4` | Wind Waker 海洋 |
| `sky-light` | `#A8E6E0` | |
| `lemon` | `#FFD93D` | 皮卡丘 |
| `lemon-light` | `#FFEC99` | |
| `lilac` | `#B197FC` | 超能力属性 |
| `lilac-light` | `#D6C5FF` | |
| `peach` | `#FFA07A` | Peach 公主 |
| `peach-light` | `#FFD0B5` | |

### 3.4 状态（系统语义）

| 令牌 | Hex | 含义 |
|---|---|---|
| `status-idle` | `#A899B5` | Agent 在书桌前等待 |
| `status-thinking` | `#4ECDC4` | 推理中 + 正在前往工作站 |
| `status-working` | `#FFD93D` | 位于工作站并正在使用工具 |
| `status-waiting` | `#6C8EF5` | 工作 Agent 正等待 GOD 或另一个 Agent |
| `status-blocked` | `#FF6B6B` | 通知已触发，需要用户处理 |
| `status-success` | `#6BCF7F` | 刚刚完成 |
| `status-ghost` | `#D9CFE0` | 窗格已关闭，正在淡出 |
| `status-compacting` | `#9B7EDE` | 正在整理上下文（PreCompact/PostCompact） |
| `status-looping` | `#FF9F43` | 熔断器已启动——发生失控循环 |
| `status-typing` | `#E8A33D` | **不是 Agent 状态。**你在该 Agent 的提示词中有尚未发送的文字，消息队列因此被占住 |

### 3.5 世界（工作区本身）

| 令牌 | Hex | 用途 |
|---|---|---|
| `grass-light` | `#D4EAB0` | 浅色地砖 |
| `grass-dark` | `#B5D589` | 深色地砖（棋盘格） |
| `wood-light` | `#E5C896` | 房间地面浅色地砖 |
| `wood-dark` | `#C9A66B` | 房间地面深色地砖 |
| `path` | `#E8D8B0` | 房间之间的通道 |
| `wall` | `#8B6F47` | 房间墙壁（3px 描边） |

### 3.6 渐变限制

除标题栏上的垂直双颜色渐变（`cream-100` → `cream-200`）之外，不使用渐变。仅此一处；其他所有表面都使用纯色。

---

## 4. 字体排版

使用三种字体，全部从 Google Fonts 加载。**每个文本元素都必须声明其中一种字体。**不使用系统字体。

| 用途 | 字体 | 原因 |
|---|---|---|
| **展示** | `Press Start 2P` | 具有 NES 标志性的字体，仅用于标题，8/12/16 px |
| **UI** | `Pixelify Sans` | 现代且易读的像素字体，用于正文/标签 |
| **等宽/终端** | `VT323` | CRT 终端感觉，较大的字面高度 |

### 4.1 字号比例（全部使用整数 px）

| 令牌 | 大小 | 行高 | 用途 |
|---|---|---|---|
| `display-lg` | 16 / `Press Start 2P` | 24 | 应用标题、页面标题 |
| `display-md` | 12 / `Press Start 2P` | 20 | 分区标题、模态框标题 |
| `display-sm` | 8 / `Press Start 2P` | 12 | 徽章、标签文字 |
| `body-lg` | 18 / `Pixelify Sans` | 24 | 主要正文 |
| `body-md` | 16 / `Pixelify Sans` | 20 | 默认 UI 文字 |
| `body-sm` | 14 / `Pixelify Sans` | 18 | 次要文字、说明 |
| `mono-md` | 16 / `VT323` | 20 | 终端流 |
| `mono-sm` | 14 / `VT323` | 18 | 内联日志行、路径 |

### 4.2 字重
所有字体只提供一个字重。**绝不使用粗体。**强调时使用颜色（`ink-900` 对比 `ink-500`）或标签/徽章。

### 4.3 大小写
- 展示字体：使用**标题式大小写**，绝不全部大写（Press Start 2P 已经足够醒目）。
- UI 字体：使用句首大写。
- 状态徽章：使用小写（“working”、“thinking”、“blocked”）。

### 4.4 字间距
- Press Start 2P: `0` (already wide enough).
- Pixelify Sans: `0`.
- VT323: `0`.
绝不添加 letter-spacing——它会破坏像素网格。

---

## 5. 间距与网格

基础单位：**4 px**。所有 margin、padding、gap 和位置都必须是 4 的倍数。精灵内部绘制除外，不允许其他例外。

| 令牌 | px |
|---|---|
| `space-0` | 0 |
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 24 |
| `space-6` | 32 |
| `space-7` | 48 |
| `space-8` | 64 |

### 布局

- 主窗口最小尺寸：1280 × 800。
- 标准边距：16 px（`space-4`）。
- 面板内部 padding：12 px（`space-3`）。
- 工作区画布：尺寸动态变化，但地砖网格为 32 × 32 px（一个游戏地砖）。

### 像素对齐

- 所有 `transform: translate(...)` 的值都必须是整数。
- 每个 `<canvas>` 以及所有渲染出的精灵 `<img>` 都使用 `imageRendering: pixelated`。
- 缩放级别使用整数倍（1×、2×、3×），绝不使用 1.5×。

---

## 6. 边框与面板

SNES 三层边框是基础规范。每个面板都使用它。

### 6.1 结构

```
┌────────────────────────────────┐  ← outer:  ink-900, 2px
│┌──────────────────────────────┐│  ← middle: cream-200, 2px
││┌────────────────────────────┐││  ← inner:  ink-700, 1px
│││                            │││
│││   panel content            │││  ← fill:   cream-100
│││                            │││
││└────────────────────────────┘││
│└──────────────────────────────┘│
└────────────────────────────────┘
```

CSS 实现：使用嵌套的 `box-shadow inset`，而不是嵌套 DOM。不使用 `border-radius`。每侧边框总厚度为 5 px。

### 6.2 面板变体

| 变体 | 外层 | 中层 | 内层 | 填充 | 用途 |
|---|---|---|---|---|---|
| `panel/default` | `ink-900` | `cream-200` | `ink-700` | `cream-100` | 标准面板 |
| `panel/inset` | `ink-700` | `cream-100` | `ink-500` | `cream-200` | 凹陷区域 |
| `panel/active` | `ink-900` | accent | `ink-700` | `cream-100` | 选中的 Agent、聚焦输入框 |
| `panel/terminal` | `ink-900` | `ink-700` | `ink-500` | `paper-100` | 终端背景 |
| `panel/dialog` | `ink-900` | `cream-200` | `ink-700` | `cream-50` | 模态框、通知 |

### 6.3 转角裁切

可选。通过从每个角裁掉 2 px 的方块，增加 8-bit“圆角”感觉。实现方式：使用 SVG `clip-path`，或使用四个与父级背景匹配、绝对定位的 2 × 2 方块。仅用于：对话框和应用主框架。

### 6.4 投影

唯一允许的阴影是**硬偏移阴影**：向右 4 px、向下 4 px，使用 25% 不透明度的 `ink-900`。不使用模糊。用于：模态框、Toast、拖动中的头像。

```css
filter: drop-shadow(4px 4px 0 rgba(26, 19, 32, 0.25));
```

也可以使用一个绝对定位、偏移 4 px 的兄弟块元素实现。

---

## 7. 组件

每个组件都要明确其结构、状态、props 和示例。

### 7.1 `<PixelPanel>`

基础容器。

```
Props:
  variant    'default' | 'inset' | 'active' | 'terminal' | 'dialog'
  title?     string        — 渲染标题栏
  accent?    AccentColor   — 激活时应用于标题栏和中间边框
  children   ReactNode

States:
  default   — 按规范绘制
  hover     — 无变化（面板不响应 hover，只有按钮响应）
  focused   — 中间边框变为 accent，并加宽 1px
```

### 7.2 `<PixelButton>`

具有 3D 按压感的按钮，默认采用厚重风格。

```
Props:
  variant   'primary' | 'secondary' | 'ghost' | 'destructive'
  size      'sm' (24h) | 'md' (32h) | 'lg' (40h)
  icon?     IconName
  children  ReactNode

States:
  default   — 顶边明亮，底边深色
  hover     — 填充变为该变体颜色的浅色版本
  active    — translate(0, 2px)，底边消失（按下）
  disabled  — fill = cream-300，文字为 ink-500，没有按压反馈
  focus     — 2px ink-900 轮廓，偏移 +2px

Primary：fill = ink-900，text = cream-50
Secondary：fill = cream-100，text = ink-900，border = ink-900
Ghost：无填充，border = ink-500，text = ink-700
Destructive：fill = coral，text = cream-50
```

### 7.3 `<PixelBadge>`（状态标签）

```
Props:
  status    'idle' | 'thinking' | 'working' | 'waiting' | 'blocked' | 'success'
            | 'ghost' | 'compacting' | 'looping' | 'typing'
  label     string
  icon?     IconName

结构：8 px 高的像素点 + space-1 + 14 px 小写 Pixelify Sans。
颜色：使用状态调色板。背景：状态颜色以 20% 不透明度叠加在 cream-100 上。
```

标签不是令牌名称——它们面向*用户*阅读。`blocked` 显示
“需要你处理”（保留给正在等待你的 GOD Agent），`waiting` 保持为“waiting”
（如实表示工作 Agent 正卡在另一个 Agent 上），`typing` 显示
**“你的草稿”**——这是你输入在提示词中的文字，不是 Agent 的文字，也是该 Agent
的消息队列无法继续消费的原因。参见
[`docs/message-queue.md`](./docs/message-queue.md).

### 7.4 `<AgentCard>`（底部条）

```
Width: 200 px. Height: 80 px. Panel variant: default.
顶部：精灵头像（32 × 32）+ 名称（body-md）+ 状态徽章。
中部：当前项目名称（body-sm、ink-500）和当前工具/动作。
底部：8 段进度点（已填充 = 当前步骤中的工作单元）。

选中状态：使用 Agent 强调色的 panel/active 变体。
```

### 7.5 `<CommandBar>`

```
Anatomy: PixelPanel inset variant.
Contains:
  - 提示词前缀 "> "（mono-md，Agent 强调色）
  - 文本输入框（mono-md，无边框）
  - 发送按钮（primary、size-md，图标：箭头）
  - 上方模式标签：[Free] [/skill] [Quick]

States:
  - typing       — 光标为 2px 宽的方块，每 500ms 闪烁
  - busy         — 输入框边框染为 lemon（Agent 正在工作）
  - blocked      — 输入框边框染为 coral，并显示辅助文字
```

### 7.6 `<TerminalView>`

```
PixelPanel terminal variant.
xterm.js 主题：
  background = paper-100
  foreground = ink-900
  cursor = coral
  selection = lemon-light
  ansi colors：见 §11
字体：VT323 16 px。
顶部：2px 的 ink-300 虚线，使用 mono-sm 显示“live · pipe-pane”。
```

### 7.7 `<Toast>`（通知）

```
PixelPanel dialog variant, 320 px wide.
顶部：12 px 高的 Agent 强调色条带。
主体：头像（24 × 24）+ 消息（body-md，最多 3 行）。
操作行：最多两个按钮。
投影（硬偏移 4/4）。
从右上角滑入并快速贴合（首帧之后不使用缓动）。
只有非阻塞通知会自动消失；阻塞通知等待用户处理。
```

### 7.8 `<RoomLabel>`（每个项目房间上方的路牌）

```
Signpost: 8 px wood post + plank.
Plank: cream-200 fill, ink-900 outline, display-sm text.
显示“project: <basename>”。位于每个房间的左上角。
功能上是像素精灵，而不是 HTML。
```

### 7.9 `<ConfigDrawer>`

```
从右侧滑入（240 ms 快速贴合，不使用缓动）。
宽度：480 px。
标题栏：display-md + 关闭按钮。
分区（可折叠）：Identity、Goal、Runtime、Skills、MCP、Hooks。
每个分区标题：ink-900 + 2px 下划线 + 强调色圆点。
```

### 7.10 `<Modal>`

```
PixelPanel dialog variant.
背景遮罩：ink-900 @ 60% 不透明度。**不使用模糊。**
位置：居中。快速出现（200 ms ease-out，scale 0.92 → 1.0）。
始终在右上角提供关闭按钮，并在右下角至少提供一个操作按钮。
```

---

## 8. 头像精灵

整个产品都依赖这些精灵。本节规格是精确要求。

### 8.1 网格

- **24 × 24 px** sprite cell.
- 行走循环：**4 帧**（idle、step-A、idle、step-B）。每帧 24 × 24。
- 动画：8 fps（每帧 125 ms）。
- 方向：**4 个基本方向**（下、上、左、右）。对角线方向在运行时通过选择主轴计算。

### 8.2 结构

```
0123456789012345678901234   (x)
        ▓▓▓▓▓▓▓▓             row 4-5: hair
      ▓░░░░░░░░░▓            row 6-9: head, skin
      ▓░██░░░██░▓            row 8: eyes
      ▓░░░░░░░░░▓            row 10: mouth/cheeks
        ▓▓▓▓▓▓▓▓             row 11: jaw
       ▓░░░░░░░▓             row 12-17: torso, outfit
       ▓░██░██░▓             outfit detail
       ▓░██░██░▓
       ▓░░░░░░░▓
        ▓░░░░░▓              row 18-22: legs
        ▓░░ ░░▓              walk: alternating
         ▓▓  ▓▓              feet
```

### 8.3 每个头像的调色板（最多 4 种颜色）

每个头像使用**恰好 4 种精灵颜色**（再加上 `ink-900` 轮廓，共 5 个槽位）：

| 槽位 | 作用 |
|---|---|
| `skin` | 脸部、手 |
| `hair` | 头顶 |
| `primary` | 主要服装颜色 |
| `accent` | 服装细节（衣领、腰带） |

Agent 的**强调色调色板令牌**（来自 §3.3）驱动 `primary`。

### 8.4 初始角色原型

内置精灵预设，每种都有自己的服装图案。

| 原型 | 气质 | 服装说明 |
|---|---|---|
| `scientist` | 实验室研究员 | 中央有白大褂面板，方框眼镜（第 8 行 2px 黑色） |
| `wizard` | 魔法模式 | 尖顶帽（头顶上方第 2–5 行），胸口有星星（第 14 行） |
| `astronaut` | 探险家 | 头盔（头部周围 3px 圆环），顶部有天线像素 |
| `cat-villager` | 动物森友会 | 三角耳朵（第 3–4 行），躯干后可见尾巴 |
| `hacker` | 连帽衫 | 帽兜垂在头部两侧，耳机（第 6–7 行两侧各 2px 黑色） |
| `ninja` | 潜行者 | 遮住下半张脸的面罩，忍者头带 |

### 8.5 行走循环

第 0 帧（idle）：双脚对齐，略微下垂（y+0）
第 1 帧（step-A）：左脚抬高 1 px（y-1），右脚着地（y+0）
第 2 帧（idle）：与第 0 帧相同
第 3 帧（step-B）：右脚抬高 1 px，左脚着地

行走时，整个精灵会按正弦波上下浮动：y 方向 ±1 px，以 8 fps 采样并与脚步循环保持相位。这就是 Stardew Valley 的行走感觉。

### 8.6 状态叠加层

绘制在精灵上方，尺寸 8 × 8 px：

| 状态 | 叠加内容 |
|---|---|
| `thinking` | 头顶上方 +2 位置循环显示 3 个点（`...`） |
| `blocked` | 脉冲式 `!` 标记（coral），2 帧闪烁 |
| `success` | 闪光（4 帧星芒爆发） |
| `attention` | 挥手（绘制到右臂槽位，2 帧循环） |
| `ghost` | 精灵不透明度 50%，无叠加层 |

### 8.7 移动

- 速度：行走时为 80 px / 秒。
- 路径：在 32 × 32 px 地砖网格上使用 A*。MVP 阶段：简单插值到目标地砖中心。
- 浮动：行走时 `y += sin(t * 8π) * 1`，站立时为 `0`。

### 8.8 携带产物

工具返回结果后，头像从工作站走回时，会在双手上方携带一个**令牌**：

| 工具 | 令牌 |
|---|---|
| `Read` / `Edit` / `Write` | 6 × 8 px 折叠纸张（cream-50 + ink-700 轮廓） |
| `Bash` | 6 × 6 px 终端 `>_`（ink-900 填充） |
| `WebFetch` / `WebSearch` | 6 × 6 px 地球（sky + mint） |
| `Grep` / `Glob` | 6 × 6 px 放大镜（ink-900 + cream-50） |
| MCP 工具 | 使用 MCP 服务器颜色的 6 × 6 px 菱形 |
| `TodoWrite` | 6 × 8 px 清单精灵 |

到达时令牌会被放到书桌上（3 帧淡出）。

---

## 9. 工作站（工作坊）

工作站是放置在每个房间中的 64 × 64 px 结构。

### 9.1 目录

| 工作站 | 用途 | 视觉表现 |
|---|---|---|
| **书桌** | 每个头像的归属地 | 32 × 32 木桌，带迷你笔记本和椅子 |
| **文件架** | Read/Edit/Write | 64 × 48 书架，3 排、每排 4 本书，使用随机调色板 |
| **终端工作站** | Bash | 桌上放置 32 × 48 CRT 显示器，光标闪烁 |
| **Web 门户** | WebFetch/Search | 48 × 48 拱门，紫丁香色旋涡渐变（动画） |
| **MCP 角落** | 任意 `mcp__*` | 48 × 48 模块化货架；每个 MCP 服务器放置一个小图标 |
| **任务板** | TodoWrite | 32 × 48 软木板，带便利贴（3 色轮换） |
| **邮箱** | Notification | 16 × 24 立柱式邮箱；有待处理通知时升起旗子 |

### 9.2 工作站状态

每个工作站有 3 种状态：

1. **空闲**——静态精灵
2. **使用中**——2 帧动画，周围增加闪光粒子
3. **高亮**——鼠标悬停或对应头像正在靠近时（增加 1 px 白色轮廓）

### 9.3 摆放

在一个房间（项目）中，工作站按固定模式排列：

```
┌───── project: <name> ──────────────┐
│  [shelf]    [terminal]    [web]    │
│                                     │
│              · · · ·                │ ← pathways (path color tiles)
│                                     │
│  [desks of agents in this project]  │
│                                     │
│  [board]    [mailbox]    [mcp]     │
└────────────────────────────────────┘
```

房间最小尺寸：480 × 320 px。房间会根据 Agent 数量扩展（每增加 4 个 Agent 就增加一排书桌）。

---

## 10. 图标

16 × 16 px 像素图标。最多使用 2 种颜色（ink + accent）。所有图标都手工绘制。

### 10.1 必需图标集

| 名称 | 用途 | 颜色 |
|---|---|---|
| `gear` | 配置 | ink-900 + ink-300 |
| `plus` | 添加 | ink-900 + mint |
| `x` | 关闭 / 取消 | ink-900 + coral |
| `check` | 确认 | ink-900 + mint |
| `arrow-right` | 发送 / 下一步 | ink-900 + sky |
| `pause` | 停止 / 暂停 | ink-900 + lemon |
| `play` | 恢复 | ink-900 + mint |
| `bell` | 通知 | ink-900 + peach |
| `folder` | 项目 | ink-900 + lemon |
| `terminal` | 终端 | ink-900 + mint |
| `code` | 文件 / 代码 | ink-900 + sky |
| `web` | Web 工具 | ink-900 + lilac |
| `mcp` | MCP 服务器 | ink-900 + lilac |
| `sparkle` | 成功 | ink-900 + lemon |

### 10.2 实现

图标以 inline SVG `<svg viewBox="0 0 16 16">` 组件存在，所有路径都使用整数坐标绘制。使用 `image-rendering: pixelated`。通过 `transform: scale(N)` 缩放，并且 N 只能是整数。

---

## 11. 终端（xterm.js）主题

```ts
{
  background: '#FCFAF0',
  foreground: '#1A1320',
  cursor: '#FF6B6B',
  cursorAccent: '#FCFAF0',
  selectionBackground: '#FFEC99',
  selectionForeground: '#1A1320',

  black:        '#1A1320',
  red:          '#FF6B6B',
  green:        '#6BCF7F',
  yellow:       '#FFD93D',
  blue:         '#4ECDC4',  // we use sky as our blue
  magenta:      '#B197FC',
  cyan:         '#4ECDC4',
  white:        '#FFF8E7',
  brightBlack:  '#6B5878',
  brightRed:    '#FFB4B4',
  brightGreen:  '#B4E5BD',
  brightYellow: '#FFEC99',
  brightBlue:   '#A8E6E0',
  brightMagenta:'#D6C5FF',
  brightCyan:   '#A8E6E0',
  brightWhite:  '#FFFDF5',
}
```

字体：`VT323`，16 px，line-height 1。

---

## 12. 动效

### 12.1 时长

| 类型 | ms | 缓动 |
|---|---|---|
| UI 快速出现（模态框、抽屉） | 200 | cubic-bezier(.2, .8, .2, 1) |
| 悬停状态 | 0 | 无——立即生效 |
| 按钮按下 | 0 | 无——立即平移 |
| Toast 滑入 | 200 | cubic-bezier(.2, .8, .2, 1) |
| 精灵行走 | 持续 | 8 fps 正弦波浮动 |
| 精灵帧 | 每帧 125 ms | step（无缓动） |
| 头像传送（房间切换） | 400 | step——淡出、移动、淡入 |

### 12.2 禁止的动效
- UI 不使用弹簧物理。
- 不弹跳。
- 不使用视差。
- 静态 UI 面板不使用环境式空闲动画。

动画属于**游戏层**（头像、工作站、粒子）。UI 层整体保持静止。

### 12.3 粒子

谨慎使用：

- **闪光**：任务完成时从书桌爆发 4 颗像素星星，总时长 250 ms
- **尘土**：头像到达工作站时，3 个像素点受重力影响弧线飞出，持续 300 ms
- **脉冲**：邮箱旗子每 800 ms 做一次 1 帧的 `+1 px scale`

---

## 13. 声音（暂缓——仅规格）

8-bit 音效按以下优先级排列：

1. `agent-arrives.wav` — 到达工作站时的啵声
2. `task-complete.wav` — 三音符大三度旋律
3. `notification.wav` — 单声提示音
4. `button-press.wav` — 轻柔点击声
5. `error.wav` — 下降音蜂鸣
6. `mailbox-flag.wav` — 旗子升起的咔哒声

所有声音最长 200 ms，单声道，22 kHz。默认关闭；用户可以在偏好设置中启用。

---

## 14. 语气与文案

### 语气
友好、简短、事实导向。想象一个恰好懂技术的动物森友会村民。

### 示例（应该 / 不应该）

| 不要 | 应该 |
|---|---|
| “Agent 当前正在对 SPEC.md 执行 Read 操作” | “Ada 正在读取 SPEC.md” |
| “发生错误” | “Ada 遇到了一点问题” |
| “Agent 已完成任务” | “Ada 完成了！” |
| “权限被拒绝” | “Ada 需要你的许可” |
| “确认操作” | “可以吗？” |
| “加载中……” | “稍等一下……” |

### 始终遵循
- 使用头像的名字，绝不要说“the agent”。
- 系统反馈控制在 12 个词以内。
- 对用户使用第二人称（“Ada 需要你看一下”）。

### 绝不使用
- 文案中使用 Emoji。我们有图标。
- 除完成和通知之外的感叹号。
- 不带撇号的缩写（“dont”）。使用正确标点。

---

## 15. 布局模板

### 15.1 主视图

```
┌─────────────────────── App title bar (display-md) ──────────────────────┐
├──────────────────────────────────────────┬─────────────────────────────┤
│                                          │                             │
│           Floor canvas (Pixi)            │     Selected agent panel    │
│           — fills remaining width        │     — 360 px wide           │
│                                          │     - portrait + name       │
│                                          │     - terminal view         │
│                                          │     - command bar           │
│                                          │     - status badge          │
│                                          │                             │
├──────────────────────────────────────────┴─────────────────────────────┤
│  Agent strip — horizontal scroll of <AgentCard>s, 80 px tall            │
└─────────────────────────────────────────────────────────────────────────┘
```

最小窗口：1280 × 800。窗口宽度低于 1024 时，右侧面板折叠为底部抽屉。

### 15.2 Z-index 层

| 层 | z | 内容 |
|---|---|---|
| 0 | 工作区画布 |
| 1 | UI 外框（面板、底部条） |
| 2 | 抽屉 / 侧边栏 |
| 3 | Toast |
| 4 | 模态框 |
| 5 | Tooltip |

---

## 16. 令牌文件

所有令牌都存在于两个同步文件中：

- `src/renderer/design/tokens.css` — 可供任意样式元素使用的 CSS 自定义属性。
- `src/renderer/design/tokens.ts` — 供 Pixi.js 和 inline styles 使用的 TypeScript 对象。

两个文件在构建时都从唯一真源 `tokens.json` 导入（后续工作）。MVP 阶段手动保持它们同步。

---

## 17. 无障碍说明

- 像素字体在小字号下本来就更难阅读——任何面向用户的文字都不得小于 14 px。
- 颜色对比度：本文档中的每组文字/背景组合都通过 WCAG AA（4.5:1）——添加新组合时必须验证。
- 状态通过**颜色 + 图标 + 位置**（头像所在位置）共同传达，绝不能只依赖颜色。
- 键盘导航：每个交互式 UI 元素都可以通过 Tab 到达；聚焦状态使用 2 px 轮廓（§7.2）。
- 减少动效：当 `prefers-reduced-motion: reduce` 时，禁用精灵浮动，行走变成立即传送，并禁用粒子。

---

## 18. 待重新审视的设计决策

1. 长期来看，是委托制作定制精灵，还是继续使用程序化精灵。
2. 深色模式：v1 不包含——奶油色背景的像素艺术就是品牌特色；如有需求再重新审视。
3. 可调整大小的房间还是固定网格——目前规格为固定网格，之后可能希望支持拖动调整房间大小。
4. 是否添加环境式地面装饰（花朵、地毯）——可以添加，但优先级较低。
5. 自定义鼠标光标（像素风格的手）——暂缓。
