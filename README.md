# CodeFit - Web học lập trình

Giao diện demo tiếng Việt, sẵn sàng deploy lên Netlify.

## Các trang

- **Trang chủ** `/` - Chào mừng, giới thiệu, Bảng xếp hạng, Bài học, Nhiệm vụ
- **Đăng nhập** `/login` - Đăng nhập tài khoản
- **Đăng ký** `/register` - Tạo tài khoản mới
- **Khóa học** `/courses` - Danh sách khóa học
- **Bản đồ** `/ban-do` - Lộ trình học tập
- **Bảng xếp hạng** `/bang-xep-hang` - Xếp hạng người dùng
- **Thanh toán** `/thanh-toan` - 2 gói: 0đ (miễn phí), 399.000đ (Enterprise)
- **Admin** `/admin` - Quản trị (cần đăng nhập admin)
- **Bài tập** `/course/:id`, `/exercise/:id` - Học và làm bài

## Chế độ Demo

Mặc định `VITE_DEMO_MODE=true` - app chạy hoàn toàn offline với dữ liệu giả, không cần backend.

**Tài khoản demo:**
- User: `demo@codefit.vn` / `123456`
- Admin: `admin@codefit.vn` / `123456`

## Deploy Netlify

1. Đẩy code lên GitHub
2. Vào [Netlify](https://app.netlify.com) → Add new site → Import từ Git
3. Chọn repo, cấu hình:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Thêm biến môi trường: `VITE_DEMO_MODE=true`
5. Deploy

## Chạy local

```bash
cd frontend
npm install
npm run dev
```

Truy cập http://localhost:5173
