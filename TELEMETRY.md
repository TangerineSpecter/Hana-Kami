# 遥测

Hana-Kami 收集少量**匿名**使用事件，用于了解产品采用情况（有多少人启动应用、是否成功运行第一个 Agent、哪些功能被使用）并改进产品。本文件是完整且权威的协议：**如果某个事件或属性没有列在这里，应用就不会发送它。**实现位于 [`src/main/analytics.ts`](src/main/analytics.ts)，并将此列表作为严格白名单执行——代码与本文件保持同步；由于仓库开源，你可以自行验证。

## 发送的内容

每个事件只携带以下通用属性：

| 属性 | 示例 | 说明 |
| --- | --- | --- |
| `app_version` | `0.4.2` | 应用自身的版本 |
| `os` | `darwin` / `win32` / `linux` | 平台，仅此而已 |
| `arch` | `arm64` / `x64` | CPU 架构 |

事件列表：

| 事件 | 额外属性 | 触发时机 |
| --- | --- | --- |
| `first_run` | — | 应用首次启动时触发一次 |
| `app_launched` | — | 每次应用启动 |
| `update_applied` | `from_version`、`to_version` — 版本字符串；早于该事件的安装使用 `unknown`；`via` — `auto`（由应用自身更新器安装）、`manual`、`unknown` 之一 | 应用版本变化后首次启动时触发一次 |
| `agent_spawned` | `provider`（CLI 引擎名称，例如 `claude`、`codex`） | 启动 Agent 终端 |
| `onboarding_completed` | `provider`（设置向导中选择的 CLI 引擎） | 引导流程完成时触发一次 |
| `agent_spawn_attempted` | `provider` | 每次请求启动 Agent，用于与 `agent_spawned` 对比 |
| `agent_spawn_failed` | `provider`；`reason` 为 `cli_missing`、`cwd_missing`、`already_running`、`spawn_error` 之一 | 请求的启动没有成功运行 Agent |
| `agent_install_started` | `provider`；`rung` 为 `npm`、`node-then-npm`、`native` 之一 | 引擎 CLI 缺失，因此开始运行内置自动安装器 |
| `agent_install_finished` | `provider`；`rung` 同上；`outcome` 为 `agent_launched`、`install_failed` 之一 | 自动安装器退出 |
| `message_sent` | `surface` — `terminal`、`composer`、`steer`、`hive` 之一 | 每次**你**向 Agent 发送消息。只统计消息数量，不记录其他内容：消息本身永远不会被读取、测量或哈希 |
| `feature_used` | `feature` — `slack_trigger`、`webhook_trigger`、`hire_install`、`voice_dictation` 之一 | 每个应用会话中每项功能最多一次 |
| `session_ended` | `duration_bucket` — `<5m`、`5-30m`、`30m-2h`、`2-8h`、`8h+` 之一 | 退出时（粗粒度分桶，永不发送原始时长） |

### 关于 `message_sent`

这是唯一会在你工作过程中触发的事件，因此有必要准确说明它会做什么、不会做什么。

- 每发送一条消息，就在发送时统计**一个事件**。统计发生在*提交*时——按下 Enter 或发送按钮——绝不会按击键次数统计。应用不会报告你输入过程中的内容。
- `surface` 只说明消息从哪里发出：`terminal`（输入到 Agent 终端）、`composer`（Agent 消息队列输入框）、`steer`（Agent 控制条上的 steer 输入框）或 `hive`（调度、线程回复或 ASK ME 答案）。
- **Agent 彼此发送的消息**不会统计。只有来自人的消息会被统计。
- 没有任何属性携带消息内容。不会有文本、长度、字符数、前 N 个字符，也不会有正文哈希——事件恰好只有一个属性，就是上面所述的来源名称。应用用于报告它的通道根本不接受消息参数，因此不存在内容意外发送出去的形式。

它只用于回答一个问题：有人成功运行 Agent 后，是否真的与它交流过？没有这个事件，就无法区分一个启动后被忽略的 Agent 和一个每天都在使用的 Agent。

## 永不发送的内容

不发送提示词，不发送 Agent 转录或输出，不发送文件路径、仓库名、分支名或主机名，不发送邮箱地址、账号标识、机器标识或 API 密钥。不发送任何自由文本——`analytics.ts` 中的属性白名单会丢弃上表之外的所有内容。

## 如何保持匿名

- 事件发送到 [PostHog](https://posthog.com)（PostHog 本身开源），并设置 `$process_person_profile: false`，因此它们是**匿名事件**：不会创建个人资料，也不会存储身份信息。
- 唯一标识符是首次运行时生成的**随机 UUID**，存储在应用用户数据目录中（`telemetry-install-id`）。它不是从你的机器信息推导出的，删除应用数据时也会删除它。
- 遥测额外存储的唯一内容是本次安装上一次运行的应用版本（`telemetry-last-version`，与安装 ID 放在一起）——它用于让 `update_applied` 记录来源版本，并会随着应用数据一同删除。
- 为设置 `via`，应用会读取自己的更新日志（`updater.log`，保存在同一个用户数据目录中），判断当前版本是否由更新器下载并由你要求重启进入，以及该次重启是否确实完成安装：日志会在每个版本启动时记录版本，因此之后启动的不是当前版本就意味着安装由其他方式完成。离开机器的只有这个单词结果——日志中的任何行、路径或消息都不会发送。
- 不会推导任何形式的地理位置。应用在每个事件中发送 `$ip: null` 并禁用 GeoIP 查询，因此不会从你的连接推导或在事件中存储 IP 地址、国家、城市、邮编或坐标。

## 退出遥测

以下任一方式都可以完全禁用遥测：

1. **设置 → 通用 → 匿名使用统计 → 关闭**（或在引导流程中取消勾选“分享匿名使用统计”）。立即生效。
2. 设置标准的 [`DO_NOT_TRACK`](https://consoledonottrack.com) 环境变量（值为除 `0` 之外的任意内容）。该设置无条件生效。
3. **从源码构建。** PostHog 密钥只在官方发布 CI 中注入；本地构建或 Fork 构建不会包含密钥，analytics 模块会变成空操作——Fork 永远不会向任何地方发送事件。

## 自托管说明

PostHog 开源且支持自托管。官方构建指向 PostHog Cloud（美国）；端点是构建时设置（`POSTHOG_HOST`），因此项目迁移到自托管实例无需修改代码。
