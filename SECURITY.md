# 安全政策

## 适用范围

Hana-Kami 是一款**本地优先的桌面应用**。它会在 PTY 中启动本地进程，并读写你注册目录下的文件。除用于应用内 Hook 服务器的**本地 Unix 域套接字**外，它不会监听网络端口；按照设计，它没有认证或远程访问面。

## 支持的版本

这是一个早期原型。安全修复仅针对 `main` 分支。

| 版本 | 是否支持 |
|---|---|
| `main` | ✅ |
| older tags | ❌ |

## 报告漏洞

请**不要**为安全问题创建公开 Issue。

- 使用 GitHub 的**私密漏洞报告**：访问 https://github.com/TangerineSpecter/Hana-Kami 的 *Security → Report a
  vulnerability* 标签页；**或者**
- 将漏洞描述、复现步骤和影响发送至 **girichaitanya11@gmail.com**。

我们通常会在几天内确认收到报告。修复完成后会注明你的贡献（除非你希望保持匿名）。

## 给审阅者的说明

- Renderer ↔ main 的 IPC 通过带类型的 `contextBridge`（`window.cth`）传递；Renderer 无法直接访问 Node（`nodeIntegration: false`、`contextIsolation: true`）。
- 所有 `fs:*` / `git:*` IPC 调用都在主进程中进行沙箱隔离和路径校验，并以 Agent 的工作目录为根目录。
- Hive 由**单一提交者**（主进程）提交到本地 git 仓库；Agent 只写入普通文件。
