// 定义块级解析规则
const BLOCK_RULES = {
  header: {
    pattern: /^(#{1,6})\s(.+)$/,
    replacement: (hashes: string, content: string) => 
      `<h${hashes.length}>${content}</h${hashes.length}>`
  },
  hr: {
    pattern: /^([-*_])\1{2,}$/,
    replacement: '<hr>'
  }
};

export function parseBlock(text: string): string {
  // 按空行分割文本块
  const blocks = text.split(/\n\n+/);
  
  return blocks.map(block => {
    // 移除首尾空白
    block = block.trim();
    
    // 空块返回空字符串
    if (!block) return '';
    
    // 处理水平线
    if (BLOCK_RULES.hr.pattern.test(block)) {
      return BLOCK_RULES.hr.replacement;
    }
    
    // 处理标题
    const headerMatch = block.match(BLOCK_RULES.header.pattern);
    if (headerMatch) {
      return BLOCK_RULES.header.replacement(headerMatch[1], headerMatch[2]);
    }
    
    // 其他块作为段落处理
    return `<p>${block}</p>`;
  }).filter(Boolean).join('\n');
}