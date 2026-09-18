# 蜂巢——自主多 Agent 协作层

> Hana-Kami 如何把一屋子彼此独立的 `claude`
> 进程变成一支能够协作、自我协调的团队，拥有持久记忆、共享黑板和管理办公区的“GOD”编排 Agent。

本文档是 Agent 协作层的设计真源。它与 [`SPEC.md`](./SPEC.md)（终端/事件平面）和
[`DESIGN.md`](./DESIGN.md)（视觉系统）并列。代码是已经*构建完成*内容的真源；本文档是我们*计划构建*内容的真源。

---

## 1. 我们正在构建什么（以及它叫什么）

每个启动的 Agent 都是真实的 `claude` CLI 进程，拥有文件系统、系统提示词和 Hook 生命周期。我们在其上叠加四种经典模式：

| 用户要求的行为 | 模式（名称） |
| --- | --- |
| 启动时创建、由 Agent 读取和更新的每 Agent 记忆文件 | **Agent 长期记忆**（MemGPT/Letta 风格的自管理记忆） |
| 将要求写入另一个 Agent 的文件 | **迹象协作（Stigmergy）**——通过修改共享环境进行协调 |
| 多个 Agent 共同编辑的计划 | **黑板架构**（Hearsay-II） |
| “完成每项任务后检查” | **邮箱 / Actor 模型**——在生命周期节点清空收件箱 |
| 管理办公区并为其他 Agent 释疑的“GOD”Agent | **编排器 / Supervisor**（LangGraph-supervisor 风格） |

总称是带有**自主 Agent 循环**的**多 Agent 系统（MAS）**。与本应用最接近的学术先例是斯坦福的 *Generative Agents*（Park 等，2023）：2D 世界中的 Sims 风格头像，配合记忆流、检索、反思和规划。

---

## 2. 已锁定的设计决策

1. **Git 作为协调/审计层，单一提交者。**蜂巢知道的一切都是一个本地 git 仓库中的文件。为避免多个 Agent 并发时造成 `.git/index.lock` 损坏，**只有 Electron 主进程提交**。Agent 永远不调用 git，只写入普通文件。（参考：GitHub Desktop 的提交队列模式；lazygit/git-retry 的退避。）
2. **每个文件只有一个写入者。**每个 Agent 只写入自己的 `agents/<id>/` 目录。跨 Agent 交付由**路由器**（主进程）将发送者 `outbox/` 中的消息移动到收件人 `inbox/` 完成。任何文件都不会由两个进程写入。
3. **GOD 模式自主运行，原生 HITL。**拥有特权的 **GOD Agent**（位于 Michael 的房间）裁决跨 Agent 流量。常规请求（澄清、数据请求、计划调整）由它自行处理，系统保持完全自主运行。**关键**事项（破坏性操作、花费、范围变更、无法解决的冲突）会路由给 GOD，由它在自己的 Claude Code 会话中原生呈现给人类——没有独立的审批队列。工具权限提示就是 HITL 门禁，可以通过手机上的 `/remote-control` 远程审批。
4. **记忆：Markdown 优先。**每 Agent 的 `memory.md` 加共享黑板；关键词召回不足时使用 SQLite FTS 索引。在 5–15 个 Agent 的规模下不需要重量级向量层（Letta/Mem0/Zep），在架构上也不适合这里（它们希望接管 Agent 运行时，而我们的运行时是 `claude` CLI）。未来可选升级：**通过 MCP 使用 MemPalace**（先验证其检索能力——独立审计认为其公开基准被夸大）。
5. **自主循环 = `Stop` Hook。**Agent 完成任务后，通过返回 `{"decision":"block","reason":…}` 的 `Stop` Hook 清空收件箱并继续工作，同时由 `stop_hook_active` 防止无限循环。

---

## 3. 磁盘布局——“蜂巢”

位于 `<harnessHome>/hive/` 下，是一个只由主进程提交的 git 仓库。

