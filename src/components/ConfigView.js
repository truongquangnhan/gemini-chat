import React, { useState } from 'react';
import PromptManager from './PromptManager';

const ConfigView = ({ 
  apiKey, 
  onSaveApiKey, 
  onError,
  prompts,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onResetPromptsToDefault
}) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [activeTab, setActiveTab] = useState('api-key');

  const handleSave = async () => {
    if (!inputApiKey.trim()) {
      onError('Vui lòng nhập API key');
      return;
    }

    setIsTestingKey(true);
    
    try {
      // Test API key bằng cách gọi một request đơn giản
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${inputApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      });

      if (testResponse.ok) {
        onSaveApiKey(inputApiKey);
        onError(''); // Clear any previous errors
      } else {
        onError('API key không hợp lệ. Vui lòng kiểm tra lại.');
      }
    } catch (error) {
      onError('Không thể kết nối đến API. Vui lòng kiểm tra kết nối internet và API key.');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('api-key')}
            className={`px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'api-key'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔑 API Key
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'prompts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📝 Quản lý Prompt
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'api-key' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cấu hình API Key</h2>
              <p className="text-gray-600">
                Nhập API key Gemini của bạn để bắt đầu trò chuyện
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key Gemini
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập API key của bạn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isTestingKey}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isTestingKey}
                className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingKey ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang kiểm tra...
                  </span>
                ) : (
                  'Lưu và Chuyển đến Chat'
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Hướng dẫn lấy API Key
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Truy cập <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                      <li>Đăng nhập bằng tài khoản Google</li>
                      <li>Tạo API key mới</li>
                      <li>Sao chép và dán vào ô trên</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {apiKey && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 text-sm">
                  ✓ API key đã được lưu. Bạn có thể chuyển sang tab Chat để bắt đầu trò chuyện.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'prompts' && (
          <PromptManager
            prompts={prompts}
            onAddPrompt={onAddPrompt}
            onUpdatePrompt={onUpdatePrompt}
            onDeletePrompt={onDeletePrompt}
            onResetToDefault={onResetPromptsToDefault}
          />
        )}
      </div>
    </div>
  );
};

export default ConfigView; 