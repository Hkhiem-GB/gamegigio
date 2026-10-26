import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SteamScreenshotRaw {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

interface SteamMovieRaw {
  id: number;
  name: string;
  thumbnail: string;
  dash_av1?: string;
  dash_h264?: string;
  hls_h264?: string;
  mp4?: {
    '480'?: string;
    max?: string;
  };
  webm?: {
    '480'?: string;
    max?: string;
  };
}

interface StoredGameMedia {
  appId: number;
  description?: string;
  headerImage?: string;
  screenshots: Array<{
    id: number;
    thumbnail: string;
    full: string;
  }>;
  movies: Array<{
    id: number;
    name: string;
    thumbnail: string;
    hlsUrl?: string;
    mp4Url?: string;
    webmUrl?: string;
  }>;
  updatedAt: string;
}

// Clean HTML entities from short_description
function cleanText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function fetchAppDetails(appId: number): Promise<any> {
  return new Promise((resolve) => {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`;
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Cookie': 'birthtime=28801; mature_content=1',
        },
        timeout: 10000,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            resolve(parsed[appId.toString()] || null);
          } catch {
            resolve(null);
          }
        });
      }
    );

    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("=== BẮT ĐẦU THU THẬP MEDIA STEAM CHO GAME GÌ GIỜ? ===");
  console.log("Endpoint: https://store.steampowered.com/api/appdetails\n");

  const dataDir = path.join(__dirname, '../src/data');
  const mediaFilePath = path.join(dataDir, 'gameMedia.json');

  // 1. Gather all unique games
  const genres = ['action', 'adventure', 'rpg', 'strategy', 'simulation', 'casual', 'indie', 'sports', 'racing', 'mmo', 'horror', 'fmv'];
  const uniqueGamesMap = new Map<number, { id: number; name: string; theme: string }>();

  for (const genre of genres) {
    const p = path.join(dataDir, `${genre}.json`);
    if (fs.existsSync(p)) {
      const list = JSON.parse(fs.readFileSync(p, 'utf-8'));
      for (const item of list) {
        if (item.id && !uniqueGamesMap.has(item.id)) {
          uniqueGamesMap.set(item.id, {
            id: item.id,
            name: item.name,
            theme: item.theme,
          });
        }
      }
    }
  }

  const allUniqueGames = Array.from(uniqueGamesMap.values());
  console.log(`Tìm thấy ${allUniqueGames.length} game độc bản trong hệ thống.`);

  // 2. Load existing media cache
  let existingMedia: Record<string, StoredGameMedia> = {};
  if (fs.existsSync(mediaFilePath)) {
    try {
      existingMedia = JSON.parse(fs.readFileSync(mediaFilePath, 'utf-8'));
    } catch {
      existingMedia = {};
    }
  }

  let successCount = 0;
  let hasMoviesCount = 0;
  let hasScreenshotsCount = 0;
  let fallbackCount = 0;

  const BATCH_SIZE = 5;
  const DELAY_MS = 250;

  for (let i = 0; i < allUniqueGames.length; i += BATCH_SIZE) {
    const batch = allUniqueGames.slice(i, i + BATCH_SIZE);
    process.stdout.write(`Đang xử lý ${i + 1} - ${Math.min(i + BATCH_SIZE, allUniqueGames.length)} / ${allUniqueGames.length} ... `);

    const promises = batch.map(async (game) => {
      // Check if we already have valid media cached
      const cached = existingMedia[game.id.toString()];
      if (cached && (cached.screenshots.length > 0 || cached.movies.length > 0)) {
        return { game, media: cached, cached: true };
      }

      const res = await fetchAppDetails(game.id);
      if (res && res.success && res.data) {
        const d = res.data;

        // Process screenshots
        const screenshots = (d.screenshots as SteamScreenshotRaw[] || [])
          .slice(0, 10)
          .map((s, idx) => ({
            id: s.id ?? idx,
            thumbnail: s.path_thumbnail,
            full: s.path_full,
          }));

        // Process movies/trailers
        const movies = (d.movies as SteamMovieRaw[] || [])
          .slice(0, 3)
          .map((m, idx) => ({
            id: m.id ?? idx,
            name: m.name || 'Trailer',
            thumbnail: m.thumbnail,
            hlsUrl: m.hls_h264,
            mp4Url: m.mp4?.max || m.mp4?.['480'],
            webmUrl: m.webm?.max || m.webm?.['480'],
          }));

        const mediaItem: StoredGameMedia = {
          appId: game.id,
          description: cleanText(d.short_description),
          headerImage: d.header_image || game.theme,
          screenshots,
          movies,
          updatedAt: new Date().toISOString(),
        };

        return { game, media: mediaItem, cached: false };
      }

      // Safe fallback if storefront API fails or game is unlisted
      const fallbackItem: StoredGameMedia = {
        appId: game.id,
        headerImage: game.theme,
        screenshots: [],
        movies: [],
        updatedAt: new Date().toISOString(),
      };
      return { game, media: fallbackItem, cached: false };
    });

    const results = await Promise.all(promises);

    for (const r of results) {
      existingMedia[r.game.id.toString()] = r.media;
      if (r.media.screenshots.length > 0) hasScreenshotsCount++;
      if (r.media.movies.length > 0) hasMoviesCount++;
      if (r.media.screenshots.length > 0 || r.media.movies.length > 0) {
        successCount++;
      } else {
        fallbackCount++;
      }
    }

    // Save progressively to disk
    fs.writeFileSync(mediaFilePath, JSON.stringify(existingMedia, null, 2), 'utf-8');
    console.log(`Xong.`);

    if (i + BATCH_SIZE < allUniqueGames.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n=== BÁO CÁO KẾT QUẢ THU THẬP MEDIA STEAM ===");
  console.log(`- Tổng số game xử lý: ${allUniqueGames.length}`);
  console.log(`- Game có bộ ảnh Screenshots: ${hasScreenshotsCount}`);
  console.log(`- Game có Video Trailer: ${hasMoviesCount}`);
  console.log(`- Game đầy đủ Media (Ảnh hoặc Video): ${successCount}`);
  console.log(`- Game dùng chế độ dự phòng (Fallback Header/Placeholder): ${fallbackCount}`);
  console.log(`\nĐã lưu toàn bộ metadata an toàn vào: src/data/gameMedia.json`);
}

main().catch((err) => {
  console.error("Lỗi khi thu thập media Steam:", err);
  process.exit(1);
});
