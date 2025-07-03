import { useEffect, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkedRendererProps {
  content: string;
}

export default function MarkedRenderer({ content }: MarkedRendererProps) {
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
  }, []);

  const html = useMemo(() => {
    const _content = marked.parse(content);
    return DOMPurify.sanitize(_content as string);
  }, [content]);

  return <div className="markdown-container" dangerouslySetInnerHTML={{ __html: html }} />;
}
