# Markdown 预览器

一个基于 React 和 TypeScript 的 Markdown 实时预览工具，从零开始实现 Markdown 解析器。

## 功能特点

- 实时预览 Markdown 文本
- 支持的 Markdown 语法：
  - 标题 (h1-h6)
  - 段落
  - 列表（有序和无序）
  - 代码块
  - 行内格式（粗体、斜体、行内代码）
  - 水平线

## 技术栈

- React 19
- TypeScript
- Vite
- Vitest (测试框架)

## 项目结构

src/
├── components/       # React 组件
├── utils/            # 工具函数，包含解析器
├── types/            # TypeScript 类型定义
└── test/             # 测试文件

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
 ```

### 运行测试
```bash
npm test
 ```

## 实现原理
这个项目从零开始实现了一个 Markdown 解析器，主要包含以下部分：

1. 词法分析 ：将 Markdown 文本解析为标记流
2. 语法分析 ：将标记流转换为抽象语法树 (AST)
3. HTML 渲染 ：将 AST 渲染为 HTML
4. React 组件 ：使用 React 组件展示渲染结果