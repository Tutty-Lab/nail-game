# Nail Play

Website 10 trò chơi cho khách chờ tại tiệm nail. JavaScript thuần, SVG tự vẽ, không cần cài thư viện.

## Chạy tại máy

Yêu cầu Node.js 20 trở lên. Trong thư mục nail-game chạy `npm start`, mở http://127.0.0.1:4173.
Máy chủ chỉ phục vụ trên máy hiện tại. Chưa triển khai công khai.

## Các trò chơi

| Trò | Màn | Luật |
| --- | --- | --- |
| Polish Painter | 24 | Tô bằng ngón tay theo đề bài (French tip, sọc, chấm bi, tim, chevron…), cọ 3 cỡ, đổ nền, tẩy. Chấm từng ô 20×30 so với mẫu; mục tiêu tính trên phần chi tiết nên đổ một màu không qua màn. |
| Gradient Mixer | 24 | Nhỏ giọt 3→6 sắc tố vào 1→5 dải để tái tạo ombre; giới hạn số giọt; 85/92/97% = 1/2/3 sao. Mọi màu đích pha ra được. |
| Polish Sort | 60 | Đổ sơn giữa các chai, mỗi chai một màu. 3→10 màu; từ màn 21 có lớp bị che; mọi màn kiểm chứng giải được bằng bộ giải. Undo, thêm chai rỗng (tắt từ màn 41). |
| Nail Match | 5 | Ghép 3 ô xếp lớp, khay 7 ô; mỗi màn một bộ hình và bối cảnh; màn 5 là bẫy không thể thắng. |
| Polish Merge | vô tận | Vuốt gộp 2 món giống nhau thành món cấp cao hơn, 13 cấp tới vương miện; lưu kỷ lục. |
| Polish Pop | 30 | Đổi ô ghép 3, combo nhân điểm; màn chẵn có mục tiêu thu thập. |
| Memory Match | 20 | 4→12 cặp, xem trước ở màn đầu, giới hạn lượt từ màn 4. |
| Polish Catch | 20 | Hứng lọ sơn, sao +50, tim hồi mạng; tốc độ, tỉ lệ lọ vỡ, lọ trôi ngang tăng dần. |

Đã bỏ: Copy the Look, Color Lab, Nail Jigsaw, Spot the Difference, Mini Nail Salon, Nail Designer (ít động lực chơi lại).
Tiến độ, sao, kỷ lục lưu `localStorage` trên máy; không đăng nhập, không gửi dữ liệu, không quảng cáo, không thanh toán.
Nền 3D dùng Three.js 0.170 đóng gói tại `vendor/` (MIT), chạy offline; tắt chuyển động khi máy bật giảm chuyển động.

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