```
hive/
  PROTOCOL.md            # the agent-facing contract (how to remember + message)
  registry.json          # roster: every agent, role, capabilities, status, seat
  board.md               # shared blackboard / co-authored plans
  tasks.json             # task ledger (id, assignee, spec, status, result ref)
  log.jsonl              # append-only event feed (drives the UI activity stream)
  agents/<agentId>/
    identity.md          # who am I, my role, my capabilities  (read at start)
    memory.md            # my long-term memory  (I read at start, append as I learn)
    inbox/               # messages delivered TO me — <ts>-<msgid>.json
    inbox/.done/         # processed messages (kept for audit, not deleted)
    outbox/              # messages I want to SEND — router drains these
    cursor.json          # { lastProcessed: <msgid> }  — avoids reprocessing
```

使其稳健的设计规则：
- **每条消息一个 JSON 文件**，通过临时文件 + 原子 `rename` 写入；绝不使用共同编辑的共享邮箱文件（它们会在 git 中冲突）。
- **只追加写入** `log.jsonl`；消费者跟踪自己的游标。
- `board.md` 是唯一真正共同编辑的文件——交给 GOD Agent（单一记录者）处理，以避免冲突。

---

## 4. 消息结构（FIPA-lite）

借用 FIPA-ACL/KQML 中唯一有用的概念——**言语行为（speech act）**——去掉 LISP 语法。包含七个语义字段：

```jsonc
{
  "id":            "2026-05-30T14-03-11-123Z-a1b2",  // unique, time-sortable
  "conversation":  "conv-7f3",                        // groups a thread
  "in_reply_to":   "<prev msgid> | null",
  "from":          "agent.researcher",
  "to":            "agent.coder | god | broadcast",
  "act":           "request | inform | propose | query | agree | refuse | done",
  "subject":       "short human-readable summary",
  "body":          "free text / markdown / structured payload",
  "hops":          3,            // ++ per reply; capped to kill ping-pong loops
  "requires_reply": true,        // only request/query/propose obligate a reply
  "needs_human":   false,        // router/god may flip this to escalate
  "created_at":    "ISO-8601"
}
```

防活锁规则：只有 `request` / `query` / `propose` 要求回复（纯 `inform` / `done` 是终止消息）；每次回复都会增加 `hops`；超过跳数上限后由 GOD Agent 升级处理，而不是让两个 Agent 无限循环；再次看到已处理的 `id` 时不做任何操作（通过游标实现幂等）。

---

## 5. 控制流

```
agent B mid-task needs something from agent C
        │ writes  agents/B/outbox/<msg>.json   (act:request, to:C)
        ▼
┌─────────────────────── main process (the harness) ───────────────────────┐
│  Router watches every outbox/                                             │
│    → deliver to agents/C/inbox/   (to:"human" → routed to the god proxy;  │
│       the god surfaces critical calls natively in its own session)        │
│    → append to log.jsonl → git commit (single committer, retry+backoff)   │
└──────────────────────────────────────────────────────────────────────────┘
        │ delivered to C's inbox
        ▼
agent C finishes its current turn → Stop hook fires
        │ hook POSTs to the hive socket; main process checks C's inbox
        │ unread messages?  → reply {"decision":"block","reason": <messages>}
        ▼
agent C keeps working: reads the messages, acts, replies via its own outbox
```

同一个 Hook 套接字也驱动头像：`PreToolUse` / `PostToolUse` 的 payload 会把 Agent 移动到正确工位（替代当前的 `mockEvents.ts` / PTY 抓取）。

---

## 6. GOD Agent（编排器）

一个固定且始终在线的 Agent，坐在 `desk-ceo`（Michael 的房间），`character:
michael`，标记为 `isGod`。它是普通的 `claude` 进程——负责*智能*；主进程负责*机制*（git、套接字、路由）。它拥有：

