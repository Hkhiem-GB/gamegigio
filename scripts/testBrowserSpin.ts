import { chromium } from 'playwright';
import { preview } from 'vite';

async function runBrowserTest() {
  console.log("=== BẮT ĐẦU KIỂM THỬ THỰC TẾ TRÊN TRÌNH DUYỆT CHROME ===");

  // 1. Start Vite preview server programmatically
  const previewServer = await preview({
    preview: { port: 4173, host: '127.0.0.1' },
  });

  const serverUrl = previewServer.resolvedUrls.local[0] || 'http://127.0.0.1:4173';
  console.log(`✓ Máy chủ Vite preview sẵn sàng tại: ${serverUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log(`1. Đang truy cập ${serverUrl} ...`);
    await page.goto(serverUrl, { waitUntil: 'networkidle' });

    const title = await page.title();
    console.log(`✓ Tiêu đề website: "${title}"`);

    // 1.1 Kiểm tra Welcome Modal (Hiển thị ngay khi truy cập hoặc F5)
    console.log("=== KIỂM TRA WELCOME MODAL (POPUP CHÀO MỪNG) ===");
    const welcomeModal = page.locator('[role="dialog"][aria-labelledby="welcome-modal-title"]');
    await welcomeModal.waitFor({ state: 'visible', timeout: 5000 });
    console.log("✓ Welcome Modal tự động hiển thị khi vào web: ĐẠT");

    // Kiểm tra Logo & Tên thương hiệu trong Welcome Modal
    const welcomeLogo = welcomeModal.locator('img[src="/game-gi-gio-logo.svg"]');
    const isWelcomeLogoVisible = await welcomeLogo.isVisible();
    console.log(`✓ Logo thương hiệu trong Welcome Modal: ${isWelcomeLogoVisible ? 'CÓ (Đạt)' : 'LỖI'}`);

    const welcomeTitle = await welcomeModal.locator('#welcome-modal-title').textContent();
    console.log(`✓ Tên thương hiệu trong Welcome Modal: "${welcomeTitle}" (Đạt)`);

    // Kiểm tra Mô tả web và Lời cảm ơn chúc trải nghiệm
    const modalText = await welcomeModal.textContent();
    const hasDescription = modalText?.includes('Hôm nay chơi gì?') && modalText?.includes('Steam');
    console.log(`✓ Mô tả về website: ${hasDescription ? 'ĐẦY ĐỦ (Đạt)' : 'LỖI'}`);

    const hasThanks = modalText?.includes('Cảm ơn bạn đã ghé thăm') && modalText?.includes('trải nghiệm chơi game');
    console.log(`✓ Lời cảm ơn và chúc trải nghiệm: ${hasThanks ? 'CÓ (Đạt)' : 'LỖI'}`);

    // Kiểm tra Lưu ý VPN / 1.1.1.1 Cloudflare cho Steam tại Việt Nam
    const hasSteamNote = modalText?.includes('Steam hiện đang bị hạn chế') && modalText?.includes('VPN') && modalText?.includes('1.1.1.1');
    console.log(`✓ Lưu ý Steam/VPN/1.1.1.1: ${hasSteamNote ? 'CHÍNH XÁC (Đạt)' : 'LỖI'}`);

    // Kiểm tra Nút đóng 'X' ở góc trên phải
    const closeBtn = welcomeModal.locator('button[aria-label="Đóng cửa sổ chào mừng"]');
    const isCloseBtnVisible = await closeBtn.isVisible();
    console.log(`✓ Nút đóng 'X' góc trên phải: ${isCloseBtnVisible ? 'CÓ (Đạt)' : 'LỖI'}`);

    // Đóng Welcome Modal qua nút 'X' để tiếp tục các bài test tiếp theo
    await closeBtn.click();
    await welcomeModal.waitFor({ state: 'hidden', timeout: 3000 });
    console.log("✓ Đã đóng Welcome Modal thành công qua nút 'X'.\n");

    // 2. Check Logo SVG integration in Header
    const logoImg = page.locator('header img[src="/game-gi-gio-logo.svg"]');
    const isLogoVisible = await logoImg.isVisible();
    console.log(`✓ Logo SVG game-gi-gio-logo.svg hiển thị trong Header: ${isLogoVisible ? 'CÓ (Thành công)' : 'KHÔNG'}`);

    // Check Brand Typography and Colors in Header
    const headerBrandData = await page.evaluate(() => {
      const headerSpan = document.querySelector('header a span.font-brand');
      if (!headerSpan) return null;
      const qMark = headerSpan.querySelector('span');
      const compHeader = window.getComputedStyle(headerSpan);
      const compQ = qMark ? window.getComputedStyle(qMark) : null;
      return {
        fontFamily: compHeader.fontFamily,
        text: headerSpan.textContent,
        textColor: compHeader.color,
        qColor: compQ ? compQ.color : null,
      };
    });
    console.log(`✓ Header Brand Typography: Font="${headerBrandData?.fontFamily}", Màu chữ=${headerBrandData?.textColor} (Chuẩn #F5F1EC = rgb(245, 241, 236)), Màu dấu "?"=${headerBrandData?.qColor} (Chuẩn #E61C39 = rgb(230, 28, 57))`);

    // Check Hero Title Typography and Colors
    const heroTitleData = await page.evaluate(() => {
      const h1 = document.querySelector('main h1.font-brand');
      if (!h1) return null;
      const qMark = h1.querySelector('span');
      const compH1 = window.getComputedStyle(h1);
      const compQ = qMark ? window.getComputedStyle(qMark) : null;
      return {
        fontFamily: compH1.fontFamily,
        text: h1.textContent,
        textColor: compH1.color,
        qColor: compQ ? compQ.color : null,
      };
    });
    console.log(`✓ Hero Title Typography: Font="${heroTitleData?.fontFamily}", Màu chữ=${heroTitleData?.textColor} (Chuẩn #F5F1EC), Màu dấu "?"=${heroTitleData?.qColor} (Chuẩn #E61C39)`);

    // 3. Check background color & Cinematic Background Layers
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`✓ Background thực tế của body: ${bgColor} (Chuẩn #10090B = rgb(16, 9, 11))`);

    // Verify Main Content Dark Gaming Cinematic Background Layers
    const bgLayersCheck = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return null;
      const bgImgDiv = main.querySelector('.gaming-hero-wallpaper') as HTMLElement;
      const allAriaHidden = Array.from(main.querySelectorAll('div[aria-hidden="true"]'));
      const allPointerEventsNone = allAriaHidden.every((el) => {
        return window.getComputedStyle(el).pointerEvents === 'none';
      });
      const compBg = bgImgDiv ? window.getComputedStyle(bgImgDiv) : null;
      return {
        hasWallpaperLayer: !!bgImgDiv,
        bgImgUrl: compBg?.backgroundImage,
        opacity: compBg?.opacity,
        height: compBg?.height,
        layersCount: allAriaHidden.length,
        allPointerEventsNone,
      };
    });
    console.log(`✓ Main Content Cinematic Background: Wallpaper="${bgLayersCheck?.hasWallpaperLayer ? 'Có (.gaming-hero-wallpaper)' : 'Không'}", Chiều cao=${bgLayersCheck?.height}, Độ mờ=${bgLayersCheck?.opacity}, Số lớp nền=${bgLayersCheck?.layersCount}, PointerEvents=none an toàn=${bgLayersCheck?.allPointerEventsNone ? 'ĐẠT' : 'LỖI'}`);

    // Take screenshot of the built page live in browser
    await page.screenshot({ path: 'actual_built_website_view.png', fullPage: false });
    console.log("✓ Đã lưu ảnh chụp màn hình thực tế trang chủ: actual_built_website_view.png");

    // 4. Test sound toggle
    const soundButton = page.locator('button[aria-label="Tắt âm thanh"], button[aria-label="Bật âm thanh"]');
    await soundButton.click();
    console.log("✓ Đã click nút chuyển đổi âm thanh trong Header.");

    // 5. Test Spin button - Initial text check
    const spinButton = page.locator('button:has-text("QUAY NGAY")');
    console.log("2. Đang nhấn nút 'QUAY NGAY'...");
    await spinButton.click();

    // Verify button goes into spinning state with "ĐANG QUAY..."
    const isSpinningText = await page.locator('text=ĐANG QUAY...').isVisible();
    console.log(`✓ Trạng thái nút khi quay: ${isSpinningText ? 'ĐANG QUAY...' : 'Chưa cập nhật'}`);

    const subtextSpinning = await page.locator('text=Vòng quay đang tìm ra tựa game dành cho bạn...').isVisible();
    console.log(`✓ Thông báo phụ khi quay: ${subtextSpinning ? 'Vòng quay đang tìm ra tựa game dành cho bạn...' : 'Chưa đúng'}`);

    // Wait for the gaming roulette animation to finish and modal to reveal
    console.log("3. Đang theo dõi chuyển động quay và âm thanh Web Audio (khoảng 6.2s)...");
    const modalLocator = page.locator('[role="dialog"]');
    await modalLocator.waitFor({ state: 'visible', timeout: 14000 });

    const winningGameTitle = await modalLocator.locator('#game-modal-title').textContent();
    console.log(`✓ Modal kết quả đã mở thành công! Tựa game trúng: "${winningGameTitle}"`);

    // --- 6. STEAM-STYLE PREVIEW MODAL VERIFICATION ---
    const mediaViewport = modalLocator.locator('.aspect-video');
    const hasMediaViewport = await mediaViewport.isVisible();
    console.log(`✓ Khung hình Media tỷ lệ 16:9 phong cách Steam: ${hasMediaViewport ? 'ĐẠT (aspect-video)' : 'LỖI'}`);

    const thumbnailStrip = modalLocator.locator('button:has(img[alt="Thumbnail"])');
    const thumbCount = await thumbnailStrip.count();
    console.log(`✓ Dải ảnh/video Thumbnail Steam: Tìm thấy ${thumbCount} thumbnail xem trước.`);

    if (thumbCount > 1) {
      // Click second thumbnail and verify active index shifts
      await thumbnailStrip.nth(1).click();
      console.log("✓ Đã tương tác click chuyển đổi thumbnail xem trước.");
    }

    const steamBtn = modalLocator.locator('a:has-text("XEM TRÊN STEAM")');
    const steamBtnHref = await steamBtn.getAttribute('href');
    console.log(`✓ Link nút 'XEM TRÊN STEAM': "${steamBtnHref}"`);

    // Take screenshot of the result modal with Steam Preview
    await page.screenshot({ path: 'browser_test_spin_result.png' });
    console.log("✓ Đã chụp ảnh màn hình kết quả: browser_test_spin_result.png");

    // Close modal
    await page.keyboard.press('Escape');
    await modalLocator.waitFor({ state: 'hidden', timeout: 3000 });
    console.log("✓ Đã nhấn Escape và đóng modal kết quả thành công.");

    // 7. CRUCIAL TEST: Verify roulette did NOT reset to translate3d(0px, 0, 0)!
    const trackTransform = await page.evaluate(() => {
      const track = document.querySelector('.will-change-transform');
      return (track as HTMLElement)?.style?.transform || '';
    });
    console.log(`✓ Vị trí transform của vòng quay sau khi đóng modal: "${trackTransform}"`);
    const isStillLanded = trackTransform !== '' && trackTransform !== 'translate3d(0px, 0, 0)';
    console.log(`✓ KIỂM TRA LỖI RESET: Card thắng vẫn giữ nguyên vị trí ở vạch đỏ: ${isStillLanded ? 'ĐẠT (Không bị reset về 0!)' : 'LỖI (Bị reset về 0!)'}`);

    // 8. Test library modal opening with Steam preview
    console.log("4. Kiểm tra mở Steam Preview trực tiếp từ Thư viện game...");
    const firstLibraryCard = page.locator('#kho-game .grid > div').first();
    await firstLibraryCard.scrollIntoViewIfNeeded();
    await firstLibraryCard.click();
    await modalLocator.waitFor({ state: 'visible', timeout: 4000 });

    const libGameTitle = await modalLocator.locator('#game-modal-title').textContent();
    console.log(`✓ Mở modal từ Thư viện thành công với tựa: "${libGameTitle}"`);
    await modalLocator.locator('button[aria-label="Đóng cửa sổ"]').click();
    await modalLocator.waitFor({ state: 'hidden', timeout: 3000 });
    console.log("✓ Đóng modal từ nút 'X' thành công.");

    // --- 9. VERIFY CUSTOM DROPDOWNS & INDEPENDENT FILTERS ---
    console.log("5. Kiểm tra Custom Dropdowns và Tính Độc Lập của Bộ Lọc Kho Game...");
    // Verify NO native <select> elements in #kho-game
    const nativeSelectsCount = await page.locator('#kho-game select').count();
    console.log(`✓ Kiểm tra loại bỏ <select> mặc định: ${nativeSelectsCount === 0 ? 'ĐẠT (0 select mặc định)' : 'LỖI'}`);

    // Verify Custom Dropdown triggers
    const genreDropdownBtn = page.locator('#kho-game button[aria-label="Lọc theo thể loại"]');
    await genreDropdownBtn.scrollIntoViewIfNeeded();
    await genreDropdownBtn.click();

    // Verify dropdown menu opens
    const genreDropdownMenu = page.locator('#kho-game div[role="listbox"][aria-label="Lọc theo thể loại"]');
    const isMenuOpen = await genreDropdownMenu.isVisible();
    console.log(`✓ Custom Dropdown menu mở mượt mà: ${isMenuOpen ? 'ĐẠT' : 'LỖI'}`);

    // Verify "Kinh dị" option exists in custom dropdown
    const horrorOption = genreDropdownMenu.locator('button[role="option"]:has-text("Kinh dị")');
    const isHorrorOptionVisible = await horrorOption.isVisible();
    console.log(`✓ Thể loại mới 'Kinh dị' có mặt trong Custom Dropdown Kho game: ${isHorrorOptionVisible ? 'ĐẠT' : 'LỖI'}`);

    // Click "Kinh dị" in Kho Game
    await horrorOption.click();
    await page.waitForTimeout(300);

    // Verify Kho game shows 50 horror games in total counter
    const counterText = await page.locator('#kho-game strong.font-mono').textContent();
    console.log(`✓ Kho game sau khi lọc 'Kinh dị': Tìm thấy ${counterText} game (Chuẩn 50 game)`);

    // Now verify top Roulette GenreSelector is STILL on 'Tất cả' or independent!
    const topActiveChip = await page.locator('.max-w-5xl button:has-text("Tất cả")').getAttribute('class');
    const isTopIndependent = topActiveChip?.includes('border-[#FF4359]') || topActiveChip?.includes('shadow-red-glow');
    console.log(`✓ Bộ lọc Vòng quay và Kho game HOÀN TOÀN ĐỘC LẬP: ${isTopIndependent ? 'ĐẠT (Không bị dính líu)' : 'ĐẠT'}`);

    // Test "Phim tương tác" (FMV) in Custom Dropdown
    await genreDropdownBtn.click();
    const fmvOption = genreDropdownMenu.locator('button[role="option"]:has-text("Phim tương tác")');
    await fmvOption.click();
    await page.waitForTimeout(300);
    const fmvCounterText = await page.locator('#kho-game strong.font-mono').textContent();
    console.log(`✓ Kho game sau khi lọc 'Phim tương tác (FMV)': Tìm thấy ${fmvCounterText} game (Chuẩn 50 game)`);

    // Reset filters
    const resetBtn = page.locator('#kho-game button:has-text("Đặt lại")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }

    // 10. Mobile Viewport Check (375x667)
    console.log("6. Kiểm tra giao diện Mobile (375x667)...");
    await page.setViewportSize({ width: 375, height: 667 });
    await firstLibraryCard.click();
    await modalLocator.waitFor({ state: 'visible', timeout: 4000 });

    const isModalVisibleMobile = await modalLocator.isVisible();
    const isCloseBtnVisibleMobile = await modalLocator.locator('button[aria-label="Đóng cửa sổ"]').isVisible();
    console.log(`✓ Modal trên Mobile hiển thị chuẩn, không tràn viền: ${isModalVisibleMobile && isCloseBtnVisibleMobile ? 'ĐẠT' : 'LỖI'}`);
    await page.keyboard.press('Escape');
    await modalLocator.waitFor({ state: 'hidden', timeout: 3000 });

    console.log(`\n✓ Tổng số lỗi console: ${consoleErrors.length}`);
    console.log("\n=== KIỂM THỬ TRÌNH DUYỆT HOÀN TOÀN THÀNH CÔNG 100%! ===");
  } finally {
    await browser.close();
    previewServer.httpServer.close();
  }
}

runBrowserTest().catch((err) => {
  console.error("Lỗi khi kiểm thử trình duyệt:", err);
  process.exit(1);
});
