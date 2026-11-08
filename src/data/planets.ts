export interface PlanetTheme {
  color: string;
  emissive: string;
  glow: string;
  rings?: boolean;
  ringColor?: string;
  textureUrl?: string;
}

export interface CharacterData {
  name: string;
  race: string;
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  clothingStyle: string;
  pose: string;
}

export interface PlanetData {
  id: number;
  name: string;
  path: string;
  description: string;
  theme: PlanetTheme;
  character?: CharacterData;
}

export const PLANETS: PlanetData[] = [
  {
    id: 0,
    name: "ANA SAYFA",
    path: "/",
    description: "Kozmik Merkeze Hoş Geldiniz",
    theme: {
      color: "#0d5f45",
      emissive: "#2e1065",
      glow: "#b8932e",
    },
    character: {
      name: "Nova",
      race: "Humanoid",
      skinColor: "Fair",
      hairColor: "Silver",
      eyeColor: "Violet",
      clothingStyle: "Cyberpunk",
      pose: "Idle"
    }
  },
  {
    id: 1,
    name: "KEŞFET",
    path: "/escorts",
    description: "Galaksideki Tüm Yıldızlar",
    theme: {
      color: "#0f172a",
      emissive: "#1e293b",
      glow: "#3b82f6",
      rings: true,
      ringColor: "#60a5fa"
    },
    character: {
      name: "Lyra",
      race: "Starborn",
      skinColor: "Pale",
      hairColor: "Blue",
      eyeColor: "Cyan",
      clothingStyle: "Nebula Wrap",
      pose: "Scanning"
    }
  },
  {
    id: 2,
    name: "VIP",
    path: "/vip",
    description: "En Parlak Yıldızlar",
    theme: {
      color: "#451a03",
      emissive: "#78350f",
      glow: "#f59e0b",
    },
    character: {
      name: "Solara",
      race: "Solaris",
      skinColor: "Golden",
      hairColor: "Orange",
      eyeColor: "Amber",
      clothingStyle: "Elite Armor",
      pose: "Regal"
    }
  },
  {
    id: 3,
    name: "MESAJLAR",
    path: "/messages",
    description: "Kozmik İletişim",
    theme: {
      color: "#064e3b",
      emissive: "#065f46",
      glow: "#10b981",
    },
    character: {
      name: "Echo",
      race: "Synth",
      skinColor: "Chrome",
      hairColor: "Green Neon",
      eyeColor: "Emerald",
      clothingStyle: "Digital Suit",
      pose: "Typing"
    }
  },
  {
    id: 4,
    name: "FAVORİLER",
    path: "/favorites",
    description: "Kaydedilen Takımyıldızlar",
    theme: {
      color: "#831843",
      emissive: "#9d174d",
      glow: "#ec4899",
    },
    character: {
      name: "Astra",
      race: "Nebulan",
      skinColor: "Rose",
      hairColor: "Pink",
      eyeColor: "Magenta",
      clothingStyle: "Heartguard",
      pose: "Waving"
    }
  },
  {
    id: 5,
    name: "PROFİL",
    path: "/escort/dashboard",
    description: "Kişisel Yörüngeniz",
    theme: {
      color: "#1e1b4b",
      emissive: "#312e81",
      glow: "#6366f1",
    },
    character: {
      name: "Atlas",
      race: "Titan",
      skinColor: "Bronze",
      hairColor: "Dark Blue",
      eyeColor: "Sapphire",
      clothingStyle: "Pilot Uniform",
      pose: "Saluting"
    }
  },
  {
    id: 6,
    name: "İLAN VER",
    path: "/register-escort",
    description: "Galaksiye Katılın",
    theme: {
      color: "#422006",
      emissive: "#713f12",
      glow: "#eab308",
      rings: true,
      ringColor: "#facc15"
    },
    character: {
      name: "Midas",
      race: "Merchant",
      skinColor: "Copper",
      hairColor: "Yellow",
      eyeColor: "Gold",
      clothingStyle: "Bounty Hunter",
      pose: "Point"
    }
  }
];
