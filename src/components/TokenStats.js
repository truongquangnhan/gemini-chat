import React from 'react';

const TokenStats = ({ inputTokens, outputTokens, totalCost }) => {
  const totalTokens = inputTokens + outputTokens;

  const formatCost = (cost) => {
    return cost.toFixed(4);
  };

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Input:</span>
          <span className="font-medium text-green-600">{inputTokens.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Output:</span>
          <span className="font-medium text-blue-600">{outputTokens.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="text-gray-400">|</div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-gray-600">Tổng:</span>
          <span className="font-medium text-gray-800">{totalTokens.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-gray-600">Chi phí:</span>
          <span className="font-medium text-yellow-600">${formatCost(totalCost)}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        <div className="bg-gray-100 px-2 py-1 rounded-full">
          <span title="Đây là ước tính dựa trên độ dài văn bản, không phải số liệu chính xác từ API">
            ⚠️ Ước tính
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenStats; 