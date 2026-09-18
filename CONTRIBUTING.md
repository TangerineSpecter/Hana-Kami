# 为 Hana-Kami 贡献代码

感谢你的关注！这是一个早期原型，功能面很广，也有很多可以帮助改进的地方。本指南介绍环境设置、常见陷阱以及保持代码库一致的约定。

## 行为准则

本项目遵循 [Contributor Covenant](./CODE_OF_CONDUCT.md)。参与项目即表示你同意遵守它。

## 开始之前

以下是大多数 Pull Request 容易踩到的约束。先读完它们，比在审查时才发现问题省事得多。

- **一次改动只聚焦一个明确的改进、修复或重构。** 修复加重命名再加重构就是三个 Pull Request，而它们分别合并会比塞在一个 PR 中更快。
- **Hana-Kami 面向 macOS、Windows 和 Linux。** 除非放在明确的运行时平台检查之后，否则每次改动都必须在三个平台上工作。我们的跨平台 Bug 大多与路径有关：使用 `path.join` 和 Node 的路径辅助函数，绝不要手写 `"a/b"` 字符串。
- **带空格的路径是真实存在的。** 有几个已发布 Bug 就是因为蜂巢目录位于名称含空格的目录下。请正确引用并至少测试一次。
- **我们支持十二种 Agent CLI，并且还在增加。** 保持共享行为与提供商无关，把提供商特有逻辑放在明确的检查之后。任何假设只使用 Claude Code 的实现都会破坏其他十一种 CLI。
- **不要假设本机环境。** Agent 使用自己的工作目录和环境；你机器上存在的进程、文件、凭据或 Shell，在 Agent 的环境中可能不存在。
- **新 UI 必须来源于设计 token。** [`DESIGN.md`](./DESIGN.md) 是权威来源。不要使用临时颜色、间距或字体。

## 开发环境设置

### 前置条件

