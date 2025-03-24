import { parseInline } from '../utils/inlineParser';

describe('Inline Markdown Parser', () => {
  test('解析粗体文本', () => {
    expect(parseInline('**粗体**')).toBe('<strong>粗体</strong>');
  });

  test('解析斜体文本', () => {
    expect(parseInline('*斜体*')).toBe('<em>斜体</em>');
  });

  test('解析行内代码', () => {
    expect(parseInline('`代码`')).toBe('<code>代码</code>');
  });

  test('解析转义字符', () => {
    expect(parseInline('\\*不解析\\* 但**解析**'))
      .toBe('*不解析* 但<strong>解析</strong>');
  });

  test('混合解析', () => {
    expect(parseInline('**粗体** *斜体* `代码`'))
      .toBe('<strong>粗体</strong> <em>斜体</em> <code>代码</code>');
  });
});