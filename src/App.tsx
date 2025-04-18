import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "./App.css";

function App() {
  const [value, setValue] = useState<string | undefined>("# Welcome to Yamed\n\nStart writing your markdown here...");
  const [isFocused, setIsFocused] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

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

  return (
    <main className={`container ${isFocused ? 'focus-mode' : ''}`}>
      <div className="editor-container">
        <div className={`toolbar ${showToolbar ? 'visible' : ''}`}>
          <button onClick={() => setShowToolbar(!showToolbar)}>☰</button>
          <button onClick={() => setIsFocused(!isFocused)}>👁️</button>
        </div>
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={(val) => setValue(val)}
            height="100vh"
            preview="live"
            hideToolbar={!showToolbar}
            enableScroll={true}
            visibleDragbar={false}
            highlightEnable={true}
            textareaProps={{
              placeholder: "Start writing your markdown here...",
              className: "typora-style-editor",
              onFocus: () => setIsFocused(true),
              onBlur: () => setIsFocused(false)
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
