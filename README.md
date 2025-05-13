# Flow-Render: Markdown 流式渲染演示

这个项目演示了如何使用 HTTP SSE（Server-Sent Events）实现 Markdown 内容的流式渲染。项目包含一个简单的 Express 后端和 React 前端，实现了根据最佳实践的流式 Markdown 解析和渲染。

## 项目结构

```
flow-render/
├── client/            # React前端
│   ├── src/           # 前端源代码
│   └── ...
├── server/            # Express后端
│   ├── example.md     # 示例Markdown文件
│   ├── index.js       # 服务器入口
│   └── ...
└── README.md          # 项目说明
```

## 功能特点

- 使用 Express 实现 SSE 端点
- 使用 EventSource 在前端接收流式数据
- 使用 DOMPurify 进行内容净化，确保安全
- 使用 streaming-markdown 库实现高效的流式 Markdown 解析
- 展示常见 Markdown 元素的渲染效果

## 快速开始

### 启动后端

```bash
cd server
npm install
npm start
```

服务器将在 http://localhost:3001 启动。

### 启动前端

```bash
cd client
npm install
npm run dev
```

前端应用将在 http://localhost:5173 (或其他 Vite 配置的端口) 启动。

## 使用方法

1. 打开前端应用
2. 点击"开始流式渲染"按钮
3. 查看 Markdown 内容如何逐步流式渲染

## 技术实现

### 后端

- 使用 Express 创建 HTTP 服务器
- 通过 SSE 协议流式传输 Markdown 内容
- 将内容分成小块，模拟网络延迟进行传输

### 前端

- 使用 React 和 TypeScript 构建 UI
- 使用原生 EventSource API 接收 SSE 事件
- 使用 DOMPurify 净化内容，防止 XSS 攻击
- 使用 streaming-markdown 高效解析和渲染 Markdown

## 参考资料

- [Chrome 开发者文档：渲染流式 LLM 回答的最佳实践](https://developer.chrome.com/docs/ai/render-llm-responses?hl=zh-cn#dom_sanitizer_and_streaming_markdown_parser)
