import React from 'react';

const StreamingStatus = ({ isPageVisible, isStreaming }) => {
  if (!isStreaming) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg shadow-lg border ${
        isPageVisible 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-orange-50 border-orange-200 text-orange-800'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isPageVisible ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isPageVisible ? 'bg-green-500' : 'bg-orange-500'
            }`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isPageVisible ? 'bg-green-500' : 'bg-orange-500'
            }`} style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm font-medium">
            {isPageVisible 
              ? 'AI đang trả lời...' 
              : 'AI vẫn đang trả lời (tab ẩn)'
            }
          </span>
        </div>
        {!isPageVisible && (
          <div className="text-xs mt-1 opacity-75">
            Streaming hoạt động ngay cả khi tab ẩn
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamingStatus; 