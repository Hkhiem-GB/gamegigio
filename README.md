# Game Gì Giờ? (Steam Game Roulette) 🎮

Website gợi ý và quay chọn ngẫu nhiên các tựa game chất lượng trên nền tảng Steam theo thể loại và độ phổ biến. Được thiết kế theo phong cách gaming đen - đỏ trầm hiện đại, cơ chế vòng quay mượt mà, giữ nguyên vị trí trúng thưởng kèm hệ thống âm thanh Web Audio arcade sống động.

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

# 5. Cập nhật / Xác minh dữ liệu game Steam
npm run update-games

# 6. Biên dịch mã nguồn cho bản sản xuất (Production Build)
npm run build

# 7. Xem trước bản build sản xuất
npm run preview
```

---

## 🎨 Logo Thương Hiệu SVG & Bảng Màu Đỏ Gaming

- **Logo SVG chính thức**: File `game-gi-gio-logo.svg` với thiết kế chữ "G" và dấu "?" 3D gaming sắc sảo được tích hợp tại `public/game-gi-gio-logo.svg` và `src/assets/game-gi-gio-logo.svg`.
  - Hiển thị trang trọng bên trái tiêu đề **GAME GÌ GIỜ?** trong Header và Footer.
  - Sử dụng trực tiếp làm favicon website trên trình duyệt.
  - Giữ nguyên độ trong suốt và tỷ lệ `object-fit: contain`.
- **Background chính**: `#10090B` (Đen gaming ánh đỏ trầm).
- **Background phụ**: `#190B0F` (Tạo lớp chuyển tiếp mượt mà).
- **Card**: `#211014` (Khối card nổi bật với viền `#3B2027`).
- **Đỏ chủ đạo (Primary Accent)**: `#E52E45` (Vạch chọn laser, nút bấm chính, dải phổ biến).
- **Đỏ sáng (Glow / Hover)**: `#FF4359` (Hiệu ứng phát sáng, hover và mũi tên tâm).
- **Đỏ trầm**: `#8F172B` (Ambient glow phía sau vòng quay và hero).
- **Chữ chính**: `#F5F3F4` (Trắng sáng rõ nét).
- **Chữ phụ**: `#A8A0A3` (Xám tro gaming).
- **Viền**: `#3B2027` (Viền mảnh phân chia tinh tế).

---

## 🎰 Cơ Chế Vòng Quay Ngẫu Nhiên (Gaming Roulette)

Vòng quay ngang được thiết kế đem lại cảm giác hồi hộp, chính xác và trực quan:
1. **Khởi động nhanh & dứt khoát**: Ngay khi nhấn "QUAY NGAY", vòng quay tăng tốc tức thì, cuốn qua hàng chục tựa game.
2. **Đường cong giảm tốc mượt (Quartic Ease-Out)**: Thời lượng 5.5 giây. Vòng quay chạy nhanh ở 2 giây đầu, sau đó giảm tốc dần và chuyển sang nhịp trượt chậm từng card qua vạch laser ở những giây cuối.
3. **Căn tâm tuyệt đối**: Vạch laser đỏ và 2 mũi tên cố định ngay chính giữa màn hình. Vị trí dừng được tính toán chính xác theo kích thước card thực tế trên mọi thiết bị (Mobile, Tablet, Desktop).
4. **Cố định vị trí trúng thưởng (Không tự động reset)**: Sau khi quay xong, card thắng nằm vĩnh viễn ngay tại vạch laser đỏ. Dù modal kết quả đang mở hay đã đóng, vòng quay **vẫn giữ nguyên chính xác vị trí đã dừng** cho đến khi người dùng đổi thể loại hoặc bấm quay lượt mới.
5. **Hiệu ứng dừng**: Vùng trung tâm bùng nổ hiệu ứng ánh đỏ khi trúng kết quả, tạo cảm xúc phấn khích trước khi modal kết quả hiển thị.

---

## 🔊 Hệ Thống Âm Thanh Arcade Gaming (Web Audio API)

Tích hợp trực tiếp qua **Web Audio API** (không phụ thuộc file âm thanh ngoài, không lo lỗi 404 mạng, độ trễ 0ms):
- **Âm thanh khởi động**: Tiếng power-up điện tử kết hợp sub-impact dứt khoát khi nhấn nút quay.
- **Âm thanh Tick đồng bộ chuyển động**: Mỗi khi một card game đi qua vạch laser tâm, tiếng click cơ học giòn tan vang lên. Tần số tick dày đặc khi quay nhanh và thưa dần, rõ ràng từng nhịp khi vòng quay chậm lại.
- **Âm thanh trúng game (Lock-in)**: Cú đập sub-bass 36Hz kết hợp tiếng khóa kim loại điện tử dứt khoát xác nhận kết quả.
- **Âm thanh Reveal Modal**: Hiệu ứng arpeggio điện tử 3 nốt ngân vang khi pop-up kết quả xuất hiện (chỉ phát 1 lần).
- **Nút bật/tắt tiếng (Mute Toggle)**: Nằm ngay trên Header với icon `Volume2` / `VolumeX`, ngắt âm thanh tức thì qua Master Gain Node và tự động ghi nhớ lựa chọn qua `localStorage`.

