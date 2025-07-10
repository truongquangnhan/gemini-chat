import React, { useState, useEffect } from 'react';
import ConfigView from './components/ConfigView';
import ChatView from './components/ChatView';
import StreamingStatus from './components/StreamingStatus';

const App = () => {
  // State toàn cục
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [currentView, setCurrentView] = useState('config');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [streamingQueue, setStreamingQueue] = useState([]);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [streamWorker, setStreamWorker] = useState(null);
  const [isActivelyStreaming, setIsActivelyStreaming] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // Danh sách các mô hình Gemini có sẵn
  const availableModels = [
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' }
  ];

  // Prompt có sẵn - state để có thể quản lý
  const [availablePrompts, setAvailablePrompts] = useState([
    { id: 'creative', name: 'Viết câu chuyện', text: 'Viết một câu chuyện ngắn về...' },
    { id: 'explain', name: 'Giải thích khái niệm', text: 'Giải thích khái niệm...' },
    { id: 'ideas', name: 'Đưa ra ý tưởng', text: 'Đưa ra ý tưởng cho...' },
    { id: 'analyze', name: 'Phân tích đánh giá', text: 'Phân tích và đánh giá...' },
    { id: 'translate', name: 'Dịch thuật', text: 'Dịch đoạn văn sau...' },
    { id: 'code', name: 'Viết code', text: 'Viết code để...' },
    { id: 'summary', name: 'Tóm tắt nội dung', text: 'Tóm tắt nội dung...' }
  ]);

  // Khởi tạo - kiểm tra localStorage và Web Worker
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setCurrentView('chat');
    }

    // Load saved prompts từ localStorage
    const savedPrompts = localStorage.getItem('gemini-prompts');
    if (savedPrompts) {
      try {
        const parsedPrompts = JSON.parse(savedPrompts);
        setAvailablePrompts(parsedPrompts);
      } catch (error) {
        console.error('Error loading saved prompts:', error);
      }
    }

    // Khởi tạo Web Worker cho streaming
    try {
      const worker = new Worker('/streamWorker.js');
      setStreamWorker(worker);
      
      // Cleanup khi component unmount
      return () => {
        worker.terminate();
      };
    } catch (error) {
      console.log('Web Worker not supported:', error);
    }
  }, []);

  // Page Visibility API để handle streaming khi out focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      
      // Log để debug
      console.log(`Tab ${isVisible ? 'visible' : 'hidden'}`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Streaming effect với Web Worker và fallback
  const streamText = (fullText, messageIndex) => {
    setIsActivelyStreaming(true);
    
    // Thử sử dụng Web Worker trước (hoạt động ngay cả khi tab out focus)
    if (streamWorker) {
      const handleWorkerMessage = (e) => {
        const { type, content } = e.data;
        
        if (type === 'STREAM_PROGRESS') {
          // Cập nhật tin nhắn AI trong lịch sử
          setChatHistory(prev => prev.map((msg, index) => 
            index === messageIndex ? { ...msg, content: content } : msg
          ));
        } else if (type === 'STREAM_COMPLETE') {
          // Hoàn thành streaming
          setChatHistory(prev => prev.map((msg, index) => 
            index === messageIndex ? { ...msg, isStreaming: false } : msg
          ));
          
          setIsActivelyStreaming(false);
          
          // Cleanup listener
          streamWorker.removeEventListener('message', handleWorkerMessage);
        }
      };

      // Listen for messages from worker
      streamWorker.addEventListener('message', handleWorkerMessage);
      
      // Bắt đầu streaming với Web Worker
      streamWorker.postMessage({
        type: 'START_STREAMING',
        fullText: fullText,
        delay: 40
      });
    } else {
      // Fallback với requestAnimationFrame
      const words = fullText.split(' ');
      let currentContent = '';
      let wordIndex = 0;
      let startTime = performance.now();
      let lastUpdateTime = startTime;

      const streamNextWord = (currentTime) => {
        if (wordIndex < words.length) {
          // Chỉ cập nhật nếu đủ thời gian đã trôi qua
          const timeSinceLastUpdate = currentTime - lastUpdateTime;
          const targetDelay = 40 + Math.random() * 60; // 40-100ms
          
          if (timeSinceLastUpdate >= targetDelay) {
            currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
            
            // Cập nhật tin nhắn AI trong lịch sử
            setChatHistory(prev => prev.map((msg, index) => 
              index === messageIndex ? { ...msg, content: currentContent } : msg
            ));
            
            wordIndex++;
            lastUpdateTime = currentTime;
          }
          
          // Tiếp tục streaming
          requestAnimationFrame(streamNextWord);
        } else {
          // Hoàn thành streaming
          setChatHistory(prev => prev.map((msg, index) => 
            index === messageIndex ? { ...msg, isStreaming: false } : msg
          ));
          
          setIsActivelyStreaming(false);
        }
      };

      // Bắt đầu streaming với requestAnimationFrame
      requestAnimationFrame(streamNextWord);
    }
  };

  // Lưu API key vào localStorage
  const saveApiKey = (key) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
    setCurrentView('chat');
    setErrorMessage('');
  };

  // Lưu prompts vào localStorage
  const savePromptsToStorage = (prompts) => {
    localStorage.setItem('gemini-prompts', JSON.stringify(prompts));
  };

  // Thêm prompt mới
  const addPrompt = (promptName, promptText) => {
    if (!promptName.trim() || !promptText.trim()) return false;
    
    const newPrompt = {
      id: 'custom_' + Date.now(),
      name: promptName.trim(),
      text: promptText.trim()
    };
    
    const updatedPrompts = [...availablePrompts, newPrompt];
    setAvailablePrompts(updatedPrompts);
    savePromptsToStorage(updatedPrompts);
    return true;
  };

  // Sửa prompt
  const updatePrompt = (id, newName, newText) => {
    if (!newName.trim() || !newText.trim()) return false;
    
    const updatedPrompts = availablePrompts.map(prompt =>
      prompt.id === id ? { ...prompt, name: newName.trim(), text: newText.trim() } : prompt
    );
    
    setAvailablePrompts(updatedPrompts);
    savePromptsToStorage(updatedPrompts);
    return true;
  };

  // Xóa prompt
  const deletePrompt = (id) => {
    const updatedPrompts = availablePrompts.filter(prompt => prompt.id !== id);
    setAvailablePrompts(updatedPrompts);
    savePromptsToStorage(updatedPrompts);
  };

  // Reset prompts về mặc định
  const resetPromptsToDefault = () => {
    const defaultPrompts = [
      { id: 'creative', name: 'Viết câu chuyện', text: 'Viết một câu chuyện ngắn về...' },
      { id: 'explain', name: 'Giải thích khái niệm', text: 'Giải thích khái niệm...' },
      { id: 'ideas', name: 'Đưa ra ý tưởng', text: 'Đưa ra ý tưởng cho...' },
      { id: 'analyze', name: 'Phân tích đánh giá', text: 'Phân tích và đánh giá...' },
      { id: 'translate', name: 'Dịch thuật', text: 'Dịch đoạn văn sau...' },
      { id: 'code', name: 'Viết code', text: 'Viết code để...' },
      { id: 'summary', name: 'Tóm tắt nội dung', text: 'Tóm tắt nội dung...' }
    ];
    
    setAvailablePrompts(defaultPrompts);
    savePromptsToStorage(defaultPrompts);
  };

  // Ước tính số lượng token (đơn giản)
  const estimateTokens = (text) => {
    // Ước tính đơn giản: 1 token ≈ 4 ký tự
    return Math.ceil(text.length / 4);
  };

  // Tính toán chi phí ước tính
  const calculateCost = (inputTokens, outputTokens) => {
    // Giá ước tính (USD): input $0.00025/1K tokens, output $0.00075/1K tokens
    const inputCost = (inputTokens / 1000) * 0.00025;
    const outputCost = (outputTokens / 1000) * 0.00075;
    return inputCost + outputCost;
  };

  // Gửi tin nhắn đến Gemini API với streaming
  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || currentInput;
    if (!textToSend.trim() && !attachedImage) return;

    setIsLoading(true);
    setErrorMessage('');
    setStreamingResponse('');

    try {
      // Tạo nội dung để hiển thị cho user (chỉ hiển thị tag name thay vì full prompt)
      let displayContent = textToSend;
      if (selectedPrompt) {
        displayContent = `[${selectedPrompt.name}]\n\n${textToSend}`;
      }

      // Thêm tin nhắn người dùng vào lịch sử
      const userMessage = {
        role: 'user',
        content: displayContent,
        image: attachedImage,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, userMessage]);

      // Tính toán token input (bao gồm cả prompt text thực tế)
      let totalInputText = textToSend;
      if (selectedPrompt) {
        totalInputText = `${selectedPrompt.text}\n\n${textToSend}`;
      }
      const inputTokenCount = estimateTokens(totalInputText);
      setInputTokens(prev => prev + inputTokenCount);

      // Xây dựng payload API với kỹ thuật parts
      const payload = {
        contents: [{
          parts: []
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 8192,
        }
      };

      // Thêm prompt trước (nếu có)
      if (selectedPrompt) {
        payload.contents[0].parts.push({
          text: selectedPrompt.text
        });
      }

      // Thêm nội dung chat của user
      if (textToSend.trim()) {
        payload.contents[0].parts.push({
          text: textToSend
        });
      }

      // Thêm hình ảnh nếu có
      if (attachedImage) {
        payload.contents[0].parts.push({
          inline_data: {
            mime_type: attachedImage.type,
            data: attachedImage.data
          }
        });
      }

      // Thêm tin nhắn AI placeholder với streaming content
      const aiMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true
      };

      setChatHistory(prev => [...prev, aiMessage]);
      const aiMessageIndex = chatHistory.length + 1;

      // Gọi API Gemini thông thường và tạo fake streaming effect
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Sử dụng streaming effect mới
        streamText(aiResponse, aiMessageIndex);

        // Tính toán token output
        const outputTokenCount = estimateTokens(aiResponse);
        setOutputTokens(prev => prev + outputTokenCount);

        // Cập nhật chi phí
        const newTotalCost = calculateCost(inputTokens + inputTokenCount, outputTokens + outputTokenCount);
        setTotalCost(newTotalCost);
      }

      // Reset input chỉ khi không phải từ prompt
      if (!messageText) {
        setCurrentInput('');
        setAttachedImage(null);
      }
      
      // Reset selected prompt sau khi gửi
      setSelectedPrompt(null);

    } catch (error) {
      setErrorMessage(`Lỗi: ${error.message}`);
      console.error('Error sending message:', error);
      
      // Xóa tin nhắn AI nếu có lỗi
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  // Xử lý chọn prompt - lưu vào state để sử dụng khi gửi
  const handlePromptSelect = (promptId) => {
    if (isLoading) return;
    
    // Tìm prompt object từ ID
    const selectedPromptObj = availablePrompts.find(p => p.id === promptId);
    if (selectedPromptObj) {
      setSelectedPrompt(selectedPromptObj);
    }
  };

  // Xử lý đính kèm file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(',')[1];
        setAttachedImage({
          type: file.type,
          data: base64Data,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Vui lòng chọn file hình ảnh hợp lệ');
    }
  };

  // Chuyển đổi giữa các view
  const switchView = (view) => {
    setCurrentView(view);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Streaming Status Indicator */}
      <StreamingStatus 
        isPageVisible={isPageVisible} 
        isStreaming={isActivelyStreaming} 
      />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">NyanSan Chat App</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => switchView('chat')}
                className={`px-4 py-2 rounded-md font-medium ${
                  currentView === 'chat'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={!apiKey}
              >
                Chat
              </button>
              <button
                onClick={() => switchView('config')}
                className={`px-4 py-2 rounded-md font-medium ${
                  currentView === 'config'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cấu hình
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}

        {currentView === 'config' ? (
          <ConfigView
            apiKey={apiKey}
            onSaveApiKey={saveApiKey}
            onError={setErrorMessage}
            prompts={availablePrompts}
            onAddPrompt={addPrompt}
            onUpdatePrompt={updatePrompt}
            onDeletePrompt={deletePrompt}
            onResetPromptsToDefault={resetPromptsToDefault}
          />
        ) : (
          <ChatView
            chatHistory={chatHistory}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
            availablePrompts={availablePrompts}
            attachedImage={attachedImage}
            inputTokens={inputTokens}
            outputTokens={outputTokens}
            totalCost={totalCost}
            isLoading={isLoading}
            selectedPrompt={selectedPrompt}
            onSendMessage={sendMessage}
            onPromptSelect={handlePromptSelect}
            onFileChange={handleFileChange}
            onRemoveImage={() => setAttachedImage(null)}
            onClearPrompt={() => setSelectedPrompt(null)}
          />
        )}
      </main>
    </div>
  );
};

export default App; 