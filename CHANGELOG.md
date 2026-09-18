# 更新日志

本项目的所有重要变更都记录在这里。格式基于
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，本项目遵循
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 新增

- **任务现在显示任务 ID。**用户实际用来称呼卡片的标识——`bmt-12`——之前完全没有显示：看板卡片只显示标题和负责人，后面的详情视图也没有。现在它会显示在卡片标题上方，也会显示在详情视图的事实行中，使用与负责人相同的低调墨色等宽字体。每个 ID 都会显示，包括卡片没有 ID 时生成的 `t-xxxx` 合成后备值。
- **模型选择器新增 Fable 5.1、GPT-6 Astra 和 Gemini 3.7 Flash。**Claude Code 使用 `claude-fable-5-1`，Codex 使用 `gpt-6-astra`，Antigravity 在三个推理级别中都提供 Gemini 3.7 Flash；Cursor 使用它所携带的两个模型的独立构建版本。每个 ID 都直接读取自实际要调用的 CLI——`codex-rs/models-manager/models.json`、`agy models`、`cursor-agent models` 和已安装的 `claude` 二进制，而不是根据名称猜测。
  **GPT-6 Astra 需要 Codex 0.153.1 或更高版本。**该 slug 在这个版本中才加入，因此机器上的旧版 `codex` 会在 Agent 启动时拒绝它；请先更新 Codex。目录中的版本范围针对应用本身，而不是它要启动的 CLI，因此这是前置条件，选择器无法替你隐藏这个问题。
- **新增模型不再需要发布新版本。**模型选择器现在会读取
  [`docs/model-catalog.json`](docs/model-catalog.json) 的 `main` 分支，在运行时获取并缓存
  六小时，因此在 GitHub 上添加模型只需修改一个文件中的一行，而不需要构建。检查在启动时运行，而不是定时运行：安装后的应用会在下一次启动、且缓存副本已超过六小时时获取新模型；已经打开的应用不会在使用过程中自行改变。
  构建时编译进去的目录仍然是最低保障：离线、首次启动，以及远程副本缺失、无法读取或声明了本构建不认识的 schema 时，都使用它。远程副本中存在的提供商会替换该提供商的列表；远程副本没有提到的提供商则保留内置列表，因此错误编辑最多损失一个列表，而不会损坏整个选择器。载荷始终是数据而不是标记；模型 ID 在到达启动命令行的 `--model` 参数前会限制长度并移除控制字符。设置页主卡片也使用相同机制。

## [0.4.6] — 2026-08-27

**这是一个会说你的语言、也会自我更新的版本。**界面支持中文和阿拉伯语，自动更新器可以端到端下载并安装新构建，字体随应用一起发布，因此网络受限时也不会只显示空白窗口；Agent 引擎的启动方式也经过加固。

### 新增

- **界面支持中文和阿拉伯语。**所有字符串都已翻译（不会回退到英文），终端在阿拉伯语环境下从右向左显示。物理方向检查——部分屏幕上的 padding 和图标仍然沿用了错误的镜像方向——已记录为下一项工作。
- **`message_sent` 遥测。**通过统计用户发送给 Agent 的消息数量，一个匿名事件补齐了激活漏斗；只记录数量，不记录任何其他内容：没有文本、长度或任何形式的消息内容。只在提交时计数，从不按击键计数，并受现有所有退出设置抑制。[`TELEMETRY.md`](TELEMETRY.md) 与其他事件一样列出了它。
- **ASK ME 卡片现在渲染 Markdown。**此前卡片直接打印原始文本，问题会带着星号和反引号出现在屏幕上。现在它与文件预览使用同样的渲染方式：强调、列表、`code`、表格，以及在浏览器打开而不是跳转应用的链接。任务详情中的问答轨迹也会渲染，答案同样包含在内。单个换行仍然表示换行，因此纯文本问题的视觉效果与以前完全一致。原始 HTML 仍以文本显示而不会被解析，这保证了 Agent 编写的 Markdown 可以安全展示。
- **系统会要求 Agent 格式化它们向你提出的问题。**编排器提示词和 `PROTOCOL.md` 现在要求使用加粗的引导行、用反引号包裹路径和命令，并在问题有多个选项时使用列表。

### 修复

- **自动更新器现在可以端到端安装新构建。**标题栏徽章会自行从检查中变为可用、下载中、已下载，最后的操作会重启进入新版本。本次发布验证了这条路径——构建自己的更新器只能由下一个版本来验证。
- **字体随应用一起发布。**Renderer 和发布包启动时不再请求 Google Fonts，因此在任何网络环境下都能以同样速度打开，包括 Google 被阻断的网络。发布包也不会再因为样式表加载而白屏：字体已经打包，内容安全策略直接拒绝远程样式表，并由加载器覆盖窗口直到页面绘制完成。
- **Settings 现在只有一个保存按钮。**Connections 标签页不再重复自身；REST API、MCP、Slack 和 webhook 分区各自保持原位。
- **IME 输入不再过早发送。**按 Enter 选择中文或日文候选词时，会选中该词，而不是带着半截文字直接发送消息。

### 安全

- **引擎命令启动已加固。**Agent 要启动的 CLI 名称会在根据 PATH 解析之前进行校验，因此只有普通命令名或绝对路径可以到达 shell。

### 致谢

本次发布合并了来自 13 位贡献者的 16 个社区 Pull Request，其中 #213 是重新实现而不是直接合并：

