import { useState } from 'react';
import StreamingRenderer from './StreamingRenderer';
import MarkedRenderer from './MarkedRenderer';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');

  // 处理流式响应
  const handleStreamResponse = async () => {
    try {
      // 开始加载
      setIsLoading(true);
      setContent('');

      // 使用EventSource处理SSE
      const eventSource = new EventSource('http://localhost:3001/api/stream-markdown');

      // 处理接收到的消息
      eventSource.onmessage = (event) => {
        // 检查是否结束
        if (event.data === '[DONE]') {
          eventSource.close();
          setIsLoading(false);
          return;
        }

        try {
          const data = JSON.parse(event.data);
          const newChunk = data.content;

          // 更新内容
          setContent((prev) => prev + newChunk);
        } catch (error) {
          console.error('解析数据时出错:', error);
        }
      };

      // 处理错误
      eventSource.onerror = (error) => {
        console.error('SSE错误:', error);
        eventSource.close();
        setIsLoading(false);
      };
    } catch (error) {
      console.error('请求处理错误:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Markdown流式渲染演示</h1>

      <div className="controls">
        <button onClick={handleStreamResponse} disabled={isLoading}>
          {isLoading ? '加载中...' : '开始流式渲染'}
        </button>
      </div>

      <h2>渲染结果:</h2>
      <div className="render-area">
        <div className="render-area-item">
          <h3>marked</h3>
          <MarkedRenderer content={content} isLoading={isLoading} />
        </div>
        <div className="render-area-item">
          <h3>streaming-markdown</h3>
          <StreamingRenderer content={content} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
