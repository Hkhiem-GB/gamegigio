export interface GenreDefinition {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
}

export const GENRES: readonly GenreDefinition[] = [
  {
    id: "action",
    name: "Action",
    vietnameseName: "Hành động",
    description: "Chiến đấu gay cấn, nhịp độ nhanh và phản xạ tức thì",
  },
  {
    id: "adventure",
    name: "Adventure",
    vietnameseName: "Phiêu lưu",
    description: "Khám phá thế giới rộng lớn, cốt truyện lôi cuốn",
  },
  {
    id: "rpg",
    name: "RPG",
    vietnameseName: "Nhập vai",
    description: "Hóa thân nhân vật, thăng cấp kỹ năng và quyết định số phận",
  },
  {
    id: "strategy",
    name: "Strategy",
    vietnameseName: "Chiến thuật",
    description: "Tư duy chiến lược, quản lý tài nguyên và điều binh khiển tướng",
  },
  {
    id: "simulation",
    name: "Simulation",
    vietnameseName: "Mô phỏng",
    description: "Mô phỏng thực tế cuộc sống, lái xe, xây dựng và quản trị",
  },
  {
    id: "casual",
    name: "Casual",
    vietnameseName: "Giải trí nhẹ nhàng",
    description: "Thư giãn, dễ tiếp cận, phù hợp giải trí nhanh và vui vẻ",
  },
  {
    id: "indie",
    name: "Indie",
    vietnameseName: "Độc lập",
    description: "Ý tưởng sáng tạo đột phá, phong cách nghệ thuật độc đáo",
  },
  {
    id: "sports",
    name: "Sports",
    vietnameseName: "Thể thao",
    description: "Tranh tài thể thao sôi động, bóng đá, bóng rổ",
  },
  {
    id: "racing",
    name: "Racing",
    vietnameseName: "Đua xe",
    description: "Tốc độ nghẹt thở, drift đỉnh cao trên mọi cung đường",
  },
  {
    id: "mmo",
    name: "MMO",
    vietnameseName: "Nhiều người chơi trực tuyến",
    description: "Gặp gỡ bạn bè, săn boss bang hội trong thế giới ảo",
  },
  {
    id: "horror",
    name: "Horror",
    vietnameseName: "Kinh dị",
    description: "Trải nghiệm rùng rợn, giật gân, hồi hộp và ám ảnh tâm lý",
  },
  {
    id: "fmv",
    name: "FMV",
    vietnameseName: "Phim tương tác",
    description: "Điện ảnh tương tác với diễn viên thật, dẫn dắt cốt truyện",
  },
];

export const ALL_GENRE_ID = "all";

export function getGenreName(genreId: string): string {
  if (genreId === ALL_GENRE_ID) return "Tất cả";
  const found = GENRES.find((g) => g.id === genreId);
  return found ? `${found.name} — ${found.vietnameseName}` : genreId;
}

export function getGenreShortName(genreId: string): string {
  if (genreId === ALL_GENRE_ID) return "Tất cả";
  const found = GENRES.find((g) => g.id === genreId);
  return found ? found.vietnameseName : genreId;
}
