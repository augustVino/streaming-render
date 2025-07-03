import { useEffect, useMemo, useRef } from 'react';
import * as smd from 'streaming-markdown';
import DOMPurify from 'dompurify';

interface StreamingRendererProps {
  content: string;
  chunk: string;
}

export default function StreamingRenderer({ content, chunk }: StreamingRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parserRef = useRef<any>(null);
  const prevContentRef = useRef<string>('');

  // 初始化解析器
  useEffect(() => {
    DOMPurify.setConfig({
      USE_PROFILES: { html: true },
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
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'id']
    });

    if (containerRef.current && !parserRef.current) {
      try {
        // 创建渲染器
        const renderer = smd.default_renderer(containerRef.current);
        parserRef.current = smd.parser(renderer);
      } catch (error) {
        console.error('初始化解析器失败:', error);
      }
    }

    // 组件卸载时清理解析器
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

  const isSafe = useMemo(() => {
    if (!content) return true;
    DOMPurify.sanitize(content);
    if (DOMPurify.removed.length) {
      //   console.warn('DOMPurify.removed', DOMPurify.removed);
      return false;
    }
    prevContentRef.current = content;
    return true;
  }, [content]);

  // 处理新的 chunk
  useEffect(() => {
    if (!chunk || !parserRef.current) return;

    try {
      if (isSafe) {
        // 解析新内容
        smd.parser_write(parserRef.current, chunk);
      }
    } catch (error) {
      console.error('解析失败:', error);
    }
  }, [chunk, isSafe]);

  // 内容重置时清理容器和解析器
  useEffect(() => {
    if (!content && containerRef.current) {
      containerRef.current.innerHTML = '';

      // 重置解析器
      if (parserRef.current) {
        try {
          smd.parser_end(parserRef.current);
          parserRef.current = null;

          // 重新创建解析器
          const renderer = smd.default_renderer(containerRef.current);
          parserRef.current = smd.parser(renderer);
        } catch (e) {
          console.error('重置解析器失败:', e);
        }
      }
    }
  }, [content]);

  return <div ref={containerRef} className="markdown-container" />;
}
