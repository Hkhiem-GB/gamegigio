export type PopularityTier = "gray" | "purple" | "gold" | "red";

export interface GameScreenshot {
  id: number;
  thumbnail: string;
  full: string;
}

export interface GameMovie {
  id: number;
  name: string;
  thumbnail: string;
  hlsUrl?: string;
  mp4Url?: string;
  webmUrl?: string;
}

export interface GameMedia {
  appId: number;
  description?: string;
  descriptionVi?: string;
  headerImage?: string;
  screenshots: GameScreenshot[];
  movies: GameMovie[];
  updatedAt: string;
}

export interface Game {
  id: number;
  name: string;
  theme: string;
  steamUrl: string;
  popularity: PopularityTier;
  genre?: string;
  genreName?: string;
  genres?: string[];
  descriptionVi?: string;
  shortDescriptionVi?: string;
  nameVi?: string;
  genresVi?: string[];
  media?: GameMedia;
}

export interface GamePlaceholder {
  kind: "placeholder";
  key: string;
  name: "No Name";
  theme: "placeholder";
  popularity: "gray";
  genre?: string;
  genreName?: string;
}

export type DisplayGame = Game | GamePlaceholder;

export interface GenreInfo {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  iconName: string;
}

export const POPULARITY_TIER_CONFIG: Record<
  PopularityTier,
  {
    label: string;
    description: string;
    weight: number;
    color: string;
    textColor: string;
    borderColor: string;
    bgSubtle: string;
    glowColor: string;
  }
> = {
  gray: {
    label: "Ít phổ biến",
    description: "Game ẩn mình, ít người biết",
    weight: 1.0,
    color: "#71717A",
    textColor: "text-zinc-400",
    borderColor: "border-zinc-600/70",
    bgSubtle: "bg-zinc-800/40",
    glowColor: "rgba(113, 113, 122, 0.4)",
  },
  purple: {
    label: "Khá phổ biến",
    description: "Được cộng đồng quan tâm",
    weight: 0.65,
    color: "#A855F7",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/70",
    bgSubtle: "bg-purple-950/40",
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  gold: {
    label: "Nổi tiếng",
    description: "Game nhiều người chơi & đánh giá cao",
    weight: 0.3,
    color: "#F59E0B",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/70",
    bgSubtle: "bg-amber-950/40",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
  red: {
    label: "Siêu nổi tiếng",
    description: "Bom tấn huyền thoại, siêu phẩm",
    weight: 0.12,
    color: "#E52E45",
    textColor: "text-[#FF4359]",
    borderColor: "border-[#E52E45]/80",
    bgSubtle: "bg-[#E52E45]/20",
    glowColor: "rgba(229, 46, 69, 0.55)",
  },
};

/**
 * Type guard to check if an item is a verified real Game
 */
export function isRealGame(item: DisplayGame | null | undefined): item is Game {
  if (!item) return false;
  if ('kind' in item && item.kind === 'placeholder') return false;
  return typeof (item as Game).id === 'number' && (item as Game).id > 0 && typeof (item as Game).name === 'string';
}
