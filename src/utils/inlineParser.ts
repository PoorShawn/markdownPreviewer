// 定义解析规则
const INLINE_RULES = {
  escape: {
    pattern: /\\([*`])/g,
    replacement: '\\$1'  // 直接保持转义字符的形式
  },
  bold: {
    pattern: /(?<!\\)\*\*(?=\S)(.*?\S)(?<!\\)\*\*/g,  // 排除转义的星号
    replacement: '<strong>$1</strong>'
  },
  code: {
    pattern: /(?<!\\)`([^`]+)(?<!\\)`/g,  // 排除转义的反引号
    replacement: '<code>$1</code>'
  },
  italic: {
    pattern: /(?<!\\)\*(?=\S)(.*?\S)(?<!\\)\*/g,  // 排除转义的星号
    replacement: '<em>$1</em>'
  }
};

export function parseInline(text: string): string {
  let result = text;
  
  // 处理标记，注意顺序：粗体 -> 代码 -> 斜体
  result = result.replace(INLINE_RULES.bold.pattern, INLINE_RULES.bold.replacement);
  result = result.replace(INLINE_RULES.code.pattern, INLINE_RULES.code.replacement);
  result = result.replace(INLINE_RULES.italic.pattern, INLINE_RULES.italic.replacement);
  
  // 最后处理转义字符，直接移除反斜杠
  result = result.replace(/\\([*`])/g, '$1');
  
  return result;
}