- **macOS、Windows 或 Linux**——已签名/公证的 macOS 构建，以及 Windows 和 Linux 构建，都从[发布页面](https://github.com/TangerineSpecter/Hana-Kami/releases/latest)提供。仍然非常欢迎跨平台冒烟测试和修复（见[适合入门的方向](#good-first-areas)）。
- **Node.js 18+** 和 npm。
- 用于构建 `node-pty` 原生插件的 **C/C++ 工具链**。macOS：
  ```bash
  xcode-select --install
  ```
  Windows/Linux 请遵循 [`node-pty` 自身的前置条件](https://github.com/microsoft/node-pty#dependencies)。
- 如果希望 Agent 真正运行 `claude`（默认命令），请将 **[Claude Code](https://claude.com/claude-code)** 放在 `PATH` 中。其他命令同样可以使用。

### 安装并运行

```bash
git clone <your-fork-url> hanakami
cd hanakami
npm install        # postinstall rebuilds node-pty against Electron's ABI
npm run dev        # live-reloading Electron build
```

> [!IMPORTANT]
> **最常见的环境设置失败原因是原生 `node-pty` 重建失败。** `postinstall` 脚本会运行 `electron-rebuild`，使 `node-pty` 与 Electron 的 ABI 匹配。如果启动时看到 “wrong ELF/Mach-O” 或 “NODE_MODULE_VERSION” 错误，请先确认已安装 C/C++ 工具链，然后重新运行 `npm install`（会再次触发 `postinstall`）。

## 必须提供证据

**每个 Pull Request 都必须展示修改前和修改后。**静态内容使用截图，有动态内容使用录屏，并放在 PR 模板提供的 `### Before` 和 `### After` 标题下。

这是强制要求。打开 PR 时立即运行 `PR evidence` 检查，未通过的 PR 不能合并。修复描述并保存后，检查会重新运行。它会分别读取两个标题，因此把两张图片都放在其中一个标题下不会通过——审阅者必须能分辨哪张是修改前、哪张是修改后。

**“我的改动没有 UI”不构成例外。**它只会改变证据形式，不会改变要求：

| 改动类型 | 修改前/修改后的证据 |
|---|---|
| 视觉改动 | 同一个视图两张图。窗口大小、主题和数据相同。 |
| Bug 修复 | 展示 Bug 发生，再展示执行相同步骤后不再发生。 |
| 终端 / CLI | 会话录屏，或将输出以文本粘贴。 |
| 性能 | 修改前后的测量结果，使用同一台机器。 |
| 崩溃 / 卡死 | 展示失败，再展示相同路径成功完成。 |
| 仅测试 | 测试套件失败，再展示测试套件通过。 |

请让两张截图可比较。窗口大小不同、明暗主题不同或数据不同，都会让审阅者比较截图而不是比较你的改动。

唯一的例外是 `no-visual-change` 标签，由维护者用于确实没有可观察变化的改动：CI 调整、错别字、依赖升级。你不能自行添加；如果改动确实可见却申请该标签，耗费的时间会比截图更多。

## 创建 PR 之前

1. **附上修改前和修改后。**见上文。这是最容易导致 PR 未读即关闭的一项，所以要先做，不要最后才补。
2. **保持类型检查通过：**`npm run typecheck`（同时运行 Node 和 Web TS 项目）。
3. **运行测试：**`npm run test:focused`。如果改变了行为，请为它添加测试——没有测试的 Bug 修复，迟早会再次出现。
4. **确认生产构建可用：**`npm run build`。
5. **保持视觉风格一致。**任何新 UI **都必须**使用 [`DESIGN.md`](./DESIGN.md) / `src/renderer/src/design/tokens.ts` 中的设计 token——不要使用临时颜色、间距或字体。`tokens.ts` 与 `tokens.css` 必须保持镜像；修改一个时要同时修改另一个。
6. **阅读自己的 diff。**逐行阅读。调试日志、注释掉的代码，以及对其他无关文件的重新格式化，都会导致 PR 被退回。
7. **让你的编码 Agent 审阅自己的 PR，并粘贴它的发现。**我们发布的是 Agent 工作台，请使用一个 Agent。要求它重点检查跨平台行为、带空格的路径、改动是否在受支持的 CLI 之间保持提供商中立、热路径性能以及明显的安全风险。一份简短、诚实的总结，包括它指出了什么以及你决定不改什么，比一份“完全没问题”的报告更有价值，通常也能减少一轮审查往返。这是建议，不是硬性要求。

## 我们的标准

我们收到的 Pull Request 多到无法逐一仔细审阅，因此标准较高，写清楚也方便所有人。完成上面的清单后，基本就没问题了。下面这些情况我们会直接关闭而不是协商，因为避免它们总比审查时修复更省事：

- **没有修改前/修改后的证据**，也没有 `no-visual-change` 标签。
- **一个 PR 包含多个改动。**修复加重构再加重命名就是三个 PR。拆开后每个 PR 都会更快合并。
- **对文件进行整体重新格式化**，或者让真正的改动被空白和 import 排序淹没的 diff。
- **没人要求的重写。**大型架构改动必须在写代码**之前**先有 Issue 或达成共识的 [讨论](https://github.com/TangerineSpecter/Hana-Kami/discussions)。我们宁愿让你改掉一段文字，也不愿让你浪费一周工作。
- **生成或无署名的内容**——不是你创作的、或没有兼容许可的艺术素材，或者描述与 diff 实际行为不一致。
- **描述中没有说明理由的依赖新增。**新的运行时依赖必须解释为什么一个单文件辅助函数无法解决问题。
- **14 天没有回应审查意见。**准备好后随时重新打开；不会丢失任何内容。

这些要求不是针对新手。没有贡献经验的人提交的小而聚焦、证据充分的 PR，会优先于有经验者提交的大型 PR 得到审阅。

## 项目结构

| 路径 | 内容 |
|---|---|
| `src/main/` | Electron 主进程——PTY（`pty.ts`）、fs/git 桥接、蜂巢（`hive.ts`、`hooks.ts`、`memory.ts`）和配置。 |
| `src/preload/` | Context-bridge IPC 接口。 |
| `src/renderer/` | React UI、Pixi.js 办公区场景（`scene/office/`）、组件、设计系统和 stores。 |
| `tools/mapgen/` | 构建/渲染 Tiled 办公区地图的 Python 辅助工具。 |

数据流概览、逐模块结构和设计系统见 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。

## 适合入门的方向

- **接入真实 Claude Code Hook 事件**——当前头像行为由模拟事件循环（`src/renderer/src/store/mockEvents.ts`）驱动。将其替换为真实工具事件是下一阶段的重点里程碑。
- 添加 Agent 流程和配置抽屉。
- 跨平台冒烟测试——Windows 和 Linux 构建已发布，但真实环境覆盖（WSL2、各种发行版、不常见的 Shell）仍然不足。

## Commit 与 PR 约定

- 从 `main` 分支。每个 PR 只做一个改动——见[会导致 PR 关闭的情况](#会导致-pr-关闭的情况)。
- 清晰说明*改了什么*以及*为什么改*。我们可以阅读 diff，但读不到你的思考过程。
- 说明如何测试以及在哪个操作系统上测试。“已在本地测试”没有信息量。
- 链接你修复的 Issue：`Closes #123`。
- 不要提交 `node_modules/`、`out/` 或构建产物（它们已被 gitignore）。
- 审查开始后不要强制推送。这样会丢掉审阅者正在依据的比较结果。
- **绝不要在提交消息中放入凭据、token、内部指标或客户数据。**已推送的提交消息公开且永久存在，一旦被获取，之后无法通过重写撤回。

## 关于素材的说明

内置图块集是 LimeZu 的 *Modern Interiors*，依据 **Complete Version licence** 使用。见 [`ATTRIBUTION.md`](./src/renderer/src/assets/ATTRIBUTION.md)。该许可要求署名 LimeZu，因此不要从 README、应用或网站中删除署名。Office 角色通过 `portraitArt.ts` 程序绘制，不带第三方许可。
如果你贡献新的艺术素材，必须是你自己的作品或使用兼容许可，并将其加入 `ATTRIBUTION.md`。不要添加未经许可的素材。

## 问题

请创建[讨论或 Issue](../../issues)，我们很乐意帮助你熟悉项目。
