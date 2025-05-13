const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 启用CORS，允许前端访问
app.use(cors());

// 读取Markdown文件
const readMarkdownFile = () => {
  return fs.readFileSync(path.join(__dirname, 'example.md'), 'utf-8');
};

// SSE端点，流式传输Markdown内容
app.get('/api/stream-markdown', (req, res) => {
  // 设置SSE头部
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const markdown = readMarkdownFile();

  // 将Markdown分成小片段
  const chunks = [];
  const chunkSize = 8; // 每个片段的字符数

  for (let i = 0; i < markdown.length; i += chunkSize) {
    chunks.push(markdown.substring(i, i + chunkSize));
  }

  // 定义一个函数来按顺序发送数据
  let index = 0;
  const sendNextChunk = () => {
    if (index < chunks.length) {
      // 发送数据格式: 'data: 内容\n\n'
      res.write(`data: ${JSON.stringify({ content: chunks[index] })}\n\n`);
      index++;
      // 模拟网络延迟，每100毫秒发送一个片段
      setTimeout(sendNextChunk, 300);
    } else {
      // 所有片段都已发送，结束响应
      res.write('data: [DONE]\n\n');
      res.end();
    }
  };

  // 开始发送数据
  sendNextChunk();
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