- [#156](https://github.com/TangerineSpecter/Hana-Kami/pull/156) [@gpechieu](https://github.com/gpechieu)：被拒绝的写入之后，roster 空写入保护仍保持启用
- [#205](https://github.com/TangerineSpecter/Hana-Kami/pull/205) [@Schopenhauer-loves-Hegel](https://github.com/Schopenhauer-loves-Hegel)：react-i18next 多语言 UI 基础，并发布中文翻译
- [#213](https://github.com/TangerineSpecter/Hana-Kami/pull/213) [@abo123v-glitch](https://github.com/abo123v-glitch)：阿拉伯语/RTL 终端渲染方案（本版本重新实现）
- [#225](https://github.com/TangerineSpecter/Hana-Kami/pull/225) [@jhinzzz](https://github.com/jhinzzz)：使用扫描器可以发现 Codex hive 会话
- [#242](https://github.com/TangerineSpecter/Hana-Kami/pull/242) [@raifemre](https://github.com/raifemre)：localStorage roster 后备值限定在写入它的 hive 中
- [#243](https://github.com/TangerineSpecter/Hana-Kami/pull/243) [@L422Y](https://github.com/L422Y)：ASK ME 问题渲染为 Markdown
- [#248](https://github.com/TangerineSpecter/Hana-Kami/pull/248) [@djbiz](https://github.com/djbiz)：无法获取 WebGL 上下文的工作区重建会重试，而不是直接失败
- [#270](https://github.com/TangerineSpecter/Hana-Kami/pull/270) [@BUGHUNTER-SACHIN](https://github.com/BUGHUNTER-SACHIN)：无法投递给 Agent 时不会把 /compact 放入队列
- [#271](https://github.com/TangerineSpecter/Hana-Kami/pull/271) [@HsienW](https://github.com/HsienW)：类型化的 Hook 事件载荷契约
- [#282](https://github.com/TangerineSpecter/Hana-Kami/pull/282) [@savvaskoualis](https://github.com/savvaskoualis)：重命名 GOD 身份后不再回退为 “Michael”
- [#284](https://github.com/TangerineSpecter/Hana-Kami/pull/284) [@HundredBillion](https://github.com/HundredBillion)：Settings 保存按钮移动到模态框页脚
- [#286](https://github.com/TangerineSpecter/Hana-Kami/pull/286) [@HundredBillion](https://github.com/HundredBillion)：每次配置写入都会发出通知，Settings 不再显示旧状态
- [#310](https://github.com/TangerineSpecter/Hana-Kami/pull/310) [@LavaDMan](https://github.com/LavaDMan)：hive-hook-node 测试不再与自身 stdin 写入竞争
- [#317](https://github.com/TangerineSpecter/Hana-Kami/pull/317) [@aaroncoville](https://github.com/aaroncoville)：PTY 退出时会重置用量
- [#323](https://github.com/TangerineSpecter/Hana-Kami/pull/323) [@aaroncoville](https://github.com/aaroncoville)：终端 Renderer 销毁时释放 WebGL 上下文
- [#339](https://github.com/TangerineSpecter/Hana-Kami/pull/339) [@aaroncoville](https://github.com/aaroncoville)：更新模型目录

## [0.4.5] — 2026-08-22

**这是一个修复“你以为可靠、实际上悄悄出错”的版本。**重启后成本报告偏差超过一半，语义记忆在 Apple Silicon 上始终无法工作，Agent 之间也无法可靠通信。这三项都已修复，同时加入工作日调度、终端输出中的可点击路径、统一编辑器，以及 23 个社区 Pull Request。

### 新增

- **触发器支持按工作日调度。**触发器可以在指定工作日的某个时间运行，而不只是按固定间隔运行，并且调度对夏令时安全。
- **终端输出中的每个路径都可点击。**Markdown 打开预览，源文件和配置在 IDE 中打开；图片、压缩包以及我们无法诚实渲染的内容会在 Finder 或 Explorer 中显示，而不是直接打开。路径令牌绝不会交给操作系统的“使用默认应用打开”调用，因此输出中的 `installer.dmg` 不会被变成可执行操作。
- **手动更新点击后下载，**并根据当前平台显示安装步骤。标题栏徽章始终走手动更新路径，自动更新保留在 Settings 中；检查确认已经是最新版本后，徽章显示 `latest`。
- **更新后的首次启动会显示该版本的页面。**
- **Settings 顶部新增主卡片，**显示你的版本、方案以及返回发布说明的入口。
- **1:1 暂停功能**，告诉 Michael 暂时不要干预某个 Agent。
- **Agent 名称可编辑，**Michael 招募 Worker 时可以选择其头像和强调色。
- **Gemini CLI 和 Cursor Agent** 加入引擎列表。
- **可以在专注模式中直接编辑 Agent，**入口就在它的名称旁边。

### 新增

- **`update_applied` 遥测。**应用现在会在自身版本变化后的第一次启动时报告一次：`update_applied { from_version, to_version }`。此前我们唯一无法观察的是自动更新健康状况——版本会原地交付，而唯一证据是恰好在两个版本中都显示事件的安装。事件引入之前的安装，`from_version` 为 `unknown`，因此携带此功能的第一个版本可以被测量，而不会静默一个周期。两个值都是版本字符串；不会收集任何关于你的新信息，继续使用相同的退出设置，且 [`TELEMETRY.md`](TELEMETRY.md) 与其他事件一样列出了它。`via` 属性说明版本是由应用自己的更新器安装（`auto`）、其他方式移动（`manual`），还是没有可读取的更新日志（`unknown`）——它读取应用已经保存的更新日志，因此从早于本版本的版本更新上来也能工作。用户要求重启但随后没有实际安装任何内容时，计为 `manual` 而不是 `auto`，因为日志会标明接下来启动的是哪个构建。

### 修复

- **成本按应用整个生命周期报告，而不是只从上次重启开始。**遥测计数器每次启动都会重置，但会话 ID 保持不变，因此报告的支出下限少了 59%。现在成本从账本汇总，同时旁边保留独立的会话数值。
- **语义记忆在 Apple Silicon 上恢复工作。**CoreML 使量化嵌入图溢出，每个向量都返回 NaN，chroma 拒绝所有 upsert。macOS 上的嵌入现在固定使用 CPU。
- **Agent 间消息传递可靠。**主进程 watchdog 会唤醒停留在未清空收件箱上的空闲 Worker；过期的唤醒不再触发已经清空的收件箱；发往没有收件箱的 ID 的邮件会退回并记录日志，而不是丢弃；每 Agent 的 steer 队列有上限；webhook 分发是原子的；启动时会刷新 `PROTOCOL.md`。
- **更新重启不再卡住**，即使运行中的 Agent 使应用拒绝退出。
- **专注模式可以跨重启保留，**关闭按钮不再把你带回侧边栏，roster 变化时专注终端也会重新适配。
- **终端跟随窗口主题。**运行中的 TUI 会收到主题切换通知，会响应 OSC 颜色查询，Crush 和 OpenCode 启动时也会接收主题。
- **部分 ANSI 转义序列会跨越 pty 分块保留，**而不是被打印成乱码。
- **Windows Agent 进程会在应用退出时一同退出。**
- **拥挤行中的按钮不再覆盖相邻按钮，**侧边栏标题会先隐藏按钮文字，然后才隐藏 Agent 名称。

### 变更

- **统一编辑器。**全屏文件覆盖层已移除。Markdown、源文件和图片都在 IDE 中打开；IDE 的 git 栏现在默认折叠，并带有 git 标记。
- **Renderer 运行在 Chromium 沙箱中。**

### 致谢

这 23 个社区 Pull Request 全部进入了本次发布：

- [#157](https://github.com/TangerineSpecter/Hana-Kami/pull/157) [@gpechieu](https://github.com/gpechieu)：剥离继承到 Agent PTY 环境中的 Claude Code 会话标记
- [#158](https://github.com/TangerineSpecter/Hana-Kami/pull/158) [@gpechieu](https://github.com/gpechieu)：Apple Silicon 上的语义记忆恢复工作，macOS 嵌入固定使用 CPU
- [#159](https://github.com/TangerineSpecter/Hana-Kami/pull/159) [@gpechieu](https://github.com/gpechieu)：Michael 招募的 Worker 具备可靠启动、清理和工作区卡片
- [#165](https://github.com/TangerineSpecter/Hana-Kami/pull/165) [@rajpreetcodes](https://github.com/rajpreetcodes)：Harness home 中的 `~` 可以展开，设置不会因 ENOENT 失败
- [#171](https://github.com/TangerineSpecter/Hana-Kami/pull/171) [@KrushanPatel](https://github.com/KrushanPatel)：CONTRIBUTING.md 与应用实际支持的平台一致
- [#175](https://github.com/TangerineSpecter/Hana-Kami/pull/175) [@rekcilyssup](https://github.com/rekcilyssup)：主进程 watchdog 会唤醒停留在未清空收件箱上的空闲 Worker
- [#176](https://github.com/TangerineSpecter/Hana-Kami/pull/176) [@FenjuFu](https://github.com/FenjuFu)：Gemini CLI 加入引擎列表
- [#177](https://github.com/TangerineSpecter/Hana-Kami/pull/177) [@TTAWDTT](https://github.com/TTAWDTT)：roster 显示每个 Agent 实时上下文窗口占用
- [#178](https://github.com/TangerineSpecter/Hana-Kami/pull/178) [@gpechieu](https://github.com/gpechieu)：GOD 招募的 Worker 获得工作区卡片，并在 Worker 死亡时归档
- [#179](https://github.com/TangerineSpecter/Hana-Kami/pull/179) [@kdahal7](https://github.com/kdahal7)：`statAbs` 展开 `~`，路径在所有平台上以相同方式解析
- [#181](https://github.com/TangerineSpecter/Hana-Kami/pull/181) [@TTAWDTT](https://github.com/TTAWDTT)：Webhook 分发通过原子添加进行，旧账本不会覆盖它
- [#184](https://github.com/TangerineSpecter/Hana-Kami/pull/184) [@TTAWDTT](https://github.com/TTAWDTT)：每 Agent 的 steer 队列有上限，阻塞时内存有界
- [#185](https://github.com/TangerineSpecter/Hana-Kami/pull/185) [@hyperstream-pro](https://github.com/hyperstream-pro)：发往没有收件箱的 ID 的邮件会退回并记录，而不是丢弃
- [#186](https://github.com/TangerineSpecter/Hana-Kami/pull/186) [@BUGHUNTER-SACHIN](https://github.com/BUGHUNTER-SACHIN)：测试覆盖 Notifications 和 Stop 空闲检测分支
- [#187](https://github.com/TangerineSpecter/Hana-Kami/pull/187) [@hyperstream-pro](https://github.com/hyperstream-pro)：过期的收件箱唤醒不会再针对已为空的收件箱唤醒 Agent
- [#190](https://github.com/TangerineSpecter/Hana-Kami/pull/190) [@swarnendu19](https://github.com/swarnendu19)：Agent 启动后可以编辑名称
- [#199](https://github.com/TangerineSpecter/Hana-Kami/pull/199) [@amey-op](https://github.com/amey-op)：Antigravity 队列不再卡住 30 秒
- [#203](https://github.com/TangerineSpecter/Hana-Kami/pull/203) [@lifelmy](https://github.com/lifelmy)：Crush 配置环境变量指向 Agent 自己的目录
- [#210](https://github.com/TangerineSpecter/Hana-Kami/pull/210) [@chaitanyagiri](https://github.com/chaitanyagiri)：艺术授权声明再次真实有效，Modern Interiors 已购买
- [#214](https://github.com/TangerineSpecter/Hana-Kami/pull/214) [@pontusm](https://github.com/pontusm)：Windows Agent 进程会随应用退出
- [#219](https://github.com/TangerineSpecter/Hana-Kami/pull/219) [@chaitanyagiri](https://github.com/chaitanyagiri)：提交 Michael 的引擎前先检查引擎可用性
- [#226](https://github.com/TangerineSpecter/Hana-Kami/pull/226) [@chaitanyagiri](https://github.com/chaitanyagiri)：工作区报告整个生命周期的支出，而不是上次重启后的支出
- [#227](https://github.com/TangerineSpecter/Hana-Kami/pull/227) [@scy73](https://github.com/scy73)：Renderer 运行在 Chromium 沙箱中

## [0.4.4] — 2026-08-18

**Windows Agent 终于可以互相通信**，首次运行也不再静默失败。两个 Bug 让核心产品在约占全部下载量一半的平台上无法工作，第三个 Bug 则导致全新安装从未启动负责 Agent 间消息传递的服务。同时还带来了重做的深色模式、技能浏览器、前置条件页面，以及可以承载自定义设计页面的发布说明。

### 修复

- **Windows 上的 Agent 间消息传递。**hive 协议以多行命令行参数传给 Agent。`.cmd` 不能直接交给 `CreateProcess`，因此任何非 `.exe` 目标都会通过 `cmd.exe /d /s /c "…"` 运行，而 cmd.exe 会在第一个换行处截断参数，把包含 `inbox/` 和 `outbox/` 名称的内容一起截掉。Agent 能启动、渲染，看起来很健康，却不知道自己可以给别人发消息。现在携带提示词的启动会解析 npm shim，并通过 argv 数组启动真实解释器；无法解析的内容回退到之前的行为。
- **专门修复 Windows OpenCode。**`opencode-ai` 的 bin 是编译后的二进制，因此 npm 写入的是没有解释器的 shim，第一版修复没有覆盖它——所有 Windows OpenCode 安装都会返回 null，再回退到会截断参数的路径。现在可以处理直接可执行的 shim；此前静默的回退也会记录无法解析的目标。
- **全新安装从未启动 hive 服务。**`harnessHome` 为 null 时，`bootstrapHiveServices()` 会提前返回，而首次启动恰好处于这种状态；引导流程随后设置 home，却没有重新启动服务。消息路由器、Hook 服务器、遥测收集器和任务调度器整个会话都保持停止——邮件不会移动，Agent 也不会报告。现在会在 `null → set` 转换时启动。
- **设置向导无法完成。**`~/HarnessAgents` 会以字面量 `~` 持久化，并在 `ENOENT: mkdir` 处失败；文件夹字段也不会预填，因为它读取了 `window.process.env.HOME`，而在 `contextIsolation` 下该值始终未定义。空文件夹现在在第一步就失败，而不是到第四步才失败；面板也不再溢出短屏幕。
- **“Restart & Continue”没有可恢复的内容。**现在会从第二个来源记录实时会话 ID，因此即使没有 Hook 到达，也可以继续。
- **深色模式存在特定的不可读问题。**`ink-300` 相对每个表面的对比度只有 1.73–2.09:1，而它是结构令牌——使用了 187 次，其中 93 次用于 1px 边框——所以所有控件边缘都不可见，UI 看起来是一片扁平灰色。现在对比度为 3.4–4.0:1，背景更柔和，并使用温暖的灰白文字。选中的 Command Center 标签对比度为 1.55–1.87:1（浅色强调色上的近白文字）；新增 `--cth-on-accent` 令牌后提升到 7.0–8.5:1。
- **OpenCode 运行了你可能没有权限使用的模型。**它预选了 BYOK slug，在没有密钥时静默回退，而所有界面仍然报告它原本请求的模型。
- 终端复制会去掉 CLI 的引号轨道，Agent 终端使用 UTF-8；听写会粘贴刚刚说出的内容；任务账本变更是原子的；冻结的上下文读取不再每小时重新触发 `/compact`；异常消息 ID 不再让 Agent 的唤醒提示静默；成本账本不进入 hive 的 git 历史；根 cwd 不再解析到 projects 目录；无人查看时工作区不再持续渲染。
- 每张卡片（包括 Michael 的卡片）都能看到 Agent 选中状态——以前它使用每个 Agent 自己的强调色绘制，在始终带边框的那张卡片上看不见。

### 新增

- **Skills**——支持 Claude Code、OpenCode 和 Codex 的已安装技能及作用域优先级，并提供可浏览的 227 项目录，支持搜索、分类和发布者筛选、安装和卸载。安装有边界并检查路径包含关系；卸载会拒绝任何不属于受管理根目录内 `SKILL.md` 文件夹的内容。
- **Prerequisites（Settings）**——实时显示 uv、git、Node、MemPalace 和每个 Agent 引擎的状态，提供真实路径、适配平台的安装命令，以及请求 Michael 补齐缺失项的按钮。
- **发布包页面**——发布正文可以携带作者编写的 HTML 页面，在沙箱 iframe（`sandbox=""` + `default-src 'none'`）中以居中模态框渲染。
- **Settings 主卡片**——显示版本、方案、赞助方和重新打开发布说明的入口；内容从 `docs/hero.json` 获取，因此无需构建就可以修改。
- IDE 图片预览（PNG/SVG/Markdown 嵌入）、以 Agent 命名的标题、真实快捷键提示。
- 更新通知会说明发生了什么，并且一生最多请求一次 Star。
- 模型选择器新增 Grok 4.6。
- 语音按钮的信息标记后提供听写设置指引，包括说明 Groq 免费。
- 悬停 `pause` 和 `halt` 时会解释它们的作用。
- 全屏模式新增 `open`（在 Agent cwd 打开终端）和 `✕`（结束并归档）；roster 卡片现在显示模型、项目和上下文仪表。

### 变更

- 所有 Agent 使用同一种卡片尺寸；Michael 通过表面区分，而不是使用更粗的边框。
- Command Center 标签在停靠时换行、全屏时滚动；`commands` 标签已移除。
- Prerequisites 从 Command Center 移到 Settings——它是整台机器的状态，而不是当前正在读取终端的 Agent 的状态。

### 致谢

本次发布的社区修复来自 [@gts-47](https://github.com/gts-47)（#129、#130、
#131, #132, #133, #134, #143, #144) and [@baziyer](https://github.com/baziyer) (#142).

## [0.4.3] — 2026-08-13

**新的品牌标记：Michael 头像取代“MD”方块。**
现在的 Logo 就是产品所围绕的角色，使用应用自己的像素艺术绘制在品牌黄色背景上。它以纯矢量（`docs/logo.svg`）作为源文件，并由 `tools/make-logo.cjs` 从这一份源生成所有栅格资源，因此网站、应用和三个平台的图标不再互相偏离。只有外观变化——没有功能变化。

### 变更
- **Logo 已在所有位置替换**——`build/icon.{svg,png,ico,icns}`、`docs/logo.svg`、`docs/logo.png`、`docs/logo-light.png`、网站页眉和 favicon、应用内工具栏和窗口图标，以及 README 页眉。
- **应用图标原生支持多分辨率**——`.icns` 在 16→1024 之间包含 macOS 投影；`.ico` 包含 16/32/48/64/128/256。此前两者都围绕单张 1024px 栅格图构建。
- **网站 CTA 按钮默认更亮。**`.btn.primary` 从 `--accent` 读取填充色，而该颜色同时用于强调色**文字**，所以必须足够深才能在白色页面上阅读——浅色主题的 `#E5A00D` 让下载按钮看起来像棕色。现在填充使用独立的 `--accent-fill` / `--accent-fill-hover` 令牌，初始值采用旧的悬停颜色。
- **Product Hunt 缩略图**（`docs/media/ph-thumbnail-240.gif`）现在放在品牌黄色上，而不是浅色着色背景上，与新的标记一致。

### 新增
- `tools/make-logo.cjs`——从 `src/renderer/src/scene/office/portraitArt.ts` 中的精灵生成 SVG、所有 PNG、`.ico` 和 `.icns`。不依赖外部图像工具。
- `docs/favicon-32.png` 和 `docs/apple-touch-icon.png`——原生尺寸图标，浏览器不再对 512px 头像进行过度缩小。

### 修复
- `docs/llms.txt` 在两个版本之后仍宣传 0.4.1。`tools/check-release-links.cjs` 现在会检查它，因此不会再次静默漂移。
- README 版本徽章和状态说明从两个版本前开始一直停留在 0.4.0。

## [0.4.2] — 2026-08-13

**匿名使用统计——公开记录、可退出，且在 Fork 中关闭。**
此前项目完全不知道是否有人启动应用，或哪些功能被使用。本版本加入了最小化的匿名产品分析层（PostHog），由公开契约约束：[`TELEMETRY.md`](TELEMETRY.md) 列出每个事件和属性，代码将该列表强制为严格允许列表。

### 新增
- **匿名使用事件**（`src/main/analytics.ts`）：`first_run`、`app_launched`、`agent_spawned`（仅引擎名称）、`feature_used`（固定枚举，每会话一次）和 `session_ended`（粗粒度时长分桶）。公共属性为应用版本、操作系统和 CPU 架构——除此之外没有其他内容。没有提示词、转录、文件路径、仓库名称或任何类型的标识符；事件是 PostHog **匿名事件**（`$process_person_profile: false`），使用保存在应用用户数据目录中的随机安装 UUID 作为键。
- **同意界面**：首次引导最后一步以及 Settings → General 中的“共享匿名使用统计”开关（`telemetryEnabled`，默认开启 = 可退出）。无条件遵守标准 `DO_NOT_TRACK` 环境变量。
- **[`TELEMETRY.md`](TELEMETRY.md)**——完整的公开契约，README 中已提供链接。

### 说明
PostHog key 只在发布 CI 中注入（`POSTHOG_KEY` secret）。**从源代码构建或 Fork 仓库会生成不含 key 的构建，整个分析模块都是空操作**——Fork 永远不会向任何地方发送事件。

## [0.4.1] — 2026-08-13

**应用与网站使用同一套说法。**
munderdiffl.in 将 Hana-Kami 描述为一个全天候工作的你的克隆；应用仍然称它为“GOD Agent”。本版本填补了这一差距。只改文字——没有行为变化。

### 变更
- **Michael 是你的克隆。**引导流程全程称他为你的克隆，工作区中的卡片现在显示 **BOSS** 标签而不是 **GOD**——他是 Agent 的老板，而你仍然是他的老板。
- **引导流程先讲产品，而不是功能列表。**第一屏以“一个全天候工作的你的克隆”开场；第 2 步是“你的克隆使用的引擎”。
- **引擎卡片列出全部十个引擎。**此前只宣传 Claude Code、Antigravity、Codex 三个；随着 Grok、Kimi、Qwen、OpenCode、Crush、pi 和 Copilot 加入，现在也全部命名。
- **修复网站文案。**修正 hero 中拼写错误的 “requrired”、`cli` → `CLI`、提到价格表中不存在的 “Basic”/“Pro” 方案的 FAQ，以及声称克隆运行在 Cursor 上的交互演示卡片——Cursor 并不是受支持的引擎。
- **README 与现状重新同步。**它列出九个引擎（四处遗漏 Qwen），并且仍然报告 v0.3.8。

### 说明
`god` Agent ID、hive 文件夹布局和消息路由**保持不变**。现有 hive、记忆和运行中的 Agent 都可以原样继续使用；无需迁移。

## [0.4.0] — 2026-08-12

**品牌成熟了，落地页也随之成熟。**
Hana-Kami 现在在各处都像同一个产品：黄色“MD”标记、所有平台一致的应用图标，以及重建的 munderdiffl.in，展示真实应用而不是只描述它。

### 新增
- **落地页展示真实应用截图。**Add Agent 对话框、记忆面板和 Settings → Autonomy & Budgets 都来自真实应用，而不是 Mockup。
- **Hero 中加入实时演示视频。**旧的静态主屏截图现在替换为工作区和实时 Agent 终端的循环屏幕录制。
- **克隆之间的聊天和加密连线视觉效果**，并为 Teams 功能提供申请演示的联系入口。

### 变更
- **新的应用图标。**所有平台的 Dock/任务栏图标现在都是黄色“MD”方块（macOS `.icns` 带正确边距和投影，Windows `.ico`，Linux `.png`），与应用内 Logo 和网站 favicon 一致。
- **落地页默认使用明亮（浅色）模式。**深色模式仍可一键切换，并会记住选择。
- **落地页再次使用黄色强调色**——浅色模式使用明亮琥珀色，深色模式使用金色，应用于按钮、图表、图鉴风格工作区模拟和价格卡片。
- **围绕两项服务重新设计价格**——Private Cloud（每个克隆一个独立沙箱 VM）和 Private Network（端到端加密的克隆间连线），并加入团队规模滑块。
- **刷新社交预览。**新的 Open Graph 卡片和文案与当前产品一致。

## [0.3.9] — 2026-08-11

**直接询问应用是否为最新版本。**
Settings → General 现在显示正在运行的版本、说明是否为最新，并提供一个清楚写明作用的按钮。之所以现在发布，是因为需要让已经安装 0.3.8 的用户收到更新。

### 新增
- **在 Settings 中检查更新。**在 **Settings → General** 顶部提供一个区块，始终回答“我是不是最新版本？”：显示当前版本、是否存在更新，以及一个按钮——**检查更新** → **下载 v0.4.0** → **重启以更新**——检查失败时还会显示原始错误。它与工具栏标签共享状态流、reducer 和状态机，因此两处不可能对已安装版本产生分歧；只有文案不同，因为一切正常时必须保持安静的标签，对打开 Settings 主动询问的人没有帮助。

### 变更
- **全屏 roster 头像更大。**以前以 1× 渲染——只有 18 像素高——而地砖宽度可以继续增长，所以 roster 变宽时只是给同一个小精灵增加留白。现在头像尺寸以半精灵为步长变化，绘制宽度跟随地砖宽度。

### 移除
- **彻底移除用量限制暂停。**它随第一个 v0.3.8 标签发布，但没有真正发布。被限制暂停的 Agent 会一直暂停——声明的重置从未到来，手动 **立即恢复** 按钮也会把它们送回暂停状态，而不是清空队列。现在投递行为恢复为 0.3.7 的方式。`rateLimit.ts`、`limitGate.ts`、`useLimitWatch.ts`、横幅、Settings 分区、配置键及其 IPC 全部移除，叠加在它们之上的压缩门控也一并移除。

## [0.3.8] — 2026-08-11

**记忆压缩首次真正工作。**
Harness 一直从一个已经数月不存在的目录读取 Claude Code 转录，因此摘要器始终没有可摘要的内容——而且没有报错，因为不存在的目录会被当成“暂时没有转录”。这是本版本的核心修复。除此之外，还修复了一系列悄悄消耗 token 或隐藏在表面之下的问题：压缩同时按两个调度触发、提交历史不显示提交消息，以及深色模式下按钮文字不可见。

### 新增
- **触发器中心。**调度、入站 webhook、上下文规则和 Agent 间消息现在在 Settings 中共享一个入口，并记录触发了什么以及执行了什么。
- **可折叠面板。**IDE 的 git 栏可以折叠，为文件树恢复高度；全屏 roster 也可以折叠，以获得全宽终端。两者都会记住选择。
- **可以在语音说明处设置 OpenAI key。**Settings → Voice 现在直接提供字段，标明它付费使用的模型（`gpt-realtime-2.1`），禁用的 Talk 按钮也会直接链接到此处。

### 修复
- **Claude Code 转录从一个数月不存在的目录读取。**`projectDir()` 构建的是 2026 年之前的项目键——丢掉了开头的斜杠——而 Claude Code 会将每个非字母数字字符都转换为短横线。没有任何报错，因为所有调用方都把不存在的目录读取为“暂时没有转录”，所以记忆压缩从未成功：连续产生大量 `condense-abort`，成功次数为 0，每次失败尝试仍会先写入完整备份。离线用量对账和跨 cwd 会话恢复也读写了同一个错误路径。由 [@gts-47](https://github.com/gts-47) 发现并诊断。
- **压缩同时按两个调度运行。**每小时运维例会带有本应被上下文触发器替换的 `autoCompact` 标记，因此默认安装会按两种节奏请求压缩——关闭触发器后例会仍然会压缩。现在只有一个控制项，关闭开关也如实生效。
- **重复的 `/compact` 消息堆积在队列中**并一起触发；第一个完成工作后，后续每个都回答“没有需要压缩的内容”。现在消息存储强制每个 Agent 只能有一个待处理压缩，任何调用方都无法绕过。
- **提交历史现在清晰可读。**此前通过一个无论图形间距如何都把行固定放在 64px 的库渲染（行会重叠），无论可用宽度如何都为图形保留 500px（文字被挤进剩余空间并换行），并且完全不显示提交主题。现在直接绘制，并适配任意面板宽度。
- **禁用按钮难以阅读，深色按钮上的图标也消失。**禁用填充换成中间表面色，但标签仍保留反色，在深色模式下约为 1.4:1。图标使用了与主按钮填充相同的令牌，因此启用时 **Send** 上的箭头也不可见。
- **两个不会滚动的滚动区域**——IDE 的变更文件列表和每次提交的文件列表。受限列中的 `overflow: auto` 没有 `flex: 1` 时会按内容大小布局，于是溢出上限，而不是达到自身滚动阈值。
- **Codex Hook 不再在 1 秒后超时。**Codex 将 `timeout` 读取为秒，并用 `.max(1)` 归一化，因此从 Claude 配置复制来的 `timeout: 0` 哨兵代表的是*一秒*而不是“无超时”——每个 Codex Worker 都记录失败的 SessionStart Hook。
- **发布页上的每个下载链接都返回 404。**它们使用了四个版本前就不再解析的固定版本文件名；macOS 下载量从约 118 降到个位数。发布门现在拒绝发布无法解析的链接。
- **修复 Agent Dock 裁切 Tooltip**以及溢出 Agent 卡片的缺少 key 提示。

### 变更
- 任意提供商触发速率限制时，定时自动压缩会暂停：`/compact` 本身是一次模型调用，将它发给受限 CLI 会浪费一次被拒绝的尝试，并把 `/compact` 插到真实积压任务之前。

## [0.3.7] — 2026-08-08

**自动更新已修复。**
它从未真正运行过。自 v0.3.4 发布以来，在任何打包构建中都没有运行过一次，而应用也没有办法告诉你这一点。

### 修复
- **原生更新器现在真正运行。**`electron-updater` 是 CommonJS，通过惰性的 `Object.defineProperty` getter 暴露 `autoUpdater`，Node 的 `cjs-module-lexer` 无法看到它。因此 `await import('electron-updater')` 得到的命名空间没有 `autoUpdater` 导出，只有 `.default.autoUpdater`；解构后得到 `undefined`。初始化第一行抛出 `TypeError: Cannot set properties of undefined (setting 'autoDownload')`，进入了一个静默将整个会话锁定为仅通知模式的 `catch`。所以 v0.3.4 到 v0.3.6 的每个打包构建实际上只能提供“打开发布页”。开发环境看不到这个问题，因为整条路径都位于 `app.isPackaged` 之后。
- **更新器失败不再被吞掉。**每个错误都会发给 Renderer，**并且**追加写入应用数据目录中的 `updater.log`。旧的 `catch` 丢弃了消息，这正是上面的 Bug 能存活三个版本的原因。
- **一次短暂故障不再禁用整个会话的更新。**现在仅对当前检查降级为仅通知模式，而不是永久锁定；重新检查也不会覆盖已经准备好的更新。

### 新增
- **工具栏版本号现在是更新控件。**Logo 旁会显示 `checking…`、`vX.Y.Z ready to install`（点击下载）、实时下载进度以及 **restart to update**（点击应用）。没有待处理更新时，点击会执行手动检查——此前应用只在启动 30 秒后、之后每六小时检查一次，无法主动询问。
- **`update-available` 和 `download-progress` 会显示出来，**多分钟下载不再看起来像什么都没发生。新增 `update:download` 和 `update:current` IPC：一键下载，重新加载的窗口直接获取当前状态，而不是等待下一次定时 tick。
- **围绕更新状态模型新增 9 个测试**（`src/shared/updateState.ts`），覆盖了本次踩中的规则——重新检查绝不能清除已准备好的“重启以更新”状态——并验证底层错误可以到达 UI。

### 变更
- **精简网站、README 和发布说明。**落地页移除演示视频分区和深色模式；README 的 48 行功能表变为可快速浏览的分组列表；`RELEASE.md` 以当前版本开头，而不是把所有历史版本完整堆叠。

> **从 v0.3.5 或 v0.3.6 升级？**这些构建包含损坏的更新器，无法自行获取本修复——请手动安装一次 v0.3.7。从 v0.3.7 开始，更新会自行到达。

## [0.3.6] — 2026-08-08

**一台什么都没安装的机器现在也能运行 Agent。**
本版本的所有修复都围绕同一个失败原因：应用假设用户机器上已经有可以展开 `~` 的 shell、PATH 中的 `node`、以及可用来安装的 npm；当这些不存在时，Agent 只留下一个退出码就死掉，没有任何解释。此外还修复了一个长期存在的工作区 Bug：画布变空后再也不会回来。

### 修复
- **`~/dev/foo` 不再失败并提示“cwd 不存在”。**只有 shell 会展开 `~`；Node 将它视为字面目录，因此手动输入的 `~/…` 路径每次存在性检查都会失败，Agent 也不会启动。现在在接收时只展开一次 `~`，roster 始终保存绝对 cwd；此前一直被识别为“不是绝对路径”的现有 `~` 条目也随之修复。
- **Hook 不再静默以退出码 127 死掉。**Agent CLI 通过 `sh -c` 运行 Hook，使用的裸 PATH 为 `PATH=/usr/bin:/bin:/usr/sbin:/sbin`，其中没有 nvm 的 node，因此所有 Hook 载荷都丢失：没有实时状态、没有 Stop→inbox 排空、也没有会话 ID。现在每个 Hook shim 都使用应用已经捆绑的 Node 运行。
- **每个 Agent 的 PATH 都包含 `node`。**声明为 `node ./server.js` 的 MCP 服务器、需要启动子进程的提供商 CLI、以及 Agent 自己写的 `.cjs`，在没有系统 node 的机器上都会以 127 退出。现在把捆绑运行时**追加**到 Agent 的 PATH，而不是置于最前，因此已有自己的 Node 的用户仍保留自己的版本。
- **失去 GPU 上下文后工作区会恢复。**Chromium 限制活动 WebGL 上下文数量，并静默驱逐最旧的上下文——工作区总是最先启动，所以打开足够多 Agent 终端后它会被驱逐。Pixi 没有报告任何内容，于是工作区变空，只能重启应用。现在可以检测丢失并重建场景。
- **GOD 不再给已经不存在的 Agent 发消息。**会话开始和每次提示词时，都会将工作区的实时 roster 放入编排器上下文，而不是依赖它重新读取 `fleet.json`，因此重启后也不会过期。

### 新增
- **缺少 Node 和 npm 时可以自动安装。**过去在没有 Node 的机器上选择引擎只会打印 `npm install -g …` 并直接运行，用户只能看着 `npm: command not found` 滚过屏幕。现在应用直接从 nodejs.org 获取最新 Node LTS，在执行任何内容前根据官方 `SHASUMS256.txt` 校验，然后在该 Agent 的终端中可见地安装 Node，再安装 CLI。如果已有 Node 20 或更高版本，则完全不触碰。
- **诚实的终点，而不是注定失败的命令。**没有任何安装器可以成功时，横幅会指出缺少的内容，并且完全不运行命令。

## [0.3.5] — 2026-08-06

**队列始终有退出通道，应用也首次可以自我更新。**
这是 0.3.4 的快速后续版本：修复一个真实工作流问题，打磨侧边栏，并成为安装后的应用可以自行获取的第一个版本——0.3.4 安装会收到“v0.3.5 已下载——重启以更新”的 Toast，不再需要访问网站。

### 修复
- **排队消息不再卡住。**暂停全工作区自动投递（Command Center 开关）过去会在没有解释或手动覆盖的情况下拦住所有排队消息。现在工作区暂停时，每个排队行会出现 **立即发送** 链接：它将该消息移到队首，只绕过暂停门控；空闲/草稿/选择器安全检查和投递确认仍然生效，因此终端真正空闲的瞬间才会输入（此前显示“空闲后发送……”）。编辑器也会说明为什么没有动作：“已暂停——整个工作区的投递已暂停”，悬停时提供完整说明和恢复位置。

### 变更
- **紧凑的 Command Center 标题。**在侧边栏宽度下，旧标题会将展示字体标题折成三行，把“runs the floor”逐词堆叠，并让两个宽工具栏按钮挤压其他内容。现在使用单行 **COMMAND CENTER** 标题 + “Michael runs the floor”副标题（两者都会省略），工作区投递开关压缩为 ▶ `auto` / ⏸ `paused`，完整解释放在 Tooltip 中。队列标题中的“全部清除”也不再换行。

### 说明
- **第一个自动更新版本。**0.3.4 引入更新器；0.3.5 是它交付的第一个版本。运行中的 0.3.4 应用会在后台下载，并提示“重启以更新”（绝不会自行重启）。0.3.3 及更早版本没有更新器——请从 [munderdiffl.in](https://munderdiffl.in) 获取本版本即可加入更新流程。

## [0.3.4] — 2026-08-06

**值得信赖的队列、真正了解工作区的 Michael，以及功能完整的 IDE。**本版本集中提升终端、队列和 roster 的可靠性，并加入语音 Michael、Markdown 预览、Git 历史、六标签 Settings、Grok、Kimi Code、GitHub 自动更新、深色模式和可选的定时自动压缩。

### 新增
- **Talk 模式升级。**Michael 的语音会话可以读取实时工作区上下文，并通过安全确认执行恢复、暂停投递、工具门控、删除任务、归档、清理上下文、创建调度和修改设置等操作。模型升级为 gpt-realtime-2.1。
- **全局 Markdown 预览。**IDE 中的 Markdown 支持 code、split、preview 三种视图；在任意终端中按住 ⌘ 点击 Agent 输出的 .md 路径即可打开安全预览。
- **IDE Git 时间机器。**提供 CHANGES、HISTORY、COMPARE 侧栏、提交图、逐文件 Monaco 差异、分支比较和受保护的 checkout；工作区和 Git 访问全部通过主进程 IPC。
- **六标签 Settings。**新增 General、Agents & Models、Autonomy & Budgets、Connections、Voice、Memory & Knowledge；模型、自治模式、保持 Mac 唤醒、简单解释和完整熔断器都有真实控制项。
- **自动更新。**打包版本启动时及之后约每 6 小时检查 GitHub Releases，在后台下载并通过 Toast 请求用户重启；应用不会自行重启。
- **新增 xAI Grok 和 Kimi Code 引擎。**两者都可作为 Worker，Grok 也可作为编排器；Hook、恢复会话和自动批准均接入现有协议。
- **定时自动压缩开关。**默认关闭，改为独立的可配置维护任务，并按提供商使用各自的压缩命令。
- **全屏 Agent roster。**左侧栏按仓库分组显示 Agent，支持恢复团队、拖动排序、暂停、停止和 steer；同时增加 typing / “你的草稿”徽章。
- **队列与终端可靠性。**自动写入统一经过一个投递门控，保留草稿和选择器安全检查，修复 WebGL、PTY、上下文恢复、进程回收、Shell 输出隔离和消息唤醒问题。

### 变更
- 自动化不会再清除或关闭用户拥有的内容；草稿和选择器保护时间更长，终端缩放会同步缩放编辑器和 roster。
- 同一提供商内切换模型会尽力恢复会话；Codex 使用 codex resume 和独立 CODEX_HOME；团队恢复并行执行。

### 修复
- 修复空白终端、队列静默停止投递、幽灵草稿、打开的模型选择器、模型变更丢失、重复仓库查询、进程未退出和熔断器误报。
- 修复 Shell PATH 捕获污染、全屏层级、终端重绘、自动化过期处理，以及 Windows/Unix 下的进程组回收。

### 性能
- 增加增量转录缓存，使热路径用量读取大幅加速；命令解析和登录 Shell PATH 捕获按会话缓存，恢复团队不再冻结应用。

## [0.3.3] — 2026-07-03

**工作区中的 IDE，以及第七个引擎。**加入内置 Monaco IDE、Git 变更栏、HEAD 差异、文件树、编辑器标签和 Cmd/Ctrl+S 保存；GitHub Copilot CLI 作为首个社区贡献的 Agent 引擎加入。

### 新增
- **内置 Monaco IDE 面板。**IDE 通过标题栏按钮打开全屏覆盖层，左侧提供 Git 变更和工作区文件树，右侧提供带脏状态的编辑器标签。Monaco 完全自托管，文件系统和 Git 都通过主进程 IPC。
- **GitHub Copilot CLI 引擎。**新增 copilot 提供商、模型选择、会话恢复、语音招募和缺失 CLI 安装支持，并遵循楼层自动模式开关。

### 修复
- 修复保存进行中输入的编辑内容被静默丢失的问题。

## [0.3.2] — 2026-06-27

**与 Michael 对话。**新增 Realtime Michael：低延迟语音频道可以读取任务、看板、记忆、Agent 和活动，并在语音回声确认后创建任务、分派工作、启动/终止 Worker 和控制工作区。

### 新增
- **实时语音 Michael。**使用自有 OpenAI key，主进程解密并生成短期会话 token，Renderer 永远拿不到真实 key；提供成本上限、空闲自动断开和完成播报。
- **语音只读消息层。**get_messages 可以读取经过主进程脱敏的完整消息、单个收件箱或工作区最新消息，不增加写入路径。
- **独立自动压缩维护调度。**从例会任务中拆出可持久化、可配置的维护任务，并增加每 Agent 环境元数据和 cwd 守卫。
- **语音安全控制。**破坏性操作需要口头回声确认；Slack 主动发帖默认关闭，没有明确频道和线程时拒绝发送。

## [0.3.1] — 2026-06-22

**OpenCode、Crush 和 pi.dev 加入工作区。**三个引擎都可以作为 Worker 或 Michael，支持自带 API key 和本地 LLM；同时修复睡眠后消息路由冻结及 Codex Worker 文件权限问题。

### 新增
- **三个可选引擎。**OpenCode 使用 native plugin，Crush 使用代理，pi.dev 使用内置扩展；三者都接入状态更新和回合结束后的收件箱排空。
- **BYOK 与本地 LLM 配置。**Settings → AI Engines 支持提供商 key、local base URL 和默认模型，并由加密 secret broker 以只写方式管理。
- **提供商无关的空闲后备。**PTY 一段时间无输出时，工作区会将仍处于 working 的 Agent 恢复为空闲，保证收件箱唤醒可以继续投递。

### 修复
- Codex Worker 在自动模式下获得完整文件系统权限和自动批准；系统睡眠恢复时会重新启用 hive 路由并立即排空积压邮件。
- OpenCode、Crush、pi.dev 的本地模型快速选择、TUI 协议注入和首次安装后的自动重启继续流程均已修复。

## [0.3.0] — 2026-06-21

**平台化版本：工作区不再只围绕 Claude。**可选 Agent 引擎、每次招募的技能和 MCP 目录、集成注册表与回环 secret broker、Slack 临时 Worker、时间范围技能、Provider / Hive 选择器、Agent Gallery 和可靠性加固全部加入。

### 新增
- 引入可插拔 AgentProvider、每次招募的技能/MCP manifest、默认拒绝的允许列表和 Electron extraResources 中的内置技能。
- Michael 可以更换引擎；集成 secret 只写入 broker，不回读 Renderer；Slack 请求可以创建隔离 Worker，完成后安全清理 worktree。
- 新增时间范围技能、Worker capability catalog、Provider / Hive 选择器、Agent Gallery 和六个现成招募角色；首次引导根据可用能力调整。

### 变更
- Hiring Fair 更名为 Agent Gallery；Add-Agent 配置围绕引擎和能力模型重新组织；加入实验性的 VDE 原型。

### 安全
- 招募 manifest 视为不可信输入：禁止自动启动，CLI 标志采用默认拒绝允许列表，模型 ID 限制字符集，所有网络获取使用 HTTPS、超时、大小上限和逐跳 SSRF 校验。

## [0.2.8] — 2026-06-15

**可靠性与安全版本。**修复浏览器导航、安全协议、代理配置、语音和 Slack 相关问题，并继续完善 Provider / Hive 选择器和本地引擎支持。

### 新增
- 新增可分享的 hanakami/hire@1 招募 manifest、Agent Gallery、OSS 模型快速选择和本地设置指南。
- 支持多窗口工作区、文件和图片附件、跨重启恢复 Agent 会话、拖拽文件到终端，以及可选的电视节目办公主题。

### 修复
- 修复 Slack 去重、终端缩放、恢复会话、WebGL 生命周期、OpenCode/Crush 安装、工作区唤醒、调度补偿、Worker stale-done 和语音按钮状态。
- 将 integrations:test 限制为有边界的 broker 探测，避免被利用为 secret 外泄或 SSRF 原语。

## [0.2.7] — 2026-06-13

**工作区控制与展示增强。**加入 Free Flow 语音听写、Knowledge Graph、多个隔离楼层、富消息编辑器、跨重启恢复和电视主题基础设施。

### 新增
- 支持 Option 语音听写、企业知识图谱、独立楼层、文件/图片附件、Restart & Continue、终端拖拽路径、GitHub Star 数量和电视主题。

### 变更
- 重做消息编辑器和落地页 Bento 布局，修复全屏标签裁切与 Slack 重复确认。

## [0.2.6] — 2026-06-10

**细节与可靠性补丁。**终端打开即正确渲染，dev 不再因 Slack sidecar 缺失崩溃，Windows ConPTY 受保护，墙上时钟可点击，ASK ME 使用记忆字体，Slack 文件下载固定在官方域名。

### 新增
- 墙上时钟读取真实时间，点击后进入优雅关闭流程。

### 修复
- 修复终端初始尺寸、Slack sidecar、Windows AttachConsole 和 ASK ME 字体问题；downloadSlackFile() 只允许向 Slack 域名发送 token。

## [0.2.5] — 2026-06-10

**可靠性与触达版本。**修复 Windows 终端回归和 Agent 生命周期，Slack 可以返回实质性答复，加入委派开关、六篇教程和更丰富的落地页图示。

### 新增
- 新增委派给 Agent 的开关、Slack 自主请求协议、Webhook/Slack/PR 审查/博客写作教程，以及展示独立 worktree 的落地页图示。

### 修复
- 修复 Program Files 路径、孤儿 Agent、Slack 空确认和未完成 compact-protocol；回退未完成的紧凑协议功能。

## [0.2.4] — 2026-06-09

**多提供商补丁。**Codex 通过原生生命周期 Hook bridge 达到完整 hive parity，GOD 默认打开 Terminal，Slack/Webhook 入口和心跳可靠性得到加强。

### 新增
- Codex 接入 config.toml [hooks]，成为完整 hive-aware 提供商；统一 agy/codex 分发路径。

### 变更
- GOD 默认打开 Terminal 标签；落地页和博客将 Claude Code、Antigravity 和 Codex 作为同等提供商展示。

### 修复
- 修复 tunnelmole ESM 加载、未读收件箱心跳，以及 Slack 完成摘要在永久错误时无限重试。

## [0.2.3] — 2026-06-09

**多提供商版本。**Antigravity（Gemini）和 Codex 成为一等 hive 参与者，调度拥有独立标签，Slack/Webhook 入口迁移到更稳定的 tunnelmole。

### 新增
- 新增 agy 提供商、Schedules 标签和无 Hook 提供商的终端工作单交接。

### 修复
- Codex 遵循 hive protocol 并通过 Renderer 唤醒收件箱；修复 public URL 的 localtunnel 浏览器中间页问题。

## [0.2.2] — 2026-06-07

**社区打磨版本。**主要由 @Gulum 完成：Agent 卡片实时上下文窗口、更加清晰的终端、正确的 Windows 用量计量，以及所有人工分发都经过 GOD。

### 新增
- 新增上下文窗口仪表、每会话终端主题开关、Unicode 11 Emoji 宽度、GOD 分发和独立 ctx 行。

### 修复
- 修复 Windows 用量计量、send-only 助手邮件黑洞、启动横幅重复和浅色终端文本光标不可见。

### 致谢
本版本几乎全部由 @Gulum 完成；由 @chaitanyagiri 维护。

## [0.2.1] — 2026-06-07

### 变更
- 定时自动压缩改为按 Agent 排队，只在 Agent 空闲时投递，并为每个 Agent 去重；Heartbeat 改为写入 Michael 收件箱，由空闲唤醒逻辑投递。

### 文档
- 扩展 README 路线图，加入聊天集成、可插拔 Agent CLI 和实时 Michael。

## [0.2.0] — 2026-06-07

**可观测与控制版本。**工作区现在可见且可控，包含大量社区贡献。

### 新增
- 重做 Command Center，加入 token 预算、实时 fleet 监控、OTel 遥测、按 Agent 成本、工具调用瀑布图、上下文仪表和 circuit breaker。
- 新增 Scheduler heartbeat、HITL、SQLite 持久化、MemoryReflector、可配置 hive/memory home、一键 Restore team、删除调度任务和 compacting/looping 头像状态。

### 修复
- 修复终端对比度、HiDPI、Windows 锁屏、实时状态、composer 草稿、Palace writer lock、Windows named pipe、PTY 输入序列化、GOD 标签滚动和默认模型优先级。

## [0.1.9] — 2026-06-06

### 新增
- 新增默认开启的每小时运维例会，GOD 检查所有 Agent 并按小时压缩上下文；一次性迁移会为已有安装补入任务。

### 修复
- 修复 Bypass Permissions 首次提示导致 Agent 退出、博客卡片边框、Windows Hook/语义记忆、Palace writer lock 和 MemPalace 索引噪音。

## [0.1.8] — 2026-06-05

### 修复
- 修复 Windows Agent 启动时的 ENOENT、Windows 安装目录和 PATH 解析，并保留 macOS/Linux 行为；Unix 后备路径增加 ~/.volta/bin。

## [0.1.7] — 2026-06-04

### 新增
- 新增 Slack → Michael 队列集成，使用签名密钥验证和重放保护。

### 变更
- 审批改为原生 Claude Code 人机协作提示；to:"human" 决策通过 Michael 会话和原生权限提示到达用户。

### 修复
- 移除旧审批面板重新入队的 Bug。

## [0.1.6] — 2026-06-04

### 新增
- 新增每 Agent Git worktree、带依赖的任务看板、定时任务、真实 token/成本遥测、全局 hive 搜索、线程聊天、记忆图、GitHub issue、CI 状态、桌面通知和 Agent 归档。

### 修复
- 修复调度重复触发、PTY 生命周期清理、任务 ID 后备和 writeTasks IPC 输入校验。

## [0.1.5] — 2026-06-04

### 新增
- 新增 Dwight 持久化准备助手、Michael Command Center、每 Agent 模型选择和入门教程。

### 修复
- 修复 Agent 虚假 idle、长标签溢出、终端切换不在最新输出和 idle 标签回显问题。

## [0.1.4] — 2026-06-04

### 新增
- 发布签名的 macOS 构建和 TCC 访问处理；新增 Blog、SEO/AEO 元数据、JSON-LD、robots.txt、sitemap.xml 和链接预览标签。

## [0.1.3] — 2026-06-01

### 新增
- Settings 增加 Reset & start over，能够清除 Michael 记忆、整个 hive 和语义记忆宫殿；GOD 初始化时显示启动加载器。

### 修复
- 修复退出时向已销毁窗口发送 IPC，以及 Michael 完成任务后立即走向“需要你”的门的问题。

## [品牌与重命名]

### 新增
- 建立 Hana-Kami 品牌身份：Logo、方形标记、Hero 横幅、GitHub Pages 落地页、应用内品牌，以及 SECURITY.md、CHANGELOG.md、Issue/PR 模板和 CI 工作流。

### 变更
- 将项目从 Claude Terminal Harness 重命名为 Hana-Kami，并同步 README、SPEC.md、DESIGN.md、HIVE.md、package.json 和应用 UI。

## [0.1.0] — 2026

初始可运行原型。

### 新增
- Electron + React + TypeScript 壳层、electron-vite、node-pty、xterm.js、类型化 IPC、多 Agent 启动/写入/调整大小/终止。
- Pixi.js 办公区、Tiled 地图、摄像机、角色换色、寻路、座位分配、工具气泡和消息信封。
- hive.ts 多 Agent 磁盘层、hooks.ts Hook 服务器和 cth-hook shim、Stop 循环、memory.ts 语义记忆层。
- GOD 编排器、审批队列、记忆搜索、安全文件浏览器、CodeMirror 编辑器、Git 标签、入门向导、安全退出和 SNES/Animal-Crossing 设计系统。
[0.1.0]: https://github.com/TangerineSpecter/Hana-Kami/releases/tag/v0.1.0
