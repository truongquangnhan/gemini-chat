# **Tài liệu thiết kế công cụ trò chuyện AI Gemini**

## **1\. Giới thiệu**

Tài liệu này mô tả thiết kế của một công cụ trò chuyện dựa trên web, sử dụng ReactJS, cho phép người dùng tương tác với các mô hình AI Gemini. Mục tiêu là tạo ra một ứng dụng trực quan và chức năng, cung cấp các tính năng cần thiết để trò chuyện hiệu quả với AI, bao gồm cấu hình API, quản lý prompt, lựa chọn mô hình, đính kèm tệp và theo dõi chi phí/token.

## **2\. Mục tiêu**

* Phát triển một ứng dụng web ReactJS hoàn chỉnh.  
* Cung cấp giao diện người dùng thân thiện và dễ sử dụng.  
* Hỗ trợ tương tác với các mô hình AI Gemini.  
* Thống kê ước tính chi phí và lượng token sử dụng.

## **3\. Các chức năng chính**

### **3.1. Cấu hình API Key**

* **Mô tả**: Người dùng có thể nhập và lưu khóa API Gemini của họ.  
* **Chi tiết**:  
  * Một trang hoặc phần riêng biệt trong ứng dụng dành cho cấu hình.  
  * Trường nhập liệu cho khóa API (sử dụng type="password" để bảo mật).  
  * Nút "Lưu" để lưu khóa API.  
  * Khóa API sẽ được lưu trữ cục bộ trong trình duyệt (sử dụng localStorage) để duy trì giữa các phiên.  
  * Thông báo lỗi nếu khóa API không hợp lệ hoặc thiếu.

### **3.2. Quản lý Prompt có sẵn**

* **Mô tả**: Người dùng có thể chọn các prompt được định nghĩa trước để nhanh chóng bắt đầu cuộc trò chuyện hoặc gợi ý AI.  
* **Chi tiết**:  
  * Một danh sách các prompt có sẵn (ví dụ: "Viết một câu chuyện ngắn về...", "Giải thích...", "Đưa ra ý tưởng cho...").  
  * Menu thả xuống hoặc các nút để chọn prompt.  
  * Khi chọn, văn bản của prompt sẽ tự động điền vào ô nhập liệu chính.

### **3.3. Lựa chọn Mô hình Gemini**

* **Mô tả**: Người dùng có thể chọn mô hình Gemini cụ thể để tương tác.  
* **Chi tiết**:  
  * Menu thả xuống trong giao diện trò chuyện để chọn mô hình (ví dụ: gemini-2.0-flash, gemini-1.5-pro).  
  * Mô hình mặc định sẽ được đặt ban đầu.  
  * Thay đổi mô hình sẽ áp dụng cho các tin nhắn tiếp theo.

### **3.4. Đính kèm tệp (Hình ảnh)**

* **Mô tả**: Người dùng có thể đính kèm hình ảnh vào tin nhắn của họ để gửi đến AI (tính năng đa phương thức của Gemini).  
* **Chi tiết**:  
  * Nút hoặc biểu tượng "đính kèm" (kẹp giấy) trong khung nhập liệu.  
  * Cho phép chọn tệp hình ảnh từ thiết bị của người dùng.  
  * Hình ảnh được chuyển đổi thành định dạng Base64 trước khi gửi qua API.  
  * Hiển thị biểu tượng hoặc văn bản xác nhận rằng tệp đã được đính kèm.

### **3.5. Thống kê chi phí và Token**

* **Mô tả**: Hiển thị ước tính số lượng token đầu vào/đầu ra và chi phí liên quan đến các tương tác với AI.  
* **Chi tiết**:  
  * Hiển thị số lượng token đầu vào (do người dùng gửi).  
  * Hiển thị số lượng token đầu ra (do AI phản hồi).  
  * Hiển thị ước tính tổng chi phí dựa trên số lượng token và một tỷ lệ giá giả định.  
  * Lưu ý rõ ràng rằng đây là ước tính và không phải số liệu chính xác từ API của Google.

## **4\. Kiến trúc ứng dụng**

### **4.1. Công nghệ**

* **Frontend**: ReactJS  
* **Styling**: Tailwind CSS  
* **API tương tác**: Fetch API (JavaScript) để gọi API Gemini  
* **Lưu trữ cục bộ**: localStorage của trình duyệt để lưu khóa API.

### **4.2. Cấu trúc Component (React)**

* **App.js (Component chính)**:  
  * Quản lý trạng thái toàn cục: apiKey, selectedModel, chatHistory, currentInput, attachedImage, inputTokens, outputTokens, totalCost, currentView, isLoading, errorMessage.  
  * Điều hướng giữa các chế độ xem (config và chat).  
  * Chứa logic để lưu/tải API key.  
* **Các hàm xử lý**:  
  * saveApiKey(): Lưu khóa API vào localStorage.  
  * sendMessage(): Xử lý logic gửi tin nhắn, gọi API Gemini, cập nhật lịch sử trò chuyện và thống kê token/chi phí.  
  * handleFileChange(): Xử lý việc đính kèm tệp hình ảnh.  
  * handlePromptSelect(): Xử lý việc chọn prompt có sẵn.

