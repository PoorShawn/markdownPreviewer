import { JSX, useMemo } from 'react';
import { Node } from '../types/types';
import { Parser } from '../utils/astParser';
import { parseInline } from '../utils/inlineParser';
import React from 'react';

interface MarkdownProps {
  children: string;
}

export function MarkdownRenderer({ children }: MarkdownProps) {
  const ast = useMemo(() => {
    const parser = new Parser('');
    parser.setSource(children);
    return parser.parse();
  }, [children]);

  return (
    <div className="markdown">
      {renderNode(ast)}
    </div>
  );
}

function renderNode(node: Node): React.ReactNode {
  switch (node.type) {
    case 'root':
      return node.children?.map((child, index) => (
        <React.Fragment key={index}>
          {renderNode(child)}
        </React.Fragment>
      ));

    case 'heading': {
      const HeadingTag = `h${node.depth}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={node.value}>
          {node.children?.map(child => renderNode(child))}
        </HeadingTag>
      );
    }

    case 'paragraph':
      return (
        <p key={node.value}>
          {node.children?.map(child => renderNode(child))}
        </p>
      );

    case 'list': {
      const ListTag = node.ordered ? 'ol' : 'ul';
      return (
        <ListTag key={node.value}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>
              {renderNode(child)}
            </React.Fragment>
          ))}
        </ListTag>
      );
    }

    case 'list_item':
      return (
        <li key={node.value}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>
              {renderNode(child)}
            </React.Fragment>
          ))}
        </li>
      );

    case 'text': {
      const html = parseInline(node.value || '');
      if (html !== node.value) {
        return <span dangerouslySetInnerHTML={{ __html: html }} />;
      }
      return node.value;
    }

    case 'hr':
      return <hr key="hr" />;

    case 'code_block':
      return (
        <pre key={node.value}>
          <code className={node.lang ? `language-${node.lang}` : ''}>
            {node.value}
          </code>
        </pre>
      );

    default:
      return null;
  }
}