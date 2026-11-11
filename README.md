# Truy tìm kho báu bí ẩn

Game 03 độc lập dành cho trẻ 5–6 tuổi: nhận biết số chẵn, số lẻ và so sánh các số từ 1 đến 10.

- [Chơi trên GitHub Pages](https://hungtv6699.github.io/truy-tim-kho-bau-so-chan-le/)
- [Hướng dẫn giáo viên](HUONG-DAN.md)
- [Báo cáo kiểm thử](reports/QA.md)

## Chạy offline

Giải nén toàn bộ gói offline rồi mở `index.html` bằng Chrome hoặc Edge. Không cần mạng, đăng nhập hay máy chủ.

## Bảo trì

`src/questions.json` là dữ liệu gốc; chạy `node tools/sync-questions.cjs` để đồng bộ JavaScript tải được qua file://. Khi thay nội dung câu hỏi, cập nhật lời thoại và dựng lại MP3 liên quan. `src/game-state.js` quản lý tiến trình; các template trong HTML mô tả từng màn. `styles/` quản lý bố cục và hoạt ảnh, `audio/manifest.js` liệt kê MP3, `src/voice-lines.json` là lời dựng. Công cụ dựng giọng dùng preset Ngọc Linh trong Onter Voice Lab (VieNeuEngine), theo quy trình Game 02. Hai ảnh WebP gốc của cảnh và nhân vật được tạo riêng cho Game 03. Rương, khóa và ánh sáng được dựng bằng CSS/SVG.

Tham chiếu: [Game 01](https://hungtv6699.github.io/be-vui-so-chan-so-le-play/index.html) có Three.js và gói clip Ngọc Linh; [Game 02](https://hungtv6699.github.io/co-may-phan-loai-bi-an/) có điều khiển lớn, gợi ý ghép đôi và MP3 offline.
