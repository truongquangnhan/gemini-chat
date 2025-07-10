import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import TypingIndicator from './TypingIndicator';

const MessageBubble = ({ message, isLoading }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="flex items-end space-x-2">
          {/* Avatar */}
          {isAssistant && (
            <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          )}
          
          {/* Message bubble */}
          <div className={`relative px-4 py-2 rounded-lg ${
            isUser 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}>
            {/* Hình ảnh đính kèm */}
            {message.image && (
              <div className="mb-2">
                <img 
                  src={`data:${message.image.type};base64,${message.image.data}`}
                  alt="Attached"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '200px' }}
                />
                <p className="text-xs opacity-75 mt-1">
                  📎 {message.image.name}
                </p>
              </div>
            )}
            
            {/* Nội dung tin nhắn */}
            <div className="text-sm">
              {isAssistant ? (
                <div>
                  {message.isStreaming ? (
                    <TypingIndicator 
                      text={message.content || ''} 
                      isStreaming={true}
                    />
                  ) : (
                    <MarkdownRenderer content={message.content || ''} />
                  )}
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              )}
            </div>
            
            {/* Loading indicator cho tin nhắn đang gửi */}
            {isLoading && isUser && (
              <div className="flex items-center mt-2 space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs opacity-75">Đang gửi...</span>
              </div>
            )}
            
            {/* Timestamp */}
            <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
          
          {/* User avatar */}
          {isUser && (
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 