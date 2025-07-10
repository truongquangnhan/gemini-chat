import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import TokenStats from './TokenStats';

const ChatView = ({
  chatHistory,
  currentInput,
  setCurrentInput,
  selectedModel,
  setSelectedModel,
  availableModels,
  availablePrompts,
  attachedImage,
  inputTokens,
  outputTokens,
  totalCost,
  isLoading,
  selectedPrompt,
  onSendMessage,
  onPromptSelect,
  onFileChange,
  onRemoveImage,
  onClearPrompt
}) => {
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border">
      {/* Header với thông tin mô hình */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            Đang sử dụng: {availableModels.find(m => m.id === selectedModel)?.name}
          </span>
        </div>
        <TokenStats
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          totalCost={totalCost}
        />
      </div>

      {/* Khu vực tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Chưa có tin nhắn nào</p>
            <p className="text-sm">Hãy bắt đầu cuộc trò chuyện với AI Gemini!</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isLoading={isLoading && index === chatHistory.length - 1 && message.role === 'user'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập liệu */}
      <div className="border-t bg-gray-50 p-4">
        <InputArea
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          availableModels={availableModels}
          availablePrompts={availablePrompts}
          attachedImage={attachedImage}
          isLoading={isLoading}
          selectedPrompt={selectedPrompt}
          onSendMessage={onSendMessage}
          onPromptSelect={onPromptSelect}
          onFileChange={onFileChange}
          onRemoveImage={onRemoveImage}
          onClearPrompt={onClearPrompt}
        />
      </div>
    </div>
  );
};

export default ChatView; 