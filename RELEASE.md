<!-- 发布流程：打标签前必须运行 RELEASE-CHECKLIST.md。在 0.4.6-rc.1 -> 0.4.7-rc.1 预发布版本上演练更新器，并在给正式版本打标签前通过故障注入检查。本注释不会显示在已发布的说明中。 -->
# Hana-Kami v0.4.6

**由 Claude Code、Antigravity、Codex、Gemini、Cursor、Grok 和 Copilot Agent 组成的本地蜂巢，可自行运行。**
消息、路由和记忆由你的克隆体 Michael 协调，你只需要和他沟通。本地优先且开源。

### → [**munderdiffl.in**](https://munderdiffl.in/) · 查看实际运行效果，然后在下方获取构建

---

## 0.4.6 新内容

**会说你的语言并能自行更新的版本。**界面现在支持中文和阿拉伯语，自动更新器可以端到端下载并安装新构建，字体随应用提供，因此网络受阻时也不会留下空白窗口；Agent 引擎的启动方式也更加安全。此外还包括设置重做、CJK 输入法修复，以及 16 个社区 Pull Request。

- **界面会说中文和阿拉伯语。**在设置中选择 zh-CN 或 Arabic——所有字符串都已翻译，不会回退到英语，终端支持从右到左。部分页面仍需要镜像内边距和图标，这是下一步工作。
- **更新会自动安装。**徽章会自动从 check 进入 available、downloading 和 downloaded，最后的按钮会重启进入新版本。本版本完整验证了这条路径。
- **字体随应用提供。**启动时不再请求 Google Fonts，因此任何网络环境下应用都能以同样速度打开，包括 Google 受阻的网络。发布页面的字体也已打包，加载样式表时不再出现白屏。
- **引擎命令启动更安全。**Agent 启动的 CLI 名称会在根据 PATH 解析之前校验，因此 Shell 只会收到普通命令名或绝对路径。
- **输入法输入不再提前发送。**按 Enter 选择中文或日文候选词时会选中该词，而不是把半截文字当成消息发送。
- **设置只有一个保存按钮。**连接页不再重复显示内容；REST API、MCP、Slack 和 Webhook 各自保留在原位置。
- **应用统计你发送的消息，而不是消息内容。**单个 `message_sent` 事件闭合激活漏斗：只统计数量，不发送文本、长度或任何内容。[`TELEMETRY.md`](TELEMETRY.md) 与其他事件一样列出它，并适用相同的退出方式。
- **ASK ME 卡片支持渲染 Markdown。**带强调、列表、`code`、表格和链接的问题现在会正常渲染，而不是显示原始星号。

### 关于 Pro 的说明

v0.5.0 将在社区版之外推出 Pro 版本。社区版保持免费、开源并持续获得更新。Pro 会提供新功能和集成，全年还会陆续发布更多内容，并始终领先于社区版，面向希望充分发挥编码 Agent 和 Agent 工作台能力的高级用户。Pro 路线图还包括移动应用。Founders' Wall 上的前 100 人可免费获得一个月 Pro，之后年度计划可享受 50% 折扣。

### 致谢

本版本收录了 13 位贡献者提交的 16 个社区 Pull Request，其中 #213 是重新实现而不是直接合并。感谢 [@aaroncoville](https://github.com/aaroncoville)、[@abo123v-glitch](https://github.com/abo123v-glitch)、[@BUGHUNTER-SACHIN](https://github.com/BUGHUNTER-SACHIN)、[@djbiz](https://github.com/djbiz)、[@gpechieu](https://github.com/gpechieu)、[@HsienW](https://github.com/HsienW)、[@HundredBillion](https://github.com/HundredBillion)、[@jhinzzz](https://github.com/jhinzzz)、[@L422Y](https://github.com/L422Y)、[@LavaDMan](https://github.com/LavaDMan)、[@raifemre](https://github.com/raifemre)、[@savvaskoualis](https://github.com/savvaskoualis)、[@Schopenhauer-loves-Hegel](https://github.com/Schopenhauer-loves-Hegel)，也感谢每一位审阅 Pull Request 或提交相关 Bug 的人。

