import React, { useState } from 'react';

export const useStream = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [chunk, setChunk] = useState('');

  const triggerStream = async () => {
    try {
      // 开始加载
      setIsLoading(true);
      setContent('');
      setChunk('');

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
          setChunk(newChunk);
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

  return {
    isLoading,
    content,
    chunk,
    triggerStream
  };
};
