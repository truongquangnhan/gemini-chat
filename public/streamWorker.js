// Web Worker for streaming text - works even when tab is not active
self.onmessage = function(e) {
  const { type, fullText, delay } = e.data;
  
  if (type === 'START_STREAMING') {
    const words = fullText.split(' ');
    let currentContent = '';
    let wordIndex = 0;

    const streamWords = () => {
      if (wordIndex < words.length) {
        currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        
        // Gửi progress về main thread
        self.postMessage({
          type: 'STREAM_PROGRESS',
          content: currentContent,
          wordIndex: wordIndex,
          totalWords: words.length
        });
        
        wordIndex++;
        
        // Random delay để tạo hiệu ứng tự nhiên
        const randomDelay = (delay || 50) + Math.random() * 50;
        setTimeout(streamWords, randomDelay);
      } else {
        // Hoàn thành streaming
        self.postMessage({
          type: 'STREAM_COMPLETE',
          content: currentContent
        });
      }
    };

    // Bắt đầu streaming
    streamWords();
  }
  
  if (type === 'STOP_STREAMING') {
    // Dừng streaming (có thể implement logic dừng nếu cần)
  }
}; 