<!-- drop -->
<div class="drop">
  <p class="eyebrow">Hana-Kami 0.4.6</p>
  <h1>会说你的语言。会自行更新。</h1>
  <p class="lede">界面现在支持中文和阿拉伯语，更新器可以端到端安装新构建，字体随应用提供，因此网络受阻时也不会留下空白屏幕。</p>
  <ul class="features">
    <li>
      <h2>中文和阿拉伯语</h2>
      <p>在设置中选择语言。所有字符串都已翻译，终端支持从右到左。部分页面仍需要镜像内边距和图标，这是下一步工作。</p>
    </li>
    <li>
      <h2>更新会自动安装</h2>
      <p>徽章会自动从 check 进入 available、downloading 和 downloaded，最后的按钮会重启进入新版本。本版本验证了这条路径。</p>
    </li>
    <li>
      <h2>字体随应用提供</h2>
      <p>启动时不再请求 Google Fonts，因此任何网络环境下应用都能以同样速度打开，包括 Google 受阻的网络；样式表加载时本页面也不再白屏。</p>
    </li>
    <li>
      <h2>更安全的命令启动</h2>
      <p>Agent 启动的 CLI 名称会在根据 PATH 解析之前完成校验。</p>
    </li>
    <li>
      <h2>一个保存按钮</h2>
      <p>连接页不再重复显示内容。REST API、MCP、Slack 和 Webhook 各自保留在原位置。</p>
    </li>
  </ul>
</div>
<!-- /drop -->

## 0.4.5 新内容

**修复那些你信任、却悄悄出错的功能。**重启后成本统计偏差超过一半，Apple Silicon 上语义记忆从未工作，Agent 之间也无法可靠沟通。这三项都已修复。此外还包括工作日调度、所有路径可点击、用一个编辑器取代两个编辑器，以及 23 个社区 Pull Request。

- **成本统计正确了。**应用重启时遥测计数器会重置，但会话 ID 保持不变，因此办公区大幅低估支出。现在从账本汇总成本，并保留单独的会话数据。
- **Apple Silicon 上的语义记忆可用。**CoreML 让量化嵌入图溢出，所有向量都变成 NaN，chroma 拒绝每次 upsert。macOS 上的嵌入现在固定使用 CPU。
- **Agent 可以可靠互相沟通。**加入收件箱唤醒看门狗，移除过期提醒，将发往不存在收件箱的邮件改为退回并记录而不是丢弃，限制 steer 队列，原子化 Webhook 调度，并在启动时刷新 PROTOCOL.md。
- **Worker 招募可靠。**提交招募前会检查启动、销毁、办公区卡片和引擎可用性。
- **Renderer 在 Chromium 沙箱中运行。**
- **Windows Agent 会随应用退出。**
- **更新重启不再卡住**，即使运行中的 Agent 让应用拒绝退出。
- **触发器按工作日和每日时间运行，**不再只有固定间隔，并且兼容 DST。
- **专注模式**可以跨重启保留，也可以在其中编辑 Agent。
- **终端输出中的每个路径都可点击。**Markdown 预览、源码会在编辑器中打开，图片和未知类型会在 Finder 或 Explorer 中显示。
- **一个编辑器。**全屏文件覆盖层已移除，所有内容都在 IDE 中打开，git 轨道默认折叠。
- **一键更新。**标题栏徽章会为你的机器下载构建并说明安装方式；检查确认已是最新版本后显示 `latest`，更新后的首次启动会打开该版本的发布页面。
- **设置打开时显示卡片**，包含你的版本、计划以及返回这些说明的入口。
- **终端跟随窗口主题。**Gemini CLI 和 Cursor Agent 加入引擎列表，Michael 可以自主招募，并支持编辑 Agent 名称。

## 0.4.4 新内容 · *Windows 加入办公区*

**如果你使用 Windows，0.4.4 是让应用真正工作的版本。**Agent 之前无法在那里互发消息：它们能启动，看起来完全正常，却永远悄悄忽略彼此。该版本也修复了首次使用的前五分钟：设置无法完成，新安装中负责传递 Agent 消息的部分必须在退出并重新打开应用后才会启动。

- **Windows Agent 可以互相沟通。**蜂巢协议以多行命令行参数传给 Agent，而 `cmd.exe` 会在第一个换行处截断，并带走包含 `inbox/` 和 `outbox/` 名称的内容。现在启动时会把参数数组交给真正的解释器。
- **设置流程可以完成。**过去接受建议目录会直接失败，目录输入框也是空的，尽管上方文字承诺会提供建议。
- **全新安装立即可用。**Agent 间消息、卡片实时状态和“重启并继续”过去都要重启应用后才会工作，而且没有任何提示。
- **技能与前置条件。**展示 Agent 可以使用的全部技能、可浏览和安装的另外 227 项技能，以及设置中用于说明支持工具是否存在的页面。
- **发布页面。**发布版本可以携带自己的设计化页面，而不是只在角落显示版本号。你正在阅读的就是其中一个。
- **暗色模式重做。**绘制控件的单像素边框与背景对比度低于 2:1，整个应用看起来像扁平的灰色形状。现在已重新调校并测量，而不是凭肉眼选择。

