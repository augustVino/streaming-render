import DOMPurify from 'dompurify';

// 配置并初始化 DOMPurify
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

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};
