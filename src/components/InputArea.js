import React, { useRef } from 'react';

const InputArea = ({
  currentInput,
  setCurrentInput,
  selectedModel,
  setSelectedModel,
  availableModels,
  availablePrompts,
  attachedImage,
  isLoading,
  selectedPrompt,
  onSendMessage,
  onPromptSelect,
  onFileChange,
  onRemoveImage,
  onClearPrompt
}) => {
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (currentInput.trim() || attachedImage) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Điều khiển compact trên cùng */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Dropdown chọn prompt - compact */}
        <div className="flex-1 min-w-48">
          <select
            onChange={(e) => onPromptSelect(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
            disabled={isLoading}
          >
            <option value="">💡 Chọn prompt có sẵn...</option>
            {availablePrompts.map((prompt) => (
              <option key={prompt.id} value={prompt.id}>
                {prompt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown chọn mô hình - compact */}
        <div className="flex-shrink-0 min-w-32">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
            disabled={isLoading}
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                🤖 {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hiển thị prompt đã chọn */}
      {selectedPrompt && (
        <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-md border border-purple-200">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900">
              💡 Prompt đã chọn
            </p>
            <p className="text-xs text-purple-600 max-w-md truncate">
              {selectedPrompt.name}
            </p>
          </div>
          <button
            onClick={onClearPrompt}
            className="flex-shrink-0 p-1 text-purple-600 hover:text-red-600 rounded-full hover:bg-red-50"
            disabled={isLoading}
            title="Xóa prompt đã chọn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Hiển thị hình ảnh đính kèm */}
      {attachedImage && (
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex-shrink-0">
            <img 
              src={`data:${attachedImage.type};base64,${attachedImage.data}`}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              📎 {attachedImage.name}
            </p>
            <p className="text-xs text-blue-600">
              {attachedImage.type}
            </p>
          </div>
          <button
            onClick={onRemoveImage}
            className="flex-shrink-0 p-1 text-blue-600 hover:text-red-600 rounded-full hover:bg-red-50"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Khu vực nhập liệu chính */}
      <div className="relative">
        <div className="flex items-end space-x-2">
          {/* Nút đính kèm file */}
          <button
            onClick={handleFileClick}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-full transition-colors"
            disabled={isLoading}
            title="Đính kèm hình ảnh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Textarea nhập liệu với khả năng resize */}
          <div className="flex-1">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn... (Shift + Enter để xuống dòng)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[80px] max-h-[300px]"
              rows={3}
              disabled={isLoading}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Nút gửi */}
          <button
            onClick={handleSend}
            disabled={isLoading || (!currentInput.trim() && !attachedImage)}
            className="flex-shrink-0 p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Gửi tin nhắn"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* Ghi chú compact */}
      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
        <span>• Enter để gửi, Shift+Enter xuống dòng</span>
        <span>• Hỗ trợ hình ảnh (JPG, PNG, GIF, WebP)</span>
        <span>• Chọn prompt + nhập chat → gửi kèm với kỹ thuật parts</span>
      </div>
    </div>
  );
};

export default InputArea; 