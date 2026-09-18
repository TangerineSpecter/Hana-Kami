# Hana-Kami — 产品规格

一个用于管理你已经在终端中运行的 Claude Code Agent 的桌面控制室。每个 Agent 都是共享二维工作区中的模拟人生风格头像；你可以在一个地方观察它们工作、发送命令，并配置目标、技能和 MCP。

---

## 1. 产品形态

### 它是什么
- **Electron 桌面应用**，优先支持 macOS。
- 渲染一个由**头像**组成的二维画布（“工作区”），每个已注册的 Claude Code 会话对应一个头像。
- 每个头像都代表机器上某个 tmux 窗格中运行的真实 `claude` 进程。
- 头像会根据底层 Agent 正在使用的工具**四处走动**并访问工作站（文件架、Web 门户、终端工作站等）。
- 侧边面板显示当前选中头像的原始终端流；命令栏允许你向该 Agent 输入内容。

### 它明确不是什么（MVP 阶段）
- 不是 `claude` CLI 的替代品。CLI 是运行时；本应用是查看器和控制器。
- 不是 Agent 之间的消息总线。头像暂时不会互相交接任务。（推迟到 v2。）
- 不是远程仪表盘。仅支持本地会话；没有 Web 访问，也没有身份认证。
- 不是代码编辑器。我们显示终端输出，而不是源文件。

---

## 2. 架构：两个数据平面

这是整个架构中最关键的承重决策，其他设计都由此展开。

```
┌───────────────────────────────────────────────────────────────┐
│                     Electron Renderer                          │
│   ┌──────────────────┐    ┌──────────────────────────────┐    │
│   │ Avatar Canvas    │    │ Terminal View + Command Bar  │    │
│   │ (Pixi.js)        │    │ (xterm.js, read-only-ish)   │    │
│   └─────────▲────────┘    └────────────▲─────────────────┘    │
│             │                          │                       │
│             │ avatar state             │ pty bytes             │
└─────────────┼──────────────────────────┼───────────────────────┘
              │                          │
       ┌──────┴──────────┐        ┌──────┴─────────────┐
       │  Event Plane    │        │  Terminal Plane    │
       │  (hooks → IPC)  │        │  (tmux pipe-pane)  │
       └──────▲──────────┘        └──────▲─────────────┘
              │                          │
              │ JSON events              │ raw bytes
       ┌──────┴──────────────────────────┴─────────────┐
       │           Claude Code processes               │
       │  (running in tmux panes the user already has) │
       └───────────────────────────────────────────────┘
```

### 终端平面（原始 pty）
- 由 **tmux** 提供支持。每个已注册 Agent 对应一个 tmux `{session}:{window}.{pane}` 三元组。
- **读取**终端输出：`tmux pipe-pane -O -t <pane> 'cat >> /tmp/cth/<id>.log'`（也可以通过打开的文件监听器流式读取）。
- **发送输入**：`tmux send-keys -t <pane> "..." Enter`。
- 应用中的 xterm.js 视图持续读取日志；用户在命令栏中输入的内容会转换为 `send-keys`。

### 事件平面（结构化 Agent 状态）
- 由 **Claude Code hooks** 提供支持，配置在每个 Agent 的 `settings.json` 中（也可以通过环境变量覆盖）。
- 应用安装的 Hook：
  - `UserPromptSubmit` → 头像“醒来”
  - `PreToolUse` → 头像开始走向与工具匹配的工作站
  - `PostToolUse` → 头像携带产物走回去
  - `Notification` → 头像挥手；界面显示 Toast
  - `Stop` → 头像在桌边空闲；有未读输出时显示徽章
  - `SubagentStop` → 生成/移除子头像（v2）
- 每个 Hook 都运行一个小型 shim：我们随应用提供的 `cth-hook`（Node CLI）。它从 stdin 读取 Hook 的 JSON，为其标记会话 ID，然后 POST 到由 Electron 主进程持有的 Unix 域套接字 `~/.cth/events.sock`。

**为什么需要两个平面？**只有 Hook 无法提供用户希望看到的原始流；单独使用 tmux pipe 又必须脆弱地解析输出，才能判断正在运行哪个工具。两者结合后：画布由事件驱动，终端视图则逐字节保持真实。

---

## 3. 注册 Agent

头像如何出现。

