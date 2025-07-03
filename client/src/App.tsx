import React from 'react';
import { useStream } from './useStream';
import StreamingRenderer from './StreamingRenderer';
import MarkedRenderer from './MarkedRenderer';
import RendererContainer from './RendererContainer';
import './App.css';

function App() {
  const { isLoading, content, chunk, triggerStream } = useStream();

  return (
    <div className="app-container">
      <h1>Markdown流式渲染演示</h1>

      <div className="controls">
        <button onClick={triggerStream} disabled={isLoading}>
          {isLoading ? '加载中...' : '获取数据'}
        </button>
      </div>

      <h2>渲染结果:</h2>
      <div className="render-area">
        <RendererContainer title="marked">
          <MarkedRenderer content={content} />
        </RendererContainer>
        <RendererContainer title="streaming-markdown">
          <StreamingRenderer content={content} chunk={chunk} />
        </RendererContainer>
      </div>
    </div>
  );
}

export default App;
