# Thiệp cưới đỏ đậm — HTML/CSS/JavaScript

Website thiệp cưới responsive lấy cảm hứng từ phong cách tối giản đỏ rượu vang và màu kem. Đây là dự án mẫu độc lập, không sao chép nguyên bản thiết kế hoặc nội dung của website tham khảo.

## Cấu trúc

- `index.html`: thiệp cưới công khai
- `admin.html`: trang quản trị nội dung, album và RSVP
- `style.css`: giao diện desktop/mobile
- `app.js`: hiển thị thiệp, đếm ngược, album, biểu mẫu RSVP
- `admin.js`: lưu chỉnh sửa, xuất CSV/JSON, nhập bản sao lưu

## Chạy local

Không nên chỉ mở file trực tiếp bằng `file://`, vì hành vi lưu trữ/trình duyệt có thể khác nhau. Hãy chạy web server tĩnh.

### Cách 1 — VS Code

1. Mở thư mục dự án trong VS Code.
2. Cài extension **Live Server**.
3. Nhấp phải `index.html` → **Open with Live Server**.
4. Mở `admin.html` trên cùng địa chỉ server để quản trị.

### Cách 2 — Python

Cài Python 3, mở Terminal tại thư mục dự án rồi chạy:

```bash
python -m http.server 8000
```

Trên một số máy Windows có thể dùng `py -m http.server 8000`.

Mở:
- Thiệp cưới: http://localhost:8000/
- Quản trị: http://localhost:8000/admin.html

Hãy dùng cùng trình duyệt và cùng địa chỉ/port khi kiểm tra dữ liệu lưu bằng `localStorage`.

## Chỉnh sửa nội dung

1. Vào `/admin.html`.
2. Chỉnh tên, ngày giờ, địa điểm, lời mời và URL ảnh.
3. Bấm **Lưu thay đổi** hoặc **Lưu album**.
4. Tải lại trang thiệp để xem bản cập nhật.

Ảnh cần là URL công khai có thể truy cập qua HTTPS. Bạn cũng có thể thay URL mặc định trực tiếp trong `app.js` và `admin.js`.

## Đưa website lên mạng

Có thể triển khai như website tĩnh bằng **Netlify**, **Cloudflare Pages** hoặc **GitHub Pages**:

1. Tạo repository Git và đưa 5 file của dự án lên.
2. Kết nối repository với nhà cung cấp hosting tĩnh.
3. Chọn thư mục gốc làm thư mục publish; không cần build command.
4. Deploy và mở URL do nhà cung cấp cấp.
5. Kiểm tra `index.html` và `admin.html` trên điện thoại.

Với Netlify, có thể kéo thả cả thư mục dự án vào khu vực deploy thủ công. Với GitHub Pages, bật Pages cho nhánh/repository chứa file.

## Giới hạn quan trọng trước khi dùng thật

**Đây là bản demo front-end, không phải hệ thống quản trị an toàn cho website công khai.**

- `localStorage` được lưu theo từng trình duyệt và origin. RSVP mà khách gửi từ điện thoại của họ **không tự động xuất hiện** trong trang quản trị của bạn.
- Trang `admin.html` hiện không có đăng nhập. Nếu deploy công khai, bất kỳ ai biết đường dẫn đều có thể mở trang quản trị trên trình duyệt của họ; các thay đổi local của họ không sửa dữ liệu của bạn, nhưng giao diện chưa được bảo vệ.
- Không nhập thông tin nhạy cảm của khách vào bản demo này.
- Để dùng thật: thêm Supabase hoặc Firebase, tạo bảng/collection lưu thiệp và RSVP, xác thực tài khoản quản trị, đặt quyền truy cập bằng policy/rules ở phía server. Không đặt secret key có quyền cao trong JavaScript phía trình duyệt.

## Tính năng hiện có

- Responsive cho điện thoại và desktop
- Đồng hồ đếm ngược
- Album ảnh có xem ảnh phóng lớn
- RSVP có tên, điện thoại tùy chọn, trạng thái, số người và lời chúc
- Quản trị nội dung, URL ảnh bìa và album
- Xem danh sách RSVP trong trình duyệt hiện tại
- Xuất RSVP CSV; xuất/nhập sao lưu JSON
- Không cần npm hoặc bước build

## Gợi ý tuỳ chỉnh

- Đổi màu ở đầu `style.css` trong nhóm biến `:root`.
- Đổi font trong phần `<link>` của hai file HTML.
- Đổi ngày cưới trong trang quản trị; bộ đếm ngược sẽ lấy ngày và giờ đã lưu.
"# DungHa.github.io" 
