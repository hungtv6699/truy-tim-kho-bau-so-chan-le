# Game 03 — Kiểm thử và bàn giao

Ngày 12/11/2026 (Việt Nam). Game dành cho trẻ 5–6 tuổi, làm riêng và không sửa hai game đã duyệt.

- [Game online](https://hungtv6699.github.io/truy-tim-kho-bau-so-chan-le/)
- [Mã nguồn và lịch sử](https://github.com/hungtv6699/truy-tim-kho-bau-so-chan-le)
- [Hướng dẫn giáo viên](../HUONG-DAN.md)
- [Bộ bàn giao Google Drive](https://drive.google.com/drive/folders/1Q_LcZhwx6iL9bArFU5uua7gPDbri6nDt)
- [ZIP offline](https://drive.google.com/file/d/1X9GrJttU2lSA8sSFK3TVCjKHDVYkJXRr/view?usp=drivesdk) · [Video thao tác](https://drive.google.com/file/d/1E-EIxVdtqMVrs9rAqkbb5mwNOqbCKR-6/view?usp=drivesdk)

## Phạm vi xác minh

- Bốn phương án khác nhau ở mỗi câu, chỉ có một đáp án đúng trong phạm vi 1–10. Mã cuối **83619**. Chọn sai ở cả năm lượt không làm mất tiến độ; chọn đúng mở đúng một ổ khóa.
- Mật mã không hiển thị trước. Bảng gợi ý có 10 số, phân màu chẵn/lẻ, ghép đôi khi chạm số, thu hẹp phạm vi từng bước và không tự điền chữ số. Rương chỉ mở sau khi đủ năm chữ số và trẻ chạm nút mở.
- Chạy đủ luồng trên Chrome bằng chuột và Edge bằng cảm ứng giả lập, 1280 × 720. Kiểm tra bật/tắt toàn màn hình, phát lại, tắt/bật âm thanh, chơi lại và trở về. Xem [offline](offline.jsonl), [online](online.jsonl) và [ảnh từng màn](previews/).
- Offline qua `file://` trong ngữ cảnh ngắt mạng; không có yêu cầu HTTP, lỗi JavaScript hay tài nguyên tải thất bại. [Kiểm tra SHA-256](offline-zip.txt) đối chiếu 37 tệp trong ZIP với bản đã chạy.
- 24 MP3 được dựng bằng preset **Ngọc Linh** trong Onter Voice Lab (VieNeuEngine). Trình duyệt đọc được metadata cả 24 clip và xác nhận phát lời chào, câu hỏi, gợi ý, đọc số, câu thử lại và lời chiến thắng. Một phần tử âm thanh điều phối lời thoại; nhạc nền và tiếng mở khóa tạo tại chỗ. Không gọi API giọng đọc hoặc dùng giọng trình duyệt.
- Đã xem ảnh giao diện. Rương và chuyển động là 2.5D CSS/SVG; cảnh hang và ba nhân vật là ảnh kết xuất 3D. Video thao tác dài 23 giây, không có rãnh âm thanh; game có âm thanh đầy đủ.
- **Chưa kiểm thử trên bảng tương tác vật lý.**

## Tái lập và lưu giữ

Chạy `node tools/qa.cjs` (offline) hoặc thêm URL Pages (online), đặt `PLAYWRIGHT_PATH` trỏ tới Playwright đã cài nếu cần. Chạy `tools/package.ps1` rồi `tools/verify-zip.ps1` để tạo và kiểm tra gói. `node tools/demo.cjs` quay bản demo từ game offline. Ảnh kiểm thử, ZIP và video là đầu ra bàn giao tạo ngày 12/11/2026, đề xuất rà soát giữ lại ngày 26/11/2026. Ảnh WebP là tài nguyên nguồn của game, giữ trong kho.

Đã dọn các WAV trung gian trong `tmp/voice` ngay sau khi mã hóa thành công và video trung gian trong `tmp/demo` sau khi lưu bản demo. Trình tạo và bằng chứng được giữ lại. Ngày rà soát tệp tạm đề xuất: 19/11/2026; không tự động xóa theo ngày.
