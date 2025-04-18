import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import "./App.css";

function App() {
  const [value, setValue] = useState<string>("# Welcome to Yamed\n\nStart writing your markdown here...");
  const [isFocused, setIsFocused] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle focus mode with Cmd/Ctrl + Shift + F
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        setIsFocused(prev => !prev);
      }
      // Show toolbar with Cmd/Ctrl + /
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        setShowToolbar(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const newValue = textarea.value;
    setValue(newValue);

    // Handle list creation
    if (newValue.endsWith('\n')) {
      const lines = newValue.split('\n');
      const currentLine = lines[lines.length - 2]; // The line before the newline

      // Check if we're in a list
      if (currentLine.match(/^[-*+]\s/)) {
        // Continue the list
        const newLines = [...lines, '- '];
        setValue(newLines.join('\n'));

        // Set cursor position after the new list item
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = newLines.join('\n').length;
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const lines = value.split('\n');
      const currentLine = lines[lines.length - 1];

      // If we're in a list and the current line is empty, end the list
      if (currentLine.match(/^[-*+]\s$/) || currentLine === '') {
        const prevLine = lines[lines.length - 2];
        if (prevLine && prevLine.match(/^[-*+]\s/)) {
          e.preventDefault();
          const newLines = [...lines.slice(0, -1), ''];
          setValue(newLines.join('\n'));
        }
      }
    }
  };

  return (
    <main className={`container ${isFocused ? 'focus-mode' : ''}`}>
      <div className="editor-container">
        <div className={`toolbar ${showToolbar ? 'visible' : ''}`}>
          <button onClick={() => setShowToolbar(!showToolbar)}>☰</button>
          <button onClick={() => setIsFocused(!isFocused)}>👁️</button>
        </div>
        <div className="single-window-editor">
          <div className="editor-content">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              className="typora-style-editor"
              placeholder="Start writing your markdown here..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="markdown-paragraph" {...props} />,
                  h1: ({node, ...props}) => <h1 className="markdown-heading" {...props} />,
                  h2: ({node, ...props}) => <h2 className="markdown-heading" {...props} />,
                  h3: ({node, ...props}) => <h3 className="markdown-heading" {...props} />,
                  h4: ({node, ...props}) => <h4 className="markdown-heading" {...props} />,
                  h5: ({node, ...props}) => <h5 className="markdown-heading" {...props} />,
                  h6: ({node, ...props}) => <h6 className="markdown-heading" {...props} />,
                  code: ({node, className, ...props}) =>
                    className?.includes('inline') ?
                      <code className="markdown-inline-code" {...props} /> :
                      <code className="markdown-code-block" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
                  ul: ({node, ...props}) => <ul className="markdown-list" {...props} />,
                  ol: ({node, ...props}) => <ol className="markdown-list" {...props} />,
                  li: ({node, ...props}) => <li className="markdown-list-item" {...props} />,
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
