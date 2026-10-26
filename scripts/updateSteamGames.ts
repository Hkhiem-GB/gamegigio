import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawGameEntry {
  id: number;
  name: string;
  theme: string;
  steamUrl: string;
  popularity: 'gray' | 'purple' | 'gold' | 'red';
  genres: string[]; // List of matching genre ids
}

// Banned / Excluded configuration
const excludedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/excludedGames.json'), 'utf-8')
);

function isBannedGame(id: number, name: string): boolean {
  if (excludedData.excludedAppIds.includes(id)) return true;
  const lowerName = name.toLowerCase();
  for (const pattern of excludedData.excludedPatterns) {
    if (lowerName.includes(pattern.toLowerCase())) return true;
  }
  return false;
}

// Curated verified catalog of MixiGaming highlights & top Steam gems
const CANDIDATE_GAMES: RawGameEntry[] = [
  // --- VIRAL CO-OP, MIXIGAMING & COMMUNITY FAVORITES ---
  {
    id: 3097560,
    name: "Liar's Bar",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/3097560/header.jpg",
    steamUrl: "https://store.steampowered.com/app/3097560/",
    popularity: "gold",
    genres: ["casual", "indie", "strategy", "mmo"]
  },
  {
    id: 2567870,
    name: "Chained Together",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2567870/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2567870/",
    popularity: "gold",
    genres: ["action", "adventure", "casual", "indie", "mmo"]
  },
  {
    id: 2881650,
    name: "Content Warning",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2881650/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2881650/",
    popularity: "gold",
    genres: ["action", "adventure", "indie", "casual", "mmo"]
  },
  {
    id: 1040210,
    name: "Crime Scene Cleaner",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1040210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1040210/",
    popularity: "purple",
    genres: ["simulation", "casual", "indie"]
  },
  {
    id: 1782210,
    name: "Crab Game",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1782210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1782210/",
    popularity: "gold",
    genres: ["action", "casual", "indie", "mmo"]
  },
  {
    id: 1358640,
    name: "Dread Hunger",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1358640/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1358640/",
    popularity: "purple",
    genres: ["action", "strategy", "rpg", "mmo"]
  },
  {
    id: 1568590,
    name: "Goose Goose Duck",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1568590/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1568590/",
    popularity: "red",
    genres: ["casual", "strategy", "mmo"]
  },
  {
    id: 1062520,
    name: "Dinkum",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1062520/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1062520/",
    popularity: "purple",
    genres: ["adventure", "rpg", "simulation", "indie"]
  },
  {
    id: 1943950,
    name: "Escape the Backrooms",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1943950/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1943950/",
    popularity: "gold",
    genres: ["adventure", "indie", "action", "mmo"]
  },
  {
    id: 756800,
    name: "Contraband Police",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/756800/header.jpg",
    steamUrl: "https://store.steampowered.com/app/756800/",
    popularity: "purple",
    genres: ["action", "simulation"]
  },
  {
    id: 1824220,
    name: "Chivalry 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1824220/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1824220/",
    popularity: "purple",
    genres: ["action", "mmo", "sports"]
  },
  {
    id: 268910,
    name: "Cuphead",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg",
    steamUrl: "https://store.steampowered.com/app/268910/",
    popularity: "gold",
    genres: ["action", "indie"]
  },
  {
    id: 1562430,
    name: "DREDGE",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1562430/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1562430/",
    popularity: "gold",
    genres: ["adventure", "rpg", "indie"]
  },
  {
    id: 2933480,
    name: "Fast Food Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2933480/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2933480/",
    popularity: "gray",
    genres: ["simulation", "casual", "indie"]
  },
  {
    id: 2780620,
    name: "Lockdown Protocol",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2780620/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2780620/",
    popularity: "gray",
    genres: ["action", "strategy", "indie"]
  },
  {
    id: 376210,
    name: "The Isle",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/376210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/376210/",
    popularity: "purple",
    genres: ["action", "simulation", "mmo"]
  },
  {
    id: 739630,
    name: "Phasmophobia",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/739630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/739630/",
    popularity: "red",
    genres: ["action", "indie", "adventure", "mmo"]
  },
  {
    id: 1260320,
    name: "Party Animals",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1260320/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1260320/",
    popularity: "gold",
    genres: ["casual", "action", "mmo"]
  },
  {
    id: 1274570,
    name: "DEVOUR",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1274570/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1274570/",
    popularity: "purple",
    genres: ["action", "adventure", "indie", "mmo"]
  },
  {
    id: 815370,
    name: "Green Hell",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/815370/header.jpg",
    steamUrl: "https://store.steampowered.com/app/815370/",
    popularity: "purple",
    genres: ["action", "adventure", "simulation", "mmo"]
  },
  {
    id: 1326470,
    name: "Sons Of The Forest",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1326470/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1326470/",
    popularity: "gold",
    genres: ["action", "adventure", "simulation", "mmo"]
  },
  {
    id: 252490,
    name: "Rust",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg",
    steamUrl: "https://store.steampowered.com/app/252490/",
    popularity: "red",
    genres: ["action", "adventure", "rpg", "mmo"]
  },
  {
    id: 1172620,
    name: "Sea of Thieves",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172620/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1172620/",
    popularity: "red",
    genres: ["action", "adventure", "mmo"]
  },
  {
    id: 448510,
    name: "Overcooked! 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/448510/header.jpg",
    steamUrl: "https://store.steampowered.com/app/448510/",
    popularity: "gold",
    genres: ["casual", "indie", "strategy"]
  },
  {
    id: 477160,
    name: "Human Fall Flat",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/477160/header.jpg",
    steamUrl: "https://store.steampowered.com/app/477160/",
    popularity: "gold",
    genres: ["casual", "adventure", "indie"]
  },
  {
    id: 285900,
    name: "Gang Beasts",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/285900/header.jpg",
    steamUrl: "https://store.steampowered.com/app/285900/",
    popularity: "gold",
    genres: ["casual", "action", "indie"]
  },
  {
    id: 1509960,
    name: "PICO PARK",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1509960/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1509960/",
    popularity: "purple",
    genres: ["casual", "action", "indie"]
  },
  {
    id: 2670630,
    name: "Supermarket Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2670630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2670630/",
    popularity: "gold",
    genres: ["simulation", "casual", "indie"]
  },
  {
    id: 1563180,
    name: "Internet Cafe Simulator 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1563180/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1563180/",
    popularity: "purple",
    genres: ["simulation", "casual"]
  },
  {
    id: 1149620,
    name: "Gas Station Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1149620/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1149620/",
    popularity: "purple",
    genres: ["simulation", "casual", "indie"]
  },
  {
    id: 1623730,
    name: "Palworld",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1623730/",
    popularity: "red",
    genres: ["action", "adventure", "rpg", "mmo"]
  },
  {
    id: 1144200,
    name: "Ready or Not",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1144200/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1144200/",
    popularity: "gold",
    genres: ["action", "strategy", "mmo"]
  },
  {
    id: 2358720,
    name: "Black Myth: Wukong",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2358720/",
    popularity: "red",
    genres: ["action", "rpg"]
  },

  // --- NOTABLE 2023 - 2024 BLOCKBUSTERS & RECOMMENDED HITS ---
  {
    id: 2215430,
    name: "Ghost of Tsushima DIRECTOR'S CUT",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2215430/",
    popularity: "red",
    genres: ["adventure", "action", "rpg"]
  },
  {
    id: 2322010,
    name: "God of War Ragnarök",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2322010/",
    popularity: "red",
    genres: ["adventure", "action", "rpg"]
  },
  {
    id: 1593500,
    name: "God of War",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1593500/",
    popularity: "red",
    genres: ["adventure", "action", "rpg"]
  },
  {
    id: 2124440,
    name: "SILENT HILL 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2124440/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2124440/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 1888930,
    name: "The Last of Us™ Part I",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1888930/",
    popularity: "red",
    genres: ["adventure", "action"]
  },
  {
    id: 2050650,
    name: "Resident Evil 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2050650/",
    popularity: "red",
    genres: ["adventure", "action"]
  },
  {
    id: 1196590,
    name: "Resident Evil Village",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1196590/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1196590/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 883710,
    name: "Resident Evil 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/883710/header.jpg",
    steamUrl: "https://store.steampowered.com/app/883710/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 1817190,
    name: "Marvel’s Spider-Man: Miles Morales",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1817190/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1817190/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 1774580,
    name: "STAR WARS Jedi: Survivor™",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1774580/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1774580/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 1172380,
    name: "STAR WARS Jedi: Fallen Order™",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172380/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1172380/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 1659420,
    name: "UNCHARTED™: Legacy of Thieves Collection",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1659420/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1659420/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 1426210,
    name: "It Takes Two",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1426210/",
    popularity: "red",
    genres: ["adventure", "casual", "sports"]
  },
  {
    id: 264710,
    name: "Subnautica",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg",
    steamUrl: "https://store.steampowered.com/app/264710/",
    popularity: "red",
    genres: ["adventure", "simulation"]
  },
  {
    id: 753640,
    name: "Outer Wilds",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/753640/header.jpg",
    steamUrl: "https://store.steampowered.com/app/753640/",
    popularity: "gold",
    genres: ["adventure", "indie"]
  },
  {
    id: 383870,
    name: "Firewatch",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/383870/header.jpg",
    steamUrl: "https://store.steampowered.com/app/383870/",
    popularity: "gold",
    genres: ["adventure", "indie"]
  },
  {
    id: 1222140,
    name: "Detroit: Become Human",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1222140/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1222140/",
    popularity: "gold",
    genres: ["adventure"]
  },
  {
    id: 1850570,
    name: "DEATH STRANDING DIRECTOR'S CUT",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1850570/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1850570/",
    popularity: "gold",
    genres: ["adventure", "action"]
  },
  {
    id: 860510,
    name: "Little Nightmares II",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/860510/header.jpg",
    steamUrl: "https://store.steampowered.com/app/860510/",
    popularity: "gold",
    genres: ["adventure"]
  },
  {
    id: 424840,
    name: "Little Nightmares",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/424840/header.jpg",
    steamUrl: "https://store.steampowered.com/app/424840/",
    popularity: "gold",
    genres: ["adventure"]
  },
  {
    id: 304430,
    name: "INSIDE",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/304430/header.jpg",
    steamUrl: "https://store.steampowered.com/app/304430/",
    popularity: "gold",
    genres: ["adventure", "indie"]
  },
  {
    id: 48000,
    name: "LIMBO",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/48000/header.jpg",
    steamUrl: "https://store.steampowered.com/app/48000/",
    popularity: "gold",
    genres: ["adventure", "indie"]
  },
  {
    id: 553420,
    name: "TUNIC",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/553420/header.jpg",
    steamUrl: "https://store.steampowered.com/app/553420/",
    popularity: "gold",
    genres: ["adventure", "indie"]
  },
  {
    id: 1849250,
    name: "Pacific Drive",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1849250/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1849250/",
    popularity: "gold",
    genres: ["adventure", "simulation", "racing", "indie"]
  },
  {
    id: 962130,
    name: "Grounded",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/962130/header.jpg",
    steamUrl: "https://store.steampowered.com/app/962130/",
    popularity: "gold",
    genres: ["adventure", "mmo"]
  },

  // --- TOP RPG GEMS & 2024 MASTERPIECES ---
  {
    id: 2620600,
    name: "Metaphor: ReFantazio",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2620600/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2620600/",
    popularity: "red",
    genres: ["rpg"]
  },
  {
    id: 2161700,
    name: "Persona 3 Reload",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2161700/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2161700/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1687950,
    name: "Persona 5 Royal",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1687950/",
    popularity: "red",
    genres: ["rpg"]
  },
  {
    id: 2072450,
    name: "Like a Dragon: Infinite Wealth",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2072450/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2072450/",
    popularity: "red",
    genres: ["rpg"]
  },
  {
    id: 1235140,
    name: "Yakuza: Like a Dragon",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1235140/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1235140/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1627720,
    name: "Lies of P",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1627720/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1627720/",
    popularity: "gold",
    genres: ["rpg", "action"]
  },
  {
    id: 1282100,
    name: "Remnant II",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1282100/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1282100/",
    popularity: "gold",
    genres: ["rpg", "action", "mmo"]
  },
  {
    id: 1203630,
    name: "Enshrouded",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1203630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1203630/",
    popularity: "gold",
    genres: ["rpg", "mmo"]
  },
  {
    id: 2183900,
    name: "Warhammer 40,000: Space Marine 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2183900/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2183900/",
    popularity: "red",
    genres: ["rpg", "action", "mmo"]
  },
  {
    id: 379430,
    name: "Kingdom Come: Deliverance",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/379430/header.jpg",
    steamUrl: "https://store.steampowered.com/app/379430/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1145350,
    name: "Hades II",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1145350/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1145350/",
    popularity: "red",
    genres: ["rpg", "indie", "action"]
  },
  {
    id: 570940,
    name: "DARK SOULS™: REMASTERED",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570940/header.jpg",
    steamUrl: "https://store.steampowered.com/app/570940/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 335300,
    name: "DARK SOULS™ II: Scholar of the First Sin",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/335300/header.jpg",
    steamUrl: "https://store.steampowered.com/app/335300/",
    popularity: "purple",
    genres: ["rpg"]
  },
  {
    id: 377160,
    name: "Fallout 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg",
    steamUrl: "https://store.steampowered.com/app/377160/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1716740,
    name: "Starfield",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1716740/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1328670,
    name: "Mass Effect™ Legendary Edition",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1328670/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1328670/",
    popularity: "red",
    genres: ["rpg"]
  },
  {
    id: 1462040,
    name: "FINAL FANTASY VII REMAKE INTERGRADE",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1462040/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1462040/",
    popularity: "red",
    genres: ["rpg"]
  },
  {
    id: 524220,
    name: "NieR:Automata™",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/524220/header.jpg",
    steamUrl: "https://store.steampowered.com/app/524220/",
    popularity: "red",
    genres: ["rpg"]
  },
  {
    id: 1875830,
    name: "Shin Megami Tensei V: Vengeance",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1875830/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1875830/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1604030,
    name: "V Rising",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1604030/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1604030/",
    popularity: "gold",
    genres: ["rpg", "mmo"]
  },
  {
    id: 1621690,
    name: "Core Keeper",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1621690/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1621690/",
    popularity: "gold",
    genres: ["rpg", "indie", "mmo"]
  },
  {
    id: 1244090,
    name: "Sea of Stars",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1244090/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1244090/",
    popularity: "gold",
    genres: ["rpg", "indie"]
  },
  {
    id: 233860,
    name: "Kenshi",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/233860/header.jpg",
    steamUrl: "https://store.steampowered.com/app/233860/",
    popularity: "gold",
    genres: ["rpg", "strategy"]
  },
  {
    id: 1971650,
    name: "OCTOPATH TRAVELER II",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1971650/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1971650/",
    popularity: "gold",
    genres: ["rpg"]
  },
  {
    id: 1091500,
    name: "Cyberpunk 2077",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1091500/",
    popularity: "red",
    genres: ["rpg"]
  },

  // --- TOP STRATEGY TITLES ---
  {
    id: 1934680,
    name: "Age of Mythology: Retold",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1934680/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1934680/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 1337520,
    name: "Against the Storm",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1337520/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1337520/",
    popularity: "gold",
    genres: ["strategy", "indie"]
  },
  {
    id: 1062090,
    name: "Timberborn",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1062090/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1062090/",
    popularity: "gold",
    genres: ["strategy", "simulation"]
  },
  {
    id: 1366540,
    name: "Dyson Sphere Program",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1366540/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1366540/",
    popularity: "gold",
    genres: ["strategy", "simulation"]
  },
  {
    id: 1669000,
    name: "Age of Wonders 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1669000/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1669000/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 779340,
    name: "Total War: THREE KINGDOMS",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/779340/header.jpg",
    steamUrl: "https://store.steampowered.com/app/779340/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 594570,
    name: "Total War: WARHAMMER II",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/594570/header.jpg",
    steamUrl: "https://store.steampowered.com/app/594570/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 214950,
    name: "Total War: ROME II - Emperor Edition",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/214950/header.jpg",
    steamUrl: "https://store.steampowered.com/app/214950/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 8930,
    name: "Sid Meier's Civilization® V",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/8930/header.jpg",
    steamUrl: "https://store.steampowered.com/app/8930/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 1146320,
    name: "Dune: Spice Wars",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1146320/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1146320/",
    popularity: "purple",
    genres: ["strategy"]
  },
  {
    id: 1029780,
    name: "Going Medieval",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1029780/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1029780/",
    popularity: "purple",
    genres: ["strategy"]
  },
  {
    id: 867210,
    name: "Songs of Conquest",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/867210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/867210/",
    popularity: "purple",
    genres: ["strategy", "indie"]
  },
  {
    id: 1527950,
    name: "Wartales",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1527950/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1527950/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 236850,
    name: "Europa Universalis IV",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/236850/header.jpg",
    steamUrl: "https://store.steampowered.com/app/236850/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 529340,
    name: "Victoria 3",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/529340/header.jpg",
    steamUrl: "https://store.steampowered.com/app/529340/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 916440,
    name: "Anno 1800",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/916440/header.jpg",
    steamUrl: "https://store.steampowered.com/app/916440/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 231430,
    name: "Company of Heroes 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/231430/header.jpg",
    steamUrl: "https://store.steampowered.com/app/231430/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 1677280,
    name: "Company of Heroes 3",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1677280/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1677280/",
    popularity: "purple",
    genres: ["strategy"]
  },
  {
    id: 1214060,
    name: "Command & Conquer™ Remastered Collection",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1214060/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1214060/",
    popularity: "purple",
    genres: ["strategy"]
  },
  {
    id: 418240,
    name: "Shadow Tactics: Blades of the Shogun",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/418240/header.jpg",
    steamUrl: "https://store.steampowered.com/app/418240/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 618290,
    name: "Desperados III",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/618290/header.jpg",
    steamUrl: "https://store.steampowered.com/app/618290/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 1150440,
    name: "Aliens: Dark Descent",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1150440/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1150440/",
    popularity: "purple",
    genres: ["strategy"]
  },
  {
    id: 2379780,
    name: "Balatro",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2379780/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 1086940,
    name: "Baldur's Gate 3",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1086940/",
    popularity: "red",
    genres: ["strategy"]
  },
  {
    id: 933110,
    name: "Age of Empires III: Definitive Edition",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/933110/header.jpg",
    steamUrl: "https://store.steampowered.com/app/933110/",
    popularity: "gold",
    genres: ["strategy"]
  },
  {
    id: 1290000,
    name: "PowerWash Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1290000/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1290000/",
    popularity: "gold",
    genres: ["simulation", "casual"]
  },
  {
    id: 613100,
    name: "House Flipper",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/613100/header.jpg",
    steamUrl: "https://store.steampowered.com/app/613100/",
    popularity: "gold",
    genres: ["simulation", "casual"]
  },
  {
    id: 322330,
    name: "Don't Starve Together",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/322330/header.jpg",
    steamUrl: "https://store.steampowered.com/app/322330/",
    popularity: "gold",
    genres: ["casual", "indie", "mmo"]
  },
  {
    id: 105600,
    name: "Terraria",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg",
    steamUrl: "https://store.steampowered.com/app/105600/",
    popularity: "red",
    genres: ["casual"]
  },
  {
    id: 250900,
    name: "The Binding of Isaac: Rebirth",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/250900/header.jpg",
    steamUrl: "https://store.steampowered.com/app/250900/",
    popularity: "gold",
    genres: ["casual", "indie"]
  },
  {
    id: 504230,
    name: "Celeste",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/504230/header.jpg",
    steamUrl: "https://store.steampowered.com/app/504230/",
    popularity: "gold",
    genres: ["casual", "indie"]
  },

  // --- SIMULATION HITS & COZY VIRALS ---
  {
    id: 2738490,
    name: "TCG Card Shop Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2738490/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2738490/",
    popularity: "gold",
    genres: ["simulation", "casual", "indie"]
  },
  {
    id: 1569080,
    name: "Tiny Glade",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1569080/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1569080/",
    popularity: "gold",
    genres: ["simulation", "casual", "indie"]
  },
  {
    id: 270880,
    name: "American Truck Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/270880/header.jpg",
    steamUrl: "https://store.steampowered.com/app/270880/",
    popularity: "gold",
    genres: ["simulation", "racing"]
  },
  {
    id: 1167630,
    name: "Teardown",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1167630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1167630/",
    popularity: "gold",
    genres: ["simulation", "racing"]
  },
  {
    id: 1465360,
    name: "SnowRunner",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1465360/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1465360/",
    popularity: "gold",
    genres: ["simulation", "racing"]
  },
  {
    id: 1248130,
    name: "Farming Simulator 22",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1248130/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1248130/",
    popularity: "gold",
    genres: ["simulation"]
  },
  {
    id: 703080,
    name: "Planet Zoo",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/703080/header.jpg",
    steamUrl: "https://store.steampowered.com/app/703080/",
    popularity: "gold",
    genres: ["simulation"]
  },
  {
    id: 493340,
    name: "Planet Coaster",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/493340/header.jpg",
    steamUrl: "https://store.steampowered.com/app/493340/",
    popularity: "gold",
    genres: ["simulation"]
  },
  {
    id: 518790,
    name: "theHunter: Call of the Wild™",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/518790/header.jpg",
    steamUrl: "https://store.steampowered.com/app/518790/",
    popularity: "gold",
    genres: ["simulation", "sports"]
  },
  {
    id: 433340,
    name: "Slime Rancher",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/433340/header.jpg",
    steamUrl: "https://store.steampowered.com/app/433340/",
    popularity: "gold",
    genres: ["simulation", "casual"]
  },
  {
    id: 1657630,
    name: "Slime Rancher 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1657630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1657630/",
    popularity: "gold",
    genres: ["simulation", "casual"]
  },
  {
    id: 853870,
    name: "Goat Simulator 3",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/853870/header.jpg",
    steamUrl: "https://store.steampowered.com/app/853870/",
    popularity: "gold",
    genres: ["simulation", "casual"]
  },
  {
    id: 535930,
    name: "Two Point Hospital",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/535930/header.jpg",
    steamUrl: "https://store.steampowered.com/app/535930/",
    popularity: "gold",
    genres: ["simulation"]
  },
  {
    id: 1649080,
    name: "Two Point Campus",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1649080/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1649080/",
    popularity: "purple",
    genres: ["simulation"]
  },
  {
    id: 1244460,
    name: "Jurassic World Evolution 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1244460/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1244460/",
    popularity: "gold",
    genres: ["simulation"]
  },
  {
    id: 380600,
    name: "Fishing Planet",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/380600/header.jpg",
    steamUrl: "https://store.steampowered.com/app/380600/",
    popularity: "purple",
    genres: ["simulation", "sports"]
  },

  // --- CASUAL GEMS & PARTY FAVORITES ---
  {
    id: 1097150,
    name: "Fall Guys",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1097150/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1097150/",
    popularity: "gold",
    genres: ["casual", "sports", "mmo"]
  },
  {
    id: 837470,
    name: "Untitled Goose Game",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/837470/header.jpg",
    steamUrl: "https://store.steampowered.com/app/837470/",
    popularity: "gold",
    genres: ["casual", "indie"]
  },
  {
    id: 240720,
    name: "Getting Over It with Bennett Foddy",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/240720/header.jpg",
    steamUrl: "https://store.steampowered.com/app/240720/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 972660,
    name: "Spiritfarer: Farewell Edition",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/972660/header.jpg",
    steamUrl: "https://store.steampowered.com/app/972660/",
    popularity: "gold",
    genres: ["casual", "indie"]
  },
  {
    id: 238460,
    name: "BattleBlock Theater",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/238460/header.jpg",
    steamUrl: "https://store.steampowered.com/app/238460/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 204360,
    name: "Castle Crashers",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/204360/header.jpg",
    steamUrl: "https://store.steampowered.com/app/204360/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 1291340,
    name: "Townscaper",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1291340/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1291340/",
    popularity: "purple",
    genres: ["casual"]
  },
  {
    id: 265930,
    name: "Goat Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/265930/header.jpg",
    steamUrl: "https://store.steampowered.com/app/265930/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 1703340,
    name: "The Stanley Parable: Ultra Deluxe",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1703340/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1703340/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 386940,
    name: "Ultimate Chicken Horse",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/386940/header.jpg",
    steamUrl: "https://store.steampowered.com/app/386940/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 674940,
    name: "Stick Fight: The Game",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/674940/header.jpg",
    steamUrl: "https://store.steampowered.com/app/674940/",
    popularity: "gold",
    genres: ["casual"]
  },
  {
    id: 397950,
    name: "Clustertruck",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/397950/header.jpg",
    steamUrl: "https://store.steampowered.com/app/397950/",
    popularity: "purple",
    genres: ["casual"]
  },
  {
    id: 207140,
    name: "SpeedRunners",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/207140/header.jpg",
    steamUrl: "https://store.steampowered.com/app/207140/",
    popularity: "gold",
    genres: ["casual", "racing"]
  },
  {
    id: 571740,
    name: "Golf It!",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/571740/header.jpg",
    steamUrl: "https://store.steampowered.com/app/571740/",
    popularity: "purple",
    genres: ["casual", "sports"]
  },
  {
    id: 1557740,
    name: "ROUNDS",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1557740/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1557740/",
    popularity: "purple",
    genres: ["casual"]
  },

  // --- TOP CRITICALLY ACCLAIMED INDIE GEMS ---
  {
    id: 1985690,
    name: "Animal Well",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1985690/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1985690/",
    popularity: "gold",
    genres: ["indie"]
  },
  {
    id: 2835570,
    name: "Mouthwashing",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2835570/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2835570/",
    popularity: "gold",
    genres: ["indie"]
  },
  {
    id: 2126830,
    name: "Crow Country",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2126830/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2126830/",
    popularity: "purple",
    genres: ["indie"]
  },

  // --- SPORTS & COMPETITIVE ESPORTS ---
  {
    id: 2669320,
    name: "EA SPORTS FC™ 25",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2669320/",
    popularity: "red",
    genres: ["sports"]
  },
  {
    id: 2878950,
    name: "NBA 2K25",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2878950/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2878950/",
    popularity: "red",
    genres: ["sports"]
  },
  {
    id: 1790600,
    name: "DRAGON BALL: Sparking! ZERO",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1790600/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1790600/",
    popularity: "red",
    genres: ["sports", "action"]
  },
  {
    id: 1364780,
    name: "Street Fighter 6",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1364780/",
    popularity: "gold",
    genres: ["sports", "action"]
  },
  {
    id: 1778820,
    name: "TEKKEN 8",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1778820/",
    popularity: "gold",
    genres: ["sports", "action"]
  },
  {
    id: 2488620,
    name: "F1® 24",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2488620/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2488620/",
    popularity: "gold",
    genres: ["sports"]
  },
  {
    id: 2108330,
    name: "F1® 23",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2108330/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2108330/",
    popularity: "gold",
    genres: ["sports", "racing"]
  },
  {
    id: 1692250,
    name: "F1® 22",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1692250/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1692250/",
    popularity: "purple",
    genres: ["sports", "racing"]
  },
  {
    id: 2582250,
    name: "Madden NFL 25",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2582250/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2582250/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 2140330,
    name: "Madden NFL 24",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2140330/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2140330/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 1942660,
    name: "WWE 2K23",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1942660/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1942660/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 2395210,
    name: "Tony Hawk's™ Pro Skater™ 1 + 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2395210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2395210/",
    popularity: "gold",
    genres: ["sports"]
  },
  {
    id: 962730,
    name: "Skater XL - Ultimate Skateboarding Game",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/962730/header.jpg",
    steamUrl: "https://store.steampowered.com/app/962730/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 1487210,
    name: "Super Mega Baseball 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1487210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1487210/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 1016120,
    name: "PGA TOUR 2K21",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1016120/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1016120/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 760630,
    name: "Tennis Elbow 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/760630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/760630/",
    popularity: "gray",
    genres: ["sports"]
  },
  {
    id: 1072500,
    name: "AO Tennis 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1072500/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1072500/",
    popularity: "gray",
    genres: ["sports"]
  },
  {
    id: 2306630,
    name: "Cricket 24",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2306630/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2306630/",
    popularity: "gray",
    genres: ["sports"]
  },
  {
    id: 766570,
    name: "Russian Fishing 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/766570/header.jpg",
    steamUrl: "https://store.steampowered.com/app/766570/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 1688080,
    name: "Way of the Hunter",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1688080/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1688080/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 1259980,
    name: "RIDE 4",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1259980/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1259980/",
    popularity: "purple",
    genres: ["sports", "racing"]
  },
  {
    id: 1650010,
    name: "RIDE 5",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1650010/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1650010/",
    popularity: "purple",
    genres: ["sports", "racing"]
  },
  {
    id: 1611910,
    name: "MXGP 2021 - The Official Motocross Videogame",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1611910/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1611910/",
    popularity: "gray",
    genres: ["sports", "racing"]
  },
  {
    id: 2138330,
    name: "Monster Energy Supercross 6",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138330/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2138330/",
    popularity: "gray",
    genres: ["sports", "racing"]
  },
  {
    id: 711540,
    name: "Lonely Mountains: Downhill",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/711540/header.jpg",
    steamUrl: "https://store.steampowered.com/app/711540/",
    popularity: "purple",
    genres: ["sports", "racing"]
  },
  {
    id: 732430,
    name: "Superflight",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/732430/header.jpg",
    steamUrl: "https://store.steampowered.com/app/732430/",
    popularity: "purple",
    genres: ["sports"]
  },
  {
    id: 1551360,
    name: "Forza Horizon 5",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1551360/",
    popularity: "red",
    genres: ["sports"]
  },

  // --- RACING TITLES & AUTOMOTIVE EXPERIENCES ---
  {
    id: 1080110,
    name: "F1® 2020",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1080110/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1080110/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 635260,
    name: "CarX Drift Racing Online",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/635260/header.jpg",
    steamUrl: "https://store.steampowered.com/app/635260/",
    popularity: "gold",
    genres: ["racing"]
  },
  {
    id: 1114150,
    name: "CarX Street",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1114150/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1114150/",
    popularity: "gold",
    genres: ["racing"]
  },
  {
    id: 227300,
    name: "Euro Truck Simulator 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/227300/header.jpg",
    steamUrl: "https://store.steampowered.com/app/227300/",
    popularity: "gold",
    genres: ["racing"]
  },
  {
    id: 1262580,
    name: "Need for Speed™ Payback",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1262580/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1262580/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1262560,
    name: "Need for Speed™ Most Wanted",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1262560/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1262560/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1328660,
    name: "Need for Speed™ Hot Pursuit Remastered",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1328660/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1328660/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1262600,
    name: "Need for Speed™ Rivals",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1262600/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1262600/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 550320,
    name: "art of rally",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550320/header.jpg",
    steamUrl: "https://store.steampowered.com/app/550320/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1022470,
    name: "Hotshot Racing",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1022470/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1022470/",
    popularity: "gray",
    genres: ["racing"]
  },
  {
    id: 517710,
    name: "Redout: Enhanced Edition",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/517710/header.jpg",
    steamUrl: "https://store.steampowered.com/app/517710/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 763180,
    name: "Redout II",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/763180/header.jpg",
    steamUrl: "https://store.steampowered.com/app/763180/",
    popularity: "gray",
    genres: ["racing"]
  },
  {
    id: 1304930,
    name: "DRIFTCE",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1304930/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1304930/",
    popularity: "gray",
    genres: ["racing"]
  },
  {
    id: 234140,
    name: "Mad Max",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/234140/header.jpg",
    steamUrl: "https://store.steampowered.com/app/234140/",
    popularity: "gold",
    genres: ["racing"]
  },
  {
    id: 2217580,
    name: "New Star GP",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2217580/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2217580/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1440670,
    name: "Shredders",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1440670/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1440670/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 460920,
    name: "Steep™",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/460920/header.jpg",
    steamUrl: "https://store.steampowered.com/app/460920/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1601580,
    name: "Session: Skate Sim",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1601580/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1601580/",
    popularity: "purple",
    genres: ["racing"]
  },
  {
    id: 1250410,
    name: "Microsoft Flight Simulator",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1250410/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1250410/",
    popularity: "gold",
    genres: ["racing"]
  },

  // --- MMO & ONLINE MULTIPLAYER TITLES ---
  {
    id: 2139460,
    name: "Once Human",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2139460/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2139460/",
    popularity: "red",
    genres: ["mmo"]
  },
  {
    id: 553850,
    name: "HELLDIVERS™ 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg",
    steamUrl: "https://store.steampowered.com/app/553850/",
    popularity: "red",
    genres: ["mmo"]
  },
  {
    id: 2073850,
    name: "THE FINALS",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2073850/header.jpg",
    steamUrl: "https://store.steampowered.com/app/2073850/",
    popularity: "gold",
    genres: ["mmo"]
  },
  {
    id: 381210,
    name: "Dead by Daylight",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/381210/header.jpg",
    steamUrl: "https://store.steampowered.com/app/381210/",
    popularity: "red",
    genres: ["mmo"]
  },
  {
    id: 221100,
    name: "DayZ",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/221100/header.jpg",
    steamUrl: "https://store.steampowered.com/app/221100/",
    popularity: "gold",
    genres: ["mmo"]
  },
  {
    id: 550,
    name: "Left 4 Dead 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg",
    steamUrl: "https://store.steampowered.com/app/550/",
    popularity: "red",
    genres: ["mmo"]
  },
  {
    id: 1966720,
    name: "Lethal Company",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg",
    steamUrl: "https://store.steampowered.com/app/1966720/",
    popularity: "red",
    genres: ["mmo"]
  },
  {
    id: 892970,
    name: "Valheim",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/892970/header.jpg",
    steamUrl: "https://store.steampowered.com/app/892970/",
    popularity: "gold",
    genres: ["mmo"]
  },
  {
    id: 945360,
    name: "Among Us",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/945360/header.jpg",
    steamUrl: "https://store.steampowered.com/app/945360/",
    popularity: "red",
    genres: ["mmo"]
  },
  {
    id: 440,
    name: "Team Fortress 2",
    theme: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/440/header.jpg",
    steamUrl: "https://store.steampowered.com/app/440/",
    popularity: "gold",
    genres: ["mmo"]
  }
];

