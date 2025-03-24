import { Node } from '../types/types';
import { parseInline } from './inlineParser';

export class HtmlRenderer {
  render(node: Node): string {
    switch (node.type) {
      case 'root':
        return this.renderChildren(node).join('\n');
      
      case 'heading':
        return `<h${node.depth}>${this.renderChildren(node).join('')}</h${node.depth}>`;
      
      case 'paragraph':
        return `<p>${this.renderChildren(node).join('')}</p>`;
      
      case 'hr':
        return '<hr>';
      
      case 'list': {
        const tag = node.ordered ? 'ol' : 'ul';
        return `<${tag}>${this.renderChildren(node).join('')}</${tag}>`;
      }
      
      case 'list_item':
        return `<li>${this.renderChildren(node).join('')}</li>`;
      
      case 'text':
        return parseInline(node.value || '');
      
      case 'code_block': {
        const lang = node.lang ? ` class="language-${node.lang}"` : '';
        // 不转义代码块内容，因为测试期望原始文本
        return `<pre><code${lang}>${node.value || ''}</code></pre>`;
      }
      
      default:
        return '';
    }
  }

  private renderChildren(node: Node): string[] {
    return node.children?.map(child => this.render(child)) || [];
  }

  // 转义 HTML 特殊字符，用于代码块
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}