// Dữ liệu mẫu cho chế độ demo (Netlify deploy không cần backend)
export const mockCourses = [
  {
    _id: "c1",
    title: "JavaScript Cơ bản",
    description: "Học từ đầu với biến, hàm, vòng lặp và cấu trúc điều khiển.",
    level: "Beginner",
    tags: ["JS", "Cơ bản", "Logic"],
    exerciseCount: 12,
    duration: "2 giờ",
  },
  {
    _id: "c2",
    title: "JavaScript Nâng cao",
    description: "ES6+, Promise, async/await, xử lý mảng và đối tượng.",
    level: "Intermediate",
    tags: ["ES6", "Async", "OOP"],
    exerciseCount: 15,
    duration: "3 giờ",
  },
  {
    _id: "c3",
    title: "Thuật toán & Cấu trúc dữ liệu",
    description: "Giải bài tập phỏng vấn, tối ưu code và tư duy thuật toán.",
    level: "Advanced",
    tags: ["Thuật toán", "Big O", "Interview"],
    exerciseCount: 20,
    duration: "5 giờ",
  },
  {
    _id: "c4",
    title: "HTML Cơ bản",
    description: "Làm quen với thẻ HTML, cấu trúc trang và form đơn giản.",
    level: "Beginner",
    tags: ["HTML", "Frontend", "Cơ bản"],
    exerciseCount: 10,
    duration: "1.5 giờ",
  },
  {
    _id: "c5",
    title: "HTML Trung cấp",
    description: "Semantic HTML5, Form nâng cao, Media, Accessibility.",
    level: "Intermediate",
    tags: ["HTML5", "Semantic", "Accessibility"],
    exerciseCount: 8,
    duration: "2.5 giờ",
  },
  {
    _id: "c6",
    title: "HTML Nâng cao",
    description: "Web Components, Meta tags, SEO, Performance optimization.",
    level: "Advanced",
    tags: ["HTML5", "SEO", "Performance"],
    exerciseCount: 5,
    duration: "3.5 giờ",
  },
];

export const mockExercises = {
  c1: [
    { 
      _id: "e1", title: "[Mẫu] Phép Cộng Cơ Bản", description: "Học cách máy tính thực hiện phép cộng.", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 1 - LÀM QUEN VỚI CODE\n\nĐây là một bài học mẫu. Trong lập trình, chúng ta sử dụng dấu `+` để cộng hai con số. Đoạn code bên phải đã được viết sẵn cho bạn.\n\n👉 **Nhiệm vụ:** Bạn không cần sửa gì cả, chỉ cần nhấn nút **Chạy** ở góc trên bên phải để xem máy tính tính toán, sau đó nhấn **Nộp bài** để vượt qua bài này.",
      starterCode: "function solution(a, b) {\n  // Trả về tổng của a và b\n  return a + b;\n}",
      hints: [
        "📌 Dòng 1: `function solution(a, b)` — Khai báo một hàm tên là solution, nhận vào 2 tham số: a (số thứ nhất) và b (số thứ hai).",
        "📌 Dòng 3: `return a + b;` — Dấu '+' cộng hai số lại với nhau. Từ khóa 'return' trả kết quả về. Hàm kết thúc tại đây.",
        "✅ Tóm tắt: Đây là bài học về phép cộng số học và cách dùng từ khóa return để xuất kết quả ra ngoài hàm."
      ],
      testCases: [
        { input: "1, 2", args: [1, 2], expected: 3, description: "1 + 2" },
        { input: "10, 5", args: [10, 5], expected: 15, description: "10 + 5" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e2", title: "[Thực hành] Ứng Dụng Phép Tính", description: "Áp dụng phép cộng và trừ để giải quyết bài toán nhỏ.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 1 - ÁP DỤNG KIẾN THỨC\n\nBạn sẽ viết một hàm tính toán nhiều bước, yêu cầu bạn tạo các biến nội bộ (variables) trước khi trả về kết quả cuối.\n\n👉 **Nhiệm vụ:** Trong đoạn code bên phải, tôi đã chuẩn bị sẵn sườn cấu trúc. \n1. Hãy khai báo biến `tong` để lưu kết quả `a + b`.\n2. Hãy tạo biến `ket_qua` lưu giá trị `tong` trừ đi 10.\n3. Trả về `ket_qua`.",
      starterCode: "function solution(a, b) {\n  // Bước 1: Khai báo biến 'tong' và gán cho nó giá trị a + b (gốc từ bài trước)\n  \n  // Bước 2: Khai báo biến 'ket_qua', lấy 'tong' trừ đi 10\n  \n  // Bước 3: Đừng quên return 'ket_qua'\n  \n}",
      hints: ["Bước 1: `let tong = a + b;`", "Bước 2: `let ket_qua = tong - 10;`", "Bước 3: `return ket_qua;`"],
      testCases: [
        { input: "15, 5", args: [15, 5], expected: 10, description: "(15 + 5) - 10" },
        { input: "10, 0", args: [10, 0], expected: 0, description: "(10 + 0) - 10" }
      ],
      rewards: { xp: 120, coins: 30 },
    },
    { 
      _id: "e3", title: "[Mẫu] Lời Chào Ứng Dụng", description: "Học cách nối chuỗi văn bản.", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 2 - VĂN BẢN VÀ CHUỖI\n\nTrong lập trình, chữ được đặt trong dấu ngoặc kép `\" \"`. Bạn có thể ghép hai chữ lại với nhau cũng bằng dấu `+`.\n\n👉 **Nhiệm vụ:** Đây là phần code viết sẵn ghép chữ \"Hello \" với tên của người dùng. Hãy tiếp tục nhấn **Chạy** và **Nộp bài** để xem nó phản ứng ra sao.",
      starterCode: "function solution(name) {\n  // Máy tính ghép chữ Hello với biến name\n  return \"Hello \" + name;\n}",
      hints: [
        "📌 Dòng 1: `function solution(name)` — Hàm nhận vào 1 tham số tên là 'name' (ví dụ: 'CodeFit').",
        "📌 Dòng 3: `return \"Hello \" + name;` — Chuỗi văn bản 'Hello ' được ghép thêm với biến 'name' bằng dấu '+'. Chú ý dấu cách sau Hello để kết quả không bị dính liền.",
        "📌 Ví dụ: name = 'CodeFit' → kết quả là 'Hello ' + 'CodeFit' = 'Hello CodeFit'.",
        "✅ Tóm tắt: Dấu '+' không chỉ cộng số mà còn nối (concatenate) các đoạn chữ lại với nhau."
      ],
      testCases: [
        { input: "'CodeFit'", args: ["CodeFit"], expected: "Hello CodeFit", description: "Tên phổ thông" },
        { input: "'Admin'", args: ["Admin"], expected: "Hello Admin", description: "Tên quản trị" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e4", title: "[Thực hành] Lời Chào Nâng Cao", description: "Thay đổi văn bản nối chuỗi nhiều cấp.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 2 - MỞ KHÓA TƯ DUY\n\nĐã biết xin chào tự động, giờ chúng ta cùng học cách ghép nhiều tham số một lúc nhé.\n\n👉 **Nhiệm vụ:** Cho trước 2 biến `name` (Tên) và `timeOfDay` (Buổi trong ngày). Bạn cần sinh ra một câu chào đầy đủ kiểu như \"Good Morning, Admin!\". \nLưu ý các khoảng trắng và dấu câu phải chuẩn xác.\n\nVí dụ: name='Bob', timeOfDay='Evening' => Kết quả trả về phải là: `Good Evening, Bob!`",
      starterCode: "function solution(name, timeOfDay) {\n  // BƯỚC 1: Tạo biến 'greeting' ghép \"Good \" với biến 'timeOfDay'\n  \n  // BƯỚC 2: Tạo biến 'message' ghép 'greeting' với \", \" và biến 'name'\n  \n  // BƯỚC 3: Dùng return để trả về biến 'message' cộng thêm dấu \"!\" ở cuối cùng.\n  \n}",
      hints: ["B1: `let greeting = \"Good \" + timeOfDay;`", "B2: Cẩn thận dấu câu: `let message = greeting + \", \" + name;`", "B3: `return message + \"!\";`"],
      testCases: [
        { input: "'CodeFit', 'Afternoon'", args: ["CodeFit", "Afternoon"], expected: "Good Afternoon, CodeFit!", description: "Kiểm tra buổi chiều" },
        { input: "'Admin', 'Morning'", args: ["Admin", "Morning"], expected: "Good Morning, Admin!", description: "Kiểm tra buổi sáng" }
      ],
      rewards: { xp: 200, coins: 50 },
    },
    { 
      _id: "e5", title: "[Mẫu] So Sánh Lớn Nhỏ", description: "Học cách dùng toán tử so sánh.", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 3 - SO SÁNH (Toán tử > và <)\n\nMáy tính có thể so sánh hai giá trị. Nếu đúng, nó trả về `true` (đúng). Nếu sai, nó trả về `false` (sai).\n\n👉 **Nhiệm vụ:** Đoạn code kiểm tra xem số A có lớn hơn số B hay không (`a > b`). Nhấn chạy để xem kết quả trả về `true` hoặc `false` nhé.",
      starterCode: "function solution(a, b) {\n  // Kiểm tra A có lớn hơn B không\n  return a > b;\n}",
      hints: [
        "📌 Dòng 1: `function solution(a, b)` — Hàm nhận vào 2 số để so sánh.",
        "📌 Dòng 3: `return a > b;` — Toán tử '>' so sánh xem a có LỚN HƠN b không. Nếu đúng → trả về 'true'. Nếu sai → trả về 'false'.",
        "📌 Ví dụ: a=10, b=5 → 10 > 5 = true | a=2, b=5 → 2 > 5 = false.",
        "✅ Tóm tắt: Các phép so sánh (>, <, >=, <=, ===) luôn cho ra kết quả Boolean: chỉ có 2 giá trị là true (đúng) hoặc false (sai)."
      ],
      testCases: [
        { input: "10, 5", args: [10, 5], expected: true, description: "10 > 5" },
        { input: "2, 5", args: [2, 5], expected: false, description: "2 không lớn hơn 5" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e6", title: "[Thực hành] Độ Dài Mật Khẩu", description: "So sánh độ dài chuỗi ký tự.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 3 - BẢO MẬT\n\nBạn cần viết hàm kiểm tra xem mật khẩu người dùng nhập vào có đủ an toàn không.\n\n👉 **Nhiệm vụ:** Một mật khẩu an toàn phải có từ 8 ký tự trở lên (Lớn hơn hoặc BẰNG 8).\n1. Lấy độ dài của chuỗi bằng `password.length`.\n2. Dùng toán tử lớn hơn hoặc bằng (`>=`) để so sánh với 8 và return kết quả.",
      starterCode: "function solution(password) {\n  // TODO: Viết lệnh trả về true nếu password.length >= 8\n  \n}",
      hints: ["Gõ: `return password.length >= 8;`"],
      testCases: [
        { input: "'12345678'", args: ["12345678"], expected: true, description: "Vừa đủ 8 ký tự" },
        { input: "'admin'", args: ["admin"], expected: false, description: "Quá ngắn (5 ký tự)" }
      ],
      rewards: { xp: 150, coins: 30 },
    },
    { 
      _id: "e7", title: "[Mẫu] Câu Lệnh Rẽ Nhánh", description: "Học cách dùng If/Else.", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 4 - CÂU LỆNH IF / ELSE\n\nChương trình có thể rẽ nhánh tùy theo điều kiện.\n`if (điều kiện) { làm_gì_đó } else { làm_cái_khác }`\n\n👉 **Nhiệm vụ:** Đây là đoạn code xác định một số là âm hay dương. Hãy nhấn Chạy để xem kết quả.",
      starterCode: "function solution(n) {\n  if (n >= 0) {\n    return \"Positive\";\n  } else {\n    return \"Negative\";\n  }\n}",
      hints: [
        "📌 Dòng 2: `if (n >= 0)` — Kiểm tra xem 'n' có lớn hơn hoặc bằng 0 không. Nếu ĐÚNG, chạy code bên trong dấu {}.",
        "📌 Dòng 3: `return 'Positive';` — Trả về chuỗi 'Positive' (số dương) nếu điều kiện đúng.",
        "📌 Dòng 4-5: `else { return 'Negative'; }` — Nếu điều kiện SAI (n < 0), chương trình nhảy sang nhánh else và trả về 'Negative'.",
        "✅ Tóm tắt: If/Else là cách để chương trình đưa ra QUYẾT ĐỊNH: nếu điều kiện đúng làm A, ngược lại làm B."
      ],
      testCases: [
        { input: "10", args: [10], expected: "Positive", description: "Số dương" },
        { input: "-5", args: [-5], expected: "Negative", description: "Số âm" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e8", title: "[Thực hành] Kiểm Tra Người Lớn", description: "Ứng dụng If/Else phân loại tuổi.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 4 - RẼ NHÁNH SỰ KIỆN\n\nViết hàm phân loại khách hàng dựa trên tuổi.\n\n👉 **Nhiệm vụ:** Nếu tuổi (`age`) từ 18 trở lên (`>= 18`), trả về chuỗi `\"Adult\"`. Nếu ngược lại, trả về chuỗi `\"Minor\"`.",
      starterCode: "function solution(age) {\n  // TODO: Điền điều kiện age >= 18 vào trong ngoặc tròn ()\n  if () {\n    return \"Adult\";\n  } else {\n    return \"Minor\";\n  }\n}",
      hints: ["Điền `age >= 18` vào bên trong dấu `()` của chữ `if`.", "Code nên thành: `if (age >= 18)`"],
      testCases: [
        { input: "20", args: [20], expected: "Adult", description: "20 tuổi" },
        { input: "15", args: [15], expected: "Minor", description: "15 tuổi" }
      ],
      rewards: { xp: 150, coins: 30 },
    },
    { 
      _id: "e9", title: "[Mẫu] Mảng (Array)", description: "Học cách trích xuất phần tử mảng.", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 5 - MẢNG (ARRAY)\n\nMảng là một danh sách chứa nhiều giá trị. Trong lập trình, phần tử đầu tiên của mảng đứng ở vị trí số **0**.\n\n👉 **Nhiệm vụ:** Đây là doạn code lấy ra món đồ đầu tiên trong danh sách. Hãy nhấn Chạy.",
      starterCode: "function solution(arr) {\n  // Lấy ra phần tử đầu tiên (index 0)\n  return arr[0];\n}",
      hints: [
        "📌 Dòng 1: `function solution(arr)` — Hàm nhận vào tham số 'arr' là một mảng (ví dụ: ['Táo', 'Lê', 'Cam']).",
        "📌 Dòng 3: `return arr[0];` — Dấu [0] nghĩa là lấy phần tử ở VỊ TRÍ SỐ 0 trong mảng. Đây là phần tử ĐẦU TIÊN.",
        "📌 Ví dụ: arr = ['Táo', 'Lê', 'Cam'] → arr[0] = 'Táo', arr[1] = 'Lê', arr[2] = 'Cam'.",
        "✅ Tóm tắt: Trong lập trình, mảng đánh số từ 0. Phần tử đầu tiên LUÔN LUÔN là [0], không phải [1]."
      ],
      testCases: [
        { input: "['Táo', 'Lê', 'Cam']", args: [["Táo", "Lê", "Cam"]], expected: "Táo", description: "Trái cây" },
        { input: "[100, 200, 300]", args: [[100, 200, 300]], expected: 100, description: "Các con số" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e10", title: "[Thực hành] Bí Mật Cuối Cùng", description: "Tìm phần tử cuối cùng của danh sách.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 5 - ĐUÔI CỦA DANH SÁCH\n\nLấy phần tử đầu tiên là `arr[0]`. Vậy phần tử cuối cùng là gì? Đó là `arr[arr.length - 1]`.\n\n👉 **Nhiệm vụ:** Bằng cách điền vào chỉ mục Index, hãy trả về phần tử cuối cùng của mảng `arr`.",
      starterCode: "function solution(arr) {\n  // TODO: Lấy phần tử cuối cùng\n  return arr[ ];\n}",
      hints: ["Điền `arr.length - 1` vào bên trong hai dấu ngoặc vuông `[]`.", "Chính xác là `arr[arr.length - 1]`."],
      testCases: [
        { input: "['A', 'B', 'Z']", args: [["A", "B", "Z"]], expected: "Z", description: "Chữ cái" },
        { input: "[5, 6, 7, 8]", args: [[5, 6, 7, 8]], expected: 8, description: "Con số" }
      ],
      rewards: { xp: 150, coins: 30 },
    },
    { 
      _id: "e11", title: "[Mẫu] Vòng Lặp For", description: "Tạo các dải số tự động bằng code.", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 6 - VÒNG LẶP LIÊN TỤC\n\nMáy tính không biết mệt. Chúng ta dùng vòng lặp `for` để bảo nó lặp đi lặp lại một hành động.\n\n👉 **Nhiệm vụ:** Đoạn code này bảo máy tính đếm từ 1 đến N (`i=1; i<=n; i++`), cứ mỗi lần đếm lại cất con số vào một cái hộp (`result.push(i)`). Nhấn Chạy để xem máy in ra dải số.",
      starterCode: "function solution(n) {\n  let result = [];\n  for (let i = 1; i <= n; i++) {\n    result.push(i);\n  }\n  return result;\n}",
      hints: [
        "📌 Dòng 2: `let result = [];` — Tạo ra một mảng rỗng [] làm 'túi' chứa kết quả.",
        "📌 Dòng 3: `for (let i = 1; i <= n; i++)` — Vòng lặp FOR với 3 phần: (BẮT ĐẦU; ĐIỀU KIỆN CHẠY TIẾP; BƯỚC NHẢY). i bắt đầu từ 1, chạy đến khi i > n thì dừng, mỗi vòng i tăng 1 (i++).",
        "📌 Dòng 4: `result.push(i);` — Phương thức push() nhét giá trị 'i' hiện tại vào cuối mảng 'result'.",
        "📌 Dòng 6: `return result;` — Trả về mảng chứa toàn bộ kết quả sau khi vòng lặp kết thúc.",
        "✅ Tóm tắt: Vòng lặp for() cho phép lặp lại một hành động nhiều lần tự động, giúp tiết kiệm việc phải viết code lặp đi lặp lại."
      ],
      testCases: [
        { input: "3", args: [3], expected: [1, 2, 3], description: "Từ 1 tới 3" },
        { input: "5", args: [5], expected: [1, 2, 3, 4, 5], description: "Từ 1 tới 5" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e12", title: "[Thực hành] Tổng Các Số Liên Tiếp", description: "Áp dụng vòng lặp để tính toán tổng phân phối.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 6 - NHÀ TOÁN HỌC\n\nNhiệm vụ của bạn là tính tổng các số từ 1 đến `n`.\n\n👉 **Nhiệm vụ:** Tôi đã viết sẵn sườn vòng lặp. Bên trong vòng lặp, bạn hãy lấy biến `sum` cộng dồn với biến đếm `i` (`sum = sum + i`) ở mỗi bước chạy.",
      starterCode: "function solution(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    // TODO: Cộng biến 'sum' với 'i'\n    \n  }\n  return sum;\n}",
      hints: ["Gõ vào trong dấu ngoặc nhọn: `sum = sum + i;` (hoặc `sum += i;`)"],
      testCases: [
        { input: "3", args: [3], expected: 6, description: "1 + 2 + 3" },
        { input: "5", args: [5], expected: 15, description: "1 + 2 + 3 + 4 + 5" }
      ],
      rewards: { xp: 180, coins: 40 },
    },
    { 
      _id: "e13", title: "[Mẫu] Điều Kiện Khắt Khe (AND)", description: "Toán Tử Logic VÀ (&&)", difficulty: "Easy",
      instruction: "BÀI HỌC SỐ 7 - LOGIC AND (&&)\n\nKhi bạn muốn yêu cầu CẢ 2 điều kiện đều phải đúng, bạn dùng dấu `&&`.\n\n👉 **Nhiệm vụ:** Kiểm tra xem CẢ HAI số a và b có phải là số dương (> 0) hay không. Máy tính sẽ kiểm tra `a > 0` và `b > 0`.",
      starterCode: "function solution(a, b) {\n  // Nếu CẢ a lớn hơn 0 VÀ b lớn hơn 0 thì trả về true\n  return a > 0 && b > 0;\n}",
      hints: [
        "📌 Dòng 2: `return a > 0 && b > 0;` — Có 2 điều kiện được nối với nhau bằng && (AND/VÀ).",
        "📌 `a > 0` — Điều kiện 1: a phải lớn hơn 0.",
        "📌 `b > 0` — Điều kiện 2: b phải lớn hơn 0.",
        "📌 `&&` — Toán tử AND nghĩa là CẢ HAI điều kiện phải ĐÚNG thì toàn bộ biểu thức mới trả về true. Chỉ cần 1 cái sai → trả về false.",
        "✅ Tóm tắt: Dùng && khi bạn muốn đặt ra NHIỀU TIÊU CHUẨN và yêu cầu tất cả chúng đều phải được thỏa mãn."
      ],
      testCases: [
        { input: "2, 5", args: [2, 5], expected: true, description: "Cả 2 đều dương" },
        { input: "-1, 5", args: [-1, 5], expected: false, description: "Một âm một dương" }
      ],
      rewards: { xp: 50, coins: 10 },
    },
    { 
      _id: "e14", title: "[Thực hành] Điều Kiện Dễ Dãi (OR)", description: "Toán Tử Logic HOẶC (||)", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH 7 - BẮT KỲ TRƯỜNG HỢP NÀO\n\nNếu muốn MỘT TRONG HAI điều kiện đúng là được, ta dùng dấu `||` (Hoặc).\n\n👉 **Nhiệm vụ:** Xin hãy kiểm tra xem trong hai số có số nào BẰNG 0 không. Tức là `a === 0` HOẶC `b === 0`.",
      starterCode: "function solution(a, b) {\n  // TODO: Viết logic trả về true nếu a === 0 hoặc b === 0\n  \n}",
      hints: ["Lưu ý, so sánh bằng là ba dấu bằng `===`", "Viết: `return a === 0 || b === 0;`"],
      testCases: [
        { input: "0, 5", args: [0, 5], expected: true, description: "a bằng 0" },
        { input: "4, 0", args: [4, 0], expected: true, description: "b bằng 0" },
        { input: "2, 3", args: [2, 3], expected: false, description: "Không có số 0" }
      ],
      rewards: { xp: 150, coins: 30 },
    }
  ],
  c2: [
    { 
      _id: "e15", title: "[Mẫu] Map - Thay Đổi Đồng Loạt", description: "Học cách dùng array.map()", difficulty: "Medium",
      instruction: "BÀI HỌC SỐ 1 - ARRAY MAP\n\n`map()` là một hàm cực mạnh để biến đổi mọi phần tử trong mảng theo một quy tắc chung.\n\n👉 **Nhiệm vụ:** Đây là đoạn code lấy một mảng các số và nhân đôi (x2) từng số lên. Nhấn Chạy để xem kết quả.",
      starterCode: "function solution(arr) {\n  // Dùng map để nhân đôi mỗi phần tử x\n  return arr.map(x => x * 2);\n}",
      hints: [
        "📌 Dòng 2: `return arr.map(x => x * 2);` — Gọi phương thức map() trên mảng 'arr'.",
        "📌 `x => x * 2` — Đây là Arrow Function (hàm mũi tên). Với mỗi phần tử x trong mảng, thực hiện phép tính x * 2 (nhân đôi).",
        "📌 Ví dụ: arr = [1, 2, 3] → map nhân đôi từng cái → [2, 4, 6].",
        "📌 Lưu ý: map() tạo ra một MẢNG MỚI và không thay đổi mảng gốc 'arr'.",
        "✅ Tóm tắt: map() là công cụ mạnh để BIẾN ĐỔI toàn bộ phần tử trong mảng theo cùng một quy tắc."
      ],
      testCases: [
        { input: "[1, 2, 3]", args: [[1, 2, 3]], expected: [2, 4, 6], description: "Nhân 2" }
      ],
      rewards: { xp: 100, coins: 20 },
    },
    { 
      _id: "e16", title: "[Thực hành] Viết Hoa Tên", description: "Dùng map chuyển đổi chữ thành in hoa.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH 1 - CHUẨN HÓA DỮ LIỆU\n\nBạn có một danh sách các cái tên đang viết thường. Hãy làm cho chúng in hoa toàn bộ!\n\n👉 **Nhiệm vụ:** Dùng `arr.map(name => ...)` và hàm `.toUpperCase()` để viết hoa tất cả chữ cái.",
      starterCode: "function solution(arr) {\n  // TODO: Trả về mảng mới với các chuỗi in hoa\n  return arr.map(name => );\n}",
      hints: ["Điền `name.toUpperCase()` vào chỗ trống."],
      testCases: [
        { input: "['a', 'b']", args: [["a", "b"]], expected: ["A", "B"], description: "Chữ thường thành chữ hoa" }
      ],
      rewards: { xp: 200, coins: 50 },
    },
    { 
      _id: "e17", title: "[Mẫu] Filter - Bộ Lọc Tinh Thể", description: "Học cách lọc mảng.", difficulty: "Medium",
      instruction: "BÀI HỌC SỐ 2 - ARRAY FILTER\n\n`filter()` giúp bạn giữ lại những gì đạt điều kiện và vứt bỏ phần còn lại.\n\n👉 **Nhiệm vụ:** Đoạn code này chỉ giữ lại những số chẵn (`x % 2 === 0`). Nhấn chạy nhé.",
      starterCode: "function solution(arr) {\n  // Giữ lại các số chia hết cho 2 (số chẵn)\n  return arr.filter(x => x % 2 === 0);\n}",
      hints: [
        "📌 Dòng 2: `return arr.filter(x => x % 2 === 0);` — Gọi phương thức filter() để lọc mảng.",
        "📌 `x % 2` — Phép chia lấy phần DƯ. Ví dụ: 4 % 2 = 0 (chẵn), 3 % 2 = 1 (lẻ).",
        "📌 `x % 2 === 0` — Điều kiện lọc: phần dư bằng 0 → là số chẵn → GIỮ LẠI. Ngược lại → LOẠI BỎ.",
        "📌 Ví dụ: [1,2,3,4,5] → filter chỉ giữ số chẵn → [2, 4].",
        "✅ Tóm tắt: Khác với map() BIẾN ĐỔI giá trị, filter() quyết định xem phần tử có đủ điều kiện để được GIỮ LẠI hay không."
      ],
      testCases: [
        { input: "[1, 2, 3, 4, 5]", args: [[1, 2, 3, 4, 5]], expected: [2, 4], description: "Lọc chẵn" }
      ],
      rewards: { xp: 100, coins: 20 },
    },
    { 
      _id: "e18", title: "[Thực hành] Lọc Người Lớn", description: "Lọc những người trên 18 tuổi.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH 2 - KIỂM DUYỆT ĐỘ TUỔI\n\nBạn có một mảng danh sách số tuổi. Hãy lọc và CHỈ giữ lại các tuổi từ 18 trở lên (>= 18).\n\n👉 **Nhiệm vụ:** Hoàn thành logic bên trong hàm `filter`.",
      starterCode: "function solution(arr) {\n  // TODO: Lọc ra các phần tử >= 18\n  return arr.filter(age => );\n}",
      hints: ["Điền `age >= 18` vào chỗ trống."],
      testCases: [
        { input: "[10, 18, 20, 15]", args: [[10, 18, 20, 15]], expected: [18, 20], description: "Người lớn" }
      ],
      rewards: { xp: 250, coins: 60 },
    },
    { 
      _id: "e19", title: "[Mẫu] Object Keys", description: "Lấy chìa khóa của đối tượng.", difficulty: "Medium",
      instruction: "BÀI HỌC SỐ 3 - THÔNG TIN ĐỐI TƯỢNG\n\nObject là dữ liệu dạng Key-Value. Ta có thể dùng `Object.keys(obj)` để lấy danh sách các tên cột (Key).\n\n👉 **Nhiệm vụ:** Đoạn code lấy ra tất cả Key của một Object. Hãy ấn Chạy.",
      starterCode: "function solution(obj) {\n  // Trả về mảng các Keys\n  return Object.keys(obj);\n}",
      hints: [
        "📌 Dòng 2: `return Object.keys(obj);` — Gọi hàm tích hợp sẵn Object.keys() của JavaScript.",
        "📌 Object.keys() nhận vào một đối tượng (obj) và trả về một MẢNG chứa TÊN CỦA TẤT CẢ CÁC THUỘC TÍNH (key) của đối tượng đó.",
        "📌 Ví dụ: obj = { a: 1, b: 2 } → Object.keys(obj) = ['a', 'b'].",
        "📌 Một Object có cấu trúc là KEY: VALUE. Key là tên, Value là giá trị tương ứng.",
        "✅ Tóm tắt: Object.keys() rất hữu ích khi bạn muốn biết một đối tượng đang có những trường dữ liệu (tên thuộc tính) nào."
      ],
      testCases: [
        { input: "{a:1, b:2}", args: [{a: 1, b: 2}], expected: ["a", "b"], description: "Keys" }
      ],
      rewards: { xp: 100, coins: 20 },
    },
    { 
      _id: "e20", title: "[Thực hành] Object Values", description: "Lấy giá trị của đối tượng.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH 3 - LẤY RA NỘI DUNG\n\nNếu `Object.keys()` lấy ra Tên cột. Thì `Object.values()` lấy ra các Giá trị bên trong.\n\n👉 **Nhiệm vụ:** Hãy điền từ `values` vào để lấy mảng dữ liệu thật sự ra khỏi Object.",
      starterCode: "function solution(obj) {\n  // TODO: Dùng hàm Object.values\n  return Object.(obj);\n}",
      hints: ["Viết `values` sau dấu chấm. Tức là `Object.values(obj)`"],
      testCases: [
        { input: "{name:'Bob', age:20}", args: [{name: "Bob", age: 20}], expected: ["Bob", 20], description: "Values" }
      ],
      rewards: { xp: 200, coins: 50 },
    }
  ],
  c3: [
    { 
      _id: "e21", title: "[Mẫu] Thuật toán Tìm Kiếm", description: "Tìm phần tử trong mảng.", difficulty: "Hard",
      instruction: "BÀI HỌC SỐ 1 - FIND INDEX\n\nKỹ thuật kinh điển: Tìm vị trí (Index) của một phần tử n trong mảng arr. Nếu không thấy trả về -1.\n\n👉 **Nhiệm vụ:** Đoạn code duyệt mảng bằng For, nếu phần tử trùng khớp sẽ return ra Index đó.",
      starterCode: "function solution(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}",
      hints: [
        "📌 Dòng 2: `for (let i = 0; i < arr.length; i++)` — Vòng lặp đi qua từng vị trí trong mảng, từ 0 đến hết (arr.length - 1).",
        "📌 Dòng 3: `if (arr[i] === target) return i;` — Nếu phần tử tại vị trí i BẰNG target, lập tức trả về VỊ TRÍ i đó.",
        "📌 `===` là toán tử so sánh BẰNG TUYỆT ĐỐI (so sánh cả giá trị lẫn kiểu dữ liệu).",
        "📌 Dòng 5: `return -1;` — Nếu vòng lặp chạy hết mà không tìm thấy, trả về -1 (quy ước có nghĩa là 'không tìm thấy').",
        "✅ Tóm tắt: Đây là thuật toán TÌM KIẾM TUYẾN TÍNH (Linear Search) - duyệt từng phần tử một cho đến khi tìm thấy."
      ],
      testCases: [
        { input: "[10, 20, 30], 20", args: [[10, 20, 30], 20], expected: 1, description: "Tìm thấy số 20" },
        { input: "[5, 6, 7], 10", args: [[5, 6, 7], 10], expected: -1, description: "Không tìm thấy" }
      ],
      rewards: { xp: 200, coins: 30 },
    },
    { 
      _id: "e22", title: "[Thực hành] Kiểm Tra Sự Tồn Tại", description: "Trả về true/false dựa trên kết quả tìm kiếm.", difficulty: "Hard",
      instruction: "BÀI THỰC HÀNH 1 - CÓ HAY KHÔNG?\n\nBạn không cần trả về vị trí. Bạn chỉ cần trả lời Có (true) hoặc Không (false).\n\n👉 **Nhiệm vụ:** Bên trong hàm `if`, thay vì return `i`, hãy return `true`. Cuối hàm thay vì `-1`, hãy return `false`.",
      starterCode: "function solution(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return ; // TODO: Điền true\n  }\n  return ; // TODO: Điền false\n}",
      hints: ["Điền `true` vào dòng 3", "Điền `false` vào dòng 5"],
      testCases: [
        { input: "[1, 2, 3], 2", args: [[1, 2, 3], 2], expected: true, description: "Có chứa số 2" },
        { input: "[1, 2, 3], 5", args: [[1, 2, 3], 5], expected: false, description: "Không chứa số 5" }
      ],
      rewards: { xp: 400, coins: 80 },
    },
    { 
      _id: "e23", title: "[Mẫu] Đảo Ngược Chuỗi", description: "Thuật toán đập tan chuỗi chữ.", difficulty: "Hard",
      instruction: "BÀI HỌC SỐ 2 - ĐẢO NGƯỢC\n\nĐể đảo ngược 1 chuỗi ký tự, ta thường bẻ nó thành mảng ký tự bằng `.split('')`, đảo ngược mảng bằng `.reverse()`, rồi nối lại bằng `.join('')`.\n\n👉 **Nhiệm vụ:** Hãy ấn Chạy để xem chuỗi bị lật ngược.",
      starterCode: "function solution(str) {\n  return str.split('').reverse().join('');\n}",
      hints: [
        "📌 Dòng 2: `return str.split('').reverse().join('');` — Đây là 3 phương thức được 'chaining' (nối tiếp) nhau.",
        "📌 Bước 1 - `str.split('')` — Bẻ chuỗi thành mảng từng ký tự. 'hello' → ['h','e','l','l','o'].",
        "📌 Bước 2 - `.reverse()` — Đảo ngược thứ tự mảng. ['h','e','l','l','o'] → ['o','l','l','e','h'].",
        "📌 Bước 3 - `.join('')` — Ghép mảng lại thành chuỗi. ['o','l','l','e','h'] → 'olleh'.",
        "✅ Tóm tắt: Kỹ thuật METHOD CHAINING cho phép gọi nhiều phương thức liên tiếp, giúp code ngắn gọn và dễ đọc."
      ],
      testCases: [
        { input: "'hello'", args: ["hello"], expected: "olleh", description: "Lật bảng" }
      ],
      rewards: { xp: 200, coins: 30 },
    },
    { 
      _id: "e24", title: "[Thực hành] Thuật toán Palindrome", description: "Kiểm tra chuỗi đối xứng.", difficulty: "Hard",
      instruction: "BÀI THỰC HÀNH 2 - ĐỐI XỨNG GƯƠNG\n\nChuỗi Palindrome là chuỗi mà đọc xuôi hay ngược đều giống nhau (VD: madam, racecar).\n\n👉 **Nhiệm vụ:** Yêu cầu bạn viết code kiểm tra xem chuỗi lật ngược có BẰNG chuỗi ban đầu hay không.",
      starterCode: "function solution(str) {\n  // TODO: So sánh str có === với chuỗi lật ngược không?\n  let reversed = str.split('').reverse().join('');\n  return ;\n}",
      hints: ["Điền `str === reversed` đằng sau chữ return"],
      testCases: [
        { input: "'racecar'", args: ["racecar"], expected: true, description: "Chuỗi đối xứng" },
        { input: "'hello'", args: ["hello"], expected: false, description: "Không đối xứng" }
      ],
      rewards: { xp: 500, coins: 100 },
    },
    { 
      _id: "e25", title: "[Mẫu] Sorting Cơ Bản", description: "Học hàm sort.", difficulty: "Hard",
      instruction: "BÀI HỌC SỐ 3 - SẮP XẾP\n\nĐể sắp xếp mảng số từ Nhỏ đến Lớn, ta truyền một callback so sánh vào hàm `sort`.\n\n👉 **Nhiệm vụ:** Chạy hàm dưới để xem dãy số được sắp xếp lại gọn gàng ra sao.",
      starterCode: "function solution(arr) {\n  // Hàm sắp xếp tăng dần\n  return arr.sort((a, b) => a - b);\n}",
      hints: [
        "📌 Dòng 3: `return arr.sort((a, b) => a - b);` — Gọi phương thức sort() kèm một hàm so sánh (comparator function).",
        "📌 Hàm so sánh `(a, b) => a - b`: sort() so sánh từng cặp phần tử. Nếu kết quả < 0, a đứng trước b. Nếu > 0, b đứng trước a.",
        "📌 `a - b` cho thứ tự TĂNG DẦN (nhỏ → lớn). Ngược lại `b - a` cho thứ tự GIẢM DẦN.",
        "⚠️ Lưu ý: Nếu gọi sort() mà không có hàm so sánh, JavaScript sẽ sắp xếp theo bảng chữ cái, gây lỗi với số nguyên.",
        "✅ Tóm tắt: Luôn truyền comparator `(a,b) => a-b` khi muốn sort mảng số nguyên theo đúng thứ tự toán học."
      ],
      testCases: [
        { input: "[3, 1, 4, 2]", args: [[3, 1, 4, 2]], expected: [1, 2, 3, 4], description: "Xếp nhỏ đến lớn" }
      ],
      rewards: { xp: 200, coins: 30 },
    },
    { 
      _id: "e26", title: "[Thực hành] Sắp Xếp Lớn Đến Nhỏ", description: "Nghịch đảo điều kiện sort.", difficulty: "Hard",
      instruction: "BÀI THỰC HÀNH 3 - SẮP XẾP NGƯỢC\n\nNếu lệnh `a - b` giúp sắp xếp Tăng Dần. Đố bạn làm sao để xếp Giảm Dần?\n\n👉 **Nhiệm vụ:** Sửa logic trong arrow function để mảng xếp từ Lớn đến Nhỏ.",
      starterCode: "function solution(arr) {\n  // TODO: Hãy sửa a - b thành ... \n  return arr.sort((a, b) => a - b);\n}",
      hints: ["Hãy đổi chỗ a và b.", "Cụ thể là thay thế bằng `b - a`."],
      testCases: [
        { input: "[10, 50, 20]", args: [[10, 50, 20]], expected: [50, 20, 10], description: "Giảm dần" }
      ],
      rewards: { xp: 600, coins: 150 },
    }
  ],
  c4: [
    {
      _id: "h1", title: "[Mẫu] Cấu Trúc Trang HTML", description: "Học cách tạo bộ khung cơ bản của một trang web.", difficulty: "Easy",
      instruction: "BÀI HỌC HTML SỐ 1 - KHUNG TRANG WEB\n\nMọi trang web đều phải bắt đầu bằng bộ khung HTML cơ bản. Code đã được viết sẵn. Hãy bấm Chạy để xem kết quả.\n\n👉 **Nhiệm vụ:** Xem và bấm Chạy để hiểu cấu trúc của một trang HTML.",
      starterCode: "function solution() {\n  return `<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>CodeFit Học Tập</title>\n</head>\n<body>\n  <h1>Xin chào CodeFit!</h1>\n  <p>Đây là trang web đầu tiên của tôi.</p>\n</body>\n</html>`;\n}",
      hints: [
        "📌 `<!DOCTYPE html>` — Khai báo cho trình duyệt biết đây là tài liệu HTML5. BẮT BUỘC phải có ở dòng đầu tiên.",
        "📌 `<html lang=\"vi\">` — Thẻ gốc bao bọc toàn bộ trang. Thuộc tính lang='vi' khai báo ngôn ngữ là Tiếng Việt.",
        "📌 `<head>` — Phần 'đầu', chứa thông tin cài đặt cho trang (charset, title...) nhưng KHÔNG hiển thị trực tiếp lên màn hình.",
        "📌 `<title>` — Văn bản hiển thị trên TAB trình duyệt.",
        "📌 `<body>` — Phần 'thân', chứa TẤT CẢ nội dung hiển thị lên màn hình cho người dùng thấy.",
        "✅ Tóm tắt: Cấu trúc chuẩn = DOCTYPE → html → (head + body). Đây là bộ khung bắt buộc của MỌI trang HTML."
      ],
      testCases: [{ input: "", args: [], expected: "<!DOCTYPE html>", description: "Có DOCTYPE" }],
      rewards: { xp: 50, coins: 10 },
    },
    {
      _id: "h2", title: "[Thực hành] Trang Giới Thiệu Bản Thân", description: "Điền thông tin title và h1 vào trang HTML.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH HTML 1 - TỰ GIỚI THIỆU\n\nHãy hoàn thiện trang HTML giới thiệu bản thân bằng cách điền tên khóa học vào thẻ <title> và tên của bạn vào thẻ <h1>.\n\n👉 **Nhiệm vụ:** Sửa hai chỗ có comment `// TODO` trong code.",
      starterCode: "function solution() {\n  return `<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title><!-- TODO: Điền 'Trang của Học Viên' --></title>\n</head>\n<body>\n  <h1><!-- TODO: Điền 'Xin chào, tôi là Học Viên' --></h1>\n  <p>Tôi đang học HTML tại CodeFit.</p>\n</body>\n</html>`;\n}",
      hints: ["Thay `<!-- TODO: Điền 'Trang của Học Viên' -->` bằng chữ `Trang của Học Viên`.", "Thay `<!-- TODO: Điền 'Xin chào, tôi là Học Viên' -->` bằng `Xin chào, tôi là Học Viên`."],
      testCases: [{ input: "", args: [], expected: "Trang của Học Viên", description: "Có tiêu đề đúng trong title" }],
      rewards: { xp: 120, coins: 25 },
    },
    {
      _id: "h3", title: "[Mẫu] Tiêu Đề và Đoạn Văn", description: "Học các thẻ heading h1-h6 và thẻ p.", difficulty: "Easy",
      instruction: "BÀI HỌC HTML SỐ 2 - VĂN BẢN\n\nHTML có 6 cấp tiêu đề (h1 to h6) và thẻ <p> để viết đoạn văn thông thường.\n\n👉 **Nhiệm vụ:** Bấm Chạy để xem sự khác biệt về kích thước của các cấp tiêu đề.",
      starterCode: "function solution() {\n  return `<h1>Tiêu đề cấp 1 - Lớn nhất</h1>\n<h2>Tiêu đề cấp 2</h2>\n<h3>Tiêu đề cấp 3</h3>\n<p>Đây là một đoạn văn bản thông thường sử dụng thẻ p (paragraph).</p>\n<p>Mỗi thẻ p tạo ra một đoạn văn riêng biệt với khoảng cách tự động.</p>`;\n}",
      hints: [
        "📌 `<h1>` đến `<h6>` — Các thẻ Heading (tiêu đề). h1 to NHẤT và GẦN NHẤT về kích thước, h6 là NHỎ NHẤT.",
        "📌 Quy tắc SEO: Mỗi trang chỉ nên có DUY NHẤT 1 thẻ `<h1>` để tối ưu công cụ tìm kiếm.",
        "📌 `<p>` — Viết tắt của Paragraph (đoạn văn). Mỗi thẻ `<p>` trình duyệt tự thêm khoảng cách phía trên và dưới.",
        "✅ Tóm tắt: Dùng h1-h6 cho tiêu đề (theo thứ bậc quan trọng) và <p> cho văn bản nội dung thông thường."
      ],
      testCases: [{ input: "", args: [], expected: "<h1>", description: "Có thẻ h1" }],
      rewards: { xp: 50, coins: 10 },
    },
    {
      _id: "h4", title: "[Thực hành] Cấu Trúc Bài Viết Blog", description: "Sắp xếp tiêu đề và đoạn văn cho một bài blog.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH HTML 2 - VIẾT BLOG\n\nHãy hoàn thiện cấu trúc HTML cho một bài viết blog. Điền thẻ đúng vào các TODO.\n\n👉 **Nhiệm vụ:** Điền `<h1>`, `<h2>`, `<p>` đúng chỗ trong code.",
      starterCode: "function solution() {\n  return `<!-- Tiêu đề chính bài viết (dùng h1) -->\n<!-- TODO: h1 'Học HTML Trong 10 Phút' -->\n\n<!-- Mục 1 (dùng h2) -->\n<!-- TODO: h2 'HTML là gì?' -->\n<!-- TODO: p 'HTML là ngôn ngữ đánh dấu siêu văn bản.' -->`;\n}",
      hints: ["Dòng 1: Thay comment bằng `<h1>Học HTML Trong 10 Phút</h1>`.", "Dòng 2: Thay comment bằng `<h2>HTML là gì?</h2>`.", "Dòng 3: Thay bằng `<p>HTML là ngôn ngữ đánh dấu siêu văn bản.</p>`."],
      testCases: [{ input: "", args: [], expected: "<h1>Học HTML Trong 10 Phút</h1>", description: "Có tiêu đề h1" }],
      rewards: { xp: 150, coins: 30 },
    },
    {
      _id: "h5", title: "[Mẫu] Liên Kết và Hình Ảnh", description: "Học thẻ <a> tạo link và <img> chèn ảnh.", difficulty: "Easy",
      instruction: "BÀI HỌC HTML SỐ 3 - LIÊN KẾT & ẢNH\n\nThẻ `<a>` tạo liên kết (link) và thẻ `<img>` chèn hình ảnh vào trang.\n\n👉 **Nhiệm vụ:** Bấm Chạy để xem cú pháp của hai thẻ quan trọng này.",
      starterCode: "function solution() {\n  return `<!-- Tạo một liên kết -->\n<a href=\"https://codefit.vn\" target=\"_blank\">Đến CodeFit</a>\n\n<!-- Chèn hình ảnh -->\n<img src=\"img/logo.png\" alt=\"Logo CodeFit\" width=\"200\">`;\n}",
      hints: [
        "📌 `<a href=\"URL\">` — Thẻ anchor tạo liên kết. Thuộc tính `href` chứa địa chỉ đích.",
        "📌 `target=\"_blank\"` — Mở liên kết trong TAB MỚI thay vì thay thế trang hiện tại.",
        "📌 `<img src=\"đường-dẫn\" alt=\"mô tả\">` — Thẻ img chèn ảnh. `src` là đường dẫn ảnh, `alt` là mô tả cho người dùng không thấy ảnh (accessibility, SEO).",
        "📌 Thẻ `<img>` là thẻ TỰ ĐÓNG (self-closing), không cần `</img>`.",
        "✅ Tóm tắt: <a> tạo liên kết (href là điểm đến), <img> chèn ảnh (src là nguồn ảnh, alt là mô tả)."
      ],
      testCases: [{ input: "", args: [], expected: "<a href=", description: "Có thẻ a với href" }],
      rewards: { xp: 50, coins: 10 },
    },
    {
      _id: "h6", title: "[Thực hành] Trang Liên Hệ", description: "Tạo trang liên hệ với link email và hình đại diện.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH HTML 3 - TRANG LIÊN HỆ\n\nTạo trang liên hệ với ảnh đại diện và link email.\n\n👉 **Nhiệm vụ:** Điền các thuộc tính còn thiếu vào thẻ img và a.",
      starterCode: "function solution() {\n  return `<img src=\"\" alt=\"Ảnh đại diện\" width=\"100\">\n<p>Email: <a href=\"\">admin@codefit.vn</a></p>`;\n  // TODO: src trong img điền 'avatar.jpg'\n  // TODO: href trong a điền 'mailto:admin@codefit.vn'\n}",
      hints: ["src trong thẻ img: điền `avatar.jpg`.", "href trong thẻ a: dùng `mailto:admin@codefit.vn` để tạo link mở ứng dụng email."],
      testCases: [{ input: "", args: [], expected: "avatar.jpg", description: "Có src ảnh đúng" }],
      rewards: { xp: 150, coins: 30 },
    },
    {
      _id: "h7", title: "[Mẫu] Danh Sách (List)", description: "Học thẻ <ul>, <ol>, <li> để tạo danh sách.", difficulty: "Easy",
      instruction: "BÀI HỌC HTML SỐ 4 - DANH SÁCH\n\nHTML có 2 loại danh sách:\n- `<ul>` (Unordered List): Danh sách không thứ tự (dấu chấm tròn)\n- `<ol>` (Ordered List): Danh sách có thứ tự (1, 2, 3...)\n\n👉 **Nhiệm vụ:** Bấm Chạy để xem hai loại danh sách hoạt động.",
      starterCode: "function solution() {\n  return `<h3>Kỹ năng cần học:</h3>\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<h3>Các bước học HTML:</h3>\n<ol>\n  <li>Tìm hiểu cấu trúc trang</li>\n  <li>Học các thẻ cơ bản</li>\n  <li>Thực hành mỗi ngày</li>\n</ol>`;\n}",
      hints: [
        "📌 `<ul>` + `<li>` — Danh sách không thứ tự. Mỗi mục là một `<li>`. Mặc định hiển thị dấu chấm (bullet).",
        "📌 `<ol>` + `<li>` — Danh sách có thứ tự. Mỗi mục cũng là `<li>` nhưng trình duyệt tự đánh số 1, 2, 3...",
        "📌 `<li>` là viết tắt của 'List Item' (mục của danh sách). Dùng cả trong ul lẫn ol.",
        "✅ Tóm tắt: ul cho danh sách không thứ tự (gạch đầu dòng), ol cho danh sách có thứ tự (số thứ tự). Mỗi mục dùng thẻ li."
      ],
      testCases: [{ input: "", args: [], expected: "<ul>", description: "Có danh sách ul" }],
      rewards: { xp: 50, coins: 10 },
    },
    {
      _id: "h8", title: "[Thực hành] Menu Điều Hướng", description: "Tạo menu điều hướng bằng danh sách.", difficulty: "Easy",
      instruction: "BÀI THỰC HÀNH HTML 4 - MENU\n\nTạo thanh menu điều hướng gồm 3 mục bằng cách kết hợp thẻ `<ul>` + `<li>` + `<a>`.\n\n👉 **Nhiệm vụ:** Hoàn thành 3 mục menu: Trang chủ (link #home), Khóa học (#courses), Liên hệ (#contact).",
      starterCode: "function solution() {\n  return `<nav>\n  <ul>\n    <li><a href=\"#home\">Trang chủ</a></li>\n    <!-- TODO: Thêm li > a href='#courses' text='Khóa học' -->\n    <!-- TODO: Thêm li > a href='#contact' text='Liên hệ' -->\n  </ul>\n</nav>`;\n}",
      hints: ["Thêm `<li><a href=\"#courses\">Khóa học</a></li>`.", "Thêm `<li><a href=\"#contact\">Liên hệ</a></li>`."],
      testCases: [{ input: "", args: [], expected: "#courses", description: "Có link đến khóa học" }],
      rewards: { xp: 150, coins: 30 },
    },
    {
      _id: "h9", title: "[Mẫu] Bảng Dữ Liệu (Table)", description: "Học thẻ <table>, <tr>, <th>, <td>.", difficulty: "Medium",
      instruction: "BÀI HỌC HTML SỐ 5 - BẢNG BIỂU\n\nBảng HTML dùng để trình bày dữ liệu dạng hàng/cột.\n\n👉 **Nhiệm vụ:** Bấm Chạy để xem cấu trúc bảng HTML.",
      starterCode: "function solution() {\n  return `<table border=\"1\">\n  <tr>\n    <th>Học viên</th>\n    <th>Khóa học</th>\n    <th>Điểm</th>\n  </tr>\n  <tr>\n    <td>Nguyễn An</td>\n    <td>JavaScript</td>\n    <td>95</td>\n  </tr>\n  <tr>\n    <td>Trần Bình</td>\n    <td>HTML</td>\n    <td>88</td>\n  </tr>\n</table>`;\n}",
      hints: [
        "📌 `<table>` — Thẻ bao bọc toàn bộ bảng. Thuộc tính `border=\"1\"` thêm đường viền.",
        "📌 `<tr>` — Table Row (hàng). Mỗi `<tr>` là một dòng ngang trong bảng.",
        "📌 `<th>` — Table Header (ô tiêu đề). Thẻ này in đậm và căn giữa tự động.",
        "📌 `<td>` — Table Data (ô dữ liệu). Đây là ô bình thường trong bảng.",
        "✅ Tóm tắt: Cấu trúc table = table > tr > (th hoặc td). Hàng đầu dùng th (tiêu đề), các hàng sau dùng td (dữ liệu)."
      ],
      testCases: [{ input: "", args: [], expected: "<table", description: "Có thẻ table" }],
      rewards: { xp: 80, coins: 15 },
    },
    {
      _id: "h10", title: "[Thực hành] Bảng Lịch Học", description: "Tạo bảng lịch học tuần.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH HTML 5 - LỊCH HỌC\n\nHãy thêm một hàng dữ liệu vào bảng lịch học đã có.\n\n👉 **Nhiệm vụ:** Thêm hàng `<tr>` mới với thứ Tư, môn HTML, buổi Chiều.",
      starterCode: "function solution() {\n  return `<table border=\"1\">\n  <tr><th>Thứ</th><th>Môn học</th><th>Buổi</th></tr>\n  <tr><td>Thứ Hai</td><td>JavaScript</td><td>Sáng</td></tr>\n  <!-- TODO: Thêm hàng cho Thứ Tư - HTML - Chiều -->\n</table>`;\n}",
      hints: ["Thêm một dòng: `<tr><td>Thứ Tư</td><td>HTML</td><td>Chiều</td></tr>`."],
      testCases: [{ input: "", args: [], expected: "Thứ Tư", description: "Có hàng thứ Tư" }],
      rewards: { xp: 200, coins: 45 },
    },
    {
      _id: "h11", title: "[Mẫu] Form Nhập Liệu", description: "Học thẻ <form>, <input>, <label>, <button>.", difficulty: "Medium",
      instruction: "BÀI HỌC HTML SỐ 6 - BIỂU MẪU (FORM)\n\nForm là thành phần thu thập dữ liệu từ người dùng (đăng ký, đăng nhập, tìm kiếm...).\n\n👉 **Nhiệm vụ:** Bấm Chạy để xem form đăng ký cơ bản.",
      starterCode: "function solution() {\n  return `<form action=\"/dang-ky\" method=\"POST\">\n  <label for=\"name\">Họ tên:</label>\n  <input type=\"text\" id=\"name\" name=\"name\" placeholder=\"Nhập họ tên\">\n  \n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" placeholder=\"email@example.com\">\n  \n  <button type=\"submit\">Đăng ký</button>\n</form>`;\n}",
      hints: [
        "📌 `<form action=\"URL\" method=\"POST\">` — Thẻ form bao bọc các input. `action` là URL nhận dữ liệu, `method` là phương thức gửi (GET/POST).",
        "📌 `<label for=\"id\">` — Nhãn hiển thị bên cạnh input. `for` phải khớp với `id` của input để click vào label là focus vào input.",
        "📌 `<input type=\"text\">` — Ô nhập văn bản. `type=\"email\"` tự validate định dạng email.",
        "📌 `placeholder` — Văn bản gợi ý hiển thị trong ô input khi chưa nhập gì.",
        "📌 `<button type=\"submit\">` — Nút để gửi form. Khi bấm, trình duyệt gửi dữ liệu đến `action`.",
        "✅ Tóm tắt: Form = Bộ thu thập dữ liệu. label + input là cặp đôi phổ biến nhất. button type=submit để gửi dữ liệu."
      ],
      testCases: [{ input: "", args: [], expected: "<form", description: "Có thẻ form" }],
      rewards: { xp: 80, coins: 15 },
    },
    {
      _id: "h12", title: "[Thực hành] Form Đăng Nhập", description: "Tạo form đăng nhập đầy đủ.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH HTML 6 - FORM ĐĂNG NHẬP\n\nTạo form đăng nhập với ô email và mật khẩu.\n\n👉 **Nhiệm vụ:** Thêm input password và nút đăng nhập vào form đã có.",
      starterCode: "function solution() {\n  return `<form action=\"/login\" method=\"POST\">\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" placeholder=\"Email của bạn\">\n  \n  <!-- TODO: Thêm label 'Mật khẩu:' for='pass' -->\n  <!-- TODO: Thêm input type='password' id='pass' placeholder='Mật khẩu' -->\n  <!-- TODO: Thêm button type='submit' text 'Đăng nhập' -->\n</form>`;\n}",
      hints: ["Thêm `<label for=\"pass\">Mật khẩu:</label>`.", "Thêm `<input type=\"password\" id=\"pass\" name=\"pass\" placeholder=\"Mật khẩu\">`.", "Thêm `<button type=\"submit\">Đăng nhập</button>`."],
      testCases: [{ input: "", args: [], expected: "type=\"password\"", description: "Có input password" }],
      rewards: { xp: 200, coins: 45 },
    },
  ],
  c5: [
    {
      _id: "hi1", title: "[Mẫu] Thẻ Semantic HTML5", description: "Học các thẻ ngữ nghĩa: header, nav, main, article, section, aside, footer.", difficulty: "Medium",
      instruction: "BÀI HỌC HTML TRUNG CẤP SỐ 1 - SEMANTIC HTML\n\nHTML5 giới thiệu các thẻ 'ngữ nghĩa' (semantic tags) giúp trình duyệt và công cụ tìm kiếm hiểu rõ hơn về cấu trúc trang.\n\n👉 **Nhiệm vụ:** Xem bố cục trang sử dụng semantic tags.",
      starterCode: "function solution() {\n  return `<header>\n  <nav><a href=\"/\">Trang chủ</a></nav>\n</header>\n\n<main>\n  <article>\n    <h1>Tiêu đề bài viết</h1>\n    <section>\n      <h2>Giới thiệu</h2>\n      <p>Nội dung đoạn giới thiệu...</p>\n    </section>\n  </article>\n  <aside>\n    <h3>Bài viết liên quan</h3>\n  </aside>\n</main>\n\n<footer><p>© 2025 CodeFit</p></footer>`;\n}",
      hints: [
        "📌 `<header>` — Phần đầu trang, thường chứa logo và menu điều hướng.",
        "📌 `<nav>` — Khu vực điều hướng chính. Giúp trình đọc màn hình nhận ra đây là menu.",
        "📌 `<main>` — Nội dung chính của trang. Mỗi trang chỉ có DUY NHẤT 1 thẻ main.",
        "📌 `<article>` — Nội dung độc lập, có thể đứng riêng (bài blog, tin tức). Có thể xuất bản độc lập.",
        "📌 `<section>` — Một phần/mục trong article. Thường có heading riêng.",
        "📌 `<aside>` — Nội dung phụ, liên quan gián tiếp (sidebar, quảng cáo, bài liên quan).",
        "📌 `<footer>` — Phần cuối trang (copyright, link phụ, thông tin liên lạc).",
        "✅ Tóm tắt: Semantic HTML giúp code có ý nghĩa rõ ràng hơn, tốt cho SEO và Accessibility."
      ],
      testCases: [{ input: "", args: [], expected: "<header>", description: "Có thẻ header" }],
      rewards: { xp: 100, coins: 20 },
    },
    {
      _id: "hi2", title: "[Thực hành] Xây Bố Cục Trang Blog", description: "Xây dựng bố cục trang blog dùng semantic HTML.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH TRUNG CẤP 1 - BỐ CỤC BLOG\n\nHoàn thiện trang blog với đầy đủ các thẻ semantic.\n\n👉 **Nhiệm vụ:** Điền các thẻ semantic đúng vào vị trí có comment TODO.",
      starterCode: "function solution() {\n  return `<!-- TODO: Thêm thẻ header bao quanh nav -->\n  <nav><a href=\"/\">Home</a></nav>\n<!-- TODO: Đóng header -->\n\n<main>\n  <!-- TODO: Thêm article bao quanh h1 và p -->\n    <h1>Học HTML Mỗi Ngày</h1>\n    <p>Nội dung bài viết...</p>\n  <!-- TODO: Đóng article -->\n</main>`;\n}",
      hints: ["Thêm `<header>` trước thẻ nav và `</header>` sau thẻ nav.", "Thêm `<article>` trước thẻ h1 và `</article>` sau thẻ p."],
      testCases: [{ input: "", args: [], expected: "<header>", description: "Có header" }],
      rewards: { xp: 250, coins: 55 },
    },
    {
      _id: "hi3", title: "[Mẫu] Form Validation", description: "Học thuộc tính required, minlength, pattern trong form.", difficulty: "Medium",
      instruction: "BÀI HỌC HTML TRUNG CẤP SỐ 2 - KIỂM TRA DỮ LIỆU FORM\n\nHTML5 cho phép kiểm tra dữ liệu form ngay trên trình duyệt mà không cần JavaScript.\n\n👉 **Nhiệm vụ:** Xem các thuộc tính validation quan trọng.",
      starterCode: "function solution() {\n  return `<form>\n  <input type=\"text\" required placeholder=\"Bắt buộc nhập\">\n  <input type=\"text\" minlength=\"6\" placeholder=\"Tối thiểu 6 ký tự\">\n  <input type=\"text\" maxlength=\"20\" placeholder=\"Tối đa 20 ký tự\">\n  <input type=\"email\" required placeholder=\"Email hợp lệ\">\n  <input type=\"text\" pattern=\"[0-9]{10}\" placeholder=\"Số điện thoại 10 số\">\n  <button type=\"submit\">Gửi</button>\n</form>`;\n}",
      hints: [
        "📌 `required` — Trường BẮT BUỘC phải điền trước khi submit form. Nếu để trống, trình duyệt sẽ báo lỗi.",
        "📌 `minlength=\"6\"` — Độ dài TỐI THIỂU phải có 6 ký tự.",
        "📌 `maxlength=\"20\"` — Độ dài TỐI ĐA là 20 ký tự. Người dùng không thể gõ thêm.",
        "📌 `type=\"email\"` — Tự động kiểm tra phải có dạng email hợp lệ (có @).",
        "📌 `pattern=\"[0-9]{10}\"` — Phải khớp với biểu thức chính quy (regex): 10 chữ số.",
        "✅ Tóm tắt: HTML5 Validation = Kiểm tra đầu vào miễn phí, không cần JavaScript. required, minlength, maxlength, pattern là các thuộc tính phổ biến nhất."
      ],
      testCases: [{ input: "", args: [], expected: "required", description: "Có thuộc tính required" }],
      rewards: { xp: 100, coins: 20 },
    },
    {
      _id: "hi4", title: "[Thực hành] Form Đăng Ký Có Validation", description: "Tạo form đăng ký với các rule kiểm tra.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH TRUNG CẤP 2 - FORM CÓ VALIDATION\n\n👉 **Nhiệm vụ:** Thêm các thuộc tính validation vào form đăng ký theo yêu cầu:\n- Username: bắt buộc, tối thiểu 3 ký tự\n- Password: bắt buộc, tối thiểu 8 ký tự\n- Email: bắt buộc, type email",
      starterCode: "function solution() {\n  return `<form>\n  <input type=\"text\" name=\"username\" placeholder=\"Username\">\n  <!-- TODO: Thêm required và minlength=3 vào input username trên -->\n  \n  <input type=\"password\" name=\"password\" placeholder=\"Password\">\n  <!-- TODO: Thêm required và minlength=8 vào input password trên -->\n  \n  <input type=\"text\" name=\"email\" placeholder=\"Email\">\n  <!-- TODO: Đổi type thành email và thêm required -->\n  \n  <button type=\"submit\">Đăng ký</button>\n</form>`;\n}",
      hints: ["Username: `<input type=\"text\" name=\"username\" required minlength=\"3\" placeholder=\"Username\">`.", "Password: `<input type=\"password\" name=\"password\" required minlength=\"8\" placeholder=\"Password\">`.", "Email: `<input type=\"email\" name=\"email\" required placeholder=\"Email\">`."],
      testCases: [{ input: "", args: [], expected: "minlength=\"8\"", description: "Password có minlength 8" }],
      rewards: { xp: 300, coins: 65 },
    },
    {
      _id: "hi5", title: "[Mẫu] Figure và Details", description: "Học thẻ <figure>, <figcaption>, <details>, <summary>.", difficulty: "Medium",
      instruction: "BÀI HỌC HTML TRUNG CẤP SỐ 3 - THẺ NỘI DUNG PHONG PHÚ\n\nHTML5 có nhiều thẻ chuyên biệt để tổ chức nội dung phức tạp hơn.\n\n👉 **Nhiệm vụ:** Xem cách dùng figure (ảnh có chú thích) và details (nội dung thu gọn).",
      starterCode: "function solution() {\n  return `<!-- Ảnh kèm chú thích -->\n<figure>\n  <img src=\"chart.png\" alt=\"Biểu đồ tiến độ\">\n  <figcaption>Hình 1: Biểu đồ tiến độ học tập tháng 3</figcaption>\n</figure>\n\n<!-- FAQ thu gọn -->\n<details>\n  <summary>HTML5 là gì?</summary>\n  <p>HTML5 là phiên bản mới nhất của HTML, ra mắt năm 2014, hỗ trợ nhiều tính năng đa phương tiện và API mới.</p>\n</details>`;\n}",
      hints: [
        "📌 `<figure>` — Bao bọc nội dung tự chứa (ảnh, biểu đồ, code) kèm chú thích.",
        "📌 `<figcaption>` — Chú thích cho nội dung trong figure. Đặt TRONG thẻ figure, thường ở đầu hoặc cuối.",
        "📌 `<details>` — Tạo khối nội dung CÓ THỂ MỞ RỘNG/THU GỌN. Mặc định là đóng.",
        "📌 `<summary>` — Tiêu đề hiển thị khi details đóng. Click vào summary để toggle mở/đóng.",
        "✅ Tóm tắt: figure+figcaption cho ảnh có chú thích chuẩn SEO. details+summary cho nội dung accordion (FAQ) mà không cần JavaScript."
      ],
      testCases: [{ input: "", args: [], expected: "<figure>", description: "Có figure" }],
      rewards: { xp: 100, coins: 20 },
    },
    {
      _id: "hi6", title: "[Thực hành] FAQ Học Tập", description: "Tạo phần FAQ dùng details/summary.", difficulty: "Medium",
      instruction: "BÀI THỰC HÀNH TRUNG CẤP 3 - FAQ\n\nHãy thêm 2 câu hỏi FAQ nữa vào phần đã có.\n\n👉 **Nhiệm vụ:** Thêm 2 thẻ details/summary với câu hỏi và câu trả lời.",
      starterCode: "function solution() {\n  return `<details>\n  <summary>HTML là gì?</summary>\n  <p>HTML là ngôn ngữ đánh dấu siêu văn bản.</p>\n</details>\n<!-- TODO: Thêm details/summary: 'CSS là gì?' / 'CSS là ngôn ngữ tạo kiểu cho trang web.' -->\n<!-- TODO: Thêm details/summary: 'JavaScript là gì?' / 'JavaScript là ngôn ngữ lập trình cho web.' -->`;\n}",
      hints: ["Thêm `<details><summary>CSS là gì?</summary><p>CSS là ngôn ngữ tạo kiểu cho trang web.</p></details>`.", "Thêm `<details><summary>JavaScript là gì?</summary><p>JavaScript là ngôn ngữ lập trình cho web.</p></details>`."],
      testCases: [{ input: "", args: [], expected: "CSS là gì?", description: "Có câu hỏi CSS" }],
      rewards: { xp: 250, coins: 55 },
    },
  ],
  c6: [
    {
      _id: "ha1", title: "[Mẫu] Meta Tags SEO", description: "Học các thẻ meta quan trọng cho SEO và mạng xã hội.", difficulty: "Hard",
      instruction: "BÀI HỌC HTML NÂNG CAO SỐ 1 - META TAGS & SEO\n\nMeta tags là thông tin ẩn trong `<head>` giúp Google và mạng xã hội hiểu trang của bạn.\n\n👉 **Nhiệm vụ:** Xem bộ meta tags đầy đủ của một trang chuyên nghiệp.",
      starterCode: "function solution() {\n  return `<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  \n  <!-- SEO cơ bản -->\n  <title>Học HTML - CodeFit | Nền tảng học lập trình</title>\n  <meta name=\"description\" content=\"Học HTML từ cơ bản đến nâng cao với CodeFit. 100+ bài tập thực hành.\">\n  \n  <!-- Open Graph (Facebook, Zalo share) -->\n  <meta property=\"og:title\" content=\"Học HTML - CodeFit\">\n  <meta property=\"og:description\" content=\"Nền tảng học lập trình tốt nhất Việt Nam\">\n  <meta property=\"og:image\" content=\"https://codefit.vn/img/og-image.jpg\">\n  <meta property=\"og:url\" content=\"https://codefit.vn/html\">\n</head>`;\n}",
      hints: [
        "📌 `<meta name=\"viewport\">` — BẮT BUỘC cho responsive web. Giúp trang hiển thị đúng trên di động.",
        "📌 `<title>` — Hiển thị trên tab trình duyệt và kết quả tìm kiếm Google. Nên từ 50-60 ký tự.",
        "📌 `<meta name=\"description\">` — Mô tả ngắn hiển thị dưới tiêu đề trong kết quả Google. Nên từ 150-160 ký tự.",
        "📌 `og:title`, `og:description`, `og:image` — Open Graph tags. Quyết định nội dung hiển thị khi ai đó share link trang lên Facebook/Zalo.",
        "✅ Tóm tắt: Meta tags tốt = Google index tốt + Share link đẹp. Đây là nền tảng của SEO On-Page."
      ],
      testCases: [{ input: "", args: [], expected: "og:title", description: "Có Open Graph tags" }],
      rewards: { xp: 150, coins: 30 },
    },
    {
      _id: "ha2", title: "[Thực hành] Tối Ưu SEO Trang Khóa Học", description: "Hoàn thiện meta tags cho trang khóa học.", difficulty: "Hard",
      instruction: "BÀI THỰC HÀNH NÂNG CAO 1 - SEO ON-PAGE\n\nHoàn thiện bộ meta tags cho trang khóa học JavaScript.\n\n👉 **Nhiệm vụ:** Điền nội dung meta description và og:image còn thiếu.",
      starterCode: "function solution() {\n  return `<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Học JavaScript - CodeFit</title>\n  <meta name=\"description\" content=\"\">\n  <!-- TODO: Điền description: 'Học JavaScript từ cơ bản đến nâng cao với 50+ bài tập.' -->\n  <meta property=\"og:title\" content=\"Học JavaScript - CodeFit\">\n  <meta property=\"og:image\" content=\"\">\n  <!-- TODO: Điền og:image: 'https://codefit.vn/img/js-course.jpg' -->\n</head>`;\n}",
      hints: ["meta description: điền `Học JavaScript từ cơ bản đến nâng cao với 50+ bài tập.` vào content.", "og:image: điền `https://codefit.vn/img/js-course.jpg` vào content."],
      testCases: [{ input: "", args: [], expected: "js-course.jpg", description: "Có og:image đúng" }],
      rewards: { xp: 400, coins: 90 },
    },
    {
      _id: "ha3", title: "[Mẫu] Preload và Lazy Loading", description: "Tối ưu hiệu năng trang với preload và lazy loading.", difficulty: "Hard",
      instruction: "BÀI HỌC HTML NÂNG CAO SỐ 2 - TỐI ƯU HIỆU NĂNG\n\nTải trang nhanh = trải nghiệm tốt hơn và Google xếp hạng cao hơn.\n\n👉 **Nhiệm vụ:** Xem các kỹ thuật tối ưu tốc độ tải trang.",
      starterCode: "function solution() {\n  return `<head>\n  <!-- Preload: Tải sẵn tài nguyên quan trọng TRƯỚC -->\n  <link rel=\"preload\" href=\"font.woff2\" as=\"font\" crossorigin>\n  <link rel=\"preload\" href=\"hero-image.jpg\" as=\"image\">\n  \n  <!-- Prefetch: Tải sẵn tài nguyên trang KẾ TIẾP -->\n  <link rel=\"prefetch\" href=\"/courses\">\n</head>\n\n<body>\n  <!-- Ảnh trên màn hình: tải ngay -->\n  <img src=\"hero.jpg\" alt=\"Hero\">\n  \n  <!-- Ảnh bên dưới: lazy load (chỉ tải khi scroll đến) -->\n  <img src=\"course.jpg\" alt=\"Course\" loading=\"lazy\" decoding=\"async\">\n</body>`;\n}",
      hints: [
        "📌 `rel=\"preload\"` — Ra lệnh cho trình duyệt tải tài nguyên NÀY NGAY LẬP TỨC với ưu tiên cao (font, ảnh hero).",
        "📌 `rel=\"prefetch\"` — Tải sẵn tài nguyên trang KẾ TIẾP trong thời gian nhàn rỗi để điều hướng nhanh hơn.",
        "📌 `loading=\"lazy\"` — Lazy loading: Ảnh bên dưới fold chỉ ĐỢI KHI người dùng SCROLL ĐẾN GẦN mới tải. Giảm tải ban đầu rất nhiều.",
        "📌 `decoding=\"async\"` — Giải mã ảnh không block rendering thread, trang vẫn hiển thị trong khi ảnh decode.",
        "✅ Tóm tắt: preload cho tài nguyên quan trọng, lazy loading cho ảnh bên dưới. Hai kỹ thuật này kết hợp cải thiện Core Web Vitals."
      ],
      testCases: [{ input: "", args: [], expected: "loading=\"lazy\"", description: "Có lazy loading" }],
      rewards: { xp: 150, coins: 30 },
    },
    {
      _id: "ha4", title: "[Thực hành] Trang Tối Ưu Performance", description: "Áp dụng preload và lazy loading.", difficulty: "Hard",
      instruction: "BÀI THỰC HÀNH NÂNG CAO 2 - PERFORMANCE\n\n👉 **Nhiệm vụ:** Thêm lazy loading cho ảnh bên dưới và preload cho font chữ.",
      starterCode: "function solution() {\n  return `<head>\n  <!-- TODO: Thêm preload cho font 'main.woff2' với as='font' và crossorigin -->\n</head>\n<body>\n  <img src=\"hero.jpg\" alt=\"Hero\">\n  <img src=\"section2.jpg\" alt=\"Phần 2\">\n  <!-- TODO: Thêm loading='lazy' và decoding='async' vào img section2 phía trên -->\n</body>`;\n}",
      hints: ["Thêm vào head: `<link rel=\"preload\" href=\"main.woff2\" as=\"font\" crossorigin>`.", "Sửa ảnh section2: `<img src=\"section2.jpg\" alt=\"Phần 2\" loading=\"lazy\" decoding=\"async\">`."],
      testCases: [{ input: "", args: [], expected: "crossorigin", description: "Có preload font đúng chuẩn" }],
      rewards: { xp: 500, coins: 120 },
    },
    {
      _id: "ha5", title: "[Mẫu] Structured Data JSON-LD", description: "Thêm dữ liệu cấu trúc để Google hiểu nội dung trang.", difficulty: "Hard",
      instruction: "BÀI HỌC HTML NÂNG CAO SỐ 3 - STRUCTURED DATA\n\nJSON-LD là cách thêm dữ liệu có cấu trúc giúp Google tạo Rich Snippets (kết quả tìm kiếm đẹp).\n\n👉 **Nhiệm vụ:** Xem một ví dụ schema Course hoàn chỉnh.",
      starterCode: "function solution() {\n  return `<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Course\",\n  \"name\": \"HTML Cơ Bản - CodeFit\",\n  \"description\": \"Khóa học HTML từ cơ bản đến nâng cao\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"CodeFit\",\n    \"url\": \"https://codefit.vn\"\n  },\n  \"offers\": {\n    \"@type\": \"Offer\",\n    \"price\": \"0\",\n    \"priceCurrency\": \"VND\"\n  }\n}\n</script>`;\n}",
      hints: [
        "📌 `<script type=\"application/ld+json\">` — Thẻ script đặc biệt chứa JSON-LD. Trình duyệt không thực thi nó như JavaScript.",
        "📌 `@context: schema.org` — Khai báo sử dụng từ điển chuẩn của Schema.org.",
        "📌 `@type: Course` — Nói với Google rằng trang này là thông tin về một KHÓA HỌC.",
        "📌 Google dùng dữ liệu này để tạo Rich Snippets — kết quả tìm kiếm hiển thị thêm thông tin (rating sao, giá, ngày).",
        "✅ Tóm tắt: JSON-LD Structured Data giúp Google 'đọc hiểu' trang của bạn và tạo kết quả tìm kiếm nổi bật hơn."
      ],
      testCases: [{ input: "", args: [], expected: "application/ld+json", description: "Có JSON-LD script" }],
      rewards: { xp: 150, coins: 30 },
    },
    {
      _id: "ha6", title: "[Thực hành] Schema Article", description: "Tạo JSON-LD cho một bài viết blog.", difficulty: "Hard",
      instruction: "BÀI THỰC HÀNH NÂNG CAO 3 - SCHEMA ARTICLE\n\n👉 **Nhiệm vụ:** Hoàn thiện schema Article với @type, name và author còn thiếu.",
      starterCode: "function solution() {\n  return `<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"\",\n  \"name\": \"\",\n  \"author\": {\n    \"@type\": \"Person\",\n    \"name\": \"CodeFit Team\"\n  }\n}\n</script>`;\n  // TODO: @type điền 'Article'\n  // TODO: name điền 'Hướng dẫn học HTML từ đầu'\n}",
      hints: ["@type: điền chuỗi `Article`.", "name: điền chuỗi `Hướng dẫn học HTML từ đầu`."],
      testCases: [{ input: "", args: [], expected: "Article", description: "@type là Article" }],
      rewards: { xp: 600, coins: 150 },
    },
  ],
};

export const mockUsers = [
  { _id: "u1", name: "Nguyễn Minh", email: "minh@demo.vn", level: "Intermediate", xp: 350, role: "admin" },
  { _id: "u2", name: "Trần Mai", email: "mai@demo.vn", level: "Beginner", xp: 80, role: "user" },
  { _id: "u3", name: "Lê Hoàng", email: "hoang@demo.vn", level: "Advanced", xp: 620, role: "user" },
];

export const mockDailyProgress = [
  { date: "01/03", score: 75, submits: 5 },
  { date: "02/03", score: 80, submits: 3 },
  { date: "03/03", score: 90, submits: 8 },
  { date: "04/03", score: 85, submits: 4 },
  { date: "05/03", score: 95, submits: 6 },
  { date: "06/03", score: 88, submits: 7 },
  { date: "07/03", score: 92, submits: 5 },
];

export const mockMe = (user) => ({
  user: { ...user, aiUsageLeft: 10 },
  stats: { completedCount: 5, totalSubmits: 12, avgScore: 85, totalTimeSpent: 3600, passedCount: 5 },
});

export const mockProgress = () => ({
  dailyProgress: mockDailyProgress,
  submissions: [],
});
