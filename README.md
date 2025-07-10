# NyanSan Chat App

Một ứng dụng trò chuyện với AI Gemini được xây dựng bằng React và Tailwind CSS.

## Tính năng

- 🔑 **Cấu hình API Key**: Lưu trữ và quản lý API key Gemini
- 💬 **Trò chuyện thông minh**: Tương tác với các mô hình AI Gemini
- 📝 **Quản lý Prompt**: Tạo, sửa, xóa prompt tùy chỉnh; gửi trực tiếp đến AI
- 🎯 **Lựa chọn mô hình**: Chọn giữa các mô hình Gemini khác nhau
- 🖼️ **Đính kèm hình ảnh**: Hỗ trợ gửi hình ảnh cho AI
- 📊 **Thống kê token**: Theo dõi số lượng token và ước tính chi phí
- 🎨 **Giao diện hiện đại**: Thiết kế đẹp mắt, UI compact, textarea có thể resize
- ⚡ **Streaming Response**: Hiển thị phản hồi AI theo thời gian thực
- 🌍 **Background Streaming**: Streaming hoạt động ngay cả khi tab out focus
- 📋 **Markdown Support**: Hỗ trợ định dạng Markdown đầy đủ
- 🎨 **Syntax Highlighting**: Tô sáng code với nhiều ngôn ngữ
- ⌨️ **Typing Indicator**: Hiệu ứng typing khi AI đang trả lời
- 👁️ **Page Visibility Detection**: Hiển thị trạng thái streaming khi tab ẩn
- 🚀 **Parts Technique**: Chọn prompt + chat content → gửi kèm với kỹ thuật parts

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd gemini-chat-app
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi chạy ứng dụng:
```bash
npm start
```

4. Mở trình duyệt tại `http://localhost:3000`

## Cách sử dụng

### Bước 1: Cấu hình API Key
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Tạo API key mới
4. Sao chép API key và dán vào ứng dụng

### Bước 2: Bắt đầu trò chuyện
1. Chọn mô hình Gemini muốn sử dụng
2. Có thể:
   - Chọn prompt có sẵn + nhập thêm nội dung chat → gửi kèm với kỹ thuật parts
   - Hoặc nhập tin nhắn tự do vào khung chat
3. Đính kèm hình ảnh nếu cần
4. Nhấn Enter hoặc nút gửi để gửi tin nhắn

### Tính năng Background Streaming
- **Streaming liên tục**: AI sẽ tiếp tục trả lời ngay cả khi bạn chuyển sang tab khác
- **Indicator trạng thái**: Góc phải trên màn hình hiển thị trạng thái streaming
- **Tự động phát hiện**: Ứng dụng tự động detect khi bạn quay lại tab
- **Web Worker technology**: Sử dụng công nghệ Web Worker để đảm bảo performance

## Các mô hình được hỗ trợ

- **Gemini 2.5 Pro**: Mô hình mạnh mẽ nhất, khả năng xử lý phức tạp vượt trội
- **Gemini 2.5 Flash**: Mô hình nhanh nhất, tối ưu cho tác vụ thường ngày
- **Gemini 2.0 Flash (Experimental)**: Mô hình thử nghiệm với tính năng mới
- **Gemini 1.5 Pro**: Mô hình mạnh mẽ, phù hợp cho tác vụ phức tạp
- **Gemini 1.5 Flash**: Cân bằng giữa tốc độ và chất lượng
- **Gemini 1.0 Pro**: Mô hình ổn định, đáng tin cậy

## Quản lý Prompt

### Prompt có sẵn (mặc định)
- **Viết câu chuyện**: Viết một câu chuyện ngắn về...
- **Giải thích khái niệm**: Giải thích khái niệm...
- **Đưa ra ý tưởng**: Đưa ra ý tưởng cho...
- **Phân tích đánh giá**: Phân tích và đánh giá...
- **Dịch thuật**: Dịch đoạn văn sau...
- **Viết code**: Viết code để...
- **Tóm tắt nội dung**: Tóm tắt nội dung...

### Tính năng quản lý
- **Tạo prompt tùy chỉnh**: Thêm prompt mới với tên và nội dung riêng
- **Chỉnh sửa prompt**: Sửa đổi tên và nội dung prompt có sẵn
- **Xóa prompt**: Loại bỏ prompt không cần thiết
- **Reset về mặc định**: Khôi phục lại prompt ban đầu
- **Lưu tự động**: Prompt được lưu vào localStorage
- **Tag name display**: Hiển thị tên prompt trong dropdown và chat
- **Parts technique**: Chọn prompt + nhập chat để gửi kèm với kỹ thuật parts

### Cách sử dụng
1. Vào tab **Cấu hình** > **Quản lý Prompt**
2. Thêm, sửa, xóa prompt theo nhu cầu
3. Quay lại tab **Chat** để sử dụng prompt
4. Chọn prompt từ dropdown → nhập nội dung chat → gửi (sử dụng kỹ thuật parts)

### Kỹ thuật Parts
- **Nguyên lý**: Gửi prompt và nội dung chat như các phần riêng biệt trong một request
- **Ưu điểm**: AI hiểu được context từ prompt và nội dung cụ thể từ user
- **Hiển thị**: Chỉ hiển thị `[Tên Prompt]` + nội dung chat trong lịch sử
- **API structure**: `parts: [{ text: prompt.text }, { text: user_content }]`
- **UI Benefits**: Giao diện gọn gàng, tên prompt dễ nhận biết

## Thống kê và chi phí

- **Token Input**: Số lượng token từ tin nhắn người dùng
- **Token Output**: Số lượng token từ phản hồi AI
- **Chi phí ước tính**: Tính toán dựa trên giá tiêu chuẩn

*Lưu ý: Số liệu này chỉ là ước tính và có thể khác với chi phí thực tế từ Google.*

## Công nghệ sử dụng

- **React 18**: Framework chính
- **Tailwind CSS**: Styling framework
- **Google Gemini API**: AI language model
- **localStorage**: Lưu trữ API key
- **react-markdown**: Render Markdown content
- **remark-gfm**: GitHub Flavored Markdown support
- **react-syntax-highlighter**: Code syntax highlighting
- **Web Workers**: Background streaming không bị ảnh hưởng bởi tab visibility
- **Page Visibility API**: Detect trạng thái tab active/inactive

## Cấu trúc dự án

```
src/
├── components/
│   ├── ConfigView.js      # Cấu hình API key và quản lý prompt
│   ├── PromptManager.js   # Quản lý prompt có sẵn
│   ├── ChatView.js        # Giao diện trò chuyện
│   ├── MessageBubble.js   # Hiển thị tin nhắn
│   ├── InputArea.js       # Khu vực nhập liệu (UI compact, resizable)
│   ├── TokenStats.js      # Thống kê token
│   ├── MarkdownRenderer.js # Render Markdown content
│   ├── TypingIndicator.js # Hiệu ứng typing
│   └── StreamingStatus.js # Trạng thái streaming
├── App.js                 # Component chính
├── index.js              # Entry point
├── index.css             # Styles chính
public/
└── streamWorker.js        # Web Worker cho background streaming
```

## Lưu ý bảo mật

- API key được lưu trữ trong localStorage của trình duyệt
- Không chia sẻ API key với người khác
- Chỉ sử dụng trong môi trường an toàn

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra kết nối internet
2. Xác minh API key hợp lệ
3. Làm mới trang và thử lại

## Phát triển

Để phát triển thêm tính năng:
1. Fork repository
2. Tạo branch mới
3. Commit thay đổi
4. Tạo pull request

---

Được phát triển với ❤️ bằng React và Tailwind CSS 