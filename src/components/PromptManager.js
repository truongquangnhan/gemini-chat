import React, { useState } from 'react';

const PromptManager = ({ 
  prompts, 
  onAddPrompt, 
  onUpdatePrompt, 
  onDeletePrompt, 
  onResetToDefault 
}) => {
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingText, setEditingText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPrompt = () => {
    if (onAddPrompt(newPromptName, newPromptText)) {
      setNewPromptName('');
      setNewPromptText('');
      setShowAddForm(false);
    }
  };

  const handleStartEdit = (prompt) => {
    setEditingId(prompt.id);
    setEditingName(prompt.name);
    setEditingText(prompt.text);
  };

  const handleSaveEdit = () => {
    if (onUpdatePrompt(editingId, editingName, editingText)) {
      setEditingId(null);
      setEditingName('');
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingText('');
  };

  const handleDeletePrompt = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa prompt này?')) {
      onDeletePrompt(id);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn reset tất cả prompts về mặc định? Tất cả prompts tùy chỉnh sẽ bị xóa.')) {
      onResetToDefault();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Prompt có sẵn</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Thêm Prompt
          </button>
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset Mặc định
          </button>
        </div>
      </div>

      {/* Form thêm prompt mới */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Thêm Prompt Mới</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              placeholder="Nhập tên prompt (tag name)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <textarea
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              placeholder="Nhập nội dung prompt mới..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddPrompt}
                disabled={!newPromptName.trim() || !newPromptText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewPromptName('');
                  setNewPromptText('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách prompts */}
      <div className="space-y-3">
        {prompts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có prompt nào</p>
          </div>
        ) : (
          prompts.map((prompt) => (
            <div key={prompt.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === prompt.id ? (
                // Chế độ chỉnh sửa
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Tên prompt (tag name)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="Nội dung prompt..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingName.trim() || !editingText.trim()}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                // Chế độ hiển thị
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {prompt.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {prompt.id}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{prompt.text}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleStartEdit(prompt)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
                      title="Xóa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Thông tin hữu ích */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">💡 Gợi ý sử dụng:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Tên prompt</strong>: Hiển thị trong dropdown và tin nhắn chat</li>
          <li>• <strong>Nội dung prompt</strong>: Được gửi đến AI với kỹ thuật parts</li>
          <li>• Sử dụng dấu "..." để người dùng có thể điền thông tin cụ thể</li>
          <li>• Prompts tùy chỉnh sẽ được lưu tự động vào localStorage</li>
          <li>• Chọn prompt + nhập chat → gửi kèm với kỹ thuật parts</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptManager; 