- **列表与路由**（`registry.json`）：有哪些 Agent、它们的能力和状态。
- **裁决**：读取每个出站请求；自行解决常规请求（回答澄清、用自包含的任务规格路由给正确专家），只升级关键请求。这就是“GOD 模式”。
- **黑板记录者**：`board.md` 的唯一写入者，确保共享计划不会冲突。
- **任务账本**（`tasks.json`）：分配、跟踪、重试和检查点。

它的升级策略（什么算“关键”）位于系统提示词中，是主要控制面——调提示词，不要改代码。

---

## 7. 分阶段计划

- **阶段 0——基础** ✅：`hive.ts` 磁盘层 + 启动注入
  （identity、protocol、env）+ 用于读取蜂巢状态的 IPC。Agent 已了解蜂巢：任务开始时读取自己的记忆/收件箱，通过 outbox 发送；路由器负责投递；一切内容都会被提交并可见。
- **阶段 1——自主运行** ✅：`hooks.ts` UDS 服务器 + `cth-hook` shim（通过 `--settings` 为每个 Agent 挂载）+ `Stop` 循环，让 Agent 自动清空收件箱并持续运行（由 `stop_hook_active` + 游标保护）；Hook 事件流向 Renderer 以驱动头像。
- **阶段 2——GOD 模式** ✅：GOD Agent 自动启动在 Michael 的房间（保留 `desk-ceo`），新启动时会尽力带 `/remote-control` 和引导提示词开始管理办公区。路由器将 `to:"human"` 流量路由给 GOD（人类的代理）；没有独立审批队列——人工介入原生存在于每个 Agent 的 Claude Code 会话中（权限提示可通过手机远程审批）。持有未读收件箱消息的空闲 Agent 会被唤醒。
- **阶段 3——语义记忆** ✅（CLI 集成）：`memory.ts` 封装 **MemPalace CLI**（根据决策，不使用 MCP）。工作台在 `harnessHome` 下维护一个共享宫殿，将每个 Agent 的 `MEMPALACE_PALACE_PATH` 指向它，把每个 Agent 的 `memory.md` 按自己的区域挖掘进去（由 mtime 控制），Agent 通过 `mempalace search` / `wake-up` 召回。检测并降级：未安装 `mempalace` 时为空操作（Markdown 记忆仍可用）。默认模型为 `minilm`（轻量，适合低内存 Mac）；`embeddinggemma` 是多语言可选项。`MemoryPanel` 允许人类搜索同一座宫殿。
  - *仍待完成*：通过反思/摘要限制 `memory.md` 的增长；需要实际安装 `mempalace` 才能端到端验证检索。

---

## 8. 主要风险与缓解措施

| 风险 | 缓解措施 |
| --- | --- |
| `index.lock` 损坏 | 单一提交者（主进程）、重试+退避、清理过期锁 |
| Stop Hook 无限循环 | 通过 `stop_hook_active` 保护；限制 `hops`；使用 `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` |
| 两个 Agent 互相乒乓 | 只有 request/query/propose 要求回复；超过跳数上限后由 GOD 升级 |
| 重复处理消息 | 每个 Agent 使用 `cursor.json`；已处理消息移动到 `inbox/.done/` |
| `memory.md` 无限制增长 | 阶段 3 的反思/摘要 |
| Hook 修改用户仓库 | 将 Hook 写入 `<cwd>/.claude/settings.local.json`（遵循 gitignore 约定） |

---

## 9. 参考资料

- Anthropic——*Building a multi-agent research system*（主 Agent/子 Agent、计划到记忆）。
- LangGraph supervisor（结构化路由 + 交接注册表 + 检查点）。
- FIPA-ACL / KQML（言语行为）。
- Stanford *Generative Agents*（记忆流、反思、2D 世界）。
- Claude Code Hook 参考（`Stop`、`PreToolUse`、`UserPromptSubmit`；`stop_hook_active`）。
