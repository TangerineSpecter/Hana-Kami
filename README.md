<div align="center">

<img src="./docs/logo.png" alt="Hana-Kami——让你的克隆体组成事务所的 Agent 工作台" width="180">

# Hana-Kami

### 让你的克隆体组成事务所的 Agent 工作台

<p>
  <a href="https://trendshift.io/repositories/46562" target="_blank" rel="noopener noreferrer"><img alt="GitHub Trending — #1 Repository of the Day" src="./docs/badge-github-trending.png" width="250" height="54"></a>
  <a href="https://www.producthunt.com/products/hanakami?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-hanakami" target="_blank" rel="noopener noreferrer"><img alt="Hana-Kami — #5 Product of the Day on Product Hunt" src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1221363&theme=light&period=daily" width="250" height="54"></a>
</p>

<img src="./docs/media/floor.png" alt="Hana-Kami 事务所办公区：Agent 在工位上并行工作，右侧是指挥中心和实时 Agent 终端" width="1240">

**免费、开源且高性能**——一个多 Agent 工作台，使用你已经订阅的服务及其每小时额度。它会把你已经在使用的终端编码 CLI 变成一个你的克隆体：即使你离开，它仍会继续工作，并在你的机器上协调整个 Agent 事务所。

支持 [Claude Code](https://claude.com/claude-code)、Antigravity（Gemini）、OpenAI Codex、
**xAI Grok**、**Kimi Code**、**Gemini CLI**、**Qwen**、**OpenCode**、**Crush**、
**pi.dev**、**GitHub Copilot CLI** 和 **Cursor**，也支持自带密钥与本地 LLM。Agent 可以互发消息、路由任务并记忆上下文，由**你的克隆体**（Michael）协调，并以头像形式呈现在共享办公区中。

<p>
  <em>Electron · React · TypeScript · Pixi.js · xterm.js · node-pty</em>
</p>

<p>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="./CHANGELOG.md"><img alt="Version: 0.4.6" src="https://img.shields.io/badge/version-0.4.6-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="https://github.com/TangerineSpecter/Hana-Kami/releases"><img alt="Downloads across all releases" src="https://img.shields.io/github/downloads/TangerineSpecter/Hana-Kami/total?style=flat-square&label=downloads&color=F4D35E&labelColor=6E1423"></a>
  <img alt="状态：预发布" src="https://img.shields.io/badge/status-pre--release-F4F1EA.svg?style=flat-square&labelColor=6E1423">
  <img alt="平台：macOS | Windows | Linux" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-F4F1EA.svg?style=flat-square&labelColor=6E1423">
  <a href="./CONTRIBUTING.md"><img alt="欢迎提交 PR" src="https://img.shields.io/badge/PRs-welcome-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="https://munderdiffl.in/blog/"><img alt="Blog" src="https://img.shields.io/badge/blog-guides%20%26%20postmortems-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="https://discord.gg/SEDzP5ZPk5"><img alt="Discord" src="https://img.shields.io/badge/Discord-join%20the%20office-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
</p>

<br>

<!-- Inline 播放器会在 github.com 上渲染（需要 raw URL；相对路径只能创建链接）。 -->
<video src="https://github.com/TangerineSpecter/Hana-Kami/raw/main/docs/media/hero.mp4" controls muted loop playsinline width="820">
  <a href="https://github.com/TangerineSpecter/Hana-Kami/raw/main/docs/media/hero.mp4">▶ 查看办公区——Hana-Kami 正在运行一群 Claude Code Agent</a>
</video>

<br><br>

**[⬇ 下载 macOS、Windows 或 Linux 版本](https://github.com/TangerineSpecter/Hana-Kami/releases/latest)**

<sub>macOS 构建已签名并完成公证。使用它不需要从源码构建。</sub>

</div>

---

> [!NOTE]
> **全世界最好的 Agent，全世界最糟糕的纸业公司。**
> Hana-Kami 把你已经在使用的终端 Agent CLI——`claude`、`agy`、`codex`、`grok`、
> `kimi`、`qwen`、`opencode`、`crush`、`pi` 和 `copilot`——变成一支可以自我协作的团队：每个 Agent 都拥有长期记忆、邮箱和 2D 办公区中的工位；**你的克隆体**（Michael）会在你旁观时为它们路由工作。他是办公区的老板，而你仍然是他的老板。

## 目录

- [支持的 Agent](#支持的-agent)
- [项目是什么](#项目是什么)
- [工作方式](#工作方式)
- [功能](#功能)
- [快速开始](#快速开始)
- [架构与项目结构](./docs/ARCHITECTURE.md)
- [路线图](#路线图)
- [参与贡献](#参与贡献)
- [遥测](#遥测)
- [许可证](#许可证)
- [致谢](#致谢)

## 支持的 Agent

**带上你已经付费使用的 CLI。** 这些 CLI 都会以真实进程运行在独立终端中，使用你现有的订阅和每小时额度。只要能在终端运行，就能在这里运行。

<p>
  <a href="https://docs.claude.com/en/docs/claude-code"><kbd>Claude Code</kbd></a>
  <a href="https://github.com/openai/codex"><kbd>Codex · GPT</kbd></a>
  <a href="https://x.ai/cli"><kbd>Grok · xAI</kbd></a>
  <a href="https://www.kimi.com/code"><kbd>Kimi Code</kbd></a>
  <a href="https://github.com/google-gemini/gemini-cli"><kbd>Gemini CLI</kbd></a>
  <a href="https://antigravity.google/docs/cli-overview"><kbd>Antigravity · Gemini</kbd></a>
  <a href="https://github.com/QwenLM/qwen-code"><kbd>Qwen</kbd></a>
  <a href="https://opencode.ai/docs"><kbd>OpenCode</kbd></a>
  <a href="https://github.com/charmbracelet/crush"><kbd>Crush · Charm</kbd></a>
  <a href="https://pi.dev/docs/latest"><kbd>Pi</kbd></a>
  <a href="https://docs.github.com/copilot/concepts/agents/about-copilot-cli"><kbd>GitHub Copilot</kbd></a>
  <a href="https://cursor.com/docs/cli/install"><kbd>Cursor</kbd></a>
  <kbd>+ 任意自定义命令</kbd>
</p>

此外还可以通过 Ollama、LM Studio 或 vLLM 使用**自带密钥**和**本地模型**。

## 项目是什么

Hana-Kami 是一款桌面应用，把**真实的终端 Agent CLI**包装成能力完整的 Agent，接入一个**蜂巢式协作网络**，并交由**你的克隆体**Michael 负责——你只需要和他沟通来推动工作。底层运行着**世界上最快的记忆层**，让每个 Agent 都能记住学到的内容并即时召回。

- **每个终端都是一个 Agent。** 每个 `claude`、`agy`、`codex`、`grok`、`kimi`、`qwen`、`opencode`、`crush`、`pi`、`copilot` 或自定义会话，都会在伪终端（`node-pty`）中作为真实进程运行，并由 xterm.js 原样渲染。
- **每个 Agent 都是一个头像。** 会话会以角色形式出现在 Pixi.js 办公区中，工作时走向不同工位，互发消息时信封会在桌子之间飞过。
- **蜂巢负责协调它们。** Agent 读取自己的记忆并清空邮箱；路由器在收件箱之间转发消息；GOD Agent 负责裁决和分派，只在需要你介入时升级。
- **即时记忆。** 以 Markdown 为核心、带语义召回索引的记忆层，让 Agent 跨会话记忆，并在毫秒级完成召回。

## 工作方式

```
            you ── talk to ──►  ┌─────────────┐
                                │  GOD agent  │  orchestrator / supervisor
                                │ (Michael's  │  roster · routing · adjudication
                                │   office)   │  blackboard · task ledger
                                └──────┬──────┘
                                       │ assigns · routes · escalates
              ┌────────────────────────┼────────────────────────┐
              ▼                         ▼                         ▼
        ┌───────────┐            ┌───────────┐            ┌───────────┐
        │  agent A  │  message   │  agent B  │  message   │  agent C  │
        │ provider  │ ─────────► │ provider  │ ─────────► │ provider  │
        │  + memory │            │  + memory │            │  + memory │
        └───────────┘            └───────────┘            └───────────┘
              └──────── shared hive: memory · mailbox · blackboard · log ───────┘
```

1. **你启动 Agent**——每个 Agent 都是一个普通的终端进程（`claude`、`agy`、`codex` 或自定义命令），拥有自己的工作目录、身份和提供商特定的生命周期。
2. **Agent 通过蜂巢协作**——蜂巢是一个由普通文件组成的本地 git 仓库。Agent 写入自己的 `outbox/`；工作台的路由器把消息送入收件人的 `inbox/`。Agent 永远不直接操作 git（单一提交者设计避免 `index.lock` 损坏）。
3. **GOD Agent 管理办公区**——它读取每个请求，自行处理常规请求（让系统保持完全自主），只有把*关键*事项（花费、破坏性操作、范围变更）放入你可以处理的审批队列。
4. **一切可见**——你可以看到头像移动、信封飞行和实时终端流；也可以向任意会话输入内容、浏览文件并查看 git 历史。

完整的多 Agent 设计见 [`HIVE.md`](./HIVE.md)，终端/事件平面见 [`SPEC.md`](./SPEC.md)，视觉系统见 [`DESIGN.md`](./DESIGN.md)。

## 功能

<table>
<tr>
<td width="50%" valign="middle">

### 和一个 Agent 沟通，而不是十二个

Michael 是你的克隆体，也是你唯一需要交代工作的 Agent。他负责分派工作、路由消息，并只把真正需要你处理的少数事项升级给你。

</td>
<td width="50%">
  <a href="https://github.com/TangerineSpecter/Hana-Kami/raw/main/docs/media/demo/orchestrator.mp4"><img src="./docs/media/demo/orchestrator-poster.jpg" alt="在指挥中心向编排 Agent Michael 交代任务" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 几次点击就能招募 Agent

选择 CLI、模型和自主程度，为它安排一个工位，它就会开始工作。如果不想从零开始，可以从 [Agent Gallery](https://munderdiffl.in/hires/) 导入现成角色。

</td>
<td width="50%">
  <img src="./docs/screenshots/add-agent.png" alt="添加 Agent 对话框：选择提供商、模型和角色" width="100%">
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 能跨会话保留的记忆

每个 Agent 都会保留 Markdown 记忆，并将其挖掘到一个共享、可搜索的记忆宫殿中。今天关闭应用，明天回来时，它们仍然知道自己学到过什么。

</td>
<td width="50%">
  <img src="./docs/screenshots/memory.png" alt="跨所有 Agent 搜索共享记忆宫殿" width="100%">
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 带缰绳的自主性

设置每个 Agent 可以自主推进到什么程度。花费、范围和破坏性操作会回到你这里；遇到循环或失控行为时，断路器会依次引导、约束并停止它。

</td>
<td width="50%">
  <img src="./docs/screenshots/autonomy.png" alt="每个 Agent 的自主性和审批设置" width="100%">
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 观察整个办公区运转

Agent 工作时会走向不同工位，互发消息时信封会在桌子之间飞过。点击任意工位即可实时查看对应终端，也可以直接在其中输入。

</td>
<td width="50%">
  <a href="https://github.com/TangerineSpecter/Hana-Kami/raw/main/docs/media/demo/agents.mp4"><img src="./docs/media/demo/agents-poster.jpg" alt="Agent 在办公区并行工作" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 一次设置即可

引导向导会检查你已有的环境，并主动安装缺失内容，而不是把你丢到文档页面。

</td>
<td width="50%">
  <a href="https://github.com/TangerineSpecter/Hana-Kami/raw/main/docs/media/demo/setup.mp4"><img src="./docs/media/demo/setup-poster.jpg" alt="首次运行设置向导" width="100%"></a>
</td>
</tr>
</table>

**办公区**
- **每个终端都是真实 Agent。** Claude Code、Antigravity（Gemini）、OpenAI Codex、xAI Grok、Kimi Code、Gemini CLI、Qwen、OpenCode、Crush、pi.dev、GitHub Copilot CLI、Cursor 或自定义命令——每个都运行在自己的 `node-pty` PTY 中，并由 xterm.js 渲染。
- **每个 Agent 都是一个头像。** Pixi.js 办公区会让 Agent 走向工位、让信封在桌子之间飞行，头像状态反映真实工作。
- **与你沟通的 GOD 编排 Agent。** 它路由任务、裁决消息，只把需要人类处理的内容升级给你。也可以按下 **Talk**，用语音管理办公区。
- **每个 Agent 独立的 git worktree。** 可选隔离功能，让并行 Agent 不会在分支上互相冲突。

**记忆与协作**
- **蜂巢**——每个 Agent 的记忆、原子文件邮箱、共享黑板、只追加事件日志，以及单一提交者 git。
- **语义召回**——把 Markdown 记忆挖掘到共享宫殿中，可从界面搜索，并通过压缩避免无限增长。
- **企业知识图谱**——把你自己的文档和政策交给任意 Agent 查询。

**控制与安全**
- **人工门禁**——花费、范围和破坏性操作会升级给你。你可以在运行中引导，也可以优雅地停止。
- **断路器**——针对循环、错误风暴或超出预算的 Agent，依次执行引导 → 约束 → 停止。
- **预算与遥测**——每个 Agent 的 token 预算、根据转录统计的真实成本、持久化账本、OTel span 和工具瀑布图。

**指挥中心**
- 带依赖关系的看板任务、定时任务与心跳、实时 Agent 集群监控、记忆搜索、活动日志和 CI 观察器。
- **技能**——Claude Code、OpenCode 和 Codex 中每个 Agent 已经可以执行的技能，以及可搜索、筛选、安装和卸载的 227 多项技能目录。
- **内置 Monaco IDE**——文件树、编辑器标签页、保存功能，以及带提交图、差异、分支比较和受保护 checkout 的 CHANGES · HISTORY · COMPARE git 轨道。所有 fs/git 访问都由主进程代理。

**接入与输出工作**
- **Slack 与 Webhook**——向频道发送消息或 POST webhook；Michael 可以启动临时 Worker、在线程中回复并安全销毁它。
- **可分享的招募配置 + Agent Gallery**——从 `hanakami://hire` 链接导入角色；导入只会预填表单，仍需人工启动。可在 [Agent Gallery](https://munderdiffl.in/hires/) 浏览角色。
- **BYOK 密钥 + 本地 LLM**——每个提供商的密钥都放在只写密钥代理中，同时支持 Ollama / LM Studio / vLLM 基础 URL。指南：[开放模型](https://munderdiffl.in/blog/run-munder-difflin-on-open-models/) · [Mac Mini](https://munderdiffl.in/blog/run-munder-difflin-on-a-mac-mini/)。
- **一键更新**：标题栏徽章会执行真实更新，为你的机器下载构建，然后重启并安装；检查确认已是最新版本后会读取 `latest`。当更新器无法自行下载时，会回退到手动下载。更新后的首次启动会打开该版本的设计化发布说明页面，而不是只显示版本号。
- **你的语言**：支持英语、简体中文和阿拉伯语，阿拉伯语支持从右到左布局。新安装默认使用简体中文，已保存的选择优先；应用不会读取操作系统语言区域。三种应用字体都随安装包提供，启动时无需下载。
- **前置条件**——设置中有一个页面展示你是否具备 uv、git、Node、MemPalace 及各 Agent CLI 等支持工具、每个工具的用途，并提供让 Michael 安装缺失工具的按钮。

> [!NOTE]
> **状态：v0.4.6，这是应用不再假设所有人都从左到右阅读英语的版本。**
> 现在界面支持简体中文和阿拉伯语，并支持从右到左布局。英语仍是默认语言，只有在设置的“通用”中选择语言后才会改变；应用从不读取操作系统语言区域。三种应用字体都随安装包提供，不再从 Google 加载；Google 在中国大陆受阻，而这正好会让中文翻译面向的用户遇到界面故障。输入法候选词仍在组合时，按 Enter 不再触发发送、搜索或重命名。
> 所有字符串都已翻译，不会回退到英语，终端也支持从右到左。部分页面仍需要镜像内边距和图标，这是下一步工作。目前还没有阿拉伯语读者审阅措辞。
> 本版本还包括：更新徽章执行真实下载和重启，而不是交给你一个磁盘映像；更新检查不再无限旋转；设置通过一个保存按钮持久化；模型列表移入已纳入版本控制的目录；ASK ME 卡片支持渲染 Markdown。
> 在安全方面：Agent 启动的 CLI 名称会在根据 PATH 解析之前完成校验；自动模式下操作系统沙箱保持启用；分析功能不再发送 IP 和推导出的地理位置。遥测现在只统计你向 Agent 发送的消息数量，不会以任何形式发送正文的文本、长度或哈希。
> 本版本合并了 13 位贡献者提交的 16 个社区 Pull Request，其中 #213 是重新实现而不是直接合并。
> **如果你仍在使用 0.3.8，请更新：**该版本的使用额度保护机制从未释放它持有的 Agent，现已完全移除。
> macOS（已签名并公证）、Windows 和 Linux 构建位于[发布页面](https://github.com/TangerineSpecter/Hana-Kami/releases/latest)。

<div align="right">(<a href="#hanakami">↑ 返回顶部</a>)</div>

## 快速开始

### 下载应用

**大多数人应该选择这个版本。** 已签名并公证的 macOS 构建，以及 Windows 和 Linux 构建，都在[最新发布版本](https://github.com/TangerineSpecter/Hana-Kami/releases/latest)中。安装并打开后，向导会带你完成剩余步骤。不需要 Node、工具链或本仓库。

你的机器上仍需要至少一个 Agent CLI；应用可以通过**设置 → 前置条件**为你安装缺失的 CLI。

### 从源码构建

下面的内容面向贡献者，以及希望运行未发布构建的人。

### 前置条件

- **macOS、Windows 或 Linux**。
- **Node.js 18+** 和 npm。
- 用于构建 `node-pty` 原生插件的 **C/C++ 工具链**——macOS 请安装 Xcode Command Line Tools：
  ```bash
  xcode-select --install
  ```
- `PATH` 中至少有一个受支持的 Agent CLI——**[Claude Code](https://claude.com/claude-code)**
  （`claude`，默认），**Antigravity**（`agy`）、**OpenAI Codex**（`codex`）、**xAI Grok**（`grok`）、
  **Kimi Code**（`kimi`）、**Gemini CLI**（`gemini`）、**Qwen**（`qwen`）、**OpenCode**（`opencode`）、
  **Crush**（`crush`）、**pi.dev**（`pi`）、**GitHub Copilot**（`copilot`）或 **Cursor**（`cursor-agent`）。
  大多数缺失的 CLI 会自动修复：工作台在终端中运行安装器，然后继续使用新二进制文件。
- *可选：* 在**设置 → AI 引擎**中配置**自己的 API 密钥和本地 LLM**（Ollama / LM Studio / vLLM）。
- *可选：* 用于即时跨会话召回的语义记忆索引——没有它，Markdown 记忆仍然可以工作。

### 安装并运行

```bash
git clone https://github.com/TangerineSpecter/Hana-Kami.git
cd hanakami
npm install        # postinstall rebuilds node-pty against Electron's ABI
npm run dev        # launches the Electron app with hot reload
```

首次启动时会经过引导向导，然后进入办公区。使用**添加 Agent**启动第一个会话——GOD Agent 会自动坐进 Michael 的办公室。

### 其他脚本

```bash
npm run build      # production build via electron-vite
npm run preview    # preview the production build
npm run typecheck  # type-check the node (main/preload) and web (renderer) projects
```

> 如果 Electron 升级后 `node-pty` 加载失败，请重新运行 `npm install`（`postinstall` hook 会针对当前 Electron ABI 运行 `electron-rebuild`）。

## 架构

两个数据平面共同为一个 Renderer 提供数据：**终端平面**负责 PTY、文件系统和 git；**事件平面**运行蜂巢、Hook 服务器和路由器。Renderer 只通过带类型的桥接层与两者通信。

**完整图表、逐模块项目结构和设计系统位于 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。**这些内容已从本文件移出，让本文件可以介绍产品而不是代码库。多 Agent 设计见 [`HIVE.md`](./HIVE.md)，终端与事件平面见 [`SPEC.md`](./SPEC.md)，视觉系统见 [`DESIGN.md`](./DESIGN.md)。

<div align="right">(<a href="#hanakami">↑ 返回顶部</a>)</div>

## 路线图

**v0.4.6** 已交付：支持从右到左布局和自托管字体的简体中文与阿拉伯语界面；支持 BYOK 密钥和本地 LLM 的十二种 Agent 引擎；语音编排；蜂巢（记忆 · 邮箱 · 黑板 · 事件日志）；带看板和工作日计划的指挥中心；带 git 轨道的内置 Monaco IDE；集成目录与密钥代理；由 Slack 启动的 Worker；可分享的招募配置和 Agent Gallery；可观测性与断路器；持久化存储；会话恢复；多窗口办公区；一键更新；技能浏览器；实时前置条件检查；根据账本统计的成本；在 Apple Silicon 上可用的语义记忆；以及会真正安装构建而不是只指向构建的更新器。完整历史见 [`CHANGELOG.md`](./CHANGELOG.md)。

下一步：

- [ ] **更多聊天集成**——支持 Telegram 和更丰富的聊天桥接，把频道接入 Michael 的队列并将回复路由回去。
- [ ] **更多引擎与集成模板**——继续扩充引擎列表和集成目录。
- [ ] **更完整的头像状态**——完全通过真实 Hook 事件驱动剩余的工位访问和工具气泡。
- [ ] **持久化布局与命令历史**——为 Agent 布局和每个会话的历史扩展持久化。

<div align="right">(<a href="#hanakami">↑ 返回顶部</a>)</div>

## 参与贡献

欢迎贡献——这是一个功能面较广的预发布软件。请从 [`CONTRIBUTING.md`](./CONTRIBUTING.md) 开始。简要来说：Fork 项目，运行 `npm install && npm run dev`，保持 `npm run typecheck` 通过，并且**所有新 UI 都要基于 [`DESIGN.md`](./DESIGN.md) 中的设计 token**。适合入门的方向包括接入真实 Hook 事件、添加 Agent 流程、配置抽屉和跨平台工作。

> [!IMPORTANT]
> **每个 Pull Request 都必须展示修改前和修改后**——静态内容使用截图，有动态内容使用录屏，并放在 PR 模板的 `### Before` 和 `### After` 标题下。系统会自动检查，缺少这些内容的 PR 无法合并。“我的改动没有 UI”不构成例外，只是证据形式不同。见[必须提供证据](./CONTRIBUTING.md#必须提供证据)。

有问题、发现 Bug，或者想展示你的事务所？加入 Discord：**<https://discord.gg/SEDzP5ZPk5>**。在 PR 中添加你的 Discord 用户名，合并后即可获得 `employee of the month` 角色。

**想找个切入点？** [`good first issue`](https://github.com/TangerineSpecter/Hana-Kami/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 列表会持续提供小型、独立且目标明确的任务。

**所有代码进入 Hana-Kami 的人都会列在 [`CONTRIBUTORS.md`](./CONTRIBUTORS.md) 中。**如果你也在其中，可以分享这份记录。名单直接从 Pull Request 生成并自动更新，因此无需申请就会出现。它也会记录已经进入 `main`、但 GitHub 显示为已关闭而非已合并的贡献，因为这是我们的记录错误，不应由贡献者解释。

<a href="./CONTRIBUTORS.md">
  <img src="https://contrib.rocks/image?repo=TangerineSpecter/Hana-Kami" alt="Hana-Kami 贡献者">
</a>

## 遥测

官方构建会发送**少量匿名使用事件**（应用打开、Agent 启动、功能使用），绝不发送提示词、代码、文件路径或 Agent 输出。完整事件列表、匿名保证以及三种退出方式（设置开关、`DO_NOT_TRACK` 或从源码构建——Fork 构建不会包含密钥，也不会发送任何内容）记录在 [`TELEMETRY.md`](./TELEMETRY.md) 中。

## 许可证

> [!IMPORTANT]
> **素材许可。**内置像素艺术（图块集和地图）是 [LimeZu](https://limezu.itch.io/moderninteriors) 的 **Modern Interiors - RPG Tileset [16X16]**，依据 **Complete Version licence** 使用，该许可允许在商业和非商业项目中编辑和使用。**该许可要求保留对 LimeZu 的署名**。Office 角色不是 LimeZu 的艺术素材，而是在 `portraitArt.ts` 中通过程序绘制。见 [`src/renderer/src/assets/ATTRIBUTION.md`](./src/renderer/src/assets/ATTRIBUTION.md)。

**源代码**依据 **MIT License** 授权——见 [`LICENSE`](./LICENSE)。MIT 授权只覆盖代码；内置像素艺术由 LimeZu 单独授权，并在 [`LICENSE-ASSETS`](./LICENSE-ASSETS) 中单独列出。*Hana-Kami* 是善意戏仿，与 NBC 的 *The Office* 或 Dunder Mifflin 无关联。

## 致谢

- 感谢 [LimeZu](https://limezu.itch.io/) 提供 *Modern Interiors* 像素艺术图块集（Complete Version licence）。
- 感谢 [`shahar061/the-office`](https://github.com/shahar061/the-office) 提供办公区图块集和地图。
- 感谢 [Pixi.js](https://pixijs.com/) · [xterm.js](https://xtermjs.org/) · [node-pty](https://github.com/microsoft/node-pty) · [electron-vite](https://electron-vite.org/) · [CodeMirror](https://codemirror.net/)，本项目基于这些库构建。
- 感谢 [Remotion](https://www.remotion.dev/) 提供着陆页的“工作方式”动画片段（`landing-remotion/`）。
- 感谢美版 *The Office* 带来 Hana-Kami, Inc.
