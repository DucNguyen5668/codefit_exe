# CodeFit Backend — API Documentation

## Giới thiệu

**CodeFit** là nền tảng học lập trình JavaScript theo hướng gamification (học qua chơi game). Backend cung cấp API RESTful hỗ trợ:

- Đăng ký, đăng nhập người dùng (JWT)
- Quản lý khóa học và bài tập (CRUD)
- Chấm bài tự động với hệ thống chấm điểm đa tầng
- Tích hợp AI (Google Gemini) để giải thích code và chat hỗ trợ
- Hệ thống XP, level, leaderboard
- Theo dõi tiến độ học tập

## Kiến trúc kỹ thuật

| Công nghệ | Vai trò |
|---|---|
| Node.js + Express v5 | Web framework |
| MongoDB + Mongoose v9 | Cơ sở dữ liệu |
| JWT + bcrypt | Xác thực & bảo mật mật khẩu |
| Google Gemini AI | Trợ lý AI tích hợp |
| Nodemon | Auto-restart khi dev |

## Cấu trúc thư mục

```
backend/
├── server.js              # Entry point — khởi tạo server, kết nối DB, mount routes
├── seed.js                # Script seed dữ liệu mẫu vào MongoDB
├── package.json
├── .env                   # Biến môi trường
└── src/
    ├── middleware/
    │   └── auth.js        # authMiddleware, adminMiddleware
    └── routes/
        ├── auth.js        # POST /register, POST /login
        ├── users.js       # GET /me, GET /progress, GET /all
        ├── courses.js     # GET /, GET /:id, POST /
        ├── exercises.js   # GET /, GET /:id, POST /
        ├── submissions.js # POST /run, POST /submit, GET /my, GET /exercise/:id
        └── ai.js          # POST /explain, POST /chat
    └── constants/
        └── models/
            ├── User.js
            ├── Course.js
            ├── Exercise.js
            └── Submission.js
```

## Cài đặt

### Yêu cầu

- Node.js >= 18
- MongoDB (local hoặc Atlas)
- Gemini API Key (từ Google AI Studio)

### Các bước

1. **Clone & cài package:**

```bash
cd backend
npm install
```

2. **Cấu hình biến môi trường:**

Tạo file `.env` tại thư mục `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/codefit
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

3. **Khởi động server:**

```bash
# Development (auto-restart khi sửa file)
npm run dev

# Production
npm start
```

4. **Seed dữ liệu mẫu:**

```bash
node seed.js
```

Script này sẽ tạo sẵn:
- 2 tài khoản: `admin@codefit.dev` / `admin123` (admin) và `demo@codefit.dev` / `demo123` (user)
- 3 khóa học: JavaScript Fundamentals, Array & String Algorithms, Data Structures & Advanced JS
- 9 bài tập mẫu với test cases

## API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/register` | Đăng ký tài khoản mới |
| POST | `/login` | Đăng nhập, nhận JWT token |

### Users — `/api/users`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/me` | User | Lấy thông tin profile + thống kê học tập |
| GET | `/progress` | User | Lấy tiến độ 14 ngày gần nhất |
| GET | `/all` | Admin | Lấy danh sách tất cả người dùng |

### Courses — `/api/courses`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/` | None | Danh sách tất cả khóa học |
| GET | `/:id` | User | Chi tiết một khóa học |
| POST | `/` | Admin | Tạo khóa học mới |

### Exercises — `/api/exercises`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/` | User | Danh sách bài tập (lọc theo `?courseId=`) |
| GET | `/:id` | User | Chi tiết bài tập (ẩn solution) |
| POST | `/` | Admin | Tạo bài tập mới |

### Submissions — `/api/submissions`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/run` | User | Chạy thử code (không lưu) |
| POST | `/submit` | User | Nộp bài — chấm điểm, cập nhật XP |
| GET | `/my` | User | Lịch sử nộp bài của user |
| GET | `/exercise/:id` | User | Bài nộp gần nhất cho một exercise |

### AI — `/api/ai`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/explain` | User | Yêu cầu AI phân tích code + lỗi test |
| POST | `/chat` | User | Chat hỗ trợ đa ngôn ngữ (VI + EN) |

## Hệ thống chấm điểm

Khi nộp bài (`POST /api/submissions/submit`), điểm được tính theo công thức:

```
passRate      = số test passed / tổng test
speedScore    = max(0, 20 - (timeSpent / 1800) × 20)
consistencyScore = max(0, 30 - submitCount × 3)
finalScore    = round(passRate × 50 + speedScore + consistencyScore)
```

Điểm tối đa: **100 điểm**. Điểm sẽ được cộng vào XP của user.

## Hệ thống Level

| Level | XP cần |
|---|---|
| Beginner | 0 |
| Intermediate | 200 |
| Advanced | 500 |

## Mô hình dữ liệu

### User

```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hash)",
  "role": "user | admin",
  "level": "Beginner | Intermediate | Advanced",
  "xp": "number",
  "aiUsageLeft": "number (mặc định 10)",
  "completedExercises": "[ObjectId]",
  "enrolledCourses": "[ObjectId]"
}
```

### Course

```json
{
  "title": "string",
  "description": "string",
  "level": "Beginner | Intermediate | Advanced",
  "language": "javascript",
  "tags": "[string]",
  "exerciseCount": "number",
  "duration": "string"
}
```

### Exercise

```json
{
  "courseId": "ObjectId",
  "title": "string",
  "description": "string",
  "difficulty": "Easy | Medium | Hard",
  "starterCode": "string",
  "solution": "string",
  "testCases": "[{ input, expected, description }]",
  "hints": "[string]",
  "order": "number"
}
```

### Submission

```json
{
  "userId": "ObjectId",
  "exerciseId": "ObjectId",
  "courseId": "ObjectId",
  "code": "string",
  "status": "passed | failed | error",
  "passedTests": "number",
  "totalTests": "number",
  "passRate": "number",
  "timeSpent": "number (giây)",
  "submitCount": "number",
  "finalScore": "number"
}
```

## Lưu ý bảo mật

> [!IMPORTANT]
> File `.env` chứa `JWT_SECRET` và `GEMINI_API_KEY` thực. **Không commit file này lên git.** Thêm `.env` vào `.gitignore` trước khi push.

> [!WARNING]
> Backend sử dụng `new Function()` để chạy code người dùng trên server. Chỉ dùng trong môi trường dev/demo. Với production, cần chạy trong sandbox thực sự (ví dụ: Docker container, AWS Lambda).

## Scripts npm

```bash
npm start       # Chạy server với node
npm run dev     # Chạy với nodemon (auto-restart)
```

## Tài liệu tham khảo

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [JSON Web Tokens](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
