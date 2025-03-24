import { Node } from '../types/types';

export class Parser {
  private pos = 0;
  private source = '';
  private contextStack: string[] = ['root']; // 添加上下文栈

  constructor(source: string) {
    this.source = source;
  }

  // 添加公共方法来设置 source
  setSource(source: string) {
    this.source = source;
    this.pos = 0;  // 重置位置
    this.contextStack = ['root']; // 重置上下文栈
  }

  // 上下文管理方法
  private enterContext(type: string) {
    this.contextStack.push(type);
  }

  private exitContext() {
    return this.contextStack.pop();
  }

  private currentContext() {
    return this.contextStack[this.contextStack.length - 1];
  }

  parse(): Node {
    const root: Node = {
      type: 'root',
      children: []
    };

    while (this.pos < this.source.length) {
      const node = this.parseBlock();
      if (node) {
        root.children?.push(node);
      }
    }

    return root;
  }

  private parseBlock(): Node | null {
    // 跳过空白行
    this.skipBlankLines();
    
    if (this.pos >= this.source.length) {
      return null;
    }

    // 尝试各种块级元素解析
    return (
      this.parseCodeBlock() ||
      this.parseHeading() ||
      this.parseHorizontalRule() ||
      this.parseList() ||
      this.parseParagraph()
    );
  }

  // 新增代码块解析
  private parseCodeBlock(): Node | null {
    const match = /^```([a-z]*)\n([\s\S]*?)```\s*(?:\n|$)/m.exec(this.source.slice(this.pos));
    if (!match) return null;

    this.pos += match[0].length;
    return {
      type: 'code_block',
      lang: match[1] || '',
      value: match[2]
    };
  }

  private parseHeading(): Node | null {
    const match = /^(#{1,6})\s+(.+)(?:\n|$)/.exec(this.source.slice(this.pos));
    if (!match) return null;

    this.pos += match[0].length;
    return {
      type: 'heading',
      depth: match[1].length,
      children: [{ type: 'text', value: match[2].trim() }]
    };
  }

  private parseHorizontalRule(): Node | null {
    const match = /^(?:[-*_]){3,}\s*(?:\n|$)/.exec(this.source.slice(this.pos));
    if (!match) return null;

    this.pos += match[0].length;
    return { type: 'hr' };
  }

  private parseList(): Node | null {
    // 获取当前行
    const currentLine = this.getCurrentLine();
    if (!currentLine) return null;
  
    // 检查是否是无序列表项
    let listItemMatch = /^(\s*)[-*+]\s+(.+)$/.exec(currentLine);
    let isOrdered = false;
  
    // 如果不是无序列表，检查是否是有序列表
    if (!listItemMatch) {
      listItemMatch = /^(\s*)(\d+)\.\s+(.+)$/.exec(currentLine);
      if (!listItemMatch) return null;
      isOrdered = true;
    }
  
    // 计算缩进级别
    const indentSize = listItemMatch[1].length;
  
    const list: Node = {
      type: 'list',
      ordered: isOrdered,
      children: []
    };
  
    // 进入列表上下文
    this.enterContext('list');
  
    // 解析列表项
    while (this.pos < this.source.length) {
      const line = this.getCurrentLine();
      if (!line) break;
  
      // 尝试匹配无序列表项
      let itemMatch = /^(\s*)[-*+]\s+(.+)$/.exec(line);
      let currentItemContent = '';
      let currentIsOrdered = false;
  
      // 如果不是无序列表项，尝试匹配有序列表项
      if (!itemMatch) {
        itemMatch = /^(\s*)(\d+)\.\s+(.+)$/.exec(line);
        if (!itemMatch) break;
        currentIsOrdered = true;
        currentItemContent = itemMatch[3];
      } else {
        currentItemContent = itemMatch[2];
      }
      
      // 如果列表类型不匹配，则结束当前列表
      if (isOrdered !== currentIsOrdered) break;
  
      // 检查缩进级别
      const currentIndent = itemMatch[1].length;
      
      // 如果缩进更小，说明当前列表结束了
      if (currentIndent < indentSize && this.currentContext() === 'list') {
        break;
      }
      
      // 如果缩进更大，说明是子列表
      if (currentIndent > indentSize) {
        // 递归解析子列表
        const subList = this.parseList();
        if (subList && list.children && list.children.length > 0) {
          // 将子列表添加到最后一个列表项的子元素中
          const lastItem = list.children[list.children.length - 1];
          if (!lastItem.children) lastItem.children = [];
          lastItem.children.push(subList);
        }
        continue;
      }
  
      // 处理当前级别的列表项
      this.pos += line.length + 1; // +1 是为了跳过换行符
      
      list.children?.push({
        type: 'list_item',
        children: [{ type: 'text', value: currentItemContent.trim() }]
      });
  
      this.skipBlankLines();
    }
  
    // 退出列表上下文
    this.exitContext();
    
    return list;
  }

  private parseParagraph(): Node {
    const endPos = this.source.indexOf('\n\n', this.pos);
    const content = endPos === -1 
      ? this.source.slice(this.pos)
      : this.source.slice(this.pos, endPos);

    this.pos = endPos === -1 ? this.source.length : endPos + 2;

    return {
      type: 'paragraph',
      children: [{ type: 'text', value: content.trim() }]
    };
  }

  private skipBlankLines() {
    const match = /^(?:\s*\n)*/.exec(this.source.slice(this.pos));
    if (match) {
      this.pos += match[0].length;
    }
  }

  // 获取当前行
  private getCurrentLine(): string | null {
    const endOfLine = this.source.indexOf('\n', this.pos);
    if (endOfLine === -1) {
      if (this.pos >= this.source.length) return null;
      return this.source.slice(this.pos);
    }
    return this.source.slice(this.pos, endOfLine);
  }
}