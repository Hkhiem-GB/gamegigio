# Game Gì Giờ? (Steam Game Roulette) 🎮

Website gợi ý và quay chọn ngẫu nhiên các tựa game chất lượng trên nền tảng Steam theo thể loại và độ phổ biến. Giao diện được thiết kế theo phong cách dark gaming hiện đại, cơ chế vòng quay mượt mà, giữ nguyên vị trí trúng thưởng và tích hợp xem trước trailer, thông tin chi tiết từ Steam.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

Yêu cầu môi trường: **Node.js >= 18** và **npm**.

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển (Dev Server)
npm run dev

# 3. Chạy bộ kiểm thử tự động (Unit Tests)
npm run test

# 4. Chạy kiểm thử trình duyệt thực tế (Playwright Browser Test)
npm run test-browser

# 5. Cập nhật dữ liệu game từ Steam
npm run update-games

# 6. Tải metadata hình ảnh & video trailer từ Steam
npm run fetch-media

# 7. Biên dịch mã nguồn cho bản sản xuất (Production Build)
npm run build

# 8. Xem trước bản build sản xuất
npm run preview
```

---

## 🎰 Cơ Chế Vòng Quay Ngẫu Nhiên (Gaming Roulette)

Vòng quay ngang được thiết kế đem lại cảm giác hồi hộp, trực quan và chính xác:
1. **Khởi động nhanh & dứt khoát**: Ngay khi nhấn "QUAY NGAY", vòng quay tăng tốc tức thì, cuốn qua hàng chục tựa game.
2. **Đường cong giảm tốc mượt (Quartic Ease-Out)**: Thời lượng 5.5 giây, giảm tốc mượt mà và trượt chậm từng card qua vạch tâm ở những giây cuối.
3. **Căn tâm tuyệt đối**: Vạch laser đỏ và mũi tên tâm cố định ngay chính giữa màn hình, vị trí dừng được tính toán chính xác theo kích thước card thực tế trên mọi thiết bị (Mobile, Tablet, Desktop).
4. **Cố định vị trí trúng thưởng**: Sau khi quay xong, card trúng nằm cố định tại vạch laser đỏ. Vòng quay giữ nguyên vị trí đã dừng cho đến khi người dùng đổi thể loại hoặc thực hiện lượt quay mới.

---

## 🎮 Dữ Liệu Game Steam

Dữ liệu game trong dự án được thu thập và đồng bộ trực tiếp từ nền tảng **Steam**:
- **Đa dạng thể loại**: Bao gồm Hành động, Phiêu lưu, Nhập vai, Chiến thuật, Mô phỏng, Game độc lập, Kinh dị, Phim tương tác (FMV), Thể thao, Đua xe, Nhiều người chơi trực tuyến,...
- **Thông tin chi tiết**: Mỗi tựa game lưu trữ đầy đủ Steam App ID, tên chính thức, hình ảnh banner, trailer chất lượng cao, danh sách thể loại và mô tả chi tiết.
- **Tích hợp Media**: Hỗ trợ phát video trailer trực tiếp và xem bộ sưu tập hình ảnh screenshot của từng game.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
gamegigio/
├── public/                        # Tài nguyên tĩnh (Logo SVG, ảnh nền, favicon)
├── scripts/
│   ├── updateSteamGames.ts        # Script cập nhật danh sách game từ Steam
│   ├── fetchSteamMedia.ts         # Script đồng bộ trailer & ảnh chụp màn hình Steam
│   └── testBrowserSpin.ts         # Script kiểm thử tự động trên trình duyệt thực tế
├── src/
│   ├── components/                # Các thành phần giao diện (Roulette, Library, Modals, Header, Footer,...)
│   ├── data/                      # Dữ liệu game Steam theo từng thể loại & media
│   ├── types/                     # Định nghĩa TypeScript (Game, Genre,...)
│   ├── utils/                     # Xử lý dữ liệu, thuật toán quay ngẫu nhiên
│   ├── __tests__/                 # Bộ kiểm thử tự động (Vitest)
│   ├── App.tsx                    # Component ứng dụng chính
│   ├── main.tsx                   # Điểm khởi chạy React
│   └── index.css                  # Cấu hình Tailwind CSS & hiệu ứng animation
├── package.json                   # Cấu hình dự án & dependencies
├── tailwind.config.js             # Cấu hình Tailwind CSS
├── tsconfig.json                  # Cấu hình TypeScript
└── vite.config.ts                 # Cấu hình Vite build
```

---

## ⚖️ Bản Quyền & Giấy Phép

Dự án được xây dựng phục vụ mục đích học tập và giải trí phi thương mại. Mọi hình ảnh, video và thương hiệu liên quan đến game thuộc bản quyền của **Valve Corporation** và các nhà phát triển/phát hành tương ứng trên **Steam**.
