import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface MarkedRendererProps {
  content: string;
  isLoading: boolean;
}

export default function MarkedRenderer({ content, isLoading }: MarkedRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const accumulatedContentRef = useRef<string>('');

  // 配置marked选项
  useEffect(() => {
    // 配置marked - 仅使用有效的选项
    marked.setOptions({
      gfm: true, // 启用GitHub风格的Markdown
      breaks: true // 允许换行符转换为<br>
    });

    // 配置DOMPurify
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
  }, []);

  // 处理内容变化
  useEffect(() => {
    // 检查是否有新内容
    if (!content || content === accumulatedContentRef.current) {
      return;
    }

    try {
      // 更新累积内容
      accumulatedContentRef.current = content;

      if (containerRef.current) {
        // 使用marked将Markdown转换为HTML
        const html = marked.parse(content) as string;

        // 使用DOMPurify净化HTML
        const sanitizedHtml = DOMPurify.sanitize(html);

        // 设置到容器
        containerRef.current.innerHTML = sanitizedHtml;

        // 处理代码块的语法高亮
        highlightCodeBlocks();
      }
    } catch (error) {
      console.error('渲染错误:', error);

      // 降级处理：直接显示文本
      if (containerRef.current) {
        containerRef.current.textContent = content;
      }
    }
  }, [content]);

  // 重置渲染
  useEffect(() => {
    if (isLoading) {
      // 开始新的加载时，重置内容
      accumulatedContentRef.current = '';

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }
  }, [isLoading]);

  // 高亮代码块
  const highlightCodeBlocks = () => {
    if (!containerRef.current) return;

    // 获取所有代码块
    const codeBlocks = containerRef.current.querySelectorAll('pre code');

    // 为每个代码块添加样式
    codeBlocks.forEach((block) => {
      block.classList.add('hljs');
    });
  };

  return (
    <div
      ref={containerRef}
      className="markdown-container"
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        minHeight: '300px',
        textAlign: 'left',
        overflow: 'auto'
      }}
    />
  );
}