### 选项 A——用户添加已有窗格（MVP 路径）
1. 用户照常在 tmux 中运行 `claude`。
2. 在应用中点击 **“添加 Agent”** → 应用调用 `tmux list-panes -a -F '#{session_name}:#{window_index}.#{pane_index} #{pane_current_command} #{pane_current_path}'`。
3. 应用显示候选窗格（筛选正在运行 `claude` 或 `node` 的窗格）。
4. 用户选择一个窗格，为它命名并选择精灵/颜色。
5. 应用执行：
   - 将 `cth-hook` shim 合并写入 `<cwd>/.claude/settings.local.json`，作为项目级 Hook 配置。
   - 在该 tmux 窗格上启动 `pipe-pane`。
   - 使用 `tmux capture-pane -p -S -1000` 读取现有滚屏内容。
   - 头像出现在工作区中。

### 选项 B——从应用启动（后续）
- “新建 Agent”按钮 → 应用创建新的 tmux 窗格，并在其中启动已经预先接好正确 Hook 的 `claude`。
- 用户体验更简单，但需要由应用接管会话生命周期。暂缓。

### 如果用户关闭了 tmux 窗格怎么办？
- pipe-pane 文件会停止更新；定期执行的 `tmux list-panes` 探测发现窗格消失后，头像进入“ghost”状态 30 秒，随后归档。

---

## 4. 模拟人生隐喻——将事件映射为行为

### 工作区
- 一个大型二维场景。背景是风格化的“工作坊”，其中包含以下**工作站**：
  - **书桌**（每个头像一个）——归属地和空闲位置
  - **文件架**——用于 Read/Write/Edit
  - **终端工作站**——用于 Bash
  - **Web 门户**——用于 WebFetch/WebSearch
  - **MCP 角落**——用于所有 `mcp__*` 工具（每个服务器有子工作站）
  - **任务板**——用于 TodoWrite
  - **邮箱**——用于 Notification（需要用户处理时显示）

### 头像状态机
```
idle ──UserPromptSubmit──▶ alert
alert ──PreToolUse──▶ thinking(→station) ──arrival──▶ working(station)
working ──PostToolUse──▶ thinking(→desk) ──arrival──▶ idle (or next tool)
thinking ──PreToolUse──▶ thinking(→new station)   (loop)
working ──Stop──▶ success ──250ms──▶ idle
any ──Notification──▶ blocked (waving at mailbox)
any ──tmux pane gone──▶ ghost ──30s──▶ archived
```

`thinking` 是**移动中 + 推理中**的状态。头像行走（物理动画），徽章显示“thinking”（认知状态）。同一个状态，两种解读。

### 移动
- Pixi.js 场景；头像基于精灵，尺寸为 32×32 或 64×64。
- 路径：在粗粒度网格上使用简单 A*，或者直接插值到目标位置——对 MVP 来说，直接插值即可，无需过度设计。
- 同一项目中的多个 Agent 共享一个“房间”（视觉区域）。不同 cwd → 不同房间，并用带名称的门连接。

### 用户一眼能看到什么
- 头像在文件架前伸手 → “Agent 正在读取或写入文件”
- 头像在带有运动线的终端工作站前 → “Agent 正在运行 Bash 命令”
- 头像站在邮箱旁挥手 → “Agent 被阻塞，需要你的输入”
- 头像坐在书桌前 → “已完成，等待下一个提示词”

这就是演示。如果观察它的工作过程本身很有趣，产品就成立了。

---

## 5. Agent 配置

每个头像都有一个**配置抽屉**（右键 → 配置）：

 - **名称和精灵**（外观设置，持久化到应用数据库）
 - **工作目录**（只读；从 tmux 窗格推导）
 - **已启用技能**——编辑项目 `.claude/settings.json` 中 `enabledMcpjsonServers` / 技能允许列表的开关
 - **MCP 服务器**——本会话挂载的 MCP 服务器列表，可切换开关
 - **Hooks**——显示应用已安装的 Hook，并提供添加自定义 Hook 的选项
 - **目标 / 系统提示词前缀**——见 §6
 - **模型**——将设置写入项目配置的 Opus / Sonnet / Haiku 选择器
 - **权限模式**——default / acceptEdits / bypassPermissions / plan

这些内容本质上都是 `settings.json` 的图形界面。应用不会发明新的配置，而是编辑 Claude Code 已经读取的文件。

---

## 6. “/goal”问题

你提到了 `/goal`——截至 2026 年初，Claude Code 没有名为它的内置斜杠命令。可能有三种情况：

