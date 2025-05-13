import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import * as smd from 'streaming-markdown';

interface StreamingRendererProps {
  content: string;
  isLoading: boolean;
}

export default function StreamingRenderer({ content, isLoading }: StreamingRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parserRef = useRef<any>(null);
  const prevContentRef = useRef<string>('');

  // 处理内容变化
  useEffect(() => {
    // 如果没有新内容，则跳过
    if (!content || content === prevContentRef.current) {
      return;
    }

    // 获取新增的内容
    const newContent = content.slice(prevContentRef.current.length);
    prevContentRef.current = content;

    if (newContent) {
      // 初始化解析器
      if (!parserRef.current && containerRef.current) {
        try {
          console.log('初始化解析器');
          // 配置DOMPurify
          DOMPurify.setConfig({
            USE_PROFILES: { html: true },
            RETURN_DOM_FRAGMENT: false,
            ALLOWED_TAGS: [
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'p',
              'a',
              'ul',
              'ol',
              'li',
              'blockquote',
              'code',
              'pre',
              'strong',
              'em',
              'del',
              'table',
              'thead',
              'tbody',
              'tr',
              'th',
              'td',
              'hr',
              'br',
              'img',
              'span',
              'div'
            ],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class']
          });

          // 创建渲染器
          const renderer = smd.default_renderer(containerRef.current);
          parserRef.current = smd.parser(renderer);
        } catch (error) {
          console.error('初始化解析器失败:', error);
        }
      }

      // 检查解析器状态
      if (parserRef.current) {
        try {
          console.log('解析内容片段:', JSON.stringify(newContent));

          // 特殊字符处理：有些流式块可能拆分了特殊字符，如"*"、"#"等
          // 这里我们直接传给parser，由parser自己处理
          smd.parser_write(parserRef.current, newContent);
        } catch (error) {
          console.error('解析失败:', error);

          // 解析失败时，尝试回退到简单渲染模式
          if (containerRef.current) {
            try {
              const textNode = document.createTextNode(newContent);
              containerRef.current.appendChild(textNode);
            } catch (fallbackError) {
              console.error('回退渲染也失败:', fallbackError);
            }
          }
        }
      }
    }
  }, [content]);

  // 重置解析器
  useEffect(() => {
    if (!isLoading) {
      // 当加载结束时，结束解析
      if (parserRef.current) {
        try {
          console.log('结束解析');
          smd.parser_end(parserRef.current);

          // 不要销毁parser，让它保持最终状态
        } catch (e) {
          console.error('结束解析器失败:', e);
        }
      }
    } else {
      // 开始新的加载时，重置解析器和内容
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      prevContentRef.current = '';

      if (parserRef.current) {
        try {
          smd.parser_end(parserRef.current);
          parserRef.current = null;
        } catch (e) {
          console.error('重置解析器失败:', e);
        }
      }
    }
  }, [isLoading]);

  // 组件卸载时清理解析器
  useEffect(() => {
    return () => {
      if (parserRef.current) {
        try {
          smd.parser_end(parserRef.current);
          parserRef.current = null;
        } catch (e) {
          console.error('清理解析器失败:', e);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="markdown-container"
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        minHeight: '300px',
        width: '800px',
        margin: '0 auto',
        textAlign: 'left',
        overflow: 'auto'
      }}
    />
  );
}
