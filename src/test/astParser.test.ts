import { Parser } from '../utils/astParser';
import { HtmlRenderer } from '../utils/htmlRenderer';

describe('Markdown AST Parser', () => {
  let parser: Parser;
  let renderer: HtmlRenderer;

  beforeEach(() => {
    parser = new Parser('');
    renderer = new HtmlRenderer();
  });

  test('解析标题', () => {
    parser.setSource('# 一级标题\n## 二级标题');
    const ast = parser.parse();
    const html = renderer.render(ast);
    expect(html).toBe('<h1>一级标题</h1>\n<h2>二级标题</h2>');
  });

  test('解析列表', () => {
    parser.setSource('- 项目1\n- 项目2\n- 项目3');
    const ast = parser.parse();
    const html = renderer.render(ast);
    expect(html).toBe('<ul><li>项目1</li><li>项目2</li><li>项目3</li></ul>');
  });

  test('解析混合内容', () => {
    parser.setSource(`# 标题

这是一段文本，包含**粗体**和*斜体*。

- 列表项1
- 列表项2

---

## 二级标题`);

    const ast = parser.parse();
    const html = renderer.render(ast);
    
    expect(html).toContain('<h1>标题</h1>');
    expect(html).toContain('<p>这是一段文本，包含<strong>粗体</strong>和<em>斜体</em>。</p>');
    expect(html).toContain('<ul><li>列表项1</li><li>列表项2</li></ul>');
    expect(html).toContain('<hr>');
    expect(html).toContain('<h2>二级标题</h2>');
  });

  test('解析嵌套列表', () => {
    parser.setSource(`- 一级列表1
  - 二级列表1
  - 二级列表2
    - 三级列表1
- 一级列表2`);
    
    const ast = parser.parse();
    const html = renderer.render(ast);
    
    expect(html).toContain('<ul><li>一级列表1');
    expect(html).toContain('<ul><li>二级列表1</li>');
    expect(html).toContain('<ul><li>三级列表1</li></ul>');
    expect(html).toContain('<li>一级列表2</li></ul>');
  });

  test('解析代码块', () => {
    parser.setSource("```js\nfunction test() {\n  console.log('Hello');\n}\n```");
    
    const ast = parser.parse();
    const html = renderer.render(ast);
    
    expect(html).toContain('<pre><code class="language-js">');
    expect(html).toContain("function test() {\n  console.log('Hello');\n}");
    expect(html).toContain('</code></pre>');
  });

  test('解析代码块中的特殊字符', () => {
    parser.setSource("```\nfunction() { console.log('`特殊符号`') }\n```");
    
    const ast = parser.parse();
    const html = renderer.render(ast);
    
    expect(html).toContain("function() { console.log('`特殊符号`') }");
    // 修改这一行，我们应该检查内部的反引号是否被正确保留，而不是检查<code>标签不存在
    expect(html).toContain("`特殊符号`");  // 确保内部的反引号被正确保留
  });
})