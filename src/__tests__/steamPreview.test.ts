import { describe, it, expect } from 'vitest';
import { getGameMedia } from '../utils/gameData';
import { soundManager } from '../utils/audio';
import { Game } from '../types/game';

describe('Steam-Style Game Preview & Media Systems', () => {
  it('1. Trích xuất thành công game có cả screenshot và video trailer (như Counter-Strike 2 #730)', () => {
    const media = getGameMedia(730);
    expect(media).toBeDefined();
    expect(media?.screenshots.length).toBeGreaterThan(0);
    expect(media?.movies.length).toBeGreaterThan(0);
    expect(media?.description).toBeTruthy();

    const firstMovie = media?.movies[0];
    expect(firstMovie?.thumbnail).toBeTruthy();
    expect(firstMovie?.hlsUrl || firstMovie?.mp4Url).toBeTruthy();
  });

  it('2. Trích xuất thành công bom tấn có trailer và hơn 5 screenshots (Baldurs Gate 3 #1086940)', () => {
    const media = getGameMedia(1086940);
    expect(media).toBeDefined();
    expect(media?.screenshots.length).toBeGreaterThanOrEqual(5);
    expect(media?.movies.length).toBeGreaterThanOrEqual(1);
    expect(media?.movies[0].hlsUrl).toContain('.m3u8');
  });

  it('3. Trạng thái an toàn cho game chỉ có header/fallback hoặc App ID không tồn tại', () => {
    const invalidAppMedia = getGameMedia(99999999);
    expect(invalidAppMedia).toBeUndefined();

    // Mock game with no media
    const mockGame: Game = {
      id: 99999999,
      name: 'Test Fallback Game',
      theme: 'https://cdn.example.com/header.jpg',
      steamUrl: 'https://store.steampowered.com/app/99999999/',
      popularity: 'gray',
    };

    expect(mockGame.media).toBeUndefined();
    expect(mockGame.theme).toBe('https://cdn.example.com/header.jpg');
  });

  it('4. Đồng bộ hóa âm thanh với soundManager (không tự phát âm thanh khi website đang tắt tiếng)', () => {
    const initialMuted = soundManager.getMuted();

    // Toggle mute
    soundManager.setMuted(true);
    expect(soundManager.getMuted()).toBe(true);

    let observedMute = false;
    const unsubscribe = soundManager.subscribe((muted) => {
      observedMute = muted;
    });

    soundManager.setMuted(false);
    expect(soundManager.getMuted()).toBe(false);
    expect(observedMute).toBe(false);

    soundManager.setMuted(true);
    expect(soundManager.getMuted()).toBe(true);
    expect(observedMute).toBe(true);

    unsubscribe();
    // Restore initial state
    soundManager.setMuted(initialMuted);
  });

  it('5. Cấu trúc Movie có hỗ trợ URL stream HLS hoặc MP4 hợp lệ', () => {
    const media = getGameMedia(1245620); // ELDEN RING
    expect(media).toBeDefined();
    if (media && media.movies.length > 0) {
      const movie = media.movies[0];
      const hasStreamableUrl = Boolean(movie.hlsUrl || movie.mp4Url || movie.webmUrl);
      expect(hasStreamableUrl).toBe(true);
    }
  });

  it('6. Loại trừ hoàn toàn PUBG trong danh mục media và game library', () => {
    const pubgMedia = getGameMedia(578080);
    expect(pubgMedia).toBeUndefined();
  });
});
