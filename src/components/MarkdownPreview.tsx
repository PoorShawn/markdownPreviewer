import { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import './MarkdownPreview.css';

export function MarkdownPreview() {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="markdown-preview">
      <div className="input-area">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="输入 Markdown 文本..."
        />
      </div>
      <div className="output-area">
        <MarkdownRenderer>{input}</MarkdownRenderer>
      </div>
    </div>
  );
}