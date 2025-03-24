// AST 节点类型定义
export type NodeType = 
  | 'root'
  | 'paragraph'
  | 'heading'
  | 'text'
  | 'strong'
  | 'emphasis'
  | 'code'
  | 'code_block'  // 新增代码块类型
  | 'hr'
  | 'list'
  | 'list_item';

export interface Node {
  type: NodeType;
  children?: Node[];
  value?: string;
  depth?: number;    // 用于标题层级
  ordered?: boolean; // 用于列表类型
  lang?: string;     // 用于代码块语言
}