1. **你指的是自定义斜杠命令**（`~/.claude/skills/goal/` 中用户定义的技能）。如果是这样，应用应允许你为每个 Agent 选择要暴露的技能，并将它们作为头像旁的快捷操作按钮。
2. **你指的是持久化目标/任务**，类似 Agent 应跨多个提示词持续追求的长期指令。这不是 CC 功能，但很容易在这里实现：应用为每个头像维护一个“目标”字符串，在 `send-keys` 前把它加到每条用户提示词前，或者安装一个注入上下文的 `UserPromptSubmit` Hook。
3. **你最近在某处看到过它。**如果是这样，请告诉我来源，我们会接入真正的实现。

**当前规格行为**：每个头像都有一个 `goal` 字段（自由文本）。发送时，应用在用户命令前加上 `<goal>...</goal>` 上下文（或者通过 `UserPromptSubmit` Hook 注入——这样不会污染可见的对话记录，更整洁）。用户可以按每次发送切换目标是否生效。

每个头像还要提供：
- **技能选择器**（`~/.claude/skills/` 或 `<cwd>/.claude/skills/` 中的内容）
- **子 Agent 选择器**（`~/.claude/agents/` 中的内容）
- **MCP 选择器**

---

## 7. 从应用发送命令

命令栏位于选中 Agent 面板的底部，提供三种输入模式：

 - **自由提示词**：通过 `tmux send-keys` 输入到窗格，然后按 `Enter`。
 - **斜杠命令**：路径相同，但从 Agent 可用技能中提供自动补全。
 - **快捷操作**：提供“/clear”、“Stop”、“Continue”、“Run goal”等按钮。

边界情况：
- 如果 Agent 正在执行工具，应用提示：“Agent 正忙——排队还是中断？”
- 中断 = `send-keys Escape`（Claude Code 的取消键）。
- 排队 = 等待 `Stop` 事件后再发送。

---

## 8. 技术栈与关键依赖

| 层 | 选型 | 说明 |
|---|---|---|
| 运行壳 | Electron | Renderer + Node 主进程 |
| UI 框架 | React + TypeScript | |
| 头像画布 | **Pixi.js** | 精灵场景、60fps、易于插值/补间动画。Phaser 对此项目来说过重。 |
| 终端视图 | **xterm.js** | 持续读取 pipe-pane 日志；正确支持 ANSI |
| 进程控制 | 调用 **tmux** | 因为采用连接已有会话的方式，不需要 node-pty |
| 事件接收 | 位于 `~/.cth/events.sock` 的 **Unix 域套接字** | Node `net.createServer`；Hook shim 是写入 JSON+换行的小型 CLI |
| 持久化 | 通过 better-sqlite3 使用 **SQLite** | Agent、布局、命令历史、目标 |
| 精灵 | 自制或 itch.io 素材包 | 8 个方向 × 空闲/行走/工作动画 |
| 打包 | electron-builder | macOS 使用 `.dmg`，Linux/Windows 暂缓 |

用户必须安装的外部二进制：`tmux`。应用首次运行时会检测它；如果不存在则拒绝启动并显示安装说明。

---

## 9. 数据模型（SQLite）

```sql
CREATE TABLE agents (
  id            TEXT PRIMARY KEY,        -- uuid
  name          TEXT NOT NULL,
  sprite        TEXT NOT NULL,           -- key into sprite pack
  color         TEXT NOT NULL,
  tmux_target   TEXT NOT NULL,           -- 'session:window.pane'
  cwd           TEXT NOT NULL,
  goal          TEXT,
  created_at    INTEGER NOT NULL,
  archived_at   INTEGER
);

CREATE TABLE events (
  id            INTEGER PRIMARY KEY,
  agent_id      TEXT NOT NULL,
  ts            INTEGER NOT NULL,
  hook          TEXT NOT NULL,           -- 'PreToolUse', etc
  tool          TEXT,                    -- 'Edit', 'Bash', etc
  payload_json  TEXT NOT NULL
);

CREATE TABLE commands (
  id            INTEGER PRIMARY KEY,
  agent_id      TEXT NOT NULL,
  ts            INTEGER NOT NULL,
  text          TEXT NOT NULL,
  source        TEXT NOT NULL            -- 'user', 'quick_action'
);

CREATE TABLE layout (                    -- avatar positions/rooms
  agent_id      TEXT PRIMARY KEY,
  x             REAL NOT NULL,
  y             REAL NOT NULL,
  room          TEXT NOT NULL
);
```

