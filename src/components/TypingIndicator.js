import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const TypingIndicator = ({ text, isStreaming }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [isStreaming]);

  return (
    <div className="inline">
      <MarkdownRenderer content={displayText} className="inline" />
      {isStreaming && (
        <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          <span className="bg-gray-600 text-white px-1 py-0.5 text-xs rounded">▋</span>
        </span>
      )}
    </div>
  );
};

export default TypingIndicator; 