// Target genre list mapping
const ALL_GENRE_FILES = [
  'action',
  'adventure',
  'rpg',
  'strategy',
  'simulation',
  'casual',
  'indie',
  'sports',
  'racing',
  'mmo'
];

const TARGET_GAMES_PER_GENRE = 50;

async function updateAllGenres() {
  console.log("=== BẮT ĐẦU CẬP NHẬT DỮ LIỆU GAME STEAM CHO GAME GÌ GIỜ? ===");
  console.log("Quy tắc an toàn: Không trùng lặp, giữ game hiện có, loại trừ PUBG hoàn toàn.");
  console.log(`Mục tiêu số lượng: ${TARGET_GAMES_PER_GENRE} game cho mỗi thể loại.\n`);

  const dataDir = path.join(__dirname, '../src/data');
  const report: Record<string, { before: number; added: number; total: number; targetReached: boolean }> = {};
  let bannedDetectedCount = 0;

  for (const genreId of ALL_GENRE_FILES) {
    const filePath = path.join(dataDir, `${genreId}.json`);
    let existingList: any[] = [];

    if (fs.existsSync(filePath)) {
      try {
        existingList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        console.error(`Không thể đọc file ${filePath}, giữ nguyên danh sách rỗng.`);
        existingList = [];
      }
    }

    const beforeCount = existingList.length;
    const existingIds = new Set(existingList.map(g => g.id));
    let addedCount = 0;

    // Filter candidate games for this genre
    const candidatesForGenre = CANDIDATE_GAMES.filter(g => g.genres.includes(genreId));

    for (const cand of candidatesForGenre) {
      // Check if target per genre is already reached
      if (existingList.length >= TARGET_GAMES_PER_GENRE) {
        break;
      }

      // 1. Strict ban check (PUBG exclusion)
      if (isBannedGame(cand.id, cand.name)) {
        bannedDetectedCount++;
        console.warn(`[CHẶN PUBG] Đã loại trừ game bị cấm: #${cand.id} - ${cand.name}`);
        continue;
      }

      // 2. Duplicate check
      if (existingIds.has(cand.id)) {
        continue;
      }

      // 3. Add game entry
      existingList.push({
        id: cand.id,
        name: cand.name,
        theme: cand.theme,
        steamUrl: cand.steamUrl,
        popularity: cand.popularity
      });
      existingIds.add(cand.id);
      addedCount++;
    }

    // Write back safely formatted JSON
    fs.writeFileSync(filePath, JSON.stringify(existingList, null, 2), 'utf-8');
    report[genreId] = {
      before: beforeCount,
      added: addedCount,
      total: existingList.length,
      targetReached: existingList.length === TARGET_GAMES_PER_GENRE
    };
  }

  console.log("=== BÁO CÁO CẬP NHẬT CHI TIẾT THEO TỪNG THỂ LOẠI ===");
  console.table(report);
  console.log(`\nTổng số lần phát hiện/loại trừ game cấm (PUBG): ${bannedDetectedCount}`);
  console.log("Cập nhật hoàn tất và an toàn 100%!");
}

updateAllGenres().catch(err => {
  console.error("Lỗi khi cập nhật game:", err);
  process.exit(1);
});