---

## 🎮 Dữ Liệu Game & Bổ Sung Tựa Game Từ MixiGaming

Hệ thống được trang bị 267 tựa game nổi tiếng, hài hước, co-op và kinh dị được cộng đồng yêu thích:
- **Game Co-op / Hài hước / Bạn bè**: *Liar's Bar*, *Chained Together*, *Goose Goose Duck*, *Content Warning*, *Crab Game*, *Party Animals*, *Human Fall Flat*, *Gang Beasts*, *PICO PARK*, *Overcooked! 2*.
- **Game Sinh tồn / Khám phá / Kinh dị**: *The Isle*, *Dread Hunger*, *Escape the Backrooms*, *Phasmophobia*, *Sons Of The Forest*, *Green Hell*, *Rust*, *Sea of Thieves*, *DREDGE*, *DEVOUR*.
- **Game Mô phỏng độc đáo**: *Crime Scene Cleaner*, *Contraband Police*, *Supermarket Simulator*, *Fast Food Simulator*, *Internet Cafe Simulator 2*, *Gas Station Simulator*, *Car Mechanic Simulator 2021*, *Dinkum*.
- **Bom tấn & Chiến thuật**: *Black Myth: Wukong*, *Palworld*, *Ready or Not*, *Chivalry 2*, *Cuphead*, *Grand Theft Auto V*, *Manor Lords*, *Frostpunk*, *Factorio*, *RimWorld*, *Mount & Blade II: Bannerlord*.

### 🚫 Chính Sách Loại Trừ PUBG Tuyệt Đối
Website có danh sách cấm riêng tại `src/data/excludedGames.json`:
- Cấm hoàn toàn **PUBG: BATTLEGROUNDS** (Steam App ID `578080`) và mọi biến thể tên gọi.
- Được kích hoạt tự động ở: Script nạp dữ liệu, hàm xử lý dữ liệu đầu vào, thuật toán quay roulette, bộ lọc kho game, tìm kiếm và modal kết quả.

---

## 📂 Cấu Trúc Thư Mục

```text
gamegigio/
├── public/
│   └── game-gi-gio-logo.svg       # Logo SVG chính thức (phục vụ Header, Favicon)
├── scripts/
│   ├── updateSteamGames.ts        # Script xác minh & nạp game Steam tự động
│   └── testBrowserSpin.ts         # Script kiểm thử trình duyệt thực tế qua Playwright
├── src/
│   ├── assets/
│   │   └── game-gi-gio-logo.svg   # Bản sao asset logo SVG
│   ├── data/
│   │   ├── excludedGames.json     # Danh sách cấm (PUBG)
│   │   ├── genres.ts              # 10 thể loại game
│   │   ├── action.json            # 50 game Hành động
│   │   ├── adventure.json         # 25 game Phiêu lưu
│   │   ├── rpg.json               # 24 game Nhập vai
│   │   ├── strategy.json          # 24 game Chiến thuật
│   │   ├── simulation.json        # 29 game Mô phỏng
│   │   ├── casual.json            # 24 game Thông thường
│   │   ├── indie.json             # 38 game Game độc lập
│   │   ├── sports.json            # 17 game Thể thao
│   │   ├── racing.json            # 19 game Đua xe
│   │   └── mmo.json               # 27 game Nhiều người chơi
│   ├── types/
│   │   └── game.ts                # Định nghĩa kiểu Game, GamePlaceholder, PopularityTier
│   ├── utils/
│   │   ├── audio.ts               # Web Audio Arcade Sound Effect Manager
│   │   ├── gameData.ts            # Nạp dữ liệu, loại trùng ID, sinh placeholder, lọc game cấm
│   │   └── weightedRandom.ts      # Thuật toán quay ngẫu nhiên theo trọng số
│   ├── components/
│   │   ├── Header.tsx             # Logo SVG, số lượng game, nút bật/tắt tiếng
│   │   ├── Roulette.tsx           # Vòng quay gaming, giữ nguyên vị trí kết quả, tick đồng bộ
│   │   ├── GenreSelector.tsx      # Bộ chọn thể loại với badge số lượng
│   │   ├── GameCard.tsx           # Card game Steam & fallback dấu ? đen-đỏ
│   │   ├── GameResultModal.tsx    # Modal kết quả reveal với âm thanh & link Steam
│   │   ├── GameLibrary.tsx        # Kho game: tìm kiếm, lọc theo thể loại & độ hiếm
│   │   └── Footer.tsx             # Bản quyền © 2026 HokaDev & logo SVG
│   ├── __tests__/
│   │   └── gameEngine.test.ts     # 17 bài test kiểm tra dữ liệu, PUBG ban, âm thanh, xác suất
│   ├── App.tsx                    # Component chính
│   ├── main.tsx                   # Điểm khởi chạy React
│   └── index.css                  # Bảng màu đỏ chủ đạo & laser glow
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚖️ Bản Quyền

© 2026 **HokaDev**. All rights reserved.