---

## 10. 风险与待决问题

### 风险
- **Hook 规格漂移。**Claude Code 的 Hook JSON 格式可能演进。缓解措施：将 Hook shim 固定到某个版本，在界面显示结构错误；如果 Hook 损坏，再惰性降级为解析工具调用文本。
- **写入用户的 `settings.json`。**触碰用户配置具有侵入性。缓解措施：只写入 `settings.local.json`（已加入 gitignore），先备份，应用前显示差异，并提供“卸载 Hook”按钮。
- **tmux 不可用 / 用户直接使用 iTerm、kitty、wezterm。**没有 tmux 就无法运行应用。v1 的缓解措施：要求使用 tmux；v2 通过 AppleScript 为 iTerm 提供 shim，其他长尾终端暂不支持。
- **模拟人生隐喻显得华而不实。**这是实际风险。缓解措施是让隐喻具有**信息价值**——每个动画都应该传达你原本不知道的信息。如果“走到文件架”并不比文字标签更快地表达“正在读取文件”，那我们做出来的只是玩具。

### 待决问题（构建前或构建过程中决定）
1. **Hook 安装范围**——`~/.claude/settings.json`（全局，所有会话都安装 Hook）还是项目级 `.claude/settings.local.json`（只有已注册项目安装）。建议使用项目级配置，以缩小影响范围。
2. **精灵：自制还是购买？**原型阶段购买素材包；如果产品稳定下来，再替换为自制素材。
3. **“目标”对你究竟意味着什么？**我猜是长期运行的指令（§6 第 2 项），在构建前确认。
4. **多机器？**如果 Agent 在远程机器上运行，是否需要远程守护进程？推迟到 MVP 之后。
5. **iTerm 支持截止时间。**它什么时候（如果有的话）会成为阻塞项？

---

## 11. 里程碑

### M0——骨架（1–2 天）
- Electron + React + Pixi 壳层
- 渲染一个在两个固定位置之间行走的硬编码头像
- 将 xterm.js 接入静态日志文件

### M1——一个真实 Agent 端到端运行（3–5 天）
- “添加 Agent”选择一个 tmux 窗格
- 将 Hook shim 安装到 `.claude/settings.local.json`
- Hook 事件通过 UDS 流入应用
- 头像状态机由真实事件驱动
- 命令栏向窗格发送按键
- 终端视图持续读取 pipe-pane 日志
- **成功标准**：你在 tmux 中运行 `claude`，注册它，让它编辑一个文件，看到头像走到文件架、走回来，最后在书桌前结束。

### M2——多 Agent（3–5 天）
- 同时运行 N 个 Agent，每个 Agent 有自己的房间（按 cwd 分组）
- 每 Agent 的配置抽屉（名称、精灵、目标、模型、权限模式）
- 快捷操作、命令排队
- 通过 UserPromptSubmit Hook 注入目标
- 持久化：应用重启后头像和位置仍然保留

### M3——打磨（1 周）
- 带有完整动画的精灵包
- 声音（可选，默认关闭）
- 通知 Toast + Dock 徽章
- 首次使用引导（tmux 检查、Hook 安装授权）
- DMG 打包、代码签名

### v1 范围之外
- Agent 间交接（“Agent A 将文件传给 Agent B”）
- 通过 SSH 运行远程 Agent
- Web/移动端伴侣应用
- 非 tmux 终端
- 子 Agent 可视化（父 Agent 生成子头像）

---

## 12. 已记录的决策

- **头像隐喻**：活跃的模拟人生风格（Agent 行走、访问工作站）。
- **执行模型**：连接已有终端会话（tmux），不生成或接管 `claude` 进程。
- **技术栈**：Electron + React + Pixi.js + xterm.js + SQLite。
- **MVP 范围**：共享工作区中的 N 个独立 Agent；不包含 Agent 间协调。

## 13. 仍需你决定的事项

1. **“/goal”——§6 中的三种解释，你指哪一种？**
2. **Hook 范围：项目级（推荐）还是全局？**
3. **iTerm 直接支持有多重要？（如果现在不需要，我们就要求使用 tmux。）**
4. **精灵美术：临时素材包可以接受，还是需要定制？**
5. **§10（“风险与待决问题”）中有没有哪项你的答案不同？**
