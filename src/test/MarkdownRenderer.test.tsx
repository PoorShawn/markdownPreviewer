import { render } from '@testing-library/react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

describe('MarkdownRenderer', () => {
  // 修改辅助函数，将 AST 节点转换为对应的 Markdown 文本
  const renderMarkdown = (text: string) => {
    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>);
    return container;
  };

  test('渲染根节点', () => {
    const container = renderMarkdown('测试文本');
    expect(container.textContent).toBe('测试文本');
  });

  test('渲染标题节点', () => {
    const container = renderMarkdown('# 标题');
    expect(container.querySelector('h1')?.textContent).toBe('标题');
  });

  test('渲染段落节点', () => {
    const container = renderMarkdown('段落内容');
    expect(container.querySelector('p')?.textContent).toBe('段落内容');
  });

  test('渲染有序列表', () => {
    const container = renderMarkdown('1. 列表项1');
    const ol = container.querySelector('ol');
    expect(ol).not.toBeNull();
    const li = container.querySelector('li');
    expect(li?.textContent).toBe('列表项1');
  });

  test('渲染无序列表', () => {
    const container = renderMarkdown('- 列表项1\n');
    const ul = container.querySelector('ul');
    const li = ul?.querySelector('li');
    expect(li?.textContent).toBe('列表项1');
  });

  test('渲染带内联标记的文本', () => {
    const container = renderMarkdown('**粗体文本**');
    expect(container.querySelector('strong')?.textContent).toBe('粗体文本');
  });

  test('渲染普通文本', () => {
    const container = renderMarkdown('普通文本');
    expect(container.textContent).toBe('普通文本');
  });

  test('渲染水平线', () => {
    const container = renderMarkdown('---');
    expect(container.querySelector('hr')).toBeTruthy();
  });

  test('渲染代码块', () => {
    const container = renderMarkdown('```javascript\nconst test = "code";\n```');
    const codeElement = container.querySelector('code');
    expect(codeElement?.className).toBe('language-javascript');
    expect(codeElement?.textContent?.trim()).toBe('const test = "code";');
  });

  test('渲染嵌套结构', () => {
    const markdown = `# 标题

段落`;
    const container = renderMarkdown(markdown);
    expect(container.querySelector('h1')?.textContent).toBe('标题');
    expect(container.querySelector('p')?.textContent).toBe('段落');
  });
});