### **4.3. Luồng dữ liệu**

1. **Khởi tạo**: Ứng dụng kiểm tra localStorage để tìm khóa API. Nếu tìm thấy, chuyển trực tiếp đến chế độ xem trò chuyện; nếu không, hiển thị trang cấu hình.  
2. **Cấu hình**: Người dùng nhập khóa API, nhấn lưu. Khóa được lưu vào localStorage và trạng thái apiKey được cập nhật.  
3. **Gửi tin nhắn**:  
   * Người dùng nhập văn bản và/hoặc đính kèm hình ảnh.  
   * Nhấn gửi.  
   * Tin nhắn của người dùng được thêm vào chatHistory.  
   * Payload API được xây dựng (bao gồm cả dữ liệu hình ảnh Base64 nếu có).  
   * Gọi API Gemini.  
   * Khi nhận được phản hồi, văn bản phản hồi của AI được thêm vào chatHistory.  
   * Token và chi phí được ước tính và cập nhật.  
   * Trường nhập liệu được xóa và hình ảnh đính kèm được đặt lại.  
4. **Hiển thị**: Lịch sử trò chuyện được hiển thị động, với các tin nhắn của người dùng và AI được định dạng khác nhau.

## **5\. Thiết kế giao diện người dùng (UI/UX)**

### **5.1. Bố cục chung**

* **Thanh điều hướng**: Ở trên cùng, với các nút chuyển đổi giữa "Chat" và "Cấu hình".  
* **Khu vực chính**: Chiếm phần lớn màn hình, hiển thị trang cấu hình hoặc giao diện trò chuyện.

### **5.2. Trang Cấu hình**

* **Tiêu đề**: "Cấu hình API Key".  
* **Trường nhập liệu**: Cho khóa API, có nhãn rõ ràng và placeholder.  
* **Nút**: "Lưu và Chuyển đến Chat".  
* **Thông báo**: Hiển thị thông báo lỗi hoặc hướng dẫn.

### **5.3. Giao diện trò chuyện**

* **Khu vực lịch sử trò chuyện**:  
  * Cuộn được, hiển thị các tin nhắn của người dùng và AI.  
  * Tin nhắn của người dùng ở bên phải, tin nhắn của AI ở bên trái.  
  * Hình ảnh đính kèm được hiển thị trong bong bóng chat của người dùng.  
  * Tự động cuộn xuống dưới cùng khi có tin nhắn mới.  
* **Khu vực nhập liệu**:  
  * **Dropdown Prompt**: Cho phép chọn các prompt có sẵn.  
  * **Dropdown Model**: Cho phép chọn mô hình Gemini.  
  * **Nút đính kèm tệp**: Biểu tượng kẹp giấy.  
  * **Trường nhập liệu văn bản**: Placeholder "Nhập tin nhắn của bạn...".  
  * **Nút gửi**: Biểu tượng mũi tên, có trạng thái tải (spinner) khi đang gửi.  
* **Khu vực thống kê**:  
  * Hiển thị "Token đầu vào", "Token đầu ra", "Chi phí ước tính".  
  * Văn bản nhỏ ghi chú rằng đây là ước tính.

### **5.4. Phong cách và Thẩm mỹ**

* Sử dụng Tailwind CSS để tạo giao diện hiện đại, sạch sẽ và đáp ứng.  
* Sử dụng màu sắc hài hòa (ví dụ: xanh lam, tím, xám).  
* Các phần tử có góc bo tròn, đổ bóng nhẹ để tạo cảm giác hiện đại.  
* Hiệu ứng chuyển động mượt mà khi chuyển đổi chế độ xem hoặc tương tác.  
* Đảm bảo khả năng đọc tốt với phông chữ rõ ràng và độ tương phản phù hợp.

## **6\. Các cân nhắc khác**

* **Xử lý lỗi**: Cần có cơ chế xử lý lỗi mạnh mẽ hơn để thông báo cho người dùng về các lỗi API cụ thể (ví dụ: khóa API không hợp lệ, giới hạn tốc độ).  
* **Tối ưu hóa hiệu suất**: Đối với lịch sử trò chuyện dài, có thể cần tối ưu hóa hiệu suất hiển thị (ví dụ: ảo hóa danh sách).  
* **Tính năng mở rộng**:  
  * Lưu trữ lịch sử trò chuyện (ví dụ: trong localStorage hoặc cơ sở dữ liệu backend).  
  * Hỗ trợ các loại tệp đính kèm khác (video, âm thanh \- nếu API Gemini hỗ trợ).  
  * Tùy chỉnh prompt bởi người dùng.  
  * Hiển thị phản hồi streaming từ AI.

Tài liệu thiết kế này cung cấp một cái nhìn tổng quan về cấu trúc và chức năng của công cụ trò chuyện AI Gemini. Nó sẽ là cơ sở để phát triển và mở rộng ứng dụng trong tương lai.