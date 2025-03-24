import { parseBlock } from '../utils/blockParser';

describe('Block Markdown Parser', () => {
  test('解析标题', () => {
    expect(parseBlock('# 一级标题')).toBe('<h1>一级标题</h1>');
    expect(parseBlock('## 二级标题')).toBe('<h2>二级标题</h2>');
    expect(parseBlock('### 三级标题')).toBe('<h3>三级标题</h3>');
  });

  test('解析水平线', () => {
    expect(parseBlock('---')).toBe('<hr>');
    expect(parseBlock('***')).toBe('<hr>');
    expect(parseBlock('___')).toBe('<hr>');
  });

  test('解析段落', () => {
    expect(parseBlock('这是一个段落')).toBe('<p>这是一个段落</p>');
  });

  test('解析多个块', () => {
    const input = `# 标题

这是第一段

---

这是第二段`;
    const expected = '<h1>标题</h1>\n<p>这是第一段</p>\n<hr>\n<p>这是第二段</p>';
    expect(parseBlock(input)).toBe(expected);
  });
});