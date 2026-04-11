const fs = require('fs');

const file = 'c:/Users/Admin/Desktop/demo/codefit/frontend/src/services/mockData.js';
let content = fs.readFileSync(file, 'utf8');

const tutorialHints = {
  e1: \`["Dòng 2: \\\`return a + b;\\\` lấy giá trị của a cộng với b, sau đó dùng từ khóa \\\`return\\\` để trả kết quả đó về cho chương trình.", "Bài học rút ra: Dấu \\\`+\\\` dùng để cộng số. Từ khóa \\\`return\\\` rất quan trọng để xuất kết quả ra ngoài hàm."]\`,
  e3: \`["Dòng 3: \\\`return 'Hello ' + name;\\\` nối chuỗi tĩnh 'Hello ' với chuỗi động \\\`name\\\`. Chú ý khoảng trắng sau chữ Hello.", "Bài học rút ra: Dấu \\\`+\\\` không chỉ cộng số mà còn dùng để nối/ghép đoạn chữ lại với nhau."]\`,
  e5: \`["Dòng 2: \\\`return a > b;\\\` sử dụng toán tử lớn hơn \\\`>\\\`. Nếu a thực sự lớn hơn b, biểu thức này trả về \\\`true\\\`. Nếu không, trả về \\\`false\\\`.", "Bài học rút ra: Các phép so sánh (>, <, >=, <=, ===) luôn luôn tạo ra kết quả là kiểu Boolean (true hoặc false)."]\`,
  e7: \`["Dòng 2: \\\`if (n >= 0)\\\` kiểm tra xem n có lớn hơn hoặc BẰNG 0 hay không.", "Dòng 3: Nếu đúng, bỏ qua nhánh else và \\\`return 'Positive'\\\`.", "Dòng 5: Nếu sai (n < 0), chương trình nhảy vào nhánh \\\`else\\\` và \\\`return 'Negative'\\\`.", "Bài học rút ra: If/Else giúp chương trình biết phải làm gì trong từng trường hợp cụ thể."]\`,
  e9: \`["Dòng 2: \\\`return arr[0];\\\` truy cập vào mảng \\\`arr\\\` và lấy ra phần tử nằm ở vị trí (index) số 0.", "Bài học rút ra: Trong Javascript và hầu hết ngôn ngữ lập trình, chỉ số mảng bắt đầu từ 0 chứ không phải 1. Phần tử đầu tiên luôn là [0]."]\`,
  e11: \`["Dòng 2: \\\`let result = [];\\\` tạo ra một mảng rỗng để chuẩn bị chứa dữ liệu.", "Dòng 3: \\\`for (let i = 1; i <= n; i++)\\\` khởi tạo vòng lặp từ 1 đến n. Mỗi bước lặp, \\\`i\\\` tăng dần lên 1 đơn vị (\\\`i++\\\`).", "Dòng 4: \\\`result.push(i)\\\` nhét con số \\\`i\\\` hiện tại vào cuối mảng \\\`result\\\`.", "Bài học rút ra: Vòng lặp kết hợp với mảng là công cụ mạnh mẽ nhất để xử lý danh sách dữ liệu."]\`,
  e13: \`["Dòng 2: \\\`return a > 0 && b > 0;\\\` chứa hai điều kiện. Điều kiện 1 là \\\`a > 0\\\`, điều kiện 2 là \\\`b > 0\\\`.", "Dấu \\\`&&\\\` (AND) yêu cầu CẢ HAI điều kiện phải \\\`true\\\` thì kết quả cuối cùng mới là \\\`true\\\`. Chỉ cần 1 cái sai, kết quả sẽ là \\\`false\\\`.", "Bài học rút ra: Dùng \\\`&&\\\` khi bạn muốn bắt buộc mọi tiêu chuẩn đều phải được đáp ứng."]\`,
  e15: \`["Dòng 2: \\\`return arr.map(x => x * 2);\\\` sử dụng hàm \\\`map()\\\`. Hàm này sẽ duyệt qua TỪNG phần tử của mảng \\\`arr\\\` (gọi tắt là \\\`x\\\`)", "Với mỗi \\\`x\\\`, biến đổi nó thành \\\`x * 2\\\` (nhân đôi).", "Sau cùng \\\`map()\\\` tạo ra một MẢNG MỚI chứa toàn bộ các số đã nhân đôi.", "Bài học rút ra: Hàm map() giúp biến đổi hàng loạt dữ liệu mà không cần viết vòng lặp dài dòng."]\`,
  e17: \`["Dòng 2: \\\`return arr.filter(x => x % 2 === 0);\\\` duyệt qua từng phần tử \\\`x\\\`.", "\\\`x % 2\\\` là phép chia lấy phần dư. Nếu dư bằng 0 (\\\`=== 0\\\`), tức là số chẵn.", "Hàm \\\`filter()\\\` sẽ LỌC BỎ tất cả các phần tử nào làm sai điều kiện này, và giữ lại phần tử đúng đắn.", "Bài học rút ra: Khác với map() biến đổi giá trị, filter() chỉ quyết định xem giá trị đó được Giữ lại hay Bỏ đi."]\`,
  e19: \`["Dòng 2: \\\`return Object.keys(obj);\\\` sử dụng một hàm tích hợp sẵn của Javascript dành riêng cho Object.", "Hàm \\\`keys()\\\` lục lọi đối tượng \\\`obj\\\` và rút ra mảng chứa TÊN CỦA TẤT CẢ CÁC CHÌA KHÓA (thuộc tính).", "Bài học rút ra: Đối tượng (Object) được định dạng theo \\\`Key: Value\\\`. Object.keys() giúp bạn lấy danh sách các Key (như name, age)."]\`,
  e21: \`["Dòng 2: \\\`return arr.findIndex(x => x === target);\\\` tìm kiếm số \\\`target\\\` trong mảng \\\`arr\\\`.", "\\\`findIndex\\\` sẽ chạy từ đầu mảng tới cuối mảng, ngay khi tìm thấy vị trí đầu tiên thỏa mãn (\\\`x === target\\\`), nó sẽ lập tức dừng lại và trả về vị trí (index) đó.", "Bài học rút ra: findIndex() rất hữu ích để tìm hiểu xem một món đồ nằm ở số thứ tự bao nhiêu trong danh sách."]\`,
  e23: \`["Dòng 3: \\\`str.split('')\\\` bẻ gãy chuỗi văn bản thành một mảng gồm từng ký tự li ti. Ví dụ 'abc' -> ['a', 'b', 'c']", "Dòng 4: \\\`.reverse()\\\` đảo ngược mảng đó lại -> ['c', 'b', 'a']", "Dòng 5: \\\`.join('')\\\` dùng keo dính ráp các chữ cái lại thành văn bản mới liền mạch -> 'cba'", "Bài học rút ra: Bạn có thể chaining (nối) các hàm lại với nhau để thực thi liên hoàn các phép biến đổi!"]\`,
  e25: \`["Dòng 2: \\\`return arr.sort((a, b) => a - b);\\\` gọi hàm sắp xếp.", "Trong Javascript, hàm \\\`sort()\\\` mặc định sắp xếp theo bảng chữ cái. Nên nếu để sắp xếp số, ta phải cung cấp luật so sánh \\\`(a, b) => a - b\\\`.", "Luật \\\`a - b\\\` có nghĩa là: Nếu a lớn hơn b (a-b > 0), a sẽ bị đẩy về đằng sau (tăng dần).", "Bài học rút ra: Khi sắp xếp mảng có chứa số, nhớ luôn truyền function luật chơi (a,b)=>a-b vào sort() nhé."]\`,
};

// Replace hints in mockData.js for the tutorials based on their ID
for (const [id, hintsStr] of Object.entries(tutorialHints)) {
    const regex = new RegExp(\`(_id:\\s*"\${id}"[\\\\s\\\\S]*?hints:\\s*)\\[.*?\\]\`);
    content = content.replace(regex, \`$1\${hintsStr}\`);
}

fs.writeFileSync(file, content);
console.log('Hints updated successfully!');