---

## 0.4.3 新内容 — *Michael 就是 Logo*

**这个标志现在是一张脸。**Hana-Kami 一直是一个让你观察大家工作的事务所，而图标过去只是渐变背景上的一对手写字母。现在它是 Michael——你的克隆体——用应用自己的像素艺术画在品牌黄背景上，正看着你。

- **一个标志，到处一致。**macOS、Windows 和 Linux 的 Dock 图标、网站 favicon 和页眉、应用内工具栏以及 README 都使用同一张头像。没有任何变体是从另一个变体重新绘制的。
- **SVG 是唯一真源。**标志以纯矢量形式编写——精灵图每个像素都是 rect，没有字体、渐变或滤镜——而 `build/` 和 `docs/` 中的每个栅格图都由 [`tools/make-logo.cjs`](https://github.com/TangerineSpecter/Hana-Kami/blob/main/tools/make-logo.cjs) 从它生成。旧图标依赖安装 Lobster Webfont 才能正确渲染。
- **图标在每个尺寸下都是原生尺寸。**真正的多分辨率 `.icns`（16→1024，带 macOS 阴影）、包含六种尺寸的 `.ico`，以及 32px favicon 和 180px apple-touch-icon，因此不再有任何图标是从 512px 图像缩小得到的。
- **更明亮的行动按钮。**下载按钮曾使用与强调*文字*相同的填充 token，而强调文字必须在白色页面上保持足够深的颜色，因此浅色主题中的按钮呈棕色。现在填充使用独立 token，并从过去的悬停颜色开始。

> [!NOTE]
> **仅外观变化。**本版本没有功能变化：更新会把新图标带到你的 Dock，其他内容都不会改变。

---

## 0.4.2 新内容 — *公开透明的匿名使用统计*

Hana-Kami 现在会发送**少量匿名使用事件**（应用打开、Agent 启动、功能使用），用于了解功能是否真正被使用。它按照开源项目应有的方式构建：

- **[TELEMETRY.md](https://github.com/TangerineSpecter/Hana-Kami/blob/main/TELEMETRY.md) 是完整协议。**每个事件和属性都列在那里，代码将该列表作为严格白名单执行——表格之外的内容无法发送。不发送提示词、转录、文件路径、仓库名称或标识符。事件是 PostHog 的*匿名事件*（没有个人资料，也没有身份信息），使用可删除的随机 UUID 标识。
- **三种退出方式。**在引导过程中取消勾选，关闭**设置 → 通用 → 匿名使用统计**，或设置标准的 `DO_NOT_TRACK` 环境变量。
- **Fork 不发送任何内容。**分析密钥只在发布 CI 中注入——从源码构建会得到一个 analytics 模块完全空操作的构建。

---

## 0.4.1 新内容 — *应用和网站使用同样的说法*

**Michael 是你的克隆体。**网站一直把 Hana-Kami 描述成一个全天候工作的你的克隆体，而应用仍称它为“GOD Agent”。现在两边一致了。

- **你的克隆体，而不是 GOD Agent。**引导流程始终将 Michael 描述为你的克隆体，办公区卡片带有 **BOSS** 标签——他是 Agent 们的老板，而你仍然是他的老板。
- **引导流程重写。**开头介绍你真正得到的东西（“一个全天候工作的你的克隆体”），而不是罗列功能；引擎卡也不再在有十个引擎时只宣传三个——Claude Code、Codex、Grok、Kimi、Antigravity、Qwen、OpenCode、Crush、pi 和 Copilot 都会显示。

> [!NOTE]
> **本版本只改变文案。**`god` Agent ID、蜂巢目录结构和消息路由均未改变，因此现有蜂巢、记忆和运行中的 Agent 都会原样保留。不需要迁移。

---

> [!NOTE]
> **从 v0.3.7 或更高版本可以通过自动更新到达这里。**如果你仍在使用 v0.3.5 或 v0.3.6，这些版本携带了损坏的更新器，需要手动安装一次——从下方获取下载文件即可。

---

## 此前版本

- **0.4.0** — *品牌成熟了*：Dock 图标、应用内 Logo、网站 favicon 和 munderdiffl.in 统一使用黄色 “MD” 标志；着陆页围绕真实截图和实时像素办公区模拟重建；定价围绕 **Private Cloud** 和 **Private Network** 重新设计。
- **0.3.9** — 设置 → 通用直接回答“我是否是最新版本？”，并移除 0.3.8 中从未释放所持 Agent 的使用额度保护。
- **0.3.8** — 记忆压缩首次可用；新增触发器中心；将两个压缩计划合并为一个；提交历史变得可读。
- **0.3.7** — 自动更新真正运行：CommonJS/ESM import Bug 导致自 v0.3.4 起所有打包构建中的原生更新器都未触发，且失败被 `catch` 吞掉。
- **0.3.6** — *空机器也能运行 Agent*：Node 和 npm 自动安装（已对照官方 `SHASUMS256.txt` 验证）；Hook 不再以退出码 127 崩溃；`~`/dev/foo` 路径可以解析；办公区在丢失 GPU 上下文后会自行重建。
- **0.3.5** — 为暂停的消息队列提供**立即发送**出口，以及紧凑的指挥中心页眉。
- **0.3.4** — 了解办公区状态的 Talk 模式、Markdown 预览、IDE git 时间机器（历史 + 分支比较）、重做的设置、xAI Grok 和 Kimi Code，以及所有自动写入器统一的交付门禁。感谢社区贡献者 [@gts-47](https://github.com/gts-47) 和 [@qschmick](https://github.com/qschmick)。
- **0.3.3** — 内置 Monaco IDE，以及首个社区贡献引擎 GitHub Copilot CLI（[@anxkhn](https://github.com/anxkhn)）。
- **0.3.2** — Realtime Michael：连接 GOD 编排 Agent 的语音通道。
- **0.3.1** — 新增三个引擎：OpenCode、Crush 和 pi.dev。

完整历史见 [CHANGELOG](https://github.com/TangerineSpecter/Hana-Kami/blob/main/CHANGELOG.md)。


---

## 致谢

本版本包含社区贡献。以下 23 项全部在 v0.4.5 中落地：

| | | |
|---|---|---|
| [#157](https://github.com/TangerineSpecter/Hana-Kami/pull/157) | [@gpechieu](https://github.com/gpechieu) | 清理 Agent PTY 环境中继承的 Claude Code 会话标记 |
| [#158](https://github.com/TangerineSpecter/Hana-Kami/pull/158) | [@gpechieu](https://github.com/gpechieu) | Apple Silicon 上的语义记忆恢复可用：macOS 上的嵌入固定使用 CPU |
| [#159](https://github.com/TangerineSpecter/Hana-Kami/pull/159) | [@gpechieu](https://github.com/gpechieu) | Michael 招募的 Worker 可以可靠启动、销毁并显示办公区卡片 |
| [#165](https://github.com/TangerineSpecter/Hana-Kami/pull/165) | [@rajpreetcodes](https://github.com/rajpreetcodes) | 工作台主目录中的 `~` 可以解析，设置不会因 ENOENT 失败 |
| [#171](https://github.com/TangerineSpecter/Hana-Kami/pull/171) | [@KrushanPatel](https://github.com/KrushanPatel) | CONTRIBUTING.md 与应用实际支持的平台一致 |
| [#175](https://github.com/TangerineSpecter/Hana-Kami/pull/175) | [@rekcilyssup](https://github.com/rekcilyssup) | 主进程看门狗会唤醒卡在未清空收件箱上的空闲 Worker |
| [#176](https://github.com/TangerineSpecter/Hana-Kami/pull/176) | [@FenjuFu](https://github.com/FenjuFu) | Gemini CLI 加入引擎列表 |
| [#177](https://github.com/TangerineSpecter/Hana-Kami/pull/177) | [@TTAWDTT](https://github.com/TTAWDTT) | 每个 Agent 的实时上下文窗口占用显示在列表中 |
| [#178](https://github.com/TangerineSpecter/Hana-Kami/pull/178) | [@gpechieu](https://github.com/gpechieu) | GOD 招募的 Worker 获得办公区卡片，并在 Worker 退出时归档 |
| [#179](https://github.com/TangerineSpecter/Hana-Kami/pull/179) | [@kdahal7](https://github.com/kdahal7) | `statAbs` 展开 `~`，使路径在所有平台上的解析方式一致 |
| [#181](https://github.com/TangerineSpecter/Hana-Kami/pull/181) | [@TTAWDTT](https://github.com/TTAWDTT) | Webhook 调度通过原子添加，过期账本不会覆盖它 |
| [#184](https://github.com/TangerineSpecter/Hana-Kami/pull/184) | [@TTAWDTT](https://github.com/TTAWDTT) | 限制每个 Agent 的 steer 队列，约束卡住 Agent 的内存占用 |
| [#185](https://github.com/TangerineSpecter/Hana-Kami/pull/185) | [@hyperstream-pro](https://github.com/hyperstream-pro) | 发往没有收件箱的 ID 的邮件会退回并记录，而不是丢弃 |
| [#186](https://github.com/TangerineSpecter/Hana-Kami/pull/186) | [@BUGHUNTER-SACHIN](https://github.com/BUGHUNTER-SACHIN) | 测试覆盖 Notifications 和 Stop 的空闲检测分支 |
| [#187](https://github.com/TangerineSpecter/Hana-Kami/pull/187) | [@hyperstream-pro](https://github.com/hyperstream-pro) | 过期的收件箱提醒不会再唤醒已经清空收件箱的 Agent |
| [#190](https://github.com/TangerineSpecter/Hana-Kami/pull/190) | [@swarnendu19](https://github.com/swarnendu19) | Agent 启动后可以编辑名称 |
| [#199](https://github.com/TangerineSpecter/Hana-Kami/pull/199) | [@amey-op](https://github.com/amey-op) | Antigravity 队列不再卡住 30 秒 |
| [#203](https://github.com/TangerineSpecter/Hana-Kami/pull/203) | [@lifelmy](https://github.com/lifelmy) | Crush 配置环境变量指向 Agent 自己的目录 |
| [#210](https://github.com/TangerineSpecter/Hana-Kami/pull/210) | [@chaitanyagiri](https://github.com/chaitanyagiri) | 素材许可声明重新属实，Modern Interiors 已购买 |
| [#214](https://github.com/TangerineSpecter/Hana-Kami/pull/214) | [@pontusm](https://github.com/pontusm) | Windows Agent 进程会随应用退出 |
| [#219](https://github.com/TangerineSpecter/Hana-Kami/pull/219) | [@chaitanyagiri](https://github.com/chaitanyagiri) | 在提交 Michael 的引擎前检查引擎可用性 |
| [#226](https://github.com/TangerineSpecter/Hana-Kami/pull/226) | [@chaitanyagiri](https://github.com/chaitanyagiri) | 办公区报告生命周期支出，而不是上次应用重启后的支出 |
| [#227](https://github.com/TangerineSpecter/Hana-Kami/pull/227) | [@scy73](https://github.com/scy73) | Renderer 在 Chromium 沙箱中运行 |

以上修复中有四项来自 [@gpechieu](https://github.com/gpechieu)，三项来自 [@TTAWDTT](https://github.com/TTAWDTT)。感谢你们，也感谢每一位审阅 Pull Request 或提交相关 Bug 的人。

## ⤓ 下载

每个平台的最新构建。macOS 构建是**通用版**，一个 DMG 同时支持 Apple Silicon 和 Intel。

### 🍎 macOS
| 构建 | 文件 |
|---|---|
| Universal (Apple Silicon + Intel) | [`Hana-Kami-0.4.6-mac-universal.dmg`](https://github.com/TangerineSpecter/Hana-Kami/releases/latest/download/Hana-Kami-0.4.6-mac-universal.dmg) |

### 🪟 Windows
| 构建 | 文件 |
|---|---|
| Installer (x64), *recommended* | [`Hana-Kami-0.4.6-win-x64-setup.exe`](https://github.com/TangerineSpecter/Hana-Kami/releases/latest/download/Hana-Kami-0.4.6-win-x64-setup.exe) |
| Portable (x64, no install) | [`Hana-Kami-0.4.6-win-x64-portable.exe`](https://github.com/TangerineSpecter/Hana-Kami/releases/latest/download/Hana-Kami-0.4.6-win-x64-portable.exe) |

### 🐧 Linux
| 构建 | 文件 |
|---|---|
| AppImage (x86_64) | [`Hana-Kami-0.4.6-linux-x86_64.AppImage`](https://github.com/TangerineSpecter/Hana-Kami/releases/latest/download/Hana-Kami-0.4.6-linux-x86_64.AppImage) |

### 📦 源码
[源码（zip）](https://github.com/TangerineSpecter/Hana-Kami/archive/refs/tags/v0.4.6.zip) ·
[源码（tar.gz）](https://github.com/TangerineSpecter/Hana-Kami/archive/refs/tags/v0.4.6.tar.gz)

> **验证下载文件：**[`SHA256SUMS.txt`](https://github.com/TangerineSpecter/Hana-Kami/releases/latest/download/SHA256SUMS.txt)——然后运行 `shasum -a 256 -c SHA256SUMS.txt`（macOS/Linux）或 `Get-File-Hash`（Windows）。

> 上面的文件名带有版本号，因此只有在这里是最新发布版本时才会有效。如果链接返回 404，说明你正在阅读旧发布页面——请从[**发布页面**](https://github.com/TangerineSpecter/Hana-Kami/releases/latest)获取当前构建，那里始终是正确的。

---

## 首次启动

- **macOS**——构建使用 **Developer ID 签名**（强化运行时）。如果 macOS 首次打开时仍显示“无法验证开发者”，请右键点击应用 → **打开** → 再次点击**打开**。之后 Agent 首次访问文件夹时，macOS 会针对 Documents/Desktop/Downloads 显示一次隐私提示；允许一次即可永久生效（覆盖应用启动的 `claude` Agent），因为授权绑定到应用的稳定签名。
- **Windows**——目前尚未进行代码签名；SmartScreen 可能显示“Windows 已保护你的电脑”→ **更多信息** → **仍要运行**。
- **Linux**——先让 AppImage 可执行：`chmod +x Hana-Kami-*.AppImage`，然后运行它。

---

## 系统要求
- macOS 12+、Windows 10/11 或现代 Linux 桌面
- 已安装并位于 `PATH` 中的 [Claude Code](https://claude.com/claude-code)（以及相应提供商的 Antigravity `agy` 或 OpenAI `codex` CLI）
- Claude Code 订阅（Hana-Kami 驱动你已有的 `claude` CLI，不会替代它）
- **Realtime Michael**（语音）需要你自己的**拥有 Realtime API 权限的 OpenAI 密钥**——没有它，**Talk** 按钮会保持禁用

---

## 🛠 从源码构建
```bash
git clone https://github.com/TangerineSpecter/Hana-Kami.git
cd hanakami
npm install        # rebuilds node-pty for Electron
npm run dev        # launches the app with hot reload
```
需要 Node 18+ 和 C/C++ 工具链（macOS 使用 Xcode CLT，Windows 使用 Build Tools）。如需自行生成安装程序，可运行 `npm run dist`（当前操作系统），或 `dist:mac` / `dist:win` / `dist:linux`。

---

## 内容一览
- **模拟办公区**——每个 Agent 都是真实的 `claude`（或 `agy` / `codex` / local-provider）伪终端，在可观察的办公区中以头像呈现（`node-pty` · `xterm.js` · Pixi.js）。
- **与 Michael 沟通**——连接 **GOD 编排 Agent 的实时语音通道**，读取蜂巢并在语音回声确认后执行，支持 BYOK 且只在主进程运行。
- **可选引擎 + 招募级能力**——每个招募角色（包括 Michael 自身）都运行在可插拔引擎上，拥有经过同意的技能和 MCP 目录。
- **MemPalace**——全办公区共享的 Markdown 优先语义记忆层；跨会话召回约 12ms。
- **GOD 编排 Agent + 蜂巢**——你只需与一个 Agent 沟通，它会把工作路由给专家并保持自主，仅通过人工介入提示把关键事项（花费、破坏性操作、范围）升级给你。它还可以直接从 Slack 启动临时 Worker，并安全销毁。
- **接入你的环境**——使用你的订阅、设置、技能和 MCP 服务器，并提供带只写密钥代理的集成目录；通过手机上的 `/remote-control` 触达整个办公区。

完整说明见 [CHANGELOG](https://github.com/TangerineSpecter/Hana-Kami/blob/main/CHANGELOG.md)。

---

## 链接
[网站](https://munderdiffl.in/) ·
[仓库](https://github.com/TangerineSpecter/Hana-Kami) ·
[Issues](https://github.com/TangerineSpecter/Hana-Kami/issues) ·
[参与贡献](https://github.com/TangerineSpecter/Hana-Kami/blob/main/CONTRIBUTING.md) ·
[成为赞助者](https://razorpay.me/@hanakamifund)

采用 MIT 许可证。这是一部善意戏仿作品，与 NBC 的 *The Office* 或 Dunder Mifflin 无关联。
