# Nail Play

Website 10 trò chơi cho khách chờ tại tiệm nail. JavaScript thuần, SVG tự vẽ, không cần cài thư viện.

## Chạy tại máy

Yêu cầu Node.js 20 trở lên. Trong thư mục nail-game chạy `npm start`, mở http://127.0.0.1:4173.
Máy chủ chỉ phục vụ trên máy hiện tại. Chưa triển khai công khai.

## Các trò chơi

| Trò | Luật phiên bản hiện tại |
| --- | --- |
| Nail Match | Ghép 3 ô xếp lớp, khay 7 ô. Tối đa 5 màn. |
| Thiết kế bộ móng | Sơn 5 móng, 8 màu, 4 kiểu trang trí; tải ảnh SVG. |
| Lật thẻ tìm cặp | 16 thẻ, tìm đủ 8 cặp; tính số lượt lật. |
| Ghép 3 lọ sơn | Bàn 6×6, đổi hai ô cạnh nhau, ghép chuỗi, 600 điểm trong 20 lượt. |
| Làm nail theo mẫu | Nhớ mẫu 8 giây, tái tạo màu và họa tiết 5 móng, chấm điểm phần trăm. |
| Pha màu sơn | Trộn 3 màu bằng thanh tỉ lệ, so độ gần với màu mục tiêu. |
| Bắt lọ sơn | Kéo giỏ, phím mũi tên hoặc nút trái/phải; 45 giây, 3 mạng, tránh lọ có dấu ×. |
| Xếp hình bộ móng | Đổi vị trí hai trong 9 mảnh để hoàn thành ảnh; có xem mẫu. |
| Tìm điểm khác biệt | 3 khác biệt giữa hai bảng 12 hình; tối đa 5 lượt sai. |
| Tiệm nail mini | Chọn khách, màu, dịch vụ; phục vụ 8 khách trong 60 giây; 3 khách bỏ đi thì thua. |

Tất cả trò có hướng dẫn bằng nút ?, chơi lại, quay menu. Bộ đếm thời gian dừng khi tab bị ẩn hoặc mở hộp thoại; rời trò sẽ hủy vòng lặp và tác vụ của lượt chơi đó.

## Nail Match

- Màn 1–4 sinh bàn có đường giải. Xáo hình giữ số lượng từng loại, vị trí, khay và điểm; sau xáo không đảm bảo đường giải.
- Màn 5 cố định 66 ô: 54 ô ngoài và khóa giữa 12 ô. Khóa bắt buộc mở theo thứ tự 0,1,2,0,1,2,3 khiến khay đầy trước khi lấy được các hình ghép còn thiếu. Không có đường thắng, không sinh thêm ô; giao diện và hướng dẫn ghi rõ. Xáo hình bị tắt ở màn 5.
- Ba lượt hoàn tác, ba lượt gợi ý mỗi màn. Gợi ý không đảm bảo thắng.
- Lưu kỷ lục Nail Match tại trình duyệt. Các trò còn lại chưa lưu tiến độ giữa các lần mở.

## Kiểm tra

- `npm test`: 12 bài logic cho xếp lớp, bẫy màn 5, xáo hình, ghép 3 hàng/cột, sập ô, pha màu, chấm mẫu móng.
- Kiểm tra Edge: 10 mục menu, chơi lại, quay về, hướng dẫn, không tràn ngang ở 320/390/768/1440px.
- Kiểm tra lượt chơi: ghép đủ 8 cặp, hoàn thành xếp hình, tìm đủ khác biệt, mẫu móng đạt 100%, xuất SVG, ghép 3 và điểm, kết thúc bắt lọ sơn, phục vụ 8 khách.
- Kịch bản kiểm tra trình duyệt ở output/playwright/verify-arcade.js và verify-arcade-edges.js (chạy qua playwright-cli run-code --filename).

Font tải từ Google Fonts; mất mạng dùng font hệ thống. Hình SVG nằm trong dự án, không phụ thuộc ảnh ngoài.

## English interface, effects and sound

All ten games, controls, help dialogs, results and accessibility labels now use English. The menu opens directly on the game cards; the introduction and footer are removed. Cards share the tile styling used in gameplay.

Shared synthesized sound effects use Web Audio: tap, pick, match, shuffle, success and loss. Sound starts after a user gesture. The header Sound on/off toggle applies to every game and persists in localStorage. Muting stops active tones; hiding the tab stops audio. No external audio downloads.

Action feedback includes match sparkles, card flips, cleared-tile animation and result reveals. Reduced-motion preferences disable animation. Buttons and layered tiles keep stable